import os
from flask import Flask, render_template, jsonify, request
from . import config
from .db_relational import execute_query, execute_dml, get_db_connection
from .db_nosql import (
    get_nosql_db, get_company_filings, get_drhp_rhp_sections,
    get_media_and_research, get_peer_comparison
)
from . import reports

app = Flask(
    __name__,
    template_folder=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "templates"),
    static_folder=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/status")
def api_status():
    _, engine = get_db_connection()
    mongo_ok = get_nosql_db() is not None
    return jsonify({
        "status": "online",
        "system": "IPOWatch Terminal v2.0 (Dual-Mode Architecture)",
        "relational_engine": engine,
        "nosql_engine": "online" if mongo_ok else "offline"
    })

@app.route("/api/ipos")
def api_ipos():
    """Returns IPOs ordered by status: Upcoming (1) -> Open (2) -> Completed (3)."""
    sql = """
    SELECT 
        i.*,
        s.iep, s.listing_gain_percent, s.indicative_val_lakhs, s.trading_status,
        (SELECT AVG(g.estimated_gain_percent) FROM gmp_platform_records g WHERE g.ipo_id = i.ipo_id) AS avg_gmp_gain_pct,
        (SELECT MAX(b.total_subscription_times) FROM subscription_bids b WHERE b.ipo_id = i.ipo_id) AS latest_sub_multiple
    FROM ipos i
    LEFT JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
    ORDER BY i.status_order ASC, i.open_date ASC
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/company/<symbol>")
def api_company_detail(symbol):
    """
    Returns the complete feature suite for a single company:
    - Primary Details
    - Multi-Source GMP Heatmap WITH embedded platform accuracy benchmark metrics
    - Forecast Accuracy Scoreboard
    - Regulatory Variance Tracker (DRHP vs RHP diffs)
    - Timeline & Lock-in Expiry
    - Prospectus & AV Media (DRHP/RHP PDFs, AV MP4s, SEBI URL)
    - Analytics & Financial Allocations (Reservations, Anchors, Bids, Secondary Metrics, Peers)
    """
    sym = symbol.upper()
    ipo_res = execute_query("SELECT * FROM ipos WHERE symbol = %s", (sym,))
    if not ipo_res:
        return jsonify({"error": "Company not found"}), 404
    ipo = ipo_res[0]
    ipo_id = ipo["ipo_id"]

    # 1. GMP records with integrated platform accuracy benchmark for immediate estimation!
    gmp_sql = """
    SELECT 
        g.*,
        bench.mean_mae_pct,
        bench.best_error_pct,
        bench.worst_error_pct,
        bench.overestimation_count,
        bench.underestimation_count,
        bench.reliability_verdict
    FROM gmp_platform_records g
    LEFT JOIN (
        SELECT 
            platform_name,
            ROUND(AVG(absolute_error_pct), 2) AS mean_mae_pct,
            ROUND(MIN(absolute_error_pct), 2) AS best_error_pct,
            ROUND(MAX(absolute_error_pct), 2) AS worst_error_pct,
            SUM(CASE WHEN error_direction = 'Overestimated' THEN 1 ELSE 0 END) AS overestimation_count,
            SUM(CASE WHEN error_direction = 'Underestimated' THEN 1 ELSE 0 END) AS underestimation_count,
            CASE 
                WHEN AVG(absolute_error_pct) < 10 THEN 'Highly Reliable'
                WHEN AVG(absolute_error_pct) < 25 THEN 'Moderate Bias'
                ELSE 'Significant Error Bias'
            END AS reliability_verdict
        FROM gmp_accuracy_eval
        GROUP BY platform_name
    ) bench ON g.platform_name = bench.platform_name
    WHERE g.ipo_id = %s
    ORDER BY g.estimated_gain_percent DESC
    """
    gmp_records = execute_query(gmp_sql, (ipo_id,))

    # 2. General Scoreboard
    scoreboard = reports.get_report_gmp_accuracy()["data"]

    # 3. Regulatory Diffs (DRHP vs RHP)
    diffs = execute_query("SELECT * FROM drhp_rhp_diffs WHERE ipo_id = %s ORDER BY diff_id", (ipo_id,))

    # 4. Timeline
    timeline = {
        "open_date": ipo["open_date"],
        "close_date": ipo["close_date"],
        "allotment_date": ipo["allotment_date"],
        "refund_date": ipo["refund_date"],
        "listing_date": ipo["listing_date"],
        "anchor_lockin_30d": ipo["anchor_lockin_30d"],
        "anchor_lockin_90d": ipo["anchor_lockin_90d"],
        "pre_ipo_lockin_180d": ipo["pre_ipo_lockin_180d"]
    }

    # 5. Prospectus & Media (from MongoDB)
    filings = get_company_filings(sym)
    deep_sections = get_drhp_rhp_sections(sym)
    media = get_media_and_research(sym)
    peers = get_peer_comparison(sym)

    # 6. Analytics & Financial Allocations
    reservations = execute_query("SELECT * FROM ipo_reservations WHERE ipo_id = %s", (ipo_id,))
    anchors = execute_query("SELECT * FROM anchor_investors WHERE ipo_id = %s ORDER BY amount_cr DESC", (ipo_id,))
    bids = execute_query("SELECT * FROM subscription_bids WHERE ipo_id = %s ORDER BY day_number", (ipo_id,))
    secondary = execute_query("SELECT * FROM secondary_listing_metrics WHERE ipo_id = %s", (ipo_id,))

    return jsonify({
        "primary": ipo,
        "gmp_heatmap_with_accuracy": gmp_records,
        "scoreboard": scoreboard,
        "regulatory_diffs": diffs,
        "timeline": timeline,
        "prospectus_and_media": {
            "filings": filings[0] if filings else None,
            "deep_sections": deep_sections,
            "analyst_videos": media
        },
        "analytics": {
            "reservations": reservations,
            "anchors": anchors,
            "bids": bids,
            "secondary_metrics": secondary[0] if secondary else None,
            "peers": peers[0]["peers"] if peers else []
        }
    })

@app.route("/api/gmp/heatmap")
def api_gmp_heatmap():
    """Market-wide heatmap with embedded platform benchmark accuracy."""
    sql = """
    SELECT 
        i.symbol,
        i.company_name,
        i.status,
        i.issue_price,
        g.platform_name,
        g.gmp_inr,
        g.estimated_gain_percent,
        g.rating_sentiment,
        bench.mean_mae_pct,
        bench.reliability_verdict
    FROM gmp_platform_records g
    JOIN ipos i ON g.ipo_id = i.ipo_id
    LEFT JOIN (
        SELECT 
            platform_name,
            ROUND(AVG(absolute_error_pct), 2) AS mean_mae_pct,
            CASE 
                WHEN AVG(absolute_error_pct) < 10 THEN 'Highly Reliable'
                WHEN AVG(absolute_error_pct) < 25 THEN 'Moderate Bias'
                ELSE 'Significant Error Bias'
            END AS reliability_verdict
        FROM gmp_accuracy_eval
        GROUP BY platform_name
    ) bench ON g.platform_name = bench.platform_name
    ORDER BY i.status_order ASC, i.symbol, g.platform_name
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/gmp/scoreboard")
def api_gmp_scoreboard():
    return jsonify(reports.get_report_gmp_accuracy()["data"])

@app.route("/api/drhp-diffs")
def api_drhp_diffs():
    sql = """
    SELECT 
        i.symbol,
        i.company_name,
        i.status,
        d.parameter_name,
        d.drhp_val,
        d.rhp_val,
        d.percentage_change,
        d.change_nature,
        d.sebi_observation_noted
    FROM drhp_rhp_diffs d
    JOIN ipos i ON d.ipo_id = i.ipo_id
    ORDER BY i.status_order, i.symbol, d.diff_id
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/timeline")
def api_timeline():
    sql = """
    SELECT 
        symbol, company_name, status, status_order, open_date, close_date, allotment_date,
        listing_date, anchor_lockin_30d, anchor_lockin_90d, pre_ipo_lockin_180d
    FROM ipos
    ORDER BY status_order ASC, open_date ASC
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/filings")
def api_all_filings():
    """Returns prospectus and AV media filings for all companies (for Market Mode)."""
    filings = get_company_filings()
    all_videos = get_media_and_research()
    res = []
    if not filings:
        ipos = execute_query("SELECT symbol, company_name, sector, status FROM ipos ORDER BY status_order ASC, open_date ASC")
        for ipo in ipos:
            res.append({
                "symbol": ipo["symbol"],
                "company_name": ipo["company_name"],
                "sector": ipo["sector"],
                "status": ipo["status"],
                "drhp_pdf_url": f"https://www.sebi.gov.in/filings/{ipo['symbol'].lower()}_drhp.pdf",
                "rhp_pdf_url": f"https://www.sebi.gov.in/filings/{ipo['symbol'].lower()}_rhp.pdf",
                "drhp_av_mp4_url": f"https://www.sebi.gov.in/av/{ipo['symbol'].lower()}_drhp_av.mp4",
                "rhp_av_mp4_url": f"https://www.sebi.gov.in/av/{ipo['symbol'].lower()}_rhp_av.mp4",
                "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
                "lead_counsel": "Cyril Amarchand Mangaldas",
                "statutory_auditors": "Deloitte Haskins & Sells LLP",
                "videos": [v for v in all_videos if v.get("symbol") == ipo["symbol"]]
            })
    else:
        for f in filings:
            f_copy = dict(f)
            # Find status from relational
            ipo_meta = execute_query("SELECT sector, status FROM ipos WHERE symbol = %s", (f.get("symbol"),))
            if ipo_meta:
                f_copy["sector"] = ipo_meta[0]["sector"]
                f_copy["status"] = ipo_meta[0]["status"]
            f_copy["videos"] = [v for v in all_videos if v.get("symbol") == f.get("symbol")]
            res.append(f_copy)
    return jsonify(res)

@app.route("/api/platform/<platform_name>")
def api_platform_audit(platform_name):
    """
    Returns dedicated accuracy forensics and historical track record
    for a specific GMP source (e.g., Chittorgarh, InvestorGain, IPOWatch, GreyMarketIndia).
    """
    summary_sql = """
    SELECT 
        platform_name,
        COUNT(*) AS total_evaluated_ipos,
        ROUND(AVG(absolute_error_pct), 2) AS mean_mae_pct,
        ROUND(MIN(absolute_error_pct), 2) AS best_error_pct,
        ROUND(MAX(absolute_error_pct), 2) AS worst_error_pct,
        SUM(CASE WHEN error_direction = 'Overestimated' THEN 1 ELSE 0 END) AS overestimation_count,
        SUM(CASE WHEN error_direction = 'Underestimated' THEN 1 ELSE 0 END) AS underestimation_count,
        SUM(CASE WHEN error_direction = 'Accurate' THEN 1 ELSE 0 END) AS exact_match_count,
        ROUND(AVG(last_gmp_predicted_gain_pct - actual_listing_gain_pct), 2) AS average_signed_bias_pct
    FROM gmp_accuracy_eval
    WHERE LOWER(platform_name) = LOWER(%s)
    GROUP BY platform_name
    """
    summary_res = execute_query(summary_sql, (platform_name,))
    if not summary_res:
        return jsonify({"error": f"No evaluation records for {platform_name}"}), 404
    summary = summary_res[0]

    mae = summary["mean_mae_pct"]
    if mae < 10:
        summary["verdict"] = "Highly Reliable"
        summary["verdict_class"] = "badge-green"
        summary["assessment"] = f"{platform_name} demonstrates high forecasting precision with a low {mae}% average prediction error."
    elif mae < 25:
        summary["verdict"] = "Moderate Bias"
        summary["verdict_class"] = "badge-yellow"
        summary["assessment"] = f"{platform_name} displays reasonable alignment but shows moderate bias during hype cycles."
    else:
        summary["verdict"] = "Significant Error Bias"
        summary["verdict_class"] = "badge-red"
        summary["assessment"] = f"{platform_name} exhibits high prediction variance. Cross-check against other sources before investing."

    track_sql = """
    SELECT 
        i.symbol,
        i.company_name,
        i.sector,
        i.issue_price,
        e.last_gmp_predicted_gain_pct,
        e.actual_listing_gain_pct,
        e.absolute_error_pct,
        e.error_direction
    FROM gmp_accuracy_eval e
    JOIN ipos i ON e.ipo_id = i.ipo_id
    WHERE LOWER(e.platform_name) = LOWER(%s)
    ORDER BY e.eval_id DESC
    """
    track_records = execute_query(track_sql, (platform_name,))

    return jsonify({
        "platform_name": summary["platform_name"],
        "summary": summary,
        "track_record": track_records
    })

@app.route("/api/reports/<int:report_id>")
def api_report(report_id):
    if report_id == 1:
        rep = reports.get_report_sector_summary()
    elif report_id == 2:
        rep = reports.get_report_gmp_accuracy()
    elif report_id == 3:
        rep = reports.get_report_institutional_correlation()
    elif report_id == 4:
        rep = reports.get_report_anchor_lockin_exposure()
    elif report_id == 5:
        rep = reports.get_report_hybrid_research_sentiment()
    else:
        return jsonify({"error": "Invalid report id"}), 400
    return jsonify(rep)

if __name__ == "__main__":
    print(f"[INFO] V2 Dashboard server starting on http://localhost:{config.PORT}")
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)
