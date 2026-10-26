from .db_relational import execute_query
from .db_nosql import get_nosql_db

def get_report_sector_summary():
    """
    Report 1: Sector & Issue Type Aggregation
    Analogous to 'Average salary of every department' in company DB.
    Demonstrates: GROUP BY, COUNT, SUM, AVG, JOIN, HAVING
    """
    sql = """
    SELECT 
        i.sector,
        i.sale_type,
        COUNT(i.ipo_id) AS total_ipos,
        ROUND(SUM(i.total_issue_val_cr), 2) AS total_capital_raised_cr,
        ROUND(AVG(i.total_issue_val_cr), 2) AS avg_issue_size_cr,
        ROUND(AVG(s.listing_gain_percent), 2) AS avg_listing_gain_pct
    FROM ipos i
    LEFT JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
    GROUP BY i.sector, i.sale_type
    ORDER BY total_capital_raised_cr DESC
    """
    return {
        "title": "Sector & Issue-Type Capital Aggregation Analysis",
        "description": "Calculates total capital mobilized, average issue size, and average listing gain grouped by industry sector and offering sale type.",
        "sql_query": sql.strip(),
        "data": execute_query(sql)
    }

def get_report_gmp_accuracy():
    """
    Report 2: Multi-Platform GMP Accuracy Scoreboard
    Demonstrates: Aggregation, Error Calculation, Benchmarking
    """
    sql = """
    SELECT 
        platform_name,
        COUNT(*) AS total_evaluated_ipos,
        ROUND(AVG(absolute_error_pct), 2) AS mean_absolute_error_pct,
        ROUND(MIN(absolute_error_pct), 2) AS best_prediction_error_pct,
        ROUND(MAX(absolute_error_pct), 2) AS worst_prediction_error_pct,
        SUM(CASE WHEN error_direction = 'Overestimated' THEN 1 ELSE 0 END) AS overestimation_count,
        SUM(CASE WHEN error_direction = 'Underestimated' THEN 1 ELSE 0 END) AS underestimation_count,
        SUM(CASE WHEN error_direction = 'Accurate' THEN 1 ELSE 0 END) AS exact_match_count
    FROM gmp_accuracy_eval
    GROUP BY platform_name
    ORDER BY mean_absolute_error_pct ASC
    """
    return {
        "title": "GMP Platform Reliability & Mean Absolute Error (MAE) Scoreboard",
        "description": "Ranks external grey market trackers by forecasting accuracy against actual stock exchange listing gains.",
        "sql_query": sql.strip(),
        "data": execute_query(sql)
    }

def get_report_institutional_correlation():
    """
    Report 3: Institutional Demand (QIB) vs Actual Listing Pop
    Demonstrates: Multi-table JOIN with day-wise filtering
    """
    sql = """
    SELECT 
        i.symbol,
        i.company_name,
        i.sector,
        b.qib_subscription_times,
        b.retail_subscription_times,
        b.total_subscription_times,
        s.prev_close AS issue_price,
        s.iep AS preopen_equilibrium_price,
        s.listing_gain_percent
    FROM ipos i
    JOIN subscription_bids b ON i.ipo_id = b.ipo_id AND b.day_number = 3
    JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
    ORDER BY b.qib_subscription_times DESC
    """
    return {
        "title": "Institutional Demand (QIB) vs First-Day Listing Performance",
        "description": "Cross-tabulates final day institutional bidding intensity with actual market price discovery (IEP).",
        "sql_query": sql.strip(),
        "data": execute_query(sql)
    }

def get_report_anchor_lockin_exposure():
    """
    Report 4: Anchor Investor Lock-In Capital Exposure
    Demonstrates: GROUP BY, Aggregation on institutional tranches
    """
    sql = """
    SELECT 
        i.symbol,
        i.company_name,
        a.lockin_period_days,
        a.lockin_expiry_date,
        COUNT(a.anchor_id) AS total_anchor_funds,
        SUM(a.shares_allocated) AS total_shares_locked,
        ROUND(SUM(a.amount_cr), 2) AS total_capital_unlocking_cr
    FROM ipos i
    JOIN anchor_investors a ON i.ipo_id = a.ipo_id
    GROUP BY i.symbol, i.company_name, a.lockin_period_days, a.lockin_expiry_date
    ORDER BY a.lockin_expiry_date ASC
    """
    return {
        "title": "Anchor Investor Lock-In Expiry & Capital Unlock Risk Report",
        "description": "Details 30-day and 90-day institutional share supply unlocks to forecast potential market liquidity shocks.",
        "sql_query": sql.strip(),
        "data": execute_query(sql)
    }

def get_report_hybrid_research_sentiment():
    """
    Report 5: Hybrid NoSQL MongoDB Pipeline + Relational Metrics
    Demonstrates: MongoDB Aggregation pipeline + SQL cross-correlation
    """
    db = get_nosql_db()
    nosql_data = []
    if db is not None:
        pipeline = [
            {
                "$group": {
                    "_id": "$symbol",
                    "total_research_videos": {"$sum": 1},
                    "total_views": {"$sum": "$view_count"},
                    "sentiments": {"$push": "$sentiment"}
                }
            }
        ]
        nosql_data = list(db.media_and_research.aggregate(pipeline))

    # Fetch listing metrics
    sql = "SELECT symbol, company_name, listing_gain_percent FROM ipos i JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id"
    sql_rows = {r["symbol"]: r for r in execute_query(sql)}

    combined = []
    for item in nosql_data:
        sym = item["_id"]
        rel = sql_rows.get(sym, {})
        combined.append({
            "symbol": sym,
            "company_name": rel.get("company_name", sym),
            "research_videos_tracked": item["total_research_videos"],
            "total_community_views": item["total_views"],
            "analyst_sentiments": ", ".join(item["sentiments"]),
            "actual_listing_gain_pct": rel.get("listing_gain_percent", 0.0)
        })

    return {
        "title": "Cross-System Intelligence: Research Sentiment vs Secondary Market Returns",
        "description": "Correlates unstructured video research sentiment with secondary market price discovery to measure retail advisory alpha.",
        "mongo_pipeline": "[{\"$group\": {\"_id\": \"$symbol\", \"total_research_videos\": {\"$sum\": 1}, \"total_views\": {\"$sum\": \"$view_count\"}}}]",
        "data": combined
    }
