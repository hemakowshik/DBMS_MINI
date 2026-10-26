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

# -------------------------------------------------------------
# REST API Endpoints
# -------------------------------------------------------------

@app.route("/api/status")
def api_status():
    _, engine = get_db_connection()
    mongo_ok = get_nosql_db() is not None
    return jsonify({
        "status": "online",
        "market_feed": "NSE/BSE Live",
        "system": "IPOWatch Financial Terminal",
        "relational_engine": engine,
        "nosql_engine": "online" if mongo_ok else "offline"
    })

@app.route("/api/ipos")
def api_ipos():
    sql = """
    SELECT 
        i.*,
        s.iep, s.listing_gain_percent, s.indicative_val_lakhs, s.trading_status
    FROM ipos i
    LEFT JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
    ORDER BY i.listing_date DESC
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/ipo/<symbol>")
def api_ipo_detail(symbol):
    sym = symbol.upper()
    ipo_sql = "SELECT * FROM ipos WHERE symbol = %s"
    ipo_res = execute_query(ipo_sql, (sym,))
    if not ipo_res:
        return jsonify({"error": "IPO not found"}), 404
    ipo = ipo_res[0]
    ipo_id = ipo["ipo_id"]

    # Child tables
    reservations = execute_query("SELECT * FROM ipo_reservations WHERE ipo_id = %s", (ipo_id,))
    anchors = execute_query("SELECT * FROM anchor_investors WHERE ipo_id = %s", (ipo_id,))
    bids = execute_query("SELECT * FROM subscription_bids WHERE ipo_id = %s ORDER BY day_number", (ipo_id,))
    secondary = execute_query("SELECT * FROM secondary_listing_metrics WHERE ipo_id = %s", (ipo_id,))
    gmp_records = execute_query("SELECT * FROM gmp_platform_records WHERE ipo_id = %s", (ipo_id,))
    accuracy = execute_query("SELECT * FROM gmp_accuracy_eval WHERE ipo_id = %s", (ipo_id,))
    diffs = execute_query("SELECT * FROM drhp_rhp_diffs WHERE ipo_id = %s", (ipo_id,))

    # MongoDB documents
    filings = get_company_filings(sym)
    sections = get_drhp_rhp_sections(sym)
    media = get_media_and_research(sym)
    peers = get_peer_comparison(sym)

    return jsonify({
        "primary": ipo,
        "reservations": reservations,
        "anchors": anchors,
        "bids": bids,
        "secondary_metrics": secondary[0] if secondary else None,
        "gmp_records": gmp_records,
        "gmp_accuracy": accuracy,
        "drhp_rhp_diffs": diffs,
        "nosql_data": {
            "filings": filings[0] if filings else None,
            "deep_sections": sections,
            "media_reviews": media,
            "peer_multiples": peers[0] if peers else None
        }
    })

@app.route("/api/gmp/heatmap")
def api_gmp_heatmap():
    """Returns matrix of IPOs vs GMP tracking sites."""
    sql = """
    SELECT 
        i.symbol,
        i.company_name,
        i.issue_price,
        g.platform_name,
        g.gmp_inr,
        g.estimated_gain_percent,
        g.rating_sentiment
    FROM gmp_platform_records g
    JOIN ipos i ON g.ipo_id = i.ipo_id
    ORDER BY i.symbol, g.platform_name
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/gmp/scoreboard")
def api_gmp_scoreboard():
    """NOVELTY 1: Evaluates platform forecasting accuracy."""
    return jsonify(reports.get_report_gmp_accuracy()["data"])

@app.route("/api/drhp-diffs")
def api_drhp_diffs():
    """NOVELTY 2: Side-by-side DRHP vs RHP regulatory diffs."""
    sql = """
    SELECT 
        i.symbol,
        i.company_name,
        d.parameter_name,
        d.drhp_val,
        d.rhp_val,
        d.percentage_change,
        d.change_nature,
        d.sebi_observation_noted
    FROM drhp_rhp_diffs d
    JOIN ipos i ON d.ipo_id = i.ipo_id
    ORDER BY i.symbol, d.diff_id
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/timeline")
def api_timeline():
    """Key milestone dates with Anchor lock-in expiry countdowns."""
    sql = """
    SELECT 
        symbol, company_name, open_date, close_date, allotment_date,
        listing_date, anchor_lockin_30d, anchor_lockin_90d, pre_ipo_lockin_180d
    FROM ipos
    ORDER BY listing_date DESC
    """
    rows = execute_query(sql)
    return jsonify(rows)

@app.route("/api/filings")
def api_filings():
    """MongoDB documents: DRHP/RHP pdfs, AV mp4 links, and SEBI portal links."""
    filings = get_company_filings()
    return jsonify(filings)

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
    print(f"[INFO] Starting IPO Intelligence Dashboard on http://localhost:{config.PORT}")
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)
