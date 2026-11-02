-- ============================================================================
-- PES UNIVERSITY • AIML DEPARTMENT • DBMS MINI PROJECT (CS304)
-- IPOWatch Intelligence & Primary Offering Forensics Platform (MARK4)
-- SCRIPT 03: Advanced Relational Objects (Views, B-Tree Indexes, and Triggers)
-- Implements Transactional Integrity, Dynamic Reporting Views, & Performance Optimization
-- Faculty Evaluator: Prof. Smitha G R
-- ============================================================================

-- ============================================================================
-- PART 1: PRODUCTION REPORTING VIEWS
-- ============================================================================

-- View 1: Cross-Platform Grey Market Arbitrage & Spread Surveillance View
-- Detects price dispersion between InvestorGain, IPOWatch, and Chittorgarh
CREATE VIEW v_active_gmp_arbitrage AS
SELECT 
    i.symbol,
    i.company_name,
    i.segment,
    i.price_band_max AS cap_price,
    COUNT(g.record_id) AS active_platforms_reporting,
    MIN(g.gmp_inr) AS min_gmp_inr,
    MAX(g.gmp_inr) AS max_gmp_inr,
    ROUND(AVG(g.gmp_inr), 2) AS mean_gmp_inr,
    (MAX(g.gmp_inr) - MIN(g.gmp_inr)) AS arbitrage_spread_inr,
    ROUND(((MAX(g.gmp_inr) - MIN(g.gmp_inr)) / i.price_band_max) * 100.0, 2) AS spread_dispersion_pct,
    CASE 
        WHEN ((MAX(g.gmp_inr) - MIN(g.gmp_inr)) / i.price_band_max) * 100.0 >= 5.0 THEN 'High Arbitrage Opportunity'
        WHEN ((MAX(g.gmp_inr) - MIN(g.gmp_inr)) / i.price_band_max) * 100.0 >= 2.0 THEN 'Moderate Spread'
        ELSE 'Tight Equilibrium'
    END AS arbitrage_risk_signal
FROM ipos i
JOIN gmp_platform_records g ON i.ipo_id = g.ipo_id
GROUP BY i.symbol, i.company_name, i.segment, i.price_band_max
HAVING COUNT(g.record_id) >= 2;

-- View 2: Two-Tier Institutional Anchor Supply-Shock Liquidity View
-- Aggregates 30-day and 90-day locked shares and prospective capital release
CREATE VIEW v_anchor_lockin_supply_shock AS
SELECT 
    i.symbol,
    i.company_name,
    i.segment,
    a.anchor_price,
    a.shares_locked_30d,
    i.anchor_lockin_30d AS expiry_date_30d,
    ROUND((a.shares_locked_30d * a.anchor_price) / 10000000.0, 2) AS capital_freed_30d_cr,
    a.shares_locked_90d,
    i.anchor_lockin_90d AS expiry_date_90d,
    ROUND((a.shares_locked_90d * a.anchor_price) / 10000000.0, 2) AS capital_freed_90d_cr,
    (a.shares_locked_30d + a.shares_locked_90d) AS total_anchor_shares,
    ROUND(((a.shares_locked_30d + a.shares_locked_90d) * a.anchor_price) / 10000000.0, 2) AS total_anchor_capital_cr
FROM ipos i
JOIN anchor_lockin_summary a ON i.ipo_id = a.ipo_id;

-- View 3: Institutional QIB Demand vs Price Discovery Correlation View
-- Correlates institutional book building demand multiples with secondary day-1 returns
CREATE VIEW v_institutional_demand_discovery AS
SELECT 
    i.symbol,
    i.company_name,
    i.segment,
    i.total_issue_val_cr,
    MAX(b.qib_multiple) AS peak_qib_oversubscription,
    MAX(b.total_subscription_times) AS peak_composite_subscription,
    i.issue_price,
    s.iep AS equilibrium_open_price,
    s.listing_gain_percent,
    s.trading_status
FROM ipos i
JOIN subscription_bids b ON i.ipo_id = b.ipo_id
JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
GROUP BY i.symbol, i.company_name, i.segment, i.total_issue_val_cr, i.issue_price, s.iep, s.listing_gain_percent, s.trading_status;

-- View 4: Complete Relational Offering Dossier View (BCNF Join)
CREATE VIEW v_offering_complete_dossier AS
SELECT 
    i.ipo_id,
    i.symbol,
    i.company_name,
    i.segment,
    i.status,
    i.price_band_min,
    i.price_band_max,
    i.lot_size,
    i.total_issue_val_cr,
    i.open_date,
    i.close_date,
    i.listing_date,
    s.iep,
    s.listing_gain_percent,
    als.shares_locked_30d,
    als.shares_locked_90d
FROM ipos i
LEFT JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
LEFT JOIN anchor_lockin_summary als ON i.ipo_id = als.ipo_id;

-- ============================================================================
-- PART 2: PERFORMANCE OPTIMIZATION B-TREE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_ipos_symbol ON ipos(symbol);
CREATE INDEX IF NOT EXISTS idx_ipos_status ON ipos(status);
CREATE INDEX IF NOT EXISTS idx_ipos_segment ON ipos(segment);
CREATE INDEX IF NOT EXISTS idx_ipos_dates ON ipos(open_date, close_date, listing_date);

CREATE INDEX IF NOT EXISTS idx_reservations_ipo_id ON ipo_reservations(ipo_id);
CREATE INDEX IF NOT EXISTS idx_anchors_ipo_id ON anchor_investors(ipo_id);
CREATE INDEX IF NOT EXISTS idx_bids_ipo_id ON subscription_bids(ipo_id);
CREATE INDEX IF NOT EXISTS idx_listing_ipo_id ON secondary_listing_metrics(ipo_id);
CREATE INDEX IF NOT EXISTS idx_gmp_platform_ipo ON gmp_platform_records(ipo_id, platform_name);
CREATE INDEX IF NOT EXISTS idx_gmp_recorded_at ON gmp_platform_records(recorded_at);
CREATE INDEX IF NOT EXISTS idx_eval_ipo_id ON gmp_accuracy_eval(ipo_id);
CREATE INDEX IF NOT EXISTS idx_diffs_ipo_id ON drhp_rhp_diffs(ipo_id);

-- ============================================================================
-- PART 3: TRANSACTIONAL INTEGRITY TRIGGERS
-- ============================================================================

-- Trigger 1: Validate Price Band Collar (Floor <= Cap)
CREATE TRIGGER IF NOT EXISTS trg_validate_price_band
BEFORE INSERT ON ipos
FOR EACH ROW
WHEN NEW.price_band_max < NEW.price_band_min
BEGIN
    SELECT RAISE(ABORT, 'Integrity Violation: price_band_max cannot be strictly less than price_band_min');
END;

-- Trigger 2: Automated Timestamp Update on Master Offering Record Modification
CREATE TRIGGER IF NOT EXISTS trg_audit_ipo_status_change
AFTER UPDATE OF status ON ipos
FOR EACH ROW
BEGIN
    UPDATE ipos SET created_at = CURRENT_TIMESTAMP WHERE ipo_id = NEW.ipo_id;
END;
