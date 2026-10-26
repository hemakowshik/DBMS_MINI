-- =====================================================================
-- PES UNIVERSITY - DEPARTMENT OF AIML - DBMS MINI PROJECT
-- TOPIC: Comprehensive IPO Analytics, GMP Intelligence & Regulatory Tracker
-- ARCHITECTURE: Hybrid Relational (MySQL) + NoSQL (MongoDB)
-- FACULTY EVALUATOR: Prof. Smitha GR (RR Campus, PESU)
-- =====================================================================

DROP DATABASE IF EXISTS ipo_intelligence_db;
CREATE DATABASE IF NOT EXISTS ipo_intelligence_db;
USE ipo_intelligence_db;

-- ---------------------------------------------------------------------
-- TABLE 1: ipos (Primary IPO Master Record)
-- ---------------------------------------------------------------------
CREATE TABLE ipos (
    ipo_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    symbol VARCHAR(30) NOT NULL UNIQUE,
    isin VARCHAR(20) NOT NULL UNIQUE,
    bse_code VARCHAR(20),
    listing_exchange VARCHAR(20) NOT NULL DEFAULT 'Both', -- NSE, BSE, Both
    issue_type VARCHAR(40) NOT NULL DEFAULT 'Book Building', -- Book Building, Fixed Price
    sale_type VARCHAR(40) NOT NULL DEFAULT 'Combination', -- Fresh Issue, OFS, Combination
    face_value DECIMAL(10,2) NOT NULL DEFAULT 10.00,
    price_band_min DECIMAL(10,2) NOT NULL,
    price_band_max DECIMAL(10,2) NOT NULL,
    issue_price DECIMAL(10,2) NOT NULL,
    lot_size INT NOT NULL,
    employee_discount DECIMAL(10,2) DEFAULT 0.00,
    total_issue_shares BIGINT NOT NULL,
    total_issue_val_cr DECIMAL(12,2) NOT NULL,
    fresh_issue_cr DECIMAL(12,2) DEFAULT 0.00,
    ofs_val_cr DECIMAL(12,2) DEFAULT 0.00,
    share_holding_pre_pct DECIMAL(5,2) DEFAULT 100.00,
    share_holding_post_pct DECIMAL(5,2) DEFAULT 75.00,
    open_date DATE NOT NULL,
    close_date DATE NOT NULL,
    allotment_date DATE NOT NULL,
    refund_date DATE NOT NULL,
    listing_date DATE NOT NULL,
    anchor_lockin_30d DATE,
    anchor_lockin_90d DATE,
    pre_ipo_lockin_180d DATE,
    brlm_lead_manager VARCHAR(255) NOT NULL,
    registrar_name VARCHAR(150) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Listed', -- Upcoming, Ongoing, Closed, Listed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_price_band CHECK (price_band_max >= price_band_min),
    CONSTRAINT chk_lot_size CHECK (lot_size > 0),
    CONSTRAINT chk_dates CHECK (close_date >= open_date AND listing_date >= close_date)
);

-- ---------------------------------------------------------------------
-- TABLE 2: ipo_reservations (Category Quotas & Allotment Limits)
-- ---------------------------------------------------------------------
CREATE TABLE ipo_reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    category_name VARCHAR(50) NOT NULL, -- QIB, NII_BIG, NII_SMALL, RETAIL, EMPLOYEE
    quota_percent DECIMAL(5,2) NOT NULL,
    shares_reserved BIGINT NOT NULL,
    min_investment_inr DECIMAL(12,2) NOT NULL,
    max_investment_inr DECIMAL(12,2),
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE,
    CONSTRAINT chk_quota CHECK (quota_percent >= 0 AND quota_percent <= 100)
);

-- ---------------------------------------------------------------------
-- TABLE 3: anchor_investors (Anchor Allocation & Lock-In Tranches)
-- ---------------------------------------------------------------------
CREATE TABLE anchor_investors (
    anchor_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    investor_name VARCHAR(150) NOT NULL,
    investor_category VARCHAR(60) NOT NULL, -- Mutual Fund, FII, Insurance, Domestic Corp
    shares_allocated BIGINT NOT NULL,
    bid_price DECIMAL(10,2) NOT NULL,
    amount_cr DECIMAL(12,2) NOT NULL,
    lockin_period_days INT NOT NULL DEFAULT 30, -- 30 days (50%) or 90 days (50%)
    lockin_expiry_date DATE NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE,
    CONSTRAINT chk_lockin_days CHECK (lockin_period_days IN (30, 90, 180, 365))
);

-- ---------------------------------------------------------------------
-- TABLE 4: subscription_bids (Day-by-Day Bidding Multiples)
-- ---------------------------------------------------------------------
CREATE TABLE subscription_bids (
    bid_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    day_number INT NOT NULL, -- 1, 2, 3
    bidding_date DATE NOT NULL,
    qib_subscription_times DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    nii_subscription_times DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    retail_subscription_times DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    employee_subscription_times DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    total_subscription_times DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE,
    CONSTRAINT unq_ipo_day UNIQUE (ipo_id, day_number)
);

-- ---------------------------------------------------------------------
-- TABLE 5: secondary_listing_metrics (Pre-open & Listing Day Market Discovery)
-- ---------------------------------------------------------------------
CREATE TABLE secondary_listing_metrics (
    metric_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL UNIQUE,
    prev_close DECIMAL(10,2) NOT NULL, -- Base Issue Price
    iep DECIMAL(10,2) NOT NULL, -- Indicative Equilibrium Price
    listing_day_open DECIMAL(10,2) NOT NULL,
    listing_day_high DECIMAL(10,2) NOT NULL,
    listing_day_low DECIMAL(10,2) NOT NULL,
    listing_day_close DECIMAL(10,2) NOT NULL,
    listing_gain_percent DECIMAL(8,2) NOT NULL,
    ieq BIGINT NOT NULL, -- Indicative Equilibrium Quantity
    indicative_val_lakhs DECIMAL(14,2) NOT NULL,
    cancelled_buy_orders_count INT NOT NULL DEFAULT 0,
    cancelled_sell_orders_count INT NOT NULL DEFAULT 0,
    cancelled_buy_qty BIGINT NOT NULL DEFAULT 0,
    cancelled_sell_qty BIGINT NOT NULL DEFAULT 0,
    trading_status VARCHAR(50) NOT NULL DEFAULT 'Traded',
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- TABLE 6: gmp_platform_records (Multi-Source Grey Market Premium Aggregation)
-- ---------------------------------------------------------------------
CREATE TABLE gmp_platform_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    platform_name VARCHAR(100) NOT NULL, -- Chittorgarh, InvestorGain, IPOWatch, GreyMarketIndia
    quote_date DATE NOT NULL,
    gmp_inr DECIMAL(10,2) NOT NULL,
    estimated_listing_price DECIMAL(10,2) NOT NULL,
    estimated_gain_percent DECIMAL(8,2) NOT NULL,
    rating_sentiment VARCHAR(30) NOT NULL DEFAULT 'Bullish',
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- TABLE 7: gmp_accuracy_eval (NOVELTY 1: Accuracy Benchmark & Platform Ranking)
-- ---------------------------------------------------------------------
CREATE TABLE gmp_accuracy_eval (
    eval_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    platform_name VARCHAR(100) NOT NULL,
    last_gmp_predicted_gain_pct DECIMAL(8,2) NOT NULL,
    actual_listing_gain_pct DECIMAL(8,2) NOT NULL,
    absolute_error_pct DECIMAL(8,2) NOT NULL,
    error_direction VARCHAR(30) NOT NULL, -- Overestimated, Underestimated, Accurate
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- TABLE 8: drhp_rhp_diffs (NOVELTY 2: SEBI Regulatory Amendment Diff Tracker)
-- ---------------------------------------------------------------------
CREATE TABLE drhp_rhp_diffs (
    diff_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    parameter_name VARCHAR(120) NOT NULL,
    drhp_val VARCHAR(120) NOT NULL,
    rhp_val VARCHAR(120) NOT NULL,
    percentage_change DECIMAL(8,2) DEFAULT 0.00,
    change_nature VARCHAR(100) NOT NULL,
    sebi_observation_noted BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- INDEXES FOR FAST QUERY EXECUTION AND REPORTING
-- ---------------------------------------------------------------------
CREATE INDEX idx_ipo_symbol ON ipos(symbol);
CREATE INDEX idx_ipo_sector ON ipos(sector);
CREATE INDEX idx_ipo_listing_date ON ipos(listing_date);
CREATE INDEX idx_gmp_platform ON gmp_platform_records(platform_name);
CREATE INDEX idx_gmp_eval_platform ON gmp_accuracy_eval(platform_name);
CREATE INDEX idx_anchor_expiry ON anchor_investors(lockin_expiry_date);
