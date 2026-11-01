-- ====================================================================
-- IPO Intelligence & Market Surveillance Platform (Live Database Schema)
-- Hybrid Relational Engine (SQLite 3 / MySQL Compatible)
-- ====================================================================

DROP TABLE IF EXISTS drhp_rhp_diffs;
DROP TABLE IF EXISTS gmp_accuracy_eval;
DROP TABLE IF EXISTS gmp_platform_records;
DROP TABLE IF EXISTS secondary_listing_metrics;
DROP TABLE IF EXISTS subscription_bids;
DROP TABLE IF EXISTS anchor_investors;
DROP TABLE IF EXISTS ipo_reservations;
DROP TABLE IF EXISTS ipos;

-- 1. Main IPO Offerings Table (Chronological status order: 1=Upcoming, 2=Open, 3=Completed)
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
    face_value DECIMAL(6,2) DEFAULT 10.00,
    issue_price DECIMAL(10,2),
    bse_code VARCHAR(10),
    anchor_lockin_30d DATE,
    anchor_lockin_90d DATE,
    pre_ipo_lockin_180d DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Investor Category Reservations & Quotas
CREATE TABLE ipo_reservations (
    reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    quota_percent DECIMAL(5,2) NOT NULL,
    shares_reserved BIGINT NOT NULL,
    min_investment_inr DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- 3. Institutional Anchor Investors
CREATE TABLE anchor_investors (
    anchor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    investor_name VARCHAR(150) NOT NULL,
    investor_category VARCHAR(50) NOT NULL,
    shares_allocated BIGINT NOT NULL,
    amount_cr DECIMAL(10,2) NOT NULL,
    lockin_period_days INT NOT NULL,
    lockin_expiry_date DATE NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- 4. Subscription Bidding Progression
CREATE TABLE subscription_bids (
    bid_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    day_number VARCHAR(10) NOT NULL,
    qib_multiple DECIMAL(8,2) NOT NULL,
    nii_multiple DECIMAL(8,2) NOT NULL,
    retail_multiple DECIMAL(8,2) NOT NULL,
    total_subscription_times DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- 5. Secondary Market Equilibrium & Listing Discovery
CREATE TABLE secondary_listing_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    iep DECIMAL(10,2) NOT NULL,
    listing_gain_percent DECIMAL(6,2) NOT NULL,
    indicative_val_lakhs DECIMAL(14,2) NOT NULL,
    total_shares_traded BIGINT NOT NULL,
    trading_status VARCHAR(40) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- 6. Multi-Source Grey Market Premium (GMP) Quotes
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

-- 7. Platform Forecast Accuracy Evaluations (Forensics)
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

-- 8. Regulatory Prospectus Variance Tracker (DRHP vs RHP Diffs)
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

CREATE INDEX idx_ipos_status ON ipos(status_order, open_date);
CREATE INDEX idx_gmp_platform ON gmp_platform_records(platform_name);
CREATE INDEX idx_gmp_eval_platform ON gmp_accuracy_eval(platform_name);
