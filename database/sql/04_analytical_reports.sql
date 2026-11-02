-- ============================================================================
-- PES UNIVERSITY • AIML DEPARTMENT • DBMS MINI PROJECT (CS304)
-- IPOWatch Intelligence & Primary Offering Forensics Platform (MARK4)
-- SCRIPT 04: Executive Demonstration Aggregation Reports (SQL Analytics)
-- Faculty Evaluator: Prof. Smitha G R
--
-- Explanatory Note on Academic DBMS Reports:
-- In database management courses, an executive report is an analytical aggregate
-- query that transforms individual transactional rows across related tables into
-- summarized business intelligence using aggregate functions (SUM, AVG, COUNT, 
-- MIN, MAX, GROUP BY, and HAVING).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- REPORT 1: Sector-Wise Capital Mobilization Summary
-- (Academic Equivalent to "Average Salary of Every Department" in Employee DB)
-- Business Objective: Analyzes which industry sectors absorbed the highest public
-- capital, computing total capital mobilized, average issue size, and average cap price.
-- ----------------------------------------------------------------------------
SELECT 
    sector, 
    COUNT(ipo_id) AS total_offerings_count,
    SUM(total_issue_val_cr) AS total_capital_mobilized_cr,
    ROUND(AVG(total_issue_val_cr), 2) AS avg_offering_size_cr,
    ROUND(AVG(price_band_max), 2) AS avg_upper_price_band_inr,
    ROUND(MIN(price_band_min), 2) AS min_sector_floor_price,
    ROUND(MAX(price_band_max), 2) AS max_sector_cap_price
FROM ipos
GROUP BY sector
ORDER BY total_capital_mobilized_cr DESC;

-- ----------------------------------------------------------------------------
-- REPORT 2: Multi-Platform Grey Market Predictive Error & Bias Forensic Benchmark
-- Business Objective: Audits unofficial grey market aggregator accuracy (InvestorGain,
-- IPOWatch, Chittorgarh) against true NSE/BSE Equilibrium Listing Prices (IEP).
-- Computes Mean Absolute Error (MAE %) and classifies systematic platform bias.
-- ----------------------------------------------------------------------------
SELECT 
    platform_name, 
    COUNT(eval_id) AS total_offerings_audited,
    ROUND(AVG(absolute_error_pct), 2) AS mean_absolute_error_pct,
    SUM(CASE WHEN error_direction = 'Overestimate' THEN 1 ELSE 0 END) AS overestimation_count,
    SUM(CASE WHEN error_direction = 'Underestimate' THEN 1 ELSE 0 END) AS underestimation_count,
    SUM(CASE WHEN error_direction = 'Accurate' THEN 1 ELSE 0 END) AS exact_matches_count
FROM gmp_accuracy_eval
GROUP BY platform_name
ORDER BY mean_absolute_error_pct ASC;

-- ----------------------------------------------------------------------------
-- REPORT 3: Institutional QIB Bidding Demand vs Secondary Day-1 Listing Gains
-- Business Objective: Evaluates institutional price discovery efficiency by joining
-- ipos, subscription_bids, and secondary_listing_metrics to verify if institutional
-- oversubscription (>1.5x) reliably translates into higher listing pop returns.
-- ----------------------------------------------------------------------------
SELECT 
    i.symbol, 
    i.company_name,
    i.segment,
    MAX(b.qib_multiple) AS peak_qib_subscription_multiple,
    MAX(b.total_subscription_times) AS composite_book_multiple,
    i.issue_price, 
    s.iep AS equilibrium_open_price,
    s.listing_gain_percent AS day1_return_percentage,
    s.trading_status
FROM ipos i
JOIN subscription_bids b ON i.ipo_id = b.ipo_id
JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
GROUP BY i.symbol, i.company_name, i.segment, i.issue_price, s.iep, s.listing_gain_percent, s.trading_status
HAVING MAX(b.qib_multiple) > 1.50
ORDER BY s.listing_gain_percent DESC;

-- ----------------------------------------------------------------------------
-- REPORT 4: Two-Tier Institutional Anchor Lock-in Expiry & Capital Overhang Schedule
-- Business Objective: Quantifies prospective institutional supply shocks under amended
-- SEBI ICDR 2022 regulations by grouping 30-day lock-in expiries by calendar month.
-- ----------------------------------------------------------------------------
SELECT 
    strftime('%Y-%m', i.anchor_lockin_30d) AS lockin_expiry_month,
    COUNT(i.ipo_id) AS expiring_offerings_count,
    SUM(a.shares_locked_30d) AS total_30d_shares_released,
    ROUND(SUM(a.shares_locked_30d * a.anchor_price) / 10000000.0, 2) AS capital_freed_30d_cr,
    SUM(a.shares_locked_90d) AS total_90d_shares_released,
    ROUND(SUM(a.shares_locked_90d * a.anchor_price) / 10000000.0, 2) AS capital_freed_90d_cr
FROM ipos i
JOIN anchor_lockin_summary a ON i.ipo_id = a.ipo_id
WHERE i.anchor_lockin_30d IS NOT NULL
GROUP BY lockin_expiry_month
ORDER BY lockin_expiry_month ASC;

-- ----------------------------------------------------------------------------
-- REPORT 5: Retail Subscription vs Gray Market Speculative Sentiment Correlation
-- Business Objective: Evaluates retail investor herd behavior by correlating unofficial
-- street expected returns against retail book oversubscription multiples.
-- ----------------------------------------------------------------------------
SELECT 
    i.symbol, 
    i.company_name,
    g.platform_name AS reporting_street_desk,
    ROUND(g.estimated_gain_percent, 1) AS predicted_gmp_return_pct,
    ROUND(MAX(b.retail_multiple), 2) AS retail_subscription_multiple,
    ROUND(MAX(b.total_subscription_times), 2) AS total_book_multiple
FROM ipos i
JOIN gmp_platform_records g ON i.ipo_id = g.ipo_id
JOIN subscription_bids b ON i.ipo_id = b.ipo_id
GROUP BY i.symbol, i.company_name, g.platform_name, g.estimated_gain_percent
ORDER BY predicted_gmp_return_pct DESC
LIMIT 10;
