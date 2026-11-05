USE ipo_intelligence_db;

-- ============================================================================
-- PES UNIVERSITY • AIML / CSE DEPARTMENT • DBMS EXPERIENTIAL LEARNING
-- Course: Database Management Systems (CS304 / UE23CS252)
-- Faculty Evaluator: Dr. Nagasundari S
-- IPOWatch Intelligence & Primary Offering Surveillance Platform (MARK4)
-- SCRIPT 05: Stored Procedures, Functions, and ACID Transaction Boundaries
-- Demonstrates Advanced Database Concepts (Requirement 7 & Option 1/2)
-- ============================================================================

DELIMITER $$

-- ----------------------------------------------------------------------------
-- STORED PROCEDURE 1: sp_record_gmp_quote
-- Purpose: Atomically records a grey market quote with validation & transaction
-- Demonstrates: Stored Procedures, Transaction (START/COMMIT/ROLLBACK), Input Validation
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_record_gmp_quote$$
CREATE PROCEDURE sp_record_gmp_quote(
    IN p_symbol VARCHAR(15),
    IN p_platform VARCHAR(60),
    IN p_gmp DECIMAL(10,2),
    IN p_sentiment VARCHAR(30),
    OUT p_status_msg VARCHAR(255)
)
proc_label: BEGIN
    DECLARE v_ipo_id INT;
    DECLARE v_cap_price DECIMAL(10,2);
    DECLARE v_est_listing DECIMAL(10,2);
    DECLARE v_est_gain_pct DECIMAL(6,2);
    
    -- Error Handler for ACID Rollback
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status_msg = 'ERROR: Transaction aborted due to SQL exception. Rolled back.';
    END;

    -- Database-Level Input Validation (Requirement 12)
    IF p_gmp < 0 THEN
        SET p_status_msg = 'VALIDATION FAILED: GMP quote cannot be negative.';
        LEAVE proc_label;
    END IF;

    -- Lookup IPO Master Record
    SELECT ipo_id, price_band_max INTO v_ipo_id, v_cap_price 
    FROM ipos 
    WHERE symbol = p_symbol;

    IF v_ipo_id IS NULL THEN
        SET p_status_msg = CONCAT('NOT FOUND: Offering symbol ', p_symbol, ' does not exist.');
        LEAVE proc_label;
    END IF;

    -- Compute Estimated Listing Price and Projected Gain %
    SET v_est_listing = v_cap_price + p_gmp;
    SET v_est_gain_pct = ROUND((p_gmp / v_cap_price) * 100.0, 2);

    -- Begin Transaction Boundary
    START TRANSACTION;

    INSERT INTO gmp_platform_records (
        ipo_id, platform_name, gmp_inr, estimated_listing_price,
        estimated_gain_percent, rating_sentiment, recorded_at
    ) VALUES (
        v_ipo_id, p_platform, p_gmp, v_est_listing,
        v_est_gain_pct, p_sentiment, CURRENT_TIMESTAMP
    );

    COMMIT;
    SET p_status_msg = CONCAT('SUCCESS: Recorded GMP ₹', p_gmp, ' for ', p_symbol, ' on ', p_platform);
END proc_label$$

-- ----------------------------------------------------------------------------
-- STORED PROCEDURE 2: sp_settle_secondary_listing
-- Purpose: Settles market opening IEP, updates status, and generates accuracy forensics
-- Demonstrates: Cross-table joins, subqueries, and transaction orchestration
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_settle_secondary_listing$$
CREATE PROCEDURE sp_settle_secondary_listing(
    IN p_symbol VARCHAR(15),
    IN p_iep DECIMAL(10,2),
    IN p_shares_traded BIGINT,
    OUT p_gain_pct DECIMAL(6,2)
)
BEGIN
    DECLARE v_ipo_id INT;
    DECLARE v_issue_price DECIMAL(10,2);
    DECLARE v_gain DECIMAL(6,2);
    DECLARE v_indicative_val DECIMAL(14,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_gain_pct = -999.99;
    END;

    SELECT ipo_id, issue_price INTO v_ipo_id, v_issue_price
    FROM ipos
    WHERE symbol = p_symbol;

    IF v_ipo_id IS NOT NULL AND v_issue_price > 0 THEN
        SET v_gain = ROUND(((p_iep - v_issue_price) / v_issue_price) * 100.0, 2);
        SET v_indicative_val = ROUND((p_iep * p_shares_traded) / 100000.0, 2);
        SET p_gain_pct = v_gain;

        START TRANSACTION;

        -- 1. Insert / Replace Secondary Metrics
        DELETE FROM secondary_listing_metrics WHERE ipo_id = v_ipo_id;
        INSERT INTO secondary_listing_metrics (
            ipo_id, iep, listing_gain_percent, indicative_val_lakhs, total_shares_traded, trading_status
        ) VALUES (
            v_ipo_id, p_iep, v_gain, v_indicative_val, p_shares_traded, 'Listed & Traded'
        );

        -- 2. Transition Status to Completed (Fires trg_audit_ipo_status_change)
        UPDATE ipos 
        SET status = 'Completed', status_order = 3, listing_date = CURRENT_DATE
        WHERE ipo_id = v_ipo_id;

        -- 3. Populate Accuracy Forensics against GMP estimates
        DELETE FROM gmp_accuracy_eval WHERE ipo_id = v_ipo_id;
        INSERT INTO gmp_accuracy_eval (
            ipo_id, platform_name, last_gmp_predicted_gain_pct,
            actual_listing_gain_pct, absolute_error_pct, error_direction
        )
        SELECT 
            g.ipo_id,
            g.platform_name,
            g.estimated_gain_percent,
            v_gain,
            ABS(g.estimated_gain_percent - v_gain),
            CASE 
                WHEN g.estimated_gain_percent > v_gain THEN 'Overestimated'
                WHEN g.estimated_gain_percent < v_gain THEN 'Underestimated'
                ELSE 'Exact Match'
            END
        FROM gmp_platform_records g
        WHERE g.ipo_id = v_ipo_id;

        COMMIT;
    END IF;
END$$

-- ----------------------------------------------------------------------------
-- STORED FUNCTION 1: fn_calculate_arbitrage_spread
-- Purpose: Returns grey market spread (Max GMP - Min GMP) for an offering
-- Demonstrates: User-defined scalar functions in SQL queries
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_calculate_arbitrage_spread$$
CREATE FUNCTION fn_calculate_arbitrage_spread(p_ipo_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_spread DECIMAL(10,2);
    SELECT IFNULL(MAX(gmp_inr) - MIN(gmp_inr), 0.0) INTO v_spread
    FROM gmp_platform_records
    WHERE ipo_id = p_ipo_id;
    RETURN v_spread;
END$$

-- ----------------------------------------------------------------------------
-- STORED FUNCTION 2: fn_anchor_unlocked_capital_cr
-- Purpose: Computes potential selling liquidity (Cr) when anchor lock-in expires
-- Demonstrates: Business logic encapsulation at the database engine level
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_anchor_unlocked_capital_cr$$
CREATE FUNCTION fn_anchor_unlocked_capital_cr(p_ipo_id INT, p_tier INT)
RETURNS DECIMAL(12,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_capital_cr DECIMAL(12,2);
    IF p_tier = 30 THEN
        SELECT ROUND((shares_locked_30d * anchor_price) / 10000000.0, 2) INTO v_capital_cr
        FROM anchor_lockin_summary WHERE ipo_id = p_ipo_id;
    ELSEIF p_tier = 90 THEN
        SELECT ROUND((shares_locked_90d * anchor_price) / 10000000.0, 2) INTO v_capital_cr
        FROM anchor_lockin_summary WHERE ipo_id = p_ipo_id;
    ELSE
        SET v_capital_cr = 0.0;
    END IF;
    RETURN IFNULL(v_capital_cr, 0.0);
END$$

DELIMITER ;
