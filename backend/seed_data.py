import json
from .db_relational import execute_dml, execute_query, init_relational_db, get_db_connection
from .db_nosql import get_nosql_db

def seed_all():
    print("[INFO] Initializing relational database schema...")
    init_relational_db()

    conn, engine = get_db_connection()
    # Check if ipos already seeded
    existing = execute_query("SELECT COUNT(*) as cnt FROM ipos")
    if existing and existing[0]["cnt"] > 0:
        print("[INFO] Relational database already has data. Re-clearing to ensure fresh testbed.")
        execute_dml("DELETE FROM drhp_rhp_diffs")
        execute_dml("DELETE FROM gmp_accuracy_eval")
        execute_dml("DELETE FROM gmp_platform_records")
        execute_dml("DELETE FROM secondary_listing_metrics")
        execute_dml("DELETE FROM subscription_bids")
        execute_dml("DELETE FROM anchor_investors")
        execute_dml("DELETE FROM ipo_reservations")
        execute_dml("DELETE FROM ipos")

    print("[INFO] Inserting primary IPO records...")
    # 1. IPOS table
    ipos_data = [
        (
            "Tonbo Imaging India Limited", "TONBO", "INE0LDG01026", "544101", "Both",
            "Book Building", "Combination", 2.00, 520.00, 550.00, 550.00, 27, 25.00,
            21818181, 1200.00, 800.00, 400.00, 82.50, 68.20,
            "2026-10-18", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-25",
            "2026-11-24", "2027-01-23", "2027-04-23",
            "Kotak Mahindra Capital, Axis Capital", "KFin Technologies Limited", "Defense & Aerospace Tech", "Listed"
        ),
        (
            "Tata Technologies Limited", "TATATECH", "INE142M01025", "544028", "Both",
            "Book Building", "OFS", 2.00, 475.00, 500.00, 500.00, 30, 0.00,
            60850278, 3042.51, 0.00, 3042.51, 66.80, 55.30,
            "2023-11-22", "2023-11-24", "2023-11-28", "2023-11-29", "2023-11-30",
            "2023-12-30", "2024-02-28", "2024-05-30",
            "JM Financial, Citigroup Global, BofA Securities", "Link Intime India Private Limited", "Engineering R&D Services", "Listed"
        ),
        (
            "Swiggy Limited", "SWIGGY", "INE00H001014", "544285", "Both",
            "Book Building", "Combination", 1.00, 371.00, 390.00, 390.00, 38, 0.00,
            290000000, 11327.00, 4499.00, 6828.00, 71.40, 58.60,
            "2024-11-06", "2024-11-08", "2024-11-11", "2024-11-12", "2024-11-13",
            "2024-12-13", "2025-02-11", "2025-05-13",
            "Kotak Mahindra, Citigroup, Jefferies, Avendus", "Link Intime India Private Limited", "Consumer Internet / Quick Commerce", "Listed"
        ),
        (
            "Hyundai Motor India Limited", "HYUNDAI", "INE00B801021", "544274", "Both",
            "Book Building", "OFS", 10.00, 1865.00, 1960.00, 1960.00, 7, 0.00,
            142194700, 27870.16, 0.00, 27870.16, 100.00, 82.50,
            "2024-10-15", "2024-10-17", "2024-10-18", "2024-10-21", "2024-10-22",
            "2024-11-21", "2025-01-20", "2025-04-22",
            "Kotak Mahindra, Citigroup, Morgan Stanley, J.P. Morgan, HSBC", "KFin Technologies Limited", "Automotive OEM", "Listed"
        ),
        (
            "Bajaj Housing Finance Limited", "BAJAJHFL", "INE377Y01017", "544252", "Both",
            "Book Building", "Combination", 10.00, 66.00, 70.00, 70.00, 214, 0.00,
            937142857, 6560.00, 3560.00, 3000.00, 100.00, 88.75,
            "2024-09-09", "2024-09-11", "2024-09-12", "2024-09-13", "2024-09-16",
            "2024-10-16", "2024-12-15", "2025-03-16",
            "Kotak Mahindra, BofA Securities, Axis Capital, Goldman Sachs, SBI Capital", "KFin Technologies Limited", "Housing Finance (NBFC)", "Listed"
        ),
        (
            "Premier Energies Limited", "PREMIER", "INE237Z01018", "544234", "Both",
            "Book Building", "Combination", 1.00, 427.00, 450.00, 450.00, 33, 22.00,
            62888888, 2830.00, 1291.40, 1538.60, 85.00, 69.40,
            "2024-08-27", "2024-08-29", "2024-08-30", "2024-09-02", "2024-09-03",
            "2024-10-03", "2024-12-02", "2025-03-03",
            "Kotak Mahindra, J.P. Morgan, ICICI Securities", "KFin Technologies Limited", "Solar Cell & Module Manufacturing", "Listed"
        )
    ]

    ipo_id_map = {}
    for d in ipos_data:
        sql = """
        INSERT INTO ipos (
            company_name, symbol, isin, bse_code, listing_exchange,
            issue_type, sale_type, face_value, price_band_min, price_band_max,
            issue_price, lot_size, employee_discount, total_issue_shares,
            total_issue_val_cr, fresh_issue_cr, ofs_val_cr, share_holding_pre_pct,
            share_holding_post_pct, open_date, close_date, allotment_date,
            refund_date, listing_date, anchor_lockin_30d, anchor_lockin_90d,
            pre_ipo_lockin_180d, brlm_lead_manager, registrar_name, sector, status
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        """
        ipo_id = execute_dml(sql, d)
        ipo_id_map[d[1]] = ipo_id

    # 2. Reservations
    print("[INFO] Inserting reservations...")
    for sym, ipo_id in ipo_id_map.items():
        res_sql = """
        INSERT INTO ipo_reservations (ipo_id, category_name, quota_percent, shares_reserved, min_investment_inr, max_investment_inr)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        execute_dml(res_sql, (ipo_id, "QIB (Qualified Institutional)", 50.00, 10000000, 200000.00, None))
        execute_dml(res_sql, (ipo_id, "NII / HNI (Non-Institutional)", 15.00, 3000000, 200000.00, 1000000.00))
        execute_dml(res_sql, (ipo_id, "Retail Individual Investors", 35.00, 7000000, 14850.00, 195000.00))

    # 3. Anchor Investors
    print("[INFO] Inserting anchor investors...")
    anchors = [
        ("TONBO", "Abu Dhabi Investment Authority (ADIA)", "FII", 1450000, 550.00, 79.75, 30, "2026-11-24"),
        ("TONBO", "Goldman Sachs Asset Management", "FII", 1200000, 550.00, 66.00, 90, "2027-01-23"),
        ("TONBO", "SBI Mutual Fund - Balanced Advantage", "Mutual Fund", 1800000, 550.00, 99.00, 30, "2026-11-24"),
        ("TONBO", "Nippon India Small Cap Fund", "Mutual Fund", 1100000, 550.00, 60.50, 90, "2027-01-23"),
        ("TATATECH", "Fidelity Management & Research", "FII", 2500000, 500.00, 125.00, 30, "2023-12-30"),
        ("TATATECH", "HDFC Trustee Co - Top 100", "Mutual Fund", 3000000, 500.00, 150.00, 90, "2024-02-28"),
        ("SWIGGY", "Government of Singapore (GIC)", "FII", 15000000, 390.00, 585.00, 30, "2024-12-13"),
        ("SWIGGY", "ICICI Prudential Tech Fund", "Mutual Fund", 12000000, 390.00, 468.00, 90, "2025-02-11"),
        ("BAJAJHFL", "Morgan Stanley Asia Singapore", "FII", 18000000, 70.00, 126.00, 30, "2024-10-16"),
        ("BAJAJHFL", "Kotak Mahindra Flexicap Fund", "Mutual Fund", 22000000, 70.00, 154.00, 90, "2024-12-15")
    ]
    for sym, inv, cat, shrs, prc, amt, ldays, ldate in anchors:
        if sym in ipo_id_map:
            execute_dml(
                """INSERT INTO anchor_investors (ipo_id, investor_name, investor_category, shares_allocated, bid_price, amount_cr, lockin_period_days, lockin_expiry_date)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (ipo_id_map[sym], inv, cat, shrs, prc, amt, ldays, ldate)
            )

    # 4. Subscription Bids (Day 1, 2, 3)
    print("[INFO] Inserting day-wise subscription bids...")
    subscriptions = [
        ("TONBO", 1, "2026-10-18", 1.25, 2.40, 3.10, 0.80, 2.25),
        ("TONBO", 2, "2026-10-19", 4.80, 8.60, 9.40, 1.90, 7.85),
        ("TONBO", 3, "2026-10-21", 72.40, 54.10, 28.30, 4.20, 51.60),
        ("TATATECH", 1, "2023-11-22", 4.10, 5.20, 6.80, 1.10, 5.50),
        ("TATATECH", 2, "2023-11-23", 12.30, 18.40, 15.60, 2.40, 15.10),
        ("TATATECH", 3, "2023-11-24", 203.41, 62.11, 16.50, 3.70, 69.43),
        ("SWIGGY", 3, "2024-11-08", 6.02, 1.24, 1.14, 1.65, 3.59),
        ("HYUNDAI", 3, "2024-10-17", 6.97, 0.60, 0.50, 1.74, 2.37),
        ("BAJAJHFL", 3, "2024-09-11", 209.36, 41.51, 7.41, 2.10, 63.61),
        ("PREMIER", 3, "2024-08-29", 216.40, 50.04, 7.44, 11.2, 74.38)
    ]
    for sym, day, dt, qib, nii, ret, emp, tot in subscriptions:
        if sym in ipo_id_map:
            execute_dml(
                """INSERT INTO subscription_bids (ipo_id, day_number, bidding_date, qib_subscription_times, nii_subscription_times, retail_subscription_times, employee_subscription_times, total_subscription_times)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (ipo_id_map[sym], day, dt, qib, nii, ret, emp, tot)
            )

    # 5. Secondary Listing Metrics (Pre-open & Listing Day)
    print("[INFO] Inserting secondary market listing metrics...")
    metrics = [
        # sym, prev_close, iep, open, high, low, close, gain%, ieq, val_lakhs, c_buy_cnt, c_sell_cnt, c_buy_qty, c_sell_qty
        ("TONBO", 550.00, 935.00, 935.00, 975.00, 890.00, 940.00, 70.91, 1420500, 13281.68, 1420, 650, 350000, 120000),
        ("TATATECH", 500.00, 1200.00, 1200.00, 1400.00, 1175.00, 1313.00, 162.60, 4820000, 57840.00, 8540, 2100, 1240000, 310000),
        ("SWIGGY", 390.00, 420.00, 420.00, 449.00, 396.00, 455.95, 16.91, 3120000, 13104.00, 2400, 1800, 820000, 540000),
        ("HYUNDAI", 1960.00, 1931.00, 1934.00, 1970.00, 1807.00, 1819.60, -7.16, 850000, 16413.50, 4120, 950, 620000, 150000),
        ("BAJAJHFL", 70.00, 150.00, 150.00, 165.00, 146.00, 165.00, 135.71, 12500000, 18750.00, 14500, 1920, 4100000, 350000),
        ("PREMIER", 450.00, 991.00, 991.00, 995.00, 801.00, 842.25, 87.17, 3400000, 33694.00, 5200, 1600, 1100000, 280000)
    ]
    for sym, prev, iep, opn, hi, lo, cls, gn, ieq, vl, cb_c, cs_c, cb_q, cs_q in metrics:
        if sym in ipo_id_map:
            execute_dml(
                """INSERT INTO secondary_listing_metrics (
                    ipo_id, prev_close, iep, listing_day_open, listing_day_high, listing_day_low,
                    listing_day_close, listing_gain_percent, ieq, indicative_val_lakhs,
                    cancelled_buy_orders_count, cancelled_sell_orders_count, cancelled_buy_qty,
                    cancelled_sell_qty, trading_status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'Traded')""",
                (ipo_id_map[sym], prev, iep, opn, hi, lo, cls, gn, ieq, vl, cb_c, cs_c, cb_q, cs_q)
            )

    # 6. Multi-Source GMP Records
    print("[INFO] Inserting multi-source GMP quotes...")
    gmp_data = [
        # TONBO
        ("TONBO", "Chittorgarh", "2026-10-24", 390.00, 940.00, 70.91, "Bullish"),
        ("TONBO", "InvestorGain", "2026-10-24", 415.00, 965.00, 75.45, "Very Bullish"),
        ("TONBO", "IPOWatch", "2026-10-24", 370.00, 920.00, 67.27, "Bullish"),
        ("TONBO", "GreyMarketIndia", "2026-10-24", 430.00, 980.00, 78.18, "Very Bullish"),

        # TATATECH
        ("TATATECH", "Chittorgarh", "2023-11-29", 400.00, 900.00, 80.00, "Bullish"),
        ("TATATECH", "InvestorGain", "2023-11-29", 415.00, 915.00, 83.00, "Bullish"),
        ("TATATECH", "IPOWatch", "2023-11-29", 390.00, 890.00, 78.00, "Bullish"),
        ("TATATECH", "GreyMarketIndia", "2023-11-29", 440.00, 940.00, 88.00, "Bullish"),

        # SWIGGY
        ("SWIGGY", "Chittorgarh", "2024-11-12", 12.00, 402.00, 3.08, "Neutral"),
        ("SWIGGY", "InvestorGain", "2024-11-12", 25.00, 415.00, 6.41, "Bullish"),
        ("SWIGGY", "IPOWatch", "2024-11-12", 2.00, 392.00, 0.51, "Neutral"),
        ("SWIGGY", "GreyMarketIndia", "2024-11-12", 30.00, 420.00, 7.69, "Bullish"),

        # HYUNDAI
        ("HYUNDAI", "Chittorgarh", "2024-10-21", -15.00, 1945.00, -0.77, "Bearish"),
        ("HYUNDAI", "InvestorGain", "2024-10-21", 45.00, 2005.00, 2.30, "Neutral"),
        ("HYUNDAI", "IPOWatch", "2024-10-21", -30.00, 1930.00, -1.53, "Bearish"),
        ("HYUNDAI", "GreyMarketIndia", "2024-10-21", 60.00, 2020.00, 3.06, "Bullish"),

        # BAJAJHFL
        ("BAJAJHFL", "Chittorgarh", "2024-09-15", 75.00, 145.00, 107.14, "Very Bullish"),
        ("BAJAJHFL", "InvestorGain", "2024-09-15", 82.00, 152.00, 117.14, "Very Bullish"),
        ("BAJAJHFL", "IPOWatch", "2024-09-15", 70.00, 140.00, 100.00, "Very Bullish"),
        ("BAJAJHFL", "GreyMarketIndia", "2024-09-15", 90.00, 160.00, 128.57, "Very Bullish"),

        # PREMIER
        ("PREMIER", "Chittorgarh", "2024-09-02", 420.00, 870.00, 93.33, "Very Bullish"),
        ("PREMIER", "InvestorGain", "2024-09-02", 435.00, 885.00, 96.67, "Very Bullish"),
        ("PREMIER", "IPOWatch", "2024-09-02", 390.00, 840.00, 86.67, "Bullish"),
        ("PREMIER", "GreyMarketIndia", "2024-09-02", 450.00, 900.00, 100.00, "Very Bullish")
    ]
    for sym, plat, qdt, gmp, est_p, est_g, sent in gmp_data:
        if sym in ipo_id_map:
            execute_dml(
                """INSERT INTO gmp_platform_records (ipo_id, platform_name, quote_date, gmp_inr, estimated_listing_price, estimated_gain_percent, rating_sentiment)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (ipo_id_map[sym], plat, qdt, gmp, est_p, est_g, sent)
            )

    # 7. NOVELTY: GMP Accuracy Evaluation Scoreboard
    print("[INFO] Calculating and inserting GMP Accuracy Scoreboard...")
    actual_gains = {
        "TONBO": 70.91,
        "TATATECH": 162.60,
        "SWIGGY": 16.91,
        "HYUNDAI": -7.16,
        "BAJAJHFL": 135.71,
        "PREMIER": 87.17
    }
    for sym, plat, qdt, gmp, est_p, pred_gain, sent in gmp_data:
        if sym in ipo_id_map and sym in actual_gains:
            actual = actual_gains[sym]
            err = round(abs(pred_gain - actual), 2)
            if pred_gain > actual + 1.0:
                direction = "Overestimated"
            elif pred_gain < actual - 1.0:
                direction = "Underestimated"
            else:
                direction = "Accurate"
            execute_dml(
                """INSERT INTO gmp_accuracy_eval (ipo_id, platform_name, last_gmp_predicted_gain_pct, actual_listing_gain_pct, absolute_error_pct, error_direction)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (ipo_id_map[sym], plat, pred_gain, actual, err, direction)
            )

    # 8. NOVELTY: DRHP vs RHP Regulatory Amendment Diffs
    print("[INFO] Inserting DRHP vs RHP diffs...")
    diffs = [
        ("TONBO", "Total Issue Size (Cr)", "Rs 1,000 Cr", "Rs 1,200 Cr", 20.00, "Issue Size Expanded", True),
        ("TONBO", "Fresh Issue vs OFS Split", "Fresh: Rs 600 Cr | OFS: Rs 400 Cr", "Fresh: Rs 800 Cr | OFS: Rs 400 Cr", 33.33, "Fresh Growth Capital Prioritized", True),
        ("TONBO", "Price Band Ceiling", "Rs 510", "Rs 550", 7.84, "Valuation Multiple Upward Adjustment", True),
        ("TONBO", "Restated PAT Margin", "15.4%", "18.2%", 18.18, "Audit Adjustments Post SEBI Query", True),
        ("SWIGGY", "Fresh Issue Size (Cr)", "Rs 3,750 Cr", "Rs 4,499 Cr", 19.97, "Fresh Issue Upsized for Instamart", True),
        ("SWIGGY", "Promoter & VC OFS (Cr)", "Rs 6,664 Cr", "Rs 6,828 Cr", 2.46, "Slight Secondary Block Expansion", False),
        ("BAJAJHFL", "Valuation P/B Multiplier", "2.8x Book Value", "3.2x Book Value", 14.28, "Strong Anchor Anchor Anchoring", True),
        ("HYUNDAI", "Royalty Fee to Parent Corp", "3.0% of Revenue", "2.5% of Revenue (Revised Post SEBI Pushback)", -16.67, "Royalty Reduced Safeguarding Minority Shareholders", True)
    ]
    for sym, param, d_val, r_val, pct, nat, sebi in diffs:
        if sym in ipo_id_map:
            execute_dml(
                """INSERT INTO drhp_rhp_diffs (ipo_id, parameter_name, drhp_val, rhp_val, percentage_change, change_nature, sebi_observation_noted)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (ipo_id_map[sym], param, d_val, r_val, pct, nat, 1 if sebi else 0)
            )

    # 9. MongoDB NoSQL Database Seeding
    print("[INFO] Seeding MongoDB NoSQL database...")
    db = get_nosql_db()
    if db is not None:
        db.company_filings.drop()
        db.drhp_rhp_deep_sections.drop()
        db.media_and_research.drop()
        db.peer_comparison_matrix.drop()

        # Filings
        db.company_filings.insert_many([
            {
                "symbol": "TONBO",
                "company_name": "Tonbo Imaging India Limited",
                "drhp_pdf_url": "https://tonboimaging.com/main/wp-content/uploads/2026/08/Tonbo-Imaging-India-Limited-DRHP.pdf",
                "rhp_pdf_url": "https://tonboimaging.com/main/wp-content/uploads/2026/10/Red-Herring-Prospectus.pdf",
                "drhp_av_mp4_url": "https://tonboimaging.com/main/wp-content/uploads/2026/08/Tonbo-DRHP-English-AV.mp4",
                "rhp_av_mp4_url": "https://tonboimaging.com/main/wp-content/uploads/2026/10/Tonbo-RHP-AV-English.mp4",
                "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
                "sebi_filing_date": "2026-08-14",
                "sebi_approval_date": "2026-10-04",
                "lead_counsel": "Cyril Amarchand Mangaldas",
                "statutory_auditors": "Deloitte Haskins & Sells LLP",
                "registered_office": "Electronic City Phase 1, Bengaluru, Karnataka 560100"
            },
            {
                "symbol": "TATATECH",
                "company_name": "Tata Technologies Limited",
                "drhp_pdf_url": "https://www.tatatechnologies.com/investors/drhp.pdf",
                "rhp_pdf_url": "https://www.tatatechnologies.com/investors/rhp.pdf",
                "drhp_av_mp4_url": "https://www.tatatechnologies.com/investors/av/drhp_brief.mp4",
                "rhp_av_mp4_url": "https://www.tatatechnologies.com/investors/av/rhp_brief.mp4",
                "sebi_portal_url": "https://www.sebi.gov.in/filings/tata_tech.html",
                "sebi_filing_date": "2023-03-09",
                "sebi_approval_date": "2023-06-27",
                "lead_counsel": "Shardul Amarchand Mangaldas",
                "statutory_auditors": "B S R & Co. LLP",
                "registered_office": "Plot No 25, Rajiv Gandhi Infotech Park, Hinjawadi, Pune 411057"
            },
            {
                "symbol": "SWIGGY",
                "company_name": "Swiggy Limited",
                "drhp_pdf_url": "https://www.swiggy.com/corporate-governance/drhp.pdf",
                "rhp_pdf_url": "https://www.swiggy.com/corporate-governance/rhp.pdf",
                "drhp_av_mp4_url": "https://www.swiggy.com/corporate-governance/swiggy_drhp_av.mp4",
                "rhp_av_mp4_url": "https://www.swiggy.com/corporate-governance/swiggy_rhp_av.mp4",
                "sebi_portal_url": "https://www.sebi.gov.in/filings/swiggy_2024.html",
                "sebi_filing_date": "2024-04-26",
                "sebi_approval_date": "2024-09-24",
                "lead_counsel": "AZB & Partners",
                "statutory_auditors": "Price Waterhouse LLP",
                "registered_office": "Devarabisanahalli, Outer Ring Road, Bengaluru 560103"
            },
            {
                "symbol": "HYUNDAI",
                "company_name": "Hyundai Motor India Limited",
                "drhp_pdf_url": "https://www.hyundai.com/in/investors/ipo/drhp.pdf",
                "rhp_pdf_url": "https://www.hyundai.com/in/investors/ipo/rhp.pdf",
                "drhp_av_mp4_url": "https://www.hyundai.com/in/investors/ipo/drhp_av_walkthrough.mp4",
                "rhp_av_mp4_url": "https://www.hyundai.com/in/investors/ipo/rhp_av_walkthrough.mp4",
                "sebi_portal_url": "https://www.sebi.gov.in/filings/hyundai_2024.html",
                "sebi_filing_date": "2024-06-15",
                "sebi_approval_date": "2024-09-18",
                "lead_counsel": "Shardul Amarchand Mangaldas",
                "statutory_auditors": "S.R. Batliboi & Associates LLP",
                "registered_office": "Irungattukottai, Sriperumbudur, Tamil Nadu 602117"
            },
            {
                "symbol": "BAJAJHFL",
                "company_name": "Bajaj Housing Finance Limited",
                "drhp_pdf_url": "https://www.bajajhousingfinance.in/investors/drhp.pdf",
                "rhp_pdf_url": "https://www.bajajhousingfinance.in/investors/rhp.pdf",
                "drhp_av_mp4_url": "https://www.bajajhousingfinance.in/investors/av/drhp_summary.mp4",
                "rhp_av_mp4_url": "https://www.bajajhousingfinance.in/investors/av/rhp_summary.mp4",
                "sebi_portal_url": "https://www.sebi.gov.in/filings/bajajhfl_2024.html",
                "sebi_filing_date": "2024-06-08",
                "sebi_approval_date": "2024-08-02",
                "lead_counsel": "Cyril Amarchand Mangaldas",
                "statutory_auditors": "KKC & Associates LLP",
                "registered_office": "Cerebrum IT Park, Kalyani Nagar, Pune 411014"
            }
        ])

        # Deep Sections
        db.drhp_rhp_deep_sections.insert_many([
            {
                "symbol": "TONBO",
                "section": "Objects of the Issue",
                "drhp_clause": "Funds of Rs 250 Cr allocated towards Setting up of dedicated electro-optics manufacturing fab in Hosur.",
                "rhp_clause": "SEBI advisory reflected: Split into Rs 180 Cr for Hosur Fab and Rs 70 Cr for Long-term working capital and global defense R&D testing.",
                "regulatory_impact": "Detailed escrow deployment milestones mandated by SEBI."
            },
            {
                "symbol": "TONBO",
                "section": "Risk Factors & Litigations",
                "drhp_clause": "Disclosed 2 pending vendor contractual disputes totaling Rs 4.2 Cr.",
                "rhp_clause": "Added high-priority risk factor regarding export licenses for Dual-Use Thermal Sight technology under Indian SCOMET regulations.",
                "regulatory_impact": "Crucial regulatory transparency enhancement for retail investors."
            },
            {
                "symbol": "SWIGGY",
                "section": "Dark Stores Quick Commerce Capex",
                "drhp_clause": "Rs 982 Cr allocated towards dark store expansion across Tier-1 metros.",
                "rhp_clause": "Increased to Rs 1,178 Cr following rapid Instamart footprint scale-up and Zepto/Blinkit competitive dynamics.",
                "regulatory_impact": "Capex accelerated by 20% in final prospectus."
            }
        ])

        # Media & Research
        db.media_and_research.insert_many([
            {
                "symbol": "TONBO",
                "channel_name": "Pranjal Kamra - Finology",
                "video_title": "Tonbo Imaging IPO Review: India's Defense Tech Gamechanger?",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "view_count": 142000,
                "sentiment": "Very Bullish",
                "key_takeaway": "High gross margins in defense electro-optics; strong order book from Indian Armed Forces & NATO allies."
            },
            {
                "symbol": "TONBO",
                "channel_name": "Akshat Shrivastava",
                "video_title": "Deep Tech Investing: Should You Apply for Tonbo IPO?",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "view_count": 285000,
                "sentiment": "Bullish with Long-Term Horizon",
                "key_takeaway": "Proprietary AI thermal night vision algorithms give Tonbo 45% EBITDA margins; high barrier to entry."
            },
            {
                "symbol": "TATATECH",
                "channel_name": "CA Rachana Ranade",
                "video_title": "Tata Technologies IPO Complete Analysis & Allotment Strategy",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "view_count": 620000,
                "sentiment": "Super Bullish",
                "key_takeaway": "First Tata Group IPO in almost 2 decades; massive listing pop anticipated due to parent brand trust."
            },
            {
                "symbol": "BAJAJHFL",
                "channel_name": "Asset Yogi",
                "video_title": "Bajaj Housing Finance IPO: Is it a Multibagger or Overpriced?",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "view_count": 510000,
                "sentiment": "Bullish",
                "key_takeaway": "Lowest NPA ratio in housing finance industry; reasonable valuation relative to parent Bajaj Finance."
            }
        ])

        # Peer Comparison
        db.peer_comparison_matrix.insert_many([
            {
                "symbol": "TONBO",
                "peers": [
                    { "name": "Tonbo Imaging", "pe_ratio": 38.4, "roe_pct": 22.8, "pat_margin_pct": 18.2, "revenue_cr": 340.5 },
                    { "name": "Data Patterns India", "pe_ratio": 54.2, "roe_pct": 17.4, "pat_margin_pct": 28.5, "revenue_cr": 520.1 },
                    { "name": "Zen Technologies", "pe_ratio": 62.1, "roe_pct": 26.5, "pat_margin_pct": 31.0, "revenue_cr": 440.0 },
                    { "name": "Astra Microwave", "pe_ratio": 44.8, "roe_pct": 15.2, "pat_margin_pct": 12.8, "revenue_cr": 810.0 }
                ]
            },
            {
                "symbol": "TATATECH",
                "peers": [
                    { "name": "Tata Technologies", "pe_ratio": 32.5, "roe_pct": 23.7, "pat_margin_pct": 15.8, "revenue_cr": 4414.0 },
                    { "name": "KPIT Technologies", "pe_ratio": 78.4, "roe_pct": 25.1, "pat_margin_pct": 11.2, "revenue_cr": 4871.0 },
                    { "name": "L&T Technology Services", "pe_ratio": 41.2, "roe_pct": 24.3, "pat_margin_pct": 14.1, "revenue_cr": 9647.0 },
                    { "name": "Tata Elxsi", "pe_ratio": 52.8, "roe_pct": 29.8, "pat_margin_pct": 22.4, "revenue_cr": 3552.0 }
                ]
            }
        ])
        print("[INFO] MongoDB collections populated successfully!")
    else:
        print("[WARN] Skipping MongoDB seeding as MongoDB client is unavailable.")

    print("[SUCCESS] All database seed operations completed successfully!")

if __name__ == "__main__":
    seed_all()
