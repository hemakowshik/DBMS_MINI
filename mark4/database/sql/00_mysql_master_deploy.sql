-- ============================================================================
-- PES UNIVERSITY • AIML / CSE DEPARTMENT • DBMS EXPERIENTIAL LEARNING
-- Course: Database Management Systems (CS304 / UE23CS252)
-- Faculty Evaluator: Dr. Nagasundari S
-- IPOWatch Intelligence & Primary Offering Surveillance Platform (MARK4)
-- MASTER MYSQL DEPLOYMENT SCRIPT (00_mysql_master_deploy.sql)
-- Mandatory SQL Requirement: MySQL 8.0+ Fully Normalized Architecture
-- ============================================================================

CREATE DATABASE IF NOT EXISTS ipo_intelligence_db;
USE ipo_intelligence_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. DROP EXISTING VIEWS AND TABLES
DROP VIEW IF EXISTS v_active_gmp_arbitrage;
DROP VIEW IF EXISTS v_anchor_lockin_supply_shock;
DROP VIEW IF EXISTS v_institutional_demand_discovery;
DROP VIEW IF EXISTS v_offering_complete_dossier;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS drhp_rhp_diffs;
DROP TABLE IF EXISTS gmp_accuracy_eval;
DROP TABLE IF EXISTS gmp_platform_records;
DROP TABLE IF EXISTS secondary_listing_metrics;
DROP TABLE IF EXISTS subscription_bids;
DROP TABLE IF EXISTS anchor_lockin_summary;
DROP TABLE IF EXISTS anchor_investors;
DROP TABLE IF EXISTS ipo_reservations;
DROP TABLE IF EXISTS ipos;

SET FOREIGN_KEY_CHECKS = 1;

-- 2. CREATE 10 BCNF NORMALIZED TABLES
CREATE TABLE ipos (
    ipo_id INT AUTO_INCREMENT PRIMARY KEY,
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
    bse_code VARCHAR(10),
    anchor_lockin_30d DATE,
    anchor_lockin_90d DATE,
    pre_ipo_lockin_180d DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE ipo_reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    quota_percent DECIMAL(5,2) NOT NULL,
    shares_reserved BIGINT NOT NULL,
    min_investment_inr DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE anchor_investors (
    anchor_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    investor_name VARCHAR(150) NOT NULL,
    investor_category VARCHAR(60) NOT NULL,
    shares_allocated BIGINT NOT NULL,
    amount_cr DECIMAL(10,2) NOT NULL,
    lockin_period_days INT NOT NULL DEFAULT 30,
    lockin_expiry_date DATE NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE anchor_lockin_summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    lead_text TEXT,
    bid_date VARCHAR(40),
    anchor_price DECIMAL(10,2),
    qib_allotment_pct VARCHAR(20),
    shares_locked_30d BIGINT,
    shares_locked_90d BIGINT,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE subscription_bids (
    bid_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    day_number VARCHAR(30) NOT NULL,
    qib_multiple DECIMAL(8,2) NOT NULL,
    nii_multiple DECIMAL(8,2) NOT NULL,
    retail_multiple DECIMAL(8,2) NOT NULL,
    total_subscription_times DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE secondary_listing_metrics (
    metric_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    iep DECIMAL(10,2) NOT NULL,
    listing_gain_percent DECIMAL(6,2) NOT NULL,
    indicative_val_lakhs DECIMAL(14,2) NOT NULL,
    total_shares_traded BIGINT NOT NULL,
    trading_status VARCHAR(40) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE gmp_platform_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    platform_name VARCHAR(60) NOT NULL,
    gmp_inr DECIMAL(10,2) NOT NULL,
    estimated_listing_price DECIMAL(10,2) NOT NULL,
    estimated_gain_percent DECIMAL(6,2) NOT NULL,
    rating_sentiment VARCHAR(30) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE gmp_accuracy_eval (
    eval_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    platform_name VARCHAR(60) NOT NULL,
    last_gmp_predicted_gain_pct DECIMAL(6,2) NOT NULL,
    actual_listing_gain_pct DECIMAL(6,2) NOT NULL,
    absolute_error_pct DECIMAL(6,2) NOT NULL,
    error_direction VARCHAR(20) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE drhp_rhp_diffs (
    diff_id INT AUTO_INCREMENT PRIMARY KEY,
    ipo_id INT NOT NULL,
    parameter_name VARCHAR(100) NOT NULL,
    drhp_val VARCHAR(120) NOT NULL,
    rhp_val VARCHAR(120) NOT NULL,
    percentage_change DECIMAL(6,2) NOT NULL,
    change_nature VARCHAR(150) NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('Admin', 'Analyst', 'Investor'))
) ENGINE=InnoDB;

-- 3. B-TREE INDEXES
CREATE INDEX idx_ipos_symbol ON ipos(symbol);
CREATE INDEX idx_ipos_status ON ipos(status);
CREATE INDEX idx_ipos_segment ON ipos(segment);
CREATE INDEX idx_ipos_dates ON ipos(open_date, close_date, listing_date);
CREATE INDEX idx_reservations_ipo_id ON ipo_reservations(ipo_id);
CREATE INDEX idx_anchors_ipo_id ON anchor_investors(ipo_id);
CREATE INDEX idx_bids_ipo_id ON subscription_bids(ipo_id);
CREATE INDEX idx_listing_ipo_id ON secondary_listing_metrics(ipo_id);
CREATE INDEX idx_gmp_platform_ipo ON gmp_platform_records(ipo_id, platform_name);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- 4. PRODUCTION VIEWS
CREATE OR REPLACE VIEW v_active_gmp_arbitrage AS
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

CREATE OR REPLACE VIEW v_anchor_lockin_supply_shock AS
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

CREATE OR REPLACE VIEW v_institutional_demand_discovery AS
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

CREATE OR REPLACE VIEW v_offering_complete_dossier AS
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

-- 5. TRANSACTIONAL TRIGGERS
DELIMITER $$

DROP TRIGGER IF EXISTS trg_validate_price_band$$
CREATE TRIGGER trg_validate_price_band
BEFORE INSERT ON ipos
FOR EACH ROW
BEGIN
    IF NEW.price_band_max < NEW.price_band_min THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Integrity Violation: price_band_max cannot be strictly less than price_band_min';
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_validate_price_band_update$$
CREATE TRIGGER trg_validate_price_band_update
BEFORE UPDATE ON ipos
FOR EACH ROW
BEGIN
    IF NEW.price_band_max < NEW.price_band_min THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Integrity Violation: price_band_max cannot be strictly less than price_band_min';
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_audit_ipo_status_change$$
CREATE TRIGGER trg_audit_ipo_status_change
AFTER UPDATE ON ipos
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        -- Audit tracking
        SET @last_status_change = CURRENT_TIMESTAMP;
    END IF;
END$$

DELIMITER ;
