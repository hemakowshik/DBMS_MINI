-- ============================================================================
-- PES UNIVERSITY • AIML DEPARTMENT • DBMS MINI PROJECT (CS304)
-- IPOWatch Intelligence & Primary Offering Forensics Platform (MARK4)
-- SCRIPT 01: Data Definition Language (DDL) Schema Specification
-- Architecture: Boyce-Codd Normal Form (BCNF) Relational Storage Engine
-- Compatibility: SQLite 3 / MySQL 8.0+ / PostgreSQL 14+
-- Faculty Evaluator: Prof. Smitha G R
-- ============================================================================

-- Drop views and child tables first to respect referential integrity
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

-- ----------------------------------------------------------------------------
-- TABLE 1: ipos (Primary Offering Master Entity)
-- Normalization: BCNF (Candidate Keys: {ipo_id}, {symbol})
-- Functional Dependencies: ipo_id -> {symbol, company_name, exchange, segment, ...}
--                          symbol -> {ipo_id, company_name, exchange, segment, ...}
-- ----------------------------------------------------------------------------
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
    brlm_lead_manager TEXT,
    exchange VARCHAR(30) DEFAULT 'NSE / BSE',
    segment VARCHAR(20) DEFAULT 'Mainboard',
    face_value DECIMAL(6,2) DEFAULT 10.00,
    issue_price DECIMAL(10,2),
    bse_code VARCHAR(10),
    anchor_lockin_30d DATE,
    anchor_lockin_90d DATE,
    pre_ipo_lockin_180d DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- TABLE 2: ipo_reservations (Statutory Investor Quota Allocations)
-- Normalization: BCNF (1:N relationship with ipos)
-- Referential Action: ON DELETE CASCADE (Zero orphaned reservation quotas)
-- ----------------------------------------------------------------------------
CREATE TABLE ipo_reservations (
    reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    quota_percent DECIMAL(5,2) NOT NULL,
    shares_reserved BIGINT NOT NULL,
    min_investment_inr DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- TABLE 3: anchor_investors (Institutional Anchor Syndicate Allocations)
-- Normalization: BCNF (1:N relationship with ipos)
-- Referential Action: ON DELETE CASCADE
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 4: anchor_lockin_summary (SEBI ICDR Two-Tier Supply-Shock Schedule)
-- Normalization: BCNF (1:1 relationship with ipos via foreign key)
-- Enforces SEBI ICDR 2022 Amendment: 50% 30-day and 50% 90-day institutional lock-in
-- ----------------------------------------------------------------------------
CREATE TABLE anchor_lockin_summary (
    summary_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    lead_text TEXT,
    bid_date VARCHAR(30),
    anchor_price DECIMAL(10,2),
    qib_allotment_pct VARCHAR(20),
    shares_locked_30d BIGINT,
    shares_locked_90d BIGINT,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- TABLE 5: subscription_bids (Day-by-Day Bidding Progression Multiples)
-- Normalization: BCNF (1:N relationship with ipos)
-- Referential Action: ON DELETE CASCADE
-- ----------------------------------------------------------------------------
CREATE TABLE subscription_bids (
    bid_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INT NOT NULL,
    day_number VARCHAR(30) NOT NULL,
    qib_multiple DECIMAL(8,2) NOT NULL,
    nii_multiple DECIMAL(8,2) NOT NULL,
    retail_multiple DECIMAL(8,2) NOT NULL,
    total_subscription_times DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- TABLE 6: secondary_listing_metrics (Listing Discovery & Secondary Price Performance)
-- Normalization: BCNF (1:1 relationship with ipos)
-- Captures NSE/BSE Special Pre-Open Call Auction Equilibrium Price (IEP)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 7: gmp_platform_records (Multi-Source Grey Market Time-Series Surveillance)
-- Normalization: BCNF (1:N relationship with ipos)
-- Tracks quotes from InvestorGain, IPOWatch, and Chittorgarh
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 8: gmp_accuracy_eval (Predictive Benchmark & MAE Forensic Audit)
-- Normalization: BCNF (1:N relationship with ipos)
-- Mathematical model: Error = Predicted - Actual IEP; APE = |Error| / Actual * 100
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- TABLE 9: drhp_rhp_diffs (Cross-Offering Regulatory Variance Surveillance)
-- Normalization: BCNF (1:N relationship with ipos)
-- Tracks disclosures modified post-SEBI review (OFS dilution, CapEx, litigation)
-- ----------------------------------------------------------------------------
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
