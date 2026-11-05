-- ====================================================================
-- IPO Intelligence & Market Surveillance Platform (Live Database Schema)
-- Hybrid Relational Engine (SQLite 3 / MySQL Compatible)
-- Includes: BCNF Tables, Foreign Keys, Views, Indexes, and Triggers
-- ====================================================================

DROP TRIGGER IF EXISTS trg_validate_price_band;
DROP TRIGGER IF EXISTS trg_validate_price_band_update;
DROP TRIGGER IF EXISTS trg_audit_ipo_status_change;

DROP VIEW IF EXISTS v_active_gmp_arbitrage;
DROP VIEW IF EXISTS v_anchor_lockin_supply_shock;
DROP VIEW IF EXISTS v_institutional_demand_discovery;
DROP VIEW IF EXISTS v_offering_complete_dossier;

DROP TABLE IF EXISTS drhp_rhp_diffs;
DROP TABLE IF EXISTS gmp_accuracy_eval;
DROP TABLE IF EXISTS gmp_platform_records;
DROP TABLE IF EXISTS secondary_listing_metrics;
DROP TABLE IF EXISTS subscription_bids;
DROP TABLE IF EXISTS anchor_lockin_summary;
DROP TABLE IF EXISTS anchor_investors;
DROP TABLE IF EXISTS ipo_reservations;
DROP TABLE IF EXISTS ipos;

CREATE TABLE ipos (
    ipo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol VARCHAR(15) UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    sector VARCHAR(60) NOT NULL,
    isin VARCHAR(12) NOT NULL,
    price_band_min DECIMAL(10,2) NOT NULL,
    price_band_max DECIMAL(10,2) NOT NULL,
    lot_size INT NOT NULL,
    total_issue_val_cr DECIMAL(12,2) NOT NULL,
    fresh_issue_cr DECIMAL(12,2) NOT NULL,
    ofs_val_cr DECIMAL(12,2) NOT NULL,
    open_date DATE NOT NULL,
    close_date DATE NOT NULL,
    allotment_date DATE,
    listing_date DATE,
    status VARCHAR(20) NOT NULL,
    status_order INT NOT NULL DEFAULT 1,
    registrar_name VARCHAR(100),
    brlm_lead_manager VARCHAR(255),
    exchange VARCHAR(30) DEFAULT 'NSE / BSE',
    segment VARCHAR(20) DEFAULT 'Mainboard',
    face_value DECIMAL(6,2) DEFAULT 10.00,
    issue_price DECIMAL(10,2),
    bse_code VARCHAR(20),
    anchor_lockin_30d DATE,
    anchor_lockin_90d DATE,
    pre_ipo_lockin_180d DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ipo_reservations (
    reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    quota_percent DECIMAL(5,2) NOT NULL,
    shares_reserved BIGINT NOT NULL,
    min_investment_inr DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE anchor_investors (
    anchor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    investor_name VARCHAR(150) NOT NULL,
    investor_category VARCHAR(60) NOT NULL,
    shares_allocated BIGINT NOT NULL,
    amount_cr DECIMAL(10,2) NOT NULL,
    lockin_period_days INT NOT NULL DEFAULT 30,
    lockin_expiry_date DATE NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE anchor_lockin_summary (
    summary_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    lead_text TEXT,
    bid_date VARCHAR(40),
    anchor_price DECIMAL(10,2),
    qib_allotment_pct VARCHAR(20),
    shares_locked_30d BIGINT,
    shares_locked_90d BIGINT,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE subscription_bids (
    bid_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    day_number VARCHAR(40) NOT NULL,
    qib_multiple DECIMAL(8,2) NOT NULL,
    nii_multiple DECIMAL(8,2) NOT NULL,
    retail_multiple DECIMAL(8,2) NOT NULL,
    total_subscription_times DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE secondary_listing_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    iep DECIMAL(10,2) NOT NULL,
    listing_gain_percent DECIMAL(6,2) NOT NULL,
    indicative_val_lakhs DECIMAL(12,2) NOT NULL,
    total_shares_traded INT NOT NULL,
    trading_status VARCHAR(30) DEFAULT 'Traded',
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE gmp_platform_records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    platform_name VARCHAR(60) NOT NULL,
    gmp_inr DECIMAL(10,2) NOT NULL,
    estimated_listing_price DECIMAL(10,2) NOT NULL,
    estimated_gain_percent DECIMAL(6,2) NOT NULL,
    rating_sentiment VARCHAR(30) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE gmp_accuracy_eval (
    eval_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    platform_name VARCHAR(60) NOT NULL,
    last_gmp_predicted_gain_pct DECIMAL(6,2) NOT NULL,
    actual_listing_gain_pct DECIMAL(6,2) NOT NULL,
    absolute_error_pct DECIMAL(6,2) NOT NULL,
    error_direction VARCHAR(20) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE drhp_rhp_diffs (
    diff_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    parameter_name VARCHAR(100) NOT NULL,
    drhp_val VARCHAR(120) NOT NULL,
    rhp_val VARCHAR(120) NOT NULL,
    percentage_change DECIMAL(6,2) NOT NULL,
    change_nature VARCHAR(150) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_ipos_symbol ON ipos(symbol);
CREATE INDEX IF NOT EXISTS idx_ipos_status ON ipos(status_order, open_date);
CREATE INDEX IF NOT EXISTS idx_ipos_segment ON ipos(segment);
CREATE INDEX IF NOT EXISTS idx_ipos_dates ON ipos(open_date, close_date, listing_date);
CREATE INDEX IF NOT EXISTS idx_reservations_ipo_id ON ipo_reservations(ipo_id);
CREATE INDEX IF NOT EXISTS idx_anchors_ipo_id ON anchor_investors(ipo_id);
CREATE INDEX IF NOT EXISTS idx_bids_ipo_id ON subscription_bids(ipo_id);
CREATE INDEX IF NOT EXISTS idx_listing_ipo_id ON secondary_listing_metrics(ipo_id);
CREATE INDEX IF NOT EXISTS idx_gmp_platform ON gmp_platform_records(platform_name);
CREATE INDEX IF NOT EXISTS idx_gmp_platform_ipo ON gmp_platform_records(ipo_id, platform_name);
CREATE INDEX IF NOT EXISTS idx_gmp_recorded_at ON gmp_platform_records(recorded_at);
CREATE INDEX IF NOT EXISTS idx_gmp_eval_platform ON gmp_accuracy_eval(platform_name);
CREATE INDEX IF NOT EXISTS idx_eval_ipo_id ON gmp_accuracy_eval(ipo_id);
CREATE INDEX IF NOT EXISTS idx_diffs_ipo_id ON drhp_rhp_diffs(ipo_id);

-- VIEWS
CREATE VIEW IF NOT EXISTS v_active_gmp_arbitrage AS
SELECT 
    i.symbol, i.company_name, i.segment, i.price_band_max AS cap_price,
    COUNT(g.record_id) AS active_platforms_reporting,
    MIN(g.gmp_inr) AS min_gmp_inr, MAX(g.gmp_inr) AS max_gmp_inr,
    ROUND(AVG(g.gmp_inr), 2) AS mean_gmp_inr,
    (MAX(g.gmp_inr) - MIN(g.gmp_inr)) AS arbitrage_spread_inr,
    ROUND(((MAX(g.gmp_inr) - MIN(g.gmp_inr)) / i.price_band_max) * 100.0, 2) AS spread_dispersion_pct,
    CASE 
        WHEN ((MAX(g.gmp_inr) - MIN(g.gmp_inr)) / i.price_band_max) * 100.0 >= 5.0 THEN 'High Arbitrage Opportunity'
        WHEN ((MAX(g.gmp_inr) - MIN(g.gmp_inr)) / i.price_band_max) * 100.0 >= 2.0 THEN 'Moderate Spread'
        ELSE 'Tight Equilibrium'
    END AS arbitrage_risk_signal
FROM ipos i JOIN gmp_platform_records g ON i.ipo_id = g.ipo_id
GROUP BY i.symbol, i.company_name, i.segment, i.price_band_max HAVING COUNT(g.record_id) >= 2;

CREATE VIEW IF NOT EXISTS v_anchor_lockin_supply_shock AS
SELECT 
    i.symbol, i.company_name, i.segment, a.anchor_price, a.shares_locked_30d,
    i.anchor_lockin_30d AS expiry_date_30d,
    ROUND((a.shares_locked_30d * a.anchor_price) / 10000000.0, 2) AS capital_freed_30d_cr,
    a.shares_locked_90d, i.anchor_lockin_90d AS expiry_date_90d,
    ROUND((a.shares_locked_90d * a.anchor_price) / 10000000.0, 2) AS capital_freed_90d_cr,
    (a.shares_locked_30d + a.shares_locked_90d) AS total_anchor_shares,
    ROUND(((a.shares_locked_30d + a.shares_locked_90d) * a.anchor_price) / 10000000.0, 2) AS total_anchor_capital_cr
FROM ipos i JOIN anchor_lockin_summary a ON i.ipo_id = a.ipo_id;

CREATE VIEW IF NOT EXISTS v_institutional_demand_discovery AS
SELECT 
    i.symbol, i.company_name, i.segment, i.total_issue_val_cr,
    MAX(b.qib_multiple) AS peak_qib_oversubscription,
    MAX(b.total_subscription_times) AS peak_composite_subscription,
    i.issue_price, s.iep AS equilibrium_open_price, s.listing_gain_percent, s.trading_status
FROM ipos i
JOIN subscription_bids b ON i.ipo_id = b.ipo_id
JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
GROUP BY i.symbol, i.company_name, i.segment, i.total_issue_val_cr, i.issue_price, s.iep, s.listing_gain_percent, s.trading_status;

CREATE VIEW IF NOT EXISTS v_offering_complete_dossier AS
SELECT 
    i.ipo_id, i.symbol, i.company_name, i.segment, i.status,
    i.price_band_min, i.price_band_max, i.lot_size, i.total_issue_val_cr,
    i.open_date, i.close_date, i.listing_date, s.iep, s.listing_gain_percent,
    als.shares_locked_30d, als.shares_locked_90d
FROM ipos i
LEFT JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
LEFT JOIN anchor_lockin_summary als ON i.ipo_id = als.ipo_id;

-- TRIGGERS
CREATE TRIGGER IF NOT EXISTS trg_validate_price_band
BEFORE INSERT ON ipos
FOR EACH ROW
WHEN NEW.price_band_max < NEW.price_band_min
BEGIN
    SELECT RAISE(ABORT, 'Integrity Violation: price_band_max cannot be strictly less than price_band_min');
END;

CREATE TRIGGER IF NOT EXISTS trg_validate_price_band_update
BEFORE UPDATE OF price_band_min, price_band_max ON ipos
FOR EACH ROW
WHEN NEW.price_band_max < NEW.price_band_min
BEGIN
    SELECT RAISE(ABORT, 'Integrity Violation: price_band_max cannot be strictly less than price_band_min');
END;

CREATE TRIGGER IF NOT EXISTS trg_audit_ipo_status_change
AFTER UPDATE OF status ON ipos
FOR EACH ROW
BEGIN
    UPDATE ipos SET created_at = CURRENT_TIMESTAMP WHERE ipo_id = NEW.ipo_id;
END;
