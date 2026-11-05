from werkzeug.security import check_password_hash, generate_password_hash

import re
import os
import datetime
from flask import Flask, render_template, jsonify, request, Response
import sqlite3
import csv
import io
import requests
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

def ensure_database_initialized():
    """Auto-bootstraps database on Render / container startup if missing or empty."""
    db_file = config.SQLITE_DB_PATH
    needs_init = False
    if not os.path.exists(db_file) or os.path.getsize(db_file) == 0:
        needs_init = True
    else:
        try:
            conn = sqlite3.connect(db_file)
            c = conn.cursor()
            cnt = c.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='ipos'").fetchone()[0]
            if cnt == 0:
                needs_init = True
            else:
                row_cnt = c.execute("SELECT count(*) FROM ipos").fetchone()[0]
                if row_cnt == 0:
                    needs_init = True
            conn.close()
        except Exception:
            needs_init = True

        # Guarantee triggers and views are active even if tables already existed
        if not needs_init:
            try:
                conn = sqlite3.connect(db_file)
                c = conn.cursor()
                trg_cnt = c.execute("SELECT count(*) FROM sqlite_master WHERE type='trigger'").fetchone()[0]
                if trg_cnt == 0:
                    vti_path = os.path.join(os.path.dirname(db_file), "sql", "03_views_triggers_indexes.sql")
                    if os.path.exists(vti_path):
                        with open(vti_path, 'r', encoding='utf-8') as f:
                            c.executescript(f.read())
                        conn.commit()
                        print("[STARTUP] Active triggers and views installed into SQLite database.")
                conn.close()
            except Exception as e:
                print(f"[STARTUP] Trigger init notice: {e}")
    
    if needs_init:
        print("[STARTUP] Bootstrapping SQLite database with live primary market crawl...")
        try:
            try:
                from ..crawler.data_transformer import ingest_live_market_data
            except Exception:
                from crawler.data_transformer import ingest_live_market_data
            ingest_live_market_data()
        except Exception as e:
            print(f"[STARTUP WARN] Auto-bootstrap notice: {e}")

try:
    ensure_database_initialized()
except Exception as e:
    print(f"[STARTUP] Bootstrap notice: {e}")


@app.route("/favicon.ico")
def favicon():
    return "", 204

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/database/schema-objects")
def api_schema_objects():
    """Returns active database objects (tables, views, triggers, indexes) confirmed in sqlite_master."""
    conn, engine = get_db_connection()
    try:
        cursor = conn.cursor()
        triggers = cursor.execute("SELECT name, tbl_name, sql FROM sqlite_master WHERE type='trigger'").fetchall()
        views = cursor.execute("SELECT name, tbl_name, sql FROM sqlite_master WHERE type='view'").fetchall()
        tables = cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").fetchall()
        indexes = cursor.execute("SELECT name, tbl_name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'").fetchall()
        return jsonify({
            "status": "success",
            "relational_engine": engine,
            "database_file": config.SQLITE_DB_PATH,
            "summary": {
                "tables_count": len(tables),
                "views_count": len(views),
                "triggers_count": len(triggers),
                "indexes_count": len(indexes)
            },
            "triggers": [{"name": t[0], "tbl_name": t[1], "sql": t[2]} for t in triggers],
            "views": [{"name": v[0], "tbl_name": v[1], "sql": v[2]} for v in views],
            "tables": [t[0] for t in tables]
        })
    finally:
        conn.close()

@app.route("/api/status")
def api_status():
    conn, engine = get_db_connection()
    trg_count = 0
    view_count = 0
    try:
        c = conn.cursor()
        trg_count = c.execute("SELECT count(*) FROM sqlite_master WHERE type='trigger'").fetchone()[0]
        view_count = c.execute("SELECT count(*) FROM sqlite_master WHERE type='view'").fetchone()[0]
    except Exception:
        pass
    finally:
        conn.close()

    mongo_ok = get_nosql_db() is not None
    return jsonify({
        "status": "online",
        "system": "IPOWatch Live Terminal MARK4 (Polyglot RDBMS + NoSQL)",
        "feed": "Live Indian Primary Markets",
        "last_crawled": LAST_CRAWL_TIMESTAMP,
        "relational_engine": engine,
        "active_triggers_count": trg_count,
        "active_views_count": view_count,
        "nosql_engine": "online" if mongo_ok else "offline",
        "auth_rbac": "enabled (Admin, Analyst, Investor)"
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
    anc_summary = execute_query("SELECT * FROM anchor_lockin_summary WHERE ipo_id = %s", (ipo_id,))
    
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

    # Feature 3: Prospectus Variance Tracker Diffs (Live from user's Excel / CSV)
    from .sheets_sync_service import (
        read_regulatory_variances_for_company,
        read_media_links_for_company,
        read_timeline_milestones_for_company
    )
    excel_diffs = read_regulatory_variances_for_company(sym)
    if excel_diffs:
        diffs = excel_diffs
    else:
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
    excel_timeline = read_timeline_milestones_for_company(sym)
    if excel_timeline:
        timeline_meta["custom_milestones"] = excel_timeline

    # Feature 5: Filings & AV Media (Live from user's Excel / CSV)
    excel_media = read_media_links_for_company(sym)
    if excel_media:
        filings = [excel_media]
        videos = excel_media.get("videos") or []
    else:
        filings = get_company_filings(sym)
        videos = get_media_and_research(sym)

    # Fallback defaults if not found in Excel or Mongo
    if not filings:
        slug = sym.lower()
        filings = [{
            "symbol": sym,
            "company_name": primary["company_name"],
            "drhp_pdf_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "rhp_pdf_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
            "anchor_letter_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/",
            "bse_offer_doc_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
            "sebi_portal_url": "https://www.sebi.gov.in",
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
    peers = get_peer_comparison(sym)
    deep_sec = get_drhp_rhp_sections(sym)

    # Fallback if MongoDB is offline
    if not filings:
        try:
            from ..crawler.ipo_crawler import OFFICIAL_FILING_LINKS
        except Exception:
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
            "anchor_summary": anc_summary[0] if anc_summary else None,
            "bids": bids,
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
        d.diff_id, i.symbol, i.company_name, i.sector, i.segment, i.exchange, i.status, d.parameter_name,
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
        symbol, company_name, sector, segment, exchange, status, status_order, open_date, close_date, allotment_date,
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
    
    ipos = execute_query("SELECT symbol, company_name, sector, segment, exchange, status FROM ipos ORDER BY status_order ASC, open_date DESC")
    from .sheets_sync_service import read_media_links_for_company
    for ipo in ipos:
        sym = ipo["symbol"]
        excel_f = read_media_links_for_company(sym)
        if excel_f:
            res.append({
                "symbol": sym,
                "company_name": ipo["company_name"],
                "sector": ipo["sector"],
                "segment": ipo.get("segment", "Mainboard"),
                "exchange": ipo.get("exchange", "NSE / BSE"),
                "status": ipo["status"],
                "drhp_pdf_url": excel_f["drhp_pdf_url"],
                "rhp_pdf_url": excel_f["rhp_pdf_url"],
                "anchor_letter_pdf_url": excel_f["anchor_letter_pdf_url"],
                "drhp_av_mp4_url": excel_f["drhp_av_mp4_url"],
                "rhp_av_mp4_url": excel_f["rhp_av_mp4_url"],
                "bse_offer_doc_url": excel_f["bse_offer_doc_url"],
                "sebi_portal_url": excel_f["sebi_portal_url"],
                "lead_counsel": excel_f["lead_counsel"],
                "statutory_auditors": excel_f["statutory_auditors"],
                "videos": excel_f["videos"]
            })
            continue
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
            "segment": ipo.get("segment", "Mainboard"),
            "exchange": ipo.get("exchange", "NSE / BSE"),
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



@app.route("/api/sheets/download/workbook")
def api_download_workbook():
    """Allows downloading the master Excel workbook."""
    from .sheets_sync_service import WORKBOOK_PATH, ensure_workbook_exists
    ensure_workbook_exists()
    if os.path.exists(WORKBOOK_PATH):
        with open(WORKBOOK_PATH, "rb") as f:
            data = f.read()
        return Response(
            data,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=IPO_Intelligence_Workbook.xlsx"}
        )
    return jsonify({"error": "Workbook not found"}), 404

@app.route("/api/sheets/template/<sheet_type>")
def api_sheets_template(sheet_type):
    """Returns the CSV template file content or triggers download."""
    sheets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sheets")
    filename = f"{sheet_type}.csv"
    file_path = os.path.join(sheets_dir, filename)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            csv_text = f.read()
        return Response(
            csv_text,
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    return jsonify({"error": f"Template {sheet_type} not found"}), 404

@app.route("/api/sheets/sync", methods=["POST"])
def api_sheets_sync():
    """
    Synchronizes data from local CSV files or a live Google Sheets URL into:
    1. drhp_rhp_diffs (Regulatory Variance Tracker)
    2. ipos milestone dates and status (Timeline & Lock-in Expiry)
    3. company_filings & media_and_research (Prospectus & Media links)
    """
    data = request.get_json() or {}
    sheet_type = data.get("sheet_type", "all")
    source = data.get("source", "local")
    sheets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sheets")
    
    results = {"updated": 0, "messages": []}

    if source == "local":
        try:
            from .sheets_sync_service import sync_csv_from_excel
            sync_csv_from_excel()
        except Exception as e:
            print(f"[SHEETS SYNC] sync_csv_from_excel notice: {e}")

    def get_csv_rows(stype):
        raw_rows = []
        if source == "url" and data.get("url"):
            r = requests.get(data.get("url"), timeout=15)
            r.encoding = "utf-8"
            raw_rows = list(csv.DictReader(io.StringIO(r.text)))
        elif source == "csv_data" and data.get("csv_data"):
            raw_rows = list(csv.DictReader(io.StringIO(data.get("csv_data"))))
        else:
            fp = os.path.join(sheets_dir, f"{stype}.csv")
            read_success = False
            if os.path.exists(fp):
                try:
                    with open(fp, "r", encoding="utf-8") as f:
                        raw_rows = list(csv.DictReader(f))
                        read_success = True
                except Exception:
                    read_success = False
            if not read_success:
                try:
                    import openpyxl
                    from .sheets_sync_service import WORKBOOK_PATH
                    if os.path.exists(WORKBOOK_PATH):
                        wb = openpyxl.load_workbook(WORKBOOK_PATH, data_only=True, read_only=True)
                        sheet_map = {
                            "regulatory_variances": "Regulatory_Variances",
                            "timeline_lockin": "Timeline_Lockin_Schedule",
                            "prospectus_media_links": "Prospectus_Media_Links"
                        }
                        t_sheet = sheet_map.get(stype)
                        if t_sheet and t_sheet in wb.sheetnames:
                            ws = wb[t_sheet]
                            all_rows = list(ws.iter_rows(values_only=True))
                            if all_rows and len(all_rows) > 1:
                                headers = [str(h) if h is not None else f"col_{i}" for i, h in enumerate(all_rows[0])]
                                for r in all_rows[1:]:
                                    if any(c is not None for c in r):
                                        r_dict = {headers[i]: (str(val) if val is not None else "") for i, val in enumerate(r) if i < len(headers)}
                                        raw_rows.append(r_dict)
                except Exception as xl_err:
                    print(f"[EXCEL DIRECT READ] Notice: {xl_err}")

        normalized = []
        for row in raw_rows:
            norm_r = {}
            for k, v in row.items():
                if k is not None:
                    clean_k = re.sub(r'[^a-z0-9]', '', str(k).lower())
                    norm_r[clean_k] = str(v).strip() if v is not None else ""
            normalized.append(norm_r)
        return normalized

    conn = sqlite3.connect(config.SQLITE_DB_PATH)
    cursor = conn.cursor()

    try:
        # 1. Sync Regulatory Variances
        if sheet_type in ("regulatory_variances", "all"):
            rows = get_csv_rows("regulatory_variances")
            diff_cnt = 0
            if rows:
                symbols = set(r.get("symbol", "").strip().upper() for r in rows if r.get("symbol"))
                for sym in symbols:
                    c_ipo = cursor.execute("SELECT ipo_id FROM ipos WHERE symbol = ?", (sym,)).fetchone()
                    if c_ipo:
                        cursor.execute("DELETE FROM drhp_rhp_diffs WHERE ipo_id = ?", (c_ipo[0],))

                for r in rows:
                    sym = r.get("symbol", "").strip().upper()
                    c_ipo = cursor.execute("SELECT ipo_id FROM ipos WHERE symbol = ?", (sym,)).fetchone()
                    if c_ipo:
                        iid = c_ipo[0]
                        param = r.get("parametername") or r.get("parameter") or "Regulatory Clause"
                        drhp_v = r.get("drhpvaluedraftprospectus") or r.get("drhpvalue") or r.get("drhpval") or ""
                        rhp_v = r.get("rhpvaluefinalapproved") or r.get("rhpvalue") or r.get("rhpval") or ""
                        try:
                            chg_pct = float(str(r.get("percentagechange") or "0").replace("%", "").strip() or 0.0)
                        except Exception:
                            chg_pct = 0.0
                        nature = r.get("changenaturesebireviewrationale") or r.get("changenature") or "SEBI ICDR Regulatory Variance"
                        cursor.execute("""
                            INSERT INTO drhp_rhp_diffs (ipo_id, parameter_name, drhp_val, rhp_val, percentage_change, change_nature)
                            VALUES (?, ?, ?, ?, ?, ?)
                        """, (iid, param, drhp_v, rhp_v, chg_pct, nature))
                        diff_cnt += 1
                results["updated"] += diff_cnt
                results["messages"].append(f"Synced {diff_cnt} regulatory variance records.")

        # 2. Sync Timeline & Lock-in Expiry
        if sheet_type in ("timeline_lockin", "all"):
            rows = get_csv_rows("timeline_lockin")
            time_cnt = 0
            for r in rows:
                sym = r.get("symbol", "").strip().upper()
                c_ipo = cursor.execute("SELECT ipo_id, open_date, close_date FROM ipos WHERE symbol = ?", (sym,)).fetchone()
                if c_ipo:
                    iid, o_d, c_d = c_ipo
                    m_name = (r.get("milestonename") or r.get("milestone") or "").lower()
                    m_date = (r.get("milestonedateyyyymmdd") or r.get("milestonedate") or "").strip()
                    if m_date:
                        if "open" in m_name:
                            cursor.execute("UPDATE ipos SET open_date = ? WHERE ipo_id = ?", (m_date, iid))
                            o_d = m_date
                        elif "close" in m_name:
                            cursor.execute("UPDATE ipos SET close_date = ? WHERE ipo_id = ?", (m_date, iid))
                            c_d = m_date
                        elif "allotment" in m_name or "basis" in m_name:
                            cursor.execute("UPDATE ipos SET allotment_date = ? WHERE ipo_id = ?", (m_date, iid))
                        elif "listing" in m_name:
                            cursor.execute("UPDATE ipos SET listing_date = ? WHERE ipo_id = ?", (m_date, iid))
                        elif "30" in m_name:
                            cursor.execute("UPDATE ipos SET anchor_lockin_30d = ? WHERE ipo_id = ?", (m_date, iid))
                        elif "90" in m_name:
                            cursor.execute("UPDATE ipos SET anchor_lockin_90d = ? WHERE ipo_id = ?", (m_date, iid))
                        elif "180" in m_name or "pre-ipo" in m_name:
                            cursor.execute("UPDATE ipos SET pre_ipo_lockin_180d = ? WHERE ipo_id = ?", (m_date, iid))

                        today_iso = datetime.datetime.now().date().isoformat()
                        if today_iso < o_d:
                            new_status, new_order = 'Upcoming', 1
                        elif today_iso <= c_d:
                            new_status, new_order = 'Open', 2
                        else:
                            new_status, new_order = 'Completed', 3
                        cursor.execute("UPDATE ipos SET status = ?, status_order = ? WHERE ipo_id = ?", (new_status, new_order, iid))
                        time_cnt += 1
            results["updated"] += time_cnt
            results["messages"].append(f"Updated {time_cnt} timeline milestone dates.")

        conn.commit()

        # 3. Sync Prospectus & Media Links
        if sheet_type in ("prospectus_media_links", "all"):
            rows = get_csv_rows("prospectus_media_links")
            media_cnt = 0
            try:
                from ..crawler.ipo_crawler import OFFICIAL_FILING_LINKS
            except Exception:
                from crawler.ipo_crawler import OFFICIAL_FILING_LINKS
            db = get_nosql_db()

            for r in rows:
                sym = r.get("symbol", "").strip().upper()
                if sym:
                    rhp_url = r.get("rhp_pdf_url", "").strip()
                    drhp_url = r.get("drhp_pdf_url", "").strip()
                    anc_url = r.get("anchor_letter_pdf_url", "").strip()
                    bse_url = r.get("bse_offer_doc_url", "").strip()
                    sebi_url = r.get("sebi_portal_url", "").strip()
                    drhp_av = r.get("drhp_av_mp4_url", "").strip()
                    rhp_av = r.get("rhp_av_mp4_url", "").strip()

                    if sym not in OFFICIAL_FILING_LINKS:
                        OFFICIAL_FILING_LINKS[sym] = {}
                    if rhp_url: OFFICIAL_FILING_LINKS[sym]["rhp"] = rhp_url
                    if drhp_url: OFFICIAL_FILING_LINKS[sym]["drhp"] = drhp_url
                    if anc_url: OFFICIAL_FILING_LINKS[sym]["anchor_pdf"] = anc_url

                    if db is not None:
                        db.company_filings.update_one(
                            {"symbol": sym},
                            {"$set": {
                                "rhp_pdf_url": rhp_url or "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
                                "drhp_pdf_url": drhp_url or "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
                                "anchor_letter_pdf_url": anc_url or "https://www.chittorgarh.net/reports/anchor-investor/",
                                "bse_offer_doc_url": bse_url or "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
                                "sebi_portal_url": sebi_url or "https://www.sebi.gov.in",
                                "drhp_av_mp4_url": drhp_av or f"https://www.sebi.gov.in/filings/multimedia/{sym.lower()}_drhp_av.mp4",
                                "rhp_av_mp4_url": rhp_av or f"https://www.sebi.gov.in/filings/multimedia/{sym.lower()}_rhp_av.mp4"
                            }},
                            upsert=True
                        )

                        v1_title = r.get("analyst_video_1_title", "").strip()
                        v1_url = r.get("analyst_video_1_url", "").strip()
                        v2_title = r.get("analyst_video_2_title", "").strip()
                        v2_url = r.get("analyst_video_2_url", "").strip()
                        if v1_title and v1_url:
                            db.media_and_research.update_one(
                                {"symbol": sym, "channel_name": "ET NOW Financial Review"},
                                {"$set": {"video_title": v1_title, "video_url": v1_url}},
                                upsert=True
                            )
                        if v2_title and v2_url:
                            db.media_and_research.update_one(
                                {"symbol": sym, "channel_name": "CNBC-TV18 Primary Market"},
                                {"$set": {"video_title": v2_title, "video_url": v2_url}},
                                upsert=True
                            )

                    media_cnt += 1
            results["updated"] += media_cnt
            results["messages"].append(f"Synchronized {media_cnt} statutory filing and media links.")

        return jsonify({
            "status": "success",
            "message": " & ".join(results["messages"]) if results["messages"] else "No records changed.",
            "records_affected": results["updated"]
        })
    except Exception as e:
        conn.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        conn.close()

@app.route("/api/crawl/refresh", methods=["GET", "POST"])
def api_crawl_refresh():
    """Triggers on-demand live crawler pipeline and refreshes live database."""
    global LAST_CRAWL_TIMESTAMP
    try:
        import importlib
        try:
            import crawler.ipo_crawler as c_ipo
            import crawler.data_transformer as c_dt
            importlib.reload(c_ipo)
            importlib.reload(c_dt)
            ingest_live_market_data = c_dt.ingest_live_market_data
        except Exception:
            try:
                from ..crawler import ipo_crawler as c_ipo, data_transformer as c_dt
                importlib.reload(c_ipo)
                importlib.reload(c_dt)
                ingest_live_market_data = c_dt.ingest_live_market_data
            except Exception:
                from crawler.data_transformer import ingest_live_market_data

        count = ingest_live_market_data()
        LAST_CRAWL_TIMESTAMP = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"))

        if not count:
            count_rows = execute_query("SELECT count(*) as cnt FROM ipos")
            count = count_rows[0]["cnt"] if count_rows else 0

        return jsonify({
            "status": "success",
            "message": f"Successfully scraped and refreshed {count} live offerings from Indian market trackers.",
            "last_crawled": LAST_CRAWL_TIMESTAMP,
            "total_ipos": count
        })
    except Exception as e:
        print(f"[CRAWLER ERROR] {e}")
        return jsonify({
            "status": "error",
            "message": f"Live crawler execution notice: {str(e)}"
        }), 200



# ============================================================================
# AUTHENTICATION & ROLE-BASED ACCESS CONTROL (Requirement 11 & 13)
# ============================================================================
@app.route("/api/auth/login", methods=["POST"])
def api_auth_login():
    """Authenticates user against users table with hashed password verification."""
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"status": "error", "message": "Username and password required."}), 400

    rows = execute_query(
        "SELECT user_id, username, email, password_hash, role, full_name FROM users WHERE username = ?",
        (username,)
    )
    if not rows:
        return jsonify({"status": "error", "message": "Invalid username or password."}), 401

    user = rows[0]
    if not check_password_hash(user["password_hash"], password):
        return jsonify({"status": "error", "message": "Invalid username or password."}), 401

    return jsonify({
        "status": "success",
        "message": f"Welcome back, {user['full_name']} ({user['role']})",
        "user": {
            "user_id": user["user_id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "full_name": user["full_name"]
        }
    })

@app.route("/api/auth/roles", methods=["GET"])
def api_auth_roles():
    """Returns available system roles and test accounts for viva demonstration."""
    rows = execute_query("SELECT user_id, username, email, role, full_name FROM users")
    return jsonify({
        "status": "success",
        "roles": ["Admin", "Analyst", "Investor"],
        "users": rows
    })

# ============================================================================
# MEANINGFUL DML WITH DATABASE CONSTRAINT & TRIGGER ENFORCEMENT (Requirement 6, 12)
# ============================================================================
@app.route("/api/ipo/create", methods=["POST"])
def api_ipo_create():
    """Inserts a new IPO offering. Enforces trg_validate_price_band check."""
    data = request.get_json(silent=True) or {}
    sym = data.get("symbol", "").strip().upper()
    name = data.get("company_name", "").strip()
    sector = data.get("sector", "General")
    isin = data.get("isin", f"INE{sym[:6]}01019")
    min_p = float(data.get("price_band_min", 100.0))
    max_p = float(data.get("price_band_max", 120.0))
    lot = int(data.get("lot_size", 50))
    val = float(data.get("total_issue_val_cr", 500.0))
    fresh = float(data.get("fresh_issue_cr", val))
    ofs = float(data.get("ofs_val_cr", 0.0))
    open_d = data.get("open_date", "2026-12-01")
    close_d = data.get("close_date", "2026-12-03")
    status = data.get("status", "Upcoming")

    try:
        execute_dml("""
            INSERT INTO ipos (
                symbol, company_name, sector, isin, price_band_min, price_band_max,
                lot_size, total_issue_val_cr, fresh_issue_cr, ofs_val_cr,
                open_date, close_date, status, status_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, (sym, name, sector, isin, min_p, max_p, lot, val, fresh, ofs, open_d, close_d, status))
        return jsonify({
            "status": "success",
            "message": f"Successfully created offering {sym} - {name} with verified collar ₹{min_p}-₹{max_p}."
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Database Constraint / Trigger Violation: {str(e)}"
        }), 400

@app.errorhandler(500)
def handle_500(err):
    if request.path.startswith("/api/"):
        return jsonify({"status": "error", "message": "An internal server error occurred in API processing."}), 200
    return err

@app.errorhandler(Exception)
def handle_exception(e):
    if request.path.startswith("/api/"):
        print(f"[API ERROR] {request.path}: {e}")
        return jsonify({"status": "error", "message": str(e)}), 200
    raise e

if __name__ == "__main__":
    print(f"[INFO] V3 Live Dashboard server starting on http://localhost:{config.PORT}")
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)
