-- =====================================================================
-- SQLite Compatible Schema for IPO Intelligence System
-- =====================================================================

DROP TABLE IF EXISTS drhp_rhp_diffs;
DROP TABLE IF EXISTS gmp_accuracy_eval;
DROP TABLE IF EXISTS gmp_platform_records;
DROP TABLE IF EXISTS secondary_listing_metrics;
DROP TABLE IF EXISTS subscription_bids;
DROP TABLE IF EXISTS anchor_investors;
DROP TABLE IF EXISTS ipo_reservations;
DROP TABLE IF EXISTS ipos;

CREATE TABLE ipos (
    ipo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    symbol TEXT NOT NULL UNIQUE,
    isin TEXT NOT NULL UNIQUE,
    bse_code TEXT,
    listing_exchange TEXT NOT NULL DEFAULT 'Both',
    issue_type TEXT NOT NULL DEFAULT 'Book Building',
    sale_type TEXT NOT NULL DEFAULT 'Combination',
    face_value REAL NOT NULL DEFAULT 10.00,
    price_band_min REAL NOT NULL,
    price_band_max REAL NOT NULL,
    issue_price REAL NOT NULL,
    lot_size INTEGER NOT NULL,
    employee_discount REAL DEFAULT 0.00,
    total_issue_shares INTEGER NOT NULL,
    total_issue_val_cr REAL NOT NULL,
    fresh_issue_cr REAL DEFAULT 0.00,
    ofs_val_cr REAL DEFAULT 0.00,
    share_holding_pre_pct REAL DEFAULT 100.00,
    share_holding_post_pct REAL DEFAULT 75.00,
    open_date TEXT NOT NULL,
    close_date TEXT NOT NULL,
    allotment_date TEXT NOT NULL,
    refund_date TEXT NOT NULL,
    listing_date TEXT NOT NULL,
    anchor_lockin_30d TEXT,
    anchor_lockin_90d TEXT,
    pre_ipo_lockin_180d TEXT,
    brlm_lead_manager TEXT NOT NULL,
    registrar_name TEXT NOT NULL,
    sector TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Listed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ipo_reservations (
    reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INTEGER NOT NULL,
    category_name TEXT NOT NULL,
    quota_percent REAL NOT NULL,
    shares_reserved INTEGER NOT NULL,
    min_investment_inr REAL NOT NULL,
    max_investment_inr REAL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE anchor_investors (
    anchor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INTEGER NOT NULL,
    investor_name TEXT NOT NULL,
    investor_category TEXT NOT NULL,
    shares_allocated INTEGER NOT NULL,
    bid_price REAL NOT NULL,
    amount_cr REAL NOT NULL,
    lockin_period_days INTEGER NOT NULL DEFAULT 30,
    lockin_expiry_date TEXT NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE subscription_bids (
    bid_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    bidding_date TEXT NOT NULL,
    qib_subscription_times REAL NOT NULL DEFAULT 0.00,
    nii_subscription_times REAL NOT NULL DEFAULT 0.00,
    retail_subscription_times REAL NOT NULL DEFAULT 0.00,
    employee_subscription_times REAL NOT NULL DEFAULT 0.00,
    total_subscription_times REAL NOT NULL DEFAULT 0.00,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE,
    UNIQUE (ipo_id, day_number)
);

CREATE TABLE secondary_listing_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INTEGER NOT NULL UNIQUE,
    prev_close REAL NOT NULL,
    iep REAL NOT NULL,
    listing_day_open REAL NOT NULL,
    listing_day_high REAL NOT NULL,
    listing_day_low REAL NOT NULL,
    listing_day_close REAL NOT NULL,
    listing_gain_percent REAL NOT NULL,
    ieq INTEGER NOT NULL,
    indicative_val_lakhs REAL NOT NULL,
    cancelled_buy_orders_count INTEGER NOT NULL DEFAULT 0,
    cancelled_sell_orders_count INTEGER NOT NULL DEFAULT 0,
    cancelled_buy_qty INTEGER NOT NULL DEFAULT 0,
    cancelled_sell_qty INTEGER NOT NULL DEFAULT 0,
    trading_status TEXT NOT NULL DEFAULT 'Traded',
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE gmp_platform_records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INTEGER NOT NULL,
    platform_name TEXT NOT NULL,
    quote_date TEXT NOT NULL,
    gmp_inr REAL NOT NULL,
    estimated_listing_price REAL NOT NULL,
    estimated_gain_percent REAL NOT NULL,
    rating_sentiment TEXT NOT NULL DEFAULT 'Bullish',
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE gmp_accuracy_eval (
    eval_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INTEGER NOT NULL,
    platform_name TEXT NOT NULL,
    last_gmp_predicted_gain_pct REAL NOT NULL,
    actual_listing_gain_pct REAL NOT NULL,
    absolute_error_pct REAL NOT NULL,
    error_direction TEXT NOT NULL,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE TABLE drhp_rhp_diffs (
    diff_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipo_id INTEGER NOT NULL,
    parameter_name TEXT NOT NULL,
    drhp_val TEXT NOT NULL,
    rhp_val TEXT NOT NULL,
    percentage_change REAL DEFAULT 0.00,
    change_nature TEXT NOT NULL,
    sebi_observation_noted INTEGER DEFAULT 1,
    FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE
);

CREATE INDEX idx_ipo_symbol ON ipos(symbol);
CREATE INDEX idx_ipo_sector ON ipos(sector);
CREATE INDEX idx_ipo_listing_date ON ipos(listing_date);
CREATE INDEX idx_gmp_platform ON gmp_platform_records(platform_name);
CREATE INDEX idx_gmp_eval_platform ON gmp_accuracy_eval(platform_name);
CREATE INDEX idx_anchor_expiry ON anchor_investors(lockin_expiry_date);
