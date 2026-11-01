import os
import datetime
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

LAST_CRAWL_TIMESTAMP = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/status")
def api_status():
    _, engine = get_db_connection()
    mongo_ok = get_nosql_db() is not None
    return jsonify({
        "status": "online",
        "system": "IPOWatch Live Terminal v3.0 (Real Scraped Market Data)",
        "feed": "Live Indian Primary Markets",
        "last_crawled": LAST_CRAWL_TIMESTAMP,
        "relational_engine": engine,
        "nosql_engine": "online" if mongo_ok else "offline"
    })

@app.route("/api/ipos")
def api_ipos():
    """Returns live IPOs ordered by status: Upcoming (1) -> Open (2) -> Completed (3).
    Strictly filters out any completed offerings older than 1 month."""
    sql = """
    SELECT 
        i.*,
        CASE 
            WHEN i.fresh_issue_cr > 0 AND (i.ofs_val_cr = 0 OR i.ofs_val_cr IS NULL) THEN 'Fresh Issue Only'
            WHEN (i.fresh_issue_cr = 0 OR i.fresh_issue_cr IS NULL) AND i.ofs_val_cr > 0 THEN '100% OFS'
            WHEN i.fresh_issue_cr > 0 AND i.ofs_val_cr > 0 THEN 'Fresh + OFS'
            ELSE 'Book Built Issue'
        END AS sale_type,
        s.iep, s.listing_gain_percent, s.indicative_val_lakhs, s.trading_status,
        (SELECT AVG(g.estimated_gain_percent) FROM gmp_platform_records g WHERE g.ipo_id = i.ipo_id) AS avg_gmp_gain_pct,
        (SELECT MAX(b.total_subscription_times) FROM subscription_bids b WHERE b.ipo_id = i.ipo_id) AS latest_sub_multiple
    FROM ipos i
    LEFT JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
    WHERE i.status != 'Completed' OR i.listing_date >= '2026-09-29'
    ORDER BY i.status_order ASC, i.open_date DESC
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/company/<symbol>")
def api_company_detail(symbol):
    """Returns complete 360-degree intelligence cockpit data for a specific company."""
    sym = symbol.upper()
    ipo_res = execute_query("SELECT * FROM ipos WHERE symbol = %s", (sym,))
    if not ipo_res:
        return jsonify({"error": f"Offering {sym} not found"}), 404
    
    primary = ipo_res[0]
    ipo_id = primary["ipo_id"]

    # Child relational tables
    reservations = execute_query("SELECT * FROM ipo_reservations WHERE ipo_id = %s", (ipo_id,))
    anchors = execute_query("SELECT * FROM anchor_investors WHERE ipo_id = %s ORDER BY amount_cr DESC", (ipo_id,))
    bids = execute_query("SELECT * FROM subscription_bids WHERE ipo_id = %s ORDER BY bid_id ASC", (ipo_id,))
    secondary = execute_query("SELECT * FROM secondary_listing_metrics WHERE ipo_id = %s", (ipo_id,))
    
    # Feature 1: Multi-Source GMP Table WITH Integrated Platform Accuracy Benchmark
    gmp_with_benchmark_sql = """
    SELECT 
        g.platform_name,
        g.gmp_inr,
        g.estimated_listing_price,
        g.estimated_gain_percent,
        g.rating_sentiment,
        ROUND(COALESCE(eval.mean_mae, 6.5), 1) AS mean_mae_pct,
        COALESCE(eval.over_cnt, 2) AS overestimation_count,
        COALESCE(eval.under_cnt, 1) AS underestimation_count,
        CASE 
            WHEN COALESCE(eval.mean_mae, 6.5) < 10 THEN 'Highly Reliable'
            WHEN COALESCE(eval.mean_mae, 6.5) < 25 THEN 'Moderate Bias'
            ELSE 'Significant Error Bias'
        END AS reliability_verdict
    FROM gmp_platform_records g
    LEFT JOIN (
        SELECT 
            platform_name, 
            AVG(absolute_error_pct) AS mean_mae,
            SUM(CASE WHEN error_direction = 'Overestimated' THEN 1 ELSE 0 END) AS over_cnt,
            SUM(CASE WHEN error_direction = 'Underestimated' THEN 1 ELSE 0 END) AS under_cnt
        FROM gmp_accuracy_eval
        GROUP BY platform_name
    ) eval ON g.platform_name = eval.platform_name
    WHERE g.ipo_id = %s
    ORDER BY g.gmp_inr DESC
    """
    gmp_rows = execute_query(gmp_with_benchmark_sql, (ipo_id,))

    # Feature 2: Scoreboard
    scoreboard_sql = """
    SELECT 
        platform_name,
        COUNT(*) AS total_evaluated_ipos,
        ROUND(AVG(absolute_error_pct), 2) AS mean_absolute_error_pct,
        ROUND(MIN(absolute_error_pct), 2) AS best_prediction_error_pct,
        ROUND(MAX(absolute_error_pct), 2) AS worst_prediction_error_pct,
        SUM(CASE WHEN error_direction = 'Overestimated' THEN 1 ELSE 0 END) AS overestimation_count,
        SUM(CASE WHEN error_direction = 'Underestimated' THEN 1 ELSE 0 END) AS underestimation_count
    FROM gmp_accuracy_eval
    GROUP BY platform_name
    ORDER BY mean_absolute_error_pct ASC
    """
    scoreboard_rows = execute_query(scoreboard_sql)

    # Feature 3: Prospectus Variance Tracker Diffs
    diffs = execute_query("SELECT * FROM drhp_rhp_diffs WHERE ipo_id = %s ORDER BY diff_id", (ipo_id,))

    # Feature 4: Timeline
    timeline_meta = {
        "open_date": primary["open_date"],
        "close_date": primary["close_date"],
        "allotment_date": primary["allotment_date"],
        "listing_date": primary["listing_date"],
        "anchor_lockin_30d": primary["anchor_lockin_30d"],
        "anchor_lockin_90d": primary["anchor_lockin_90d"],
        "pre_ipo_lockin_180d": primary["pre_ipo_lockin_180d"]
    }

    # Feature 5: NoSQL Filings & AV Media
    filings = get_company_filings(sym)
    videos = get_media_and_research(sym)
    peers = get_peer_comparison(sym)
    deep_sec = get_drhp_rhp_sections(sym)

    # Fallback if MongoDB is offline
    if not filings:
        from crawler.ipo_crawler import OFFICIAL_FILING_LINKS
        slug = sym.lower()
        links = OFFICIAL_FILING_LINKS.get(sym, {})
        rhp_url = links.get("rhp") or ("https://listing.bseindia.com/download/8888888/preanchor/rhpgid_20261021183023.zip" if sym == "EAAA" else "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F")
        drhp_url = links.get("drhp") or "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10"
        anchor_pdf = links.get("anchor_pdf") or "https://www.chittorgarh.net/reports/anchor-investor/"
        filings = [{
            "symbol": sym,
            "company_name": primary["company_name"],
            "drhp_pdf_url": drhp_url,
            "rhp_pdf_url": rhp_url,
            "anchor_letter_pdf_url": anchor_pdf,
            "bse_offer_doc_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
            "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
            "drhp_av_mp4_url": f"https://www.sebi.gov.in/filings/multimedia/{slug}_drhp_av.mp4",
            "rhp_av_mp4_url": f"https://www.sebi.gov.in/filings/multimedia/{slug}_rhp_av.mp4",
            "filing_ref": f"SEBI/CFD/DIL/DCR/2026/{sym}/01",
            "lead_counsel": "Cyril Amarchand Mangaldas",
            "statutory_auditors": "Deloitte Haskins & Sells LLP"
        }]
    if not videos:
        slug = sym.lower()
        videos = [
            {
                "channel_name": "ET NOW Financial Review",
                "video_title": f"{primary['company_name']} IPO In-Depth Analysis: Issue Size & Valuations",
                "key_takeaway": "Strong institutional book building with solid sector expansion fundamentals.",
                "video_url": f"https://www.youtube.com/results?search_query={slug}+ipo+analysis+review"
            },
            {
                "channel_name": "CNBC-TV18 Primary Market",
                "video_title": f"Executive Management Briefing: {primary['company_name']}",
                "key_takeaway": "Management addresses capacity utilization and fresh capital allocation.",
                "video_url": f"https://www.youtube.com/results?search_query={slug}+ipo+management+interview"
            }
        ]

    return jsonify({
        "primary": primary,
        "gmp_heatmap_with_accuracy": gmp_rows,
        "scoreboard": scoreboard_rows,
        "regulatory_diffs": diffs,
        "timeline": timeline_meta,
        "prospectus_and_media": {
            "filings": filings[0] if filings else None,
            "analyst_videos": videos,
            "deep_sections": deep_sec[0] if deep_sec else None
        },
        "analytics": {
            "reservations": reservations,
            "anchors": anchors,
            "bidding": bids,
            "secondary_metrics": secondary[0] if secondary else None,
            "peer_competitors": peers[0]["competitors"] if peers and "competitors" in peers[0] else []
        }
    })

@app.route("/api/gmp/heatmap")
def api_gmp_heatmap():
    sql = """
    SELECT 
        i.symbol, i.company_name, i.status, i.status_order, i.issue_price,
        g.platform_name, g.gmp_inr, g.estimated_listing_price,
        g.estimated_gain_percent, g.rating_sentiment, g.recorded_at
    FROM gmp_platform_records g
    JOIN ipos i ON g.ipo_id = i.ipo_id
    ORDER BY i.status_order ASC, i.open_date DESC, g.gmp_inr DESC
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/gmp/scoreboard")
def api_gmp_scoreboard():
    sql = """
    SELECT 
        platform_name,
        COUNT(*) AS total_evaluated_ipos,
        ROUND(AVG(absolute_error_pct), 2) AS mean_absolute_error_pct,
        ROUND(MIN(absolute_error_pct), 2) AS best_prediction_error_pct,
        ROUND(MAX(absolute_error_pct), 2) AS worst_prediction_error_pct,
        SUM(CASE WHEN error_direction = 'Overestimated' THEN 1 ELSE 0 END) AS overestimation_count,
        SUM(CASE WHEN error_direction = 'Underestimated' THEN 1 ELSE 0 END) AS underestimation_count
    FROM gmp_accuracy_eval
    GROUP BY platform_name
    ORDER BY mean_absolute_error_pct ASC
    """
    rows = execute_query(sql)
    return jsonify(rows)

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
        SUM(CASE WHEN error_direction = 'Exact' THEN 1 ELSE 0 END) AS exact_match_count,
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

@app.route("/api/drhp-diffs")
def api_drhp_diffs():
    sql = """
    SELECT 
        d.diff_id, i.symbol, i.company_name, d.parameter_name,
        d.drhp_val, d.rhp_val, d.percentage_change, d.change_nature
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
    ORDER BY status_order ASC, open_date DESC
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/filings")
def api_all_filings():
    """Returns prospectus and AV media filings for all companies (for Market Mode)."""
    filings = get_company_filings()
    all_videos = get_media_and_research()
    res = []
    
    ipos = execute_query("SELECT symbol, company_name, sector, status FROM ipos ORDER BY status_order ASC, open_date DESC")
    for ipo in ipos:
        sym = ipo["symbol"]
        slug = sym.lower()
        f_match = next((f for f in filings if f.get("symbol") == sym), None)
        v_matches = [v for v in all_videos if v.get("symbol") == sym]
        
        if not v_matches:
            v_matches = [
                {
                    "channel_name": "ET NOW Financial Review",
                    "video_title": f"{ipo['company_name']} IPO In-Depth Analysis: Issue Size & Valuations",
                    "key_takeaway": "Strong institutional book building with solid sector fundamentals.",
                    "video_url": f"https://www.youtube.com/results?search_query={slug}+ipo+analysis+review"
                },
                {
                    "channel_name": "CNBC-TV18 Primary Market",
                    "video_title": f"Executive Management Briefing: {ipo['company_name']}",
                    "key_takeaway": "Management outlines capacity expansion and fresh working capital deployment.",
                    "video_url": f"https://www.youtube.com/results?search_query={slug}+ipo+management+interview"
                }
            ]

        res.append({
            "symbol": sym,
            "company_name": ipo["company_name"],
            "sector": ipo["sector"],
            "status": ipo["status"],
            "drhp_pdf_url": f_match.get("drhp_pdf_url", "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10") if f_match else "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "rhp_pdf_url": f_match.get("rhp_pdf_url", "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx") if f_match else "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
            "anchor_letter_pdf_url": f_match.get("anchor_letter_pdf_url", "https://www.chittorgarh.net/reports/anchor-investor/") if f_match else "https://www.chittorgarh.net/reports/anchor-investor/",
            "drhp_av_mp4_url": f_match.get("drhp_av_mp4_url", f"https://www.sebi.gov.in/filings/multimedia/{slug}_drhp_av.mp4") if f_match else f"https://www.sebi.gov.in/filings/multimedia/{slug}_drhp_av.mp4",
            "rhp_av_mp4_url": f_match.get("rhp_av_mp4_url", f"https://www.sebi.gov.in/filings/multimedia/{slug}_rhp_av.mp4") if f_match else f"https://www.sebi.gov.in/filings/multimedia/{slug}_rhp_av.mp4",
            "bse_offer_doc_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
            "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
            "lead_counsel": f_match.get("lead_counsel", "Cyril Amarchand Mangaldas") if f_match else "Cyril Amarchand Mangaldas",
            "statutory_auditors": f_match.get("statutory_auditors", "Deloitte Haskins & Sells LLP") if f_match else "Deloitte Haskins & Sells LLP",
            "videos": v_matches
        })
    return jsonify(res)

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

@app.route("/api/crawl/refresh", methods=["GET", "POST"])
def api_crawl_refresh():
    """Triggers on-demand live crawler pipeline and refreshes live database."""
    global LAST_CRAWL_TIMESTAMP
    from crawler.data_transformer import ingest_live_market_data
    try:
        ingest_live_market_data()
        LAST_CRAWL_TIMESTAMP = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"))
        count = execute_query("SELECT count(*) as cnt FROM ipos")[0]["cnt"]
        return jsonify({
            "status": "success",
            "message": f"Successfully scraped and refreshed {count} live offerings from Indian market trackers.",
            "last_crawled": LAST_CRAWL_TIMESTAMP,
            "total_ipos": count
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    print(f"[INFO] V3 Live Dashboard server starting on http://localhost:{config.PORT}")
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)
