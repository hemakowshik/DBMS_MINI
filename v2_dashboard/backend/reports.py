from .db_relational import execute_query
from .db_nosql import get_nosql_db

def get_report_sector_summary():
    sql = """
    SELECT 
        i.sector,
        i.sale_type,
        COUNT(i.ipo_id) AS total_ipos,
        ROUND(SUM(i.total_issue_val_cr), 2) AS total_capital_raised_cr,
        ROUND(AVG(i.total_issue_val_cr), 2) AS avg_issue_size_cr,
        ROUND(AVG(COALESCE(s.listing_gain_percent, 0)), 2) AS avg_listing_gain_pct
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
    sql = """
    SELECT 
        i.symbol,
        i.company_name,
        b.qib_subscription_times,
        b.total_subscription_times,
        i.issue_price,
        s.iep AS preopen_equilibrium_price,
        s.listing_gain_percent
    FROM ipos i
    JOIN subscription_bids b ON i.ipo_id = b.ipo_id AND b.day_number = (SELECT MAX(day_number) FROM subscription_bids WHERE ipo_id = i.ipo_id)
    JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
    ORDER BY b.qib_subscription_times DESC
    """
    return {
        "title": "Institutional Demand (QIB) vs First-Day Listing Performance",
        "description": "Cross-tabulates final institutional bidding intensity with actual market price discovery (IEP).",
        "sql_query": sql.strip(),
        "data": execute_query(sql)
    }

def get_report_anchor_lockin_exposure():
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
        "description": "Details institutional share supply unlocks to forecast potential secondary market liquidity shifts.",
        "sql_query": sql.strip(),
        "data": execute_query(sql)
    }

def get_report_hybrid_research_sentiment():
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
