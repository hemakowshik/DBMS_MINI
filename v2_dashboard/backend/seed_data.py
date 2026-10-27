import json
from .db_relational import execute_dml, execute_query, init_relational_db, get_db_connection
from .db_nosql import get_nosql_db

def seed_v2_all():
    print("[INFO] Initializing V2 Relational Database Schema...")
    init_relational_db()

    # Clear existing tables
    execute_dml("DELETE FROM drhp_rhp_diffs")
    execute_dml("DELETE FROM gmp_accuracy_eval")
    execute_dml("DELETE FROM gmp_platform_records")
    execute_dml("DELETE FROM secondary_listing_metrics")
    execute_dml("DELETE FROM subscription_bids")
    execute_dml("DELETE FROM anchor_investors")
    execute_dml("DELETE FROM ipo_reservations")
    execute_dml("DELETE FROM ipos")

    print("[INFO] Inserting IPO Master records (Upcoming at Top, Open in Middle, Completed at Bottom)...")

    # 1. IPOS table
    # status: 'Upcoming' (1), 'Open' (2), 'Completed' (3)
    ipos_data = [
        # UPCOMING (Ready for IPO right now)
        (
            "Tonbo Imaging India Limited", "TONBO", "INE0LDG01026", "544101", "Both",
            "Book Building", "Combination", 2.00, 520.00, 550.00, 550.00, 27, 25.00,
            21818181, 1200.00, 800.00, 400.00, 82.50, 68.20,
            "2026-11-05", "2026-11-08", "2026-11-09", "2026-11-10", "2026-11-12",
            "2026-12-12", "2027-02-10", "2027-05-12",
            "Kotak Mahindra Capital, Axis Capital", "KFin Technologies Limited", "Defense & Aerospace Tech",
            "Upcoming", 1,
            "Pioneering AI-driven electro-optics, night-vision sights, and autonomous defense sensing equipment."
        ),
        (
            "NTPC Green Energy Limited", "NTPCGREEN", "INE0ON801018", "544310", "Both",
            "Book Building", "Fresh Issue", 10.00, 102.00, 108.00, 108.00, 138, 5.00,
            925925925, 10000.00, 10000.00, 0.00, 100.00, 89.00,
            "2026-11-19", "2026-11-22", "2026-11-25", "2026-11-26", "2026-11-27",
            "2026-12-27", "2027-02-25", "2027-05-27",
            "IDBI Capital, HDFC Bank, IIFL Securities, Nuvama Wealth", "KFin Technologies Limited", "Renewable Energy Utility",
            "Upcoming", 1,
            "India's largest public sector renewable energy producer with massive solar and wind utility portfolios."
        ),
        (
            "Urban Company Limited", "URBANCO", "INE054T01012", "544320", "Both",
            "Book Building", "Combination", 1.00, 280.00, 300.00, 300.00, 50, 0.00,
            60000000, 1800.00, 1200.00, 600.00, 78.40, 64.50,
            "2026-11-26", "2026-11-29", "2026-12-02", "2026-12-03", "2026-12-04",
            "2027-01-03", "2027-03-04", "2027-06-04",
            "Kotak Mahindra, Morgan Stanley", "Link Intime India Private Limited", "Consumer Tech / Home Services",
            "Upcoming", 1,
            "Dominant on-demand home beauty, maintenance, and technical repair service platform."
        ),

        # CURRENTLY OPEN (Bidding active)
        (
            "Swiggy Limited", "SWIGGY", "INE00H001014", "544285", "Both",
            "Book Building", "Combination", 1.00, 371.00, 390.00, 390.00, 38, 0.00,
            290000000, 11327.00, 4499.00, 6828.00, 71.40, 58.60,
            "2026-10-26", "2026-10-28", "2026-10-29", "2026-10-30", "2026-11-03",
            "2026-12-03", "2027-02-01", "2027-05-03",
            "Kotak Mahindra, Citigroup, Jefferies, Avendus", "Link Intime India Private Limited", "Consumer Internet / Quick Commerce",
            "Open", 2,
            "Hyperlocal commerce titan operating food delivery and rapid Instamart dark-store quick commerce."
        ),
        (
            "Waaree Energies Limited", "WAAREE", "INE377N01014", "544275", "Both",
            "Book Building", "Combination", 10.00, 1427.00, 1503.00, 1503.00, 9, 0.00,
            28749168, 4321.44, 3600.00, 721.44, 72.30, 64.20,
            "2026-10-25", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-31",
            "2026-11-30", "2027-01-29", "2027-04-30",
            "Axis Capital, Jefferies India, Nomura, SBI Capital", "Link Intime India Private Limited", "Solar PV Modules",
            "Open", 2,
            "India's largest solar photovoltaic module maker with 12 GW installed manufacturing capacity."
        ),

        # COMPLETED (Listed)
        (
            "Hyundai Motor India Limited", "HYUNDAI", "INE00B801021", "544274", "Both",
            "Book Building", "OFS", 10.00, 1865.00, 1960.00, 1960.00, 7, 0.00,
            142194700, 27870.16, 0.00, 27870.16, 100.00, 82.50,
            "2024-10-15", "2024-10-17", "2024-10-18", "2024-10-21", "2024-10-22",
            "2024-11-21", "2025-01-20", "2025-04-22",
            "Kotak Mahindra, Citigroup, Morgan Stanley, J.P. Morgan, HSBC", "KFin Technologies Limited", "Automotive OEM",
            "Completed", 3,
            "Second largest passenger vehicle manufacturer in India; historic landmark capital listing."
        ),
        (
            "Tata Technologies Limited", "TATATECH", "INE142M01025", "544028", "Both",
            "Book Building", "OFS", 2.00, 475.00, 500.00, 500.00, 30, 0.00,
            60850278, 3042.51, 0.00, 3042.51, 66.80, 55.30,
            "2023-11-22", "2023-11-24", "2023-11-28", "2023-11-29", "2023-11-30",
            "2023-12-30", "2024-02-28", "2024-05-30",
            "JM Financial, Citigroup Global, BofA Securities", "Link Intime India Private Limited", "Engineering R&D Services",
            "Completed", 3,
            "Global engineering and digital transformation powerhouse serving automotive, aerospace, and heavy machinery."
        ),
        (
            "Bajaj Housing Finance Limited", "BAJAJHFL", "INE377Y01017", "544252", "Both",
            "Book Building", "Combination", 10.00, 66.00, 70.00, 70.00, 214, 0.00,
            937142857, 6560.00, 3560.00, 3000.00, 100.00, 88.75,
            "2024-09-09", "2024-09-11", "2024-09-12", "2024-09-13", "2024-09-16",
            "2024-10-16", "2024-12-15", "2025-03-16",
            "Kotak Mahindra, BofA Securities, Axis Capital, Goldman Sachs, SBI Capital", "KFin Technologies Limited", "Housing Finance (NBFC)",
            "Completed", 3,
            "Upper-layer NBFC mortgage lender backed by Bajaj Group, with industry-leading asset quality."
        ),
        (
            "Premier Energies Limited", "PREMIER", "INE237Z01018", "544234", "Both",
            "Book Building", "Combination", 1.00, 427.00, 450.00, 450.00, 33, 22.00,
            62888888, 2830.00, 1291.40, 1538.60, 85.00, 69.40,
            "2024-08-27", "2024-08-29", "2024-08-30", "2024-09-02", "2024-09-03",
            "2024-10-03", "2024-12-02", "2025-03-03",
            "Kotak Mahindra, J.P. Morgan, ICICI Securities", "KFin Technologies Limited", "Solar Cell & Module Manufacturing",
            "Completed", 3,
            "Integrated solar cell and module producer benefiting from clean energy transition subsidies."
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
            pre_ipo_lockin_180d, brlm_lead_manager, registrar_name, sector,
            status, status_order, summary
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        """
        ipo_id = execute_dml(sql, d)
        ipo_id_map[d[1]] = ipo_id

    # 2. Reservations
    print("[INFO] Inserting category quotas...")
    for sym, ipo_id in ipo_id_map.items():
        execute_dml(
            "INSERT INTO ipo_reservations (ipo_id, category_name, quota_percent, shares_reserved, min_investment_inr, max_investment_inr) VALUES (%s, %s, %s, %s, %s, %s)",
            (ipo_id, "QIB (Qualified Institutional)", 50.00, 10000000, 200000.00, None)
        )
        execute_dml(
            "INSERT INTO ipo_reservations (ipo_id, category_name, quota_percent, shares_reserved, min_investment_inr, max_investment_inr) VALUES (%s, %s, %s, %s, %s, %s)",
            (ipo_id, "NII / HNI (Non-Institutional)", 15.00, 3000000, 200000.00, 1000000.00)
        )
        execute_dml(
            "INSERT INTO ipo_reservations (ipo_id, category_name, quota_percent, shares_reserved, min_investment_inr, max_investment_inr) VALUES (%s, %s, %s, %s, %s, %s)",
            (ipo_id, "Retail Individual Investors", 35.00, 7000000, 14850.00, 195000.00)
        )

    # 3. Anchor Investors
    print("[INFO] Inserting anchor allocations...")
    anchors = [
        ("TONBO", "Abu Dhabi Investment Authority (ADIA)", "FII", 1450000, 550.00, 79.75, 30, "2026-12-12"),
        ("TONBO", "Goldman Sachs Asset Management", "FII", 1200000, 550.00, 66.00, 90, "2027-02-10"),
        ("TONBO", "SBI Mutual Fund - Balanced Advantage", "Mutual Fund", 1800000, 550.00, 99.00, 30, "2026-12-12"),
        ("TONBO", "Nippon India Small Cap Fund", "Mutual Fund", 1100000, 550.00, 60.50, 90, "2027-02-10"),
        ("NTPCGREEN", "Life Insurance Corporation of India (LIC)", "Insurance", 25000000, 108.00, 270.00, 30, "2026-12-27"),
        ("NTPCGREEN", "Capital Group Global Equity", "FII", 18000000, 108.00, 194.40, 90, "2027-02-25"),
        ("WAAREE", "BlackRock Global Allocation Fund", "FII", 2200000, 1503.00, 330.66, 30, "2026-11-30"),
        ("WAAREE", "Mirae Asset Large Cap Fund", "Mutual Fund", 1900000, 1503.00, 285.57, 90, "2027-01-29"),
        ("SWIGGY", "Government of Singapore (GIC)", "FII", 15000000, 390.00, 585.00, 30, "2026-12-03"),
        ("SWIGGY", "ICICI Prudential Tech Fund", "Mutual Fund", 12000000, 390.00, 468.00, 90, "2027-02-01"),
        ("TATATECH", "Fidelity Management & Research", "FII", 2500000, 500.00, 125.00, 30, "2023-12-30"),
        ("HYUNDAI", "GIC Singapore & Temasek", "FII", 12000000, 1960.00, 2352.00, 30, "2024-11-21"),
        ("BAJAJHFL", "Morgan Stanley Asia Singapore", "FII", 18000000, 70.00, 126.00, 30, "2024-10-16")
    ]
    for sym, inv, cat, shrs, prc, amt, ldays, ldate in anchors:
        if sym in ipo_id_map:
            execute_dml(
                "INSERT INTO anchor_investors (ipo_id, investor_name, investor_category, shares_allocated, bid_price, amount_cr, lockin_period_days, lockin_expiry_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (ipo_id_map[sym], inv, cat, shrs, prc, amt, ldays, ldate)
            )

    # 4. Daily Subscription Bids
    print("[INFO] Inserting day-by-day bidding multiples...")
    subscriptions = [
        ("TONBO", 1, "2026-11-05", 1.25, 2.40, 3.10, 0.80, 2.25),
        ("NTPCGREEN", 1, "2026-11-19", 0.75, 1.40, 2.10, 0.50, 1.35),
        ("WAAREE", 1, "2026-10-25", 8.40, 12.30, 9.80, 3.10, 10.20),
        ("WAAREE", 2, "2026-10-26", 28.50, 44.10, 24.60, 6.80, 32.40),
        ("WAAREE", 3, "2026-10-27", 208.63, 62.49, 10.79, 5.17, 76.34),
        ("SWIGGY", 1, "2026-10-26", 0.45, 0.28, 0.65, 0.30, 0.48),
        ("SWIGGY", 2, "2026-10-27", 1.82, 0.95, 1.14, 0.85, 1.45),
        ("HYUNDAI", 3, "2024-10-17", 6.97, 0.60, 0.50, 1.74, 2.37),
        ("TATATECH", 3, "2023-11-24", 203.41, 62.11, 16.50, 3.70, 69.43),
        ("BAJAJHFL", 3, "2024-09-11", 209.36, 41.51, 7.41, 2.10, 63.61),
        ("PREMIER", 3, "2024-08-29", 216.40, 50.04, 7.44, 11.2, 74.38)
    ]
    for sym, day, dt, qib, nii, ret, emp, tot in subscriptions:
        if sym in ipo_id_map:
            execute_dml(
                "INSERT INTO subscription_bids (ipo_id, day_number, bidding_date, qib_subscription_times, nii_subscription_times, retail_subscription_times, employee_subscription_times, total_subscription_times) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (ipo_id_map[sym], day, dt, qib, nii, ret, emp, tot)
            )

    # 5. Secondary Listing Metrics
    print("[INFO] Inserting secondary market discovery metrics...")
    metrics = [
        # For Completed ones
        ("HYUNDAI", 1960.00, 1931.00, 1934.00, 1970.00, 1807.00, 1819.60, -7.16, 850000, 16413.50, 4120, 950, 620000, 150000),
        ("TATATECH", 500.00, 1200.00, 1200.00, 1400.00, 1175.00, 1313.00, 162.60, 4820000, 57840.00, 8540, 2100, 1240000, 310000),
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

    # 6. Multi-Source GMP Records across platforms
    print("[INFO] Inserting multi-source GMP quotes...")
    gmp_data = [
        # TONBO (Upcoming)
        ("TONBO", "Chittorgarh", "2026-10-27", 390.00, 940.00, 70.91, "Bullish"),
        ("TONBO", "InvestorGain", "2026-10-27", 415.00, 965.00, 75.45, "Very Bullish"),
        ("TONBO", "IPOWatch", "2026-10-27", 370.00, 920.00, 67.27, "Bullish"),
        ("TONBO", "GreyMarketIndia", "2026-10-27", 430.00, 980.00, 78.18, "Very Bullish"),

        # NTPCGREEN (Upcoming)
        ("NTPCGREEN", "Chittorgarh", "2026-10-27", 15.00, 123.00, 13.89, "Moderate"),
        ("NTPCGREEN", "InvestorGain", "2026-10-27", 18.00, 126.00, 16.67, "Bullish"),
        ("NTPCGREEN", "IPOWatch", "2026-10-27", 14.00, 122.00, 12.96, "Moderate"),
        ("NTPCGREEN", "GreyMarketIndia", "2026-10-27", 20.00, 128.00, 18.52, "Bullish"),

        # URBANCO (Upcoming)
        ("URBANCO", "Chittorgarh", "2026-10-27", 65.00, 365.00, 21.67, "Bullish"),
        ("URBANCO", "InvestorGain", "2026-10-27", 72.00, 372.00, 24.00, "Bullish"),
        ("URBANCO", "IPOWatch", "2026-10-27", 60.00, 360.00, 20.00, "Bullish"),
        ("URBANCO", "GreyMarketIndia", "2026-10-27", 78.00, 378.00, 26.00, "Bullish"),

        # WAAREE (Open)
        ("WAAREE", "Chittorgarh", "2026-10-27", 1480.00, 2983.00, 98.47, "Super Bullish"),
        ("WAAREE", "InvestorGain", "2026-10-27", 1520.00, 3023.00, 101.13, "Super Bullish"),
        ("WAAREE", "IPOWatch", "2026-10-27", 1450.00, 2953.00, 96.47, "Super Bullish"),
        ("WAAREE", "GreyMarketIndia", "2026-10-27", 1560.00, 3063.00, 103.79, "Super Bullish"),

        # SWIGGY (Open)
        ("SWIGGY", "Chittorgarh", "2026-10-27", 14.00, 404.00, 3.59, "Neutral"),
        ("SWIGGY", "InvestorGain", "2026-10-27", 22.00, 412.00, 5.64, "Bullish"),
        ("SWIGGY", "IPOWatch", "2026-10-27", 8.00, 398.00, 2.05, "Neutral"),
        ("SWIGGY", "GreyMarketIndia", "2026-10-27", 28.00, 418.00, 7.18, "Bullish"),

        # HYUNDAI (Completed)
        ("HYUNDAI", "Chittorgarh", "2024-10-21", -15.00, 1945.00, -0.77, "Bearish"),
        ("HYUNDAI", "InvestorGain", "2024-10-21", 45.00, 2005.00, 2.30, "Neutral"),
        ("HYUNDAI", "IPOWatch", "2024-10-21", -30.00, 1930.00, -1.53, "Bearish"),
        ("HYUNDAI", "GreyMarketIndia", "2024-10-21", 60.00, 2020.00, 3.06, "Bullish"),

        # TATATECH (Completed)
        ("TATATECH", "Chittorgarh", "2023-11-29", 400.00, 900.00, 80.00, "Bullish"),
        ("TATATECH", "InvestorGain", "2023-11-29", 415.00, 915.00, 83.00, "Bullish"),
        ("TATATECH", "IPOWatch", "2023-11-29", 390.00, 890.00, 78.00, "Bullish"),
        ("TATATECH", "GreyMarketIndia", "2023-11-29", 440.00, 940.00, 88.00, "Bullish"),

        # BAJAJHFL (Completed)
        ("BAJAJHFL", "Chittorgarh", "2024-09-15", 75.00, 145.00, 107.14, "Very Bullish"),
        ("BAJAJHFL", "InvestorGain", "2024-09-15", 82.00, 152.00, 117.14, "Very Bullish"),
        ("BAJAJHFL", "IPOWatch", "2024-09-15", 70.00, 140.00, 100.00, "Very Bullish"),
        ("BAJAJHFL", "GreyMarketIndia", "2024-09-15", 90.00, 160.00, 128.57, "Very Bullish"),

        # PREMIER (Completed)
        ("PREMIER", "Chittorgarh", "2024-09-02", 420.00, 870.00, 93.33, "Very Bullish"),
        ("PREMIER", "InvestorGain", "2024-09-02", 435.00, 885.00, 96.67, "Very Bullish"),
        ("PREMIER", "IPOWatch", "2024-09-02", 390.00, 840.00, 86.67, "Bullish"),
        ("PREMIER", "GreyMarketIndia", "2024-09-02", 450.00, 900.00, 100.00, "Very Bullish")
    ]
    for sym, plat, qdt, gmp, est_p, est_g, sent in gmp_data:
        if sym in ipo_id_map:
            execute_dml(
                "INSERT INTO gmp_platform_records (ipo_id, platform_name, quote_date, gmp_inr, estimated_listing_price, estimated_gain_percent, rating_sentiment) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (ipo_id_map[sym], plat, qdt, gmp, est_p, est_g, sent)
            )

    # 7. Accuracy Benchmarking (historical evaluated against completed IPOs)
    print("[INFO] Computing platform forecast accuracy evaluations...")
    actual_gains = {
        "HYUNDAI": -7.16,
        "TATATECH": 162.60,
        "BAJAJHFL": 135.71,
        "PREMIER": 87.17
    }
    for sym, plat, qdt, gmp, est_p, pred_gain, sent in gmp_data:
        if sym in ipo_id_map and sym in actual_gains:
            actual = actual_gains[sym]
            err = round(abs(pred_gain - actual), 2)
            direction = "Overestimated" if pred_gain > actual + 1.0 else ("Underestimated" if pred_gain < actual - 1.0 else "Accurate")
            execute_dml(
                "INSERT INTO gmp_accuracy_eval (ipo_id, platform_name, last_gmp_predicted_gain_pct, actual_listing_gain_pct, absolute_error_pct, error_direction) VALUES (%s, %s, %s, %s, %s, %s)",
                (ipo_id_map[sym], plat, pred_gain, actual, err, direction)
            )

    # 8. Regulatory Diffs (DRHP vs RHP changes)
    print("[INFO] Inserting prospectus variance diffs...")
    diffs = [
        ("TONBO", "Total Issue Size (Cr)", "Rs 1,000 Cr", "Rs 1,200 Cr", 20.00, "Issue Size Expanded", True),
        ("TONBO", "Fresh Issue vs OFS Split", "Fresh: Rs 600 Cr | OFS: Rs 400 Cr", "Fresh: Rs 800 Cr | OFS: Rs 400 Cr", 33.33, "Fresh Growth Capital Prioritized", True),
        ("TONBO", "Price Band Ceiling", "Rs 510", "Rs 550", 7.84, "Valuation Multiple Upward Adjustment", True),
        ("TONBO", "Restated PAT Margin", "15.4%", "18.2%", 18.18, "Audit Adjustments Post SEBI Query", True),
        ("NTPCGREEN", "Total Issue Structure", "Rs 7,500 Cr", "Rs 10,000 Cr", 33.33, "Capital Requirements Scaled Post Inter-Ministerial Approval", True),
        ("WAAREE", "Capacity Expansion Allocation", "Rs 2,800 Cr for 6GW Ingot-Wafer Facility", "Rs 3,400 Cr (Solar cell line expanded)", 21.43, "Odisha Mega Solar Fab Approved", True),
        ("SWIGGY", "Dark Stores Capex (Cr)", "Rs 982 Cr", "Rs 1,178 Cr", 19.96, "Instamart Footprint Accelerated", True),
        ("SWIGGY", "Promoter & VC OFS (Cr)", "Rs 6,664 Cr", "Rs 6,828 Cr", 2.46, "Slight Secondary Block Expansion", False),
        ("HYUNDAI", "Royalty Fee to Parent Corp", "3.0% of Revenue", "2.5% of Revenue", -16.67, "Royalty Reduced Safeguarding Minority Shareholders", True),
        ("BAJAJHFL", "Valuation P/B Multiplier", "2.8x Book Value", "3.2x Book Value", 14.28, "Strong Anchor Anchor Anchoring", True)
    ]
    for sym, param, d_val, r_val, pct, nat, sebi in diffs:
        if sym in ipo_id_map:
            execute_dml(
                "INSERT INTO drhp_rhp_diffs (ipo_id, parameter_name, drhp_val, rhp_val, percentage_change, change_nature, sebi_observation_noted) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (ipo_id_map[sym], param, d_val, r_val, pct, nat, 1 if sebi else 0)
            )

    # 9. NoSQL Seeding
    db = get_nosql_db()
    if db is not None:
        db.company_filings.delete_many({})
        db.drhp_rhp_deep_sections.delete_many({})
        db.media_and_research.delete_many({})
        db.peer_comparison_matrix.delete_many({})

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
                "statutory_auditors": "Deloitte Haskins & Sells LLP"
            },
            {
                "symbol": "NTPCGREEN",
                "company_name": "NTPC Green Energy Limited",
                "drhp_pdf_url": "https://www.ntpcgreen.com/investors/drhp.pdf",
                "rhp_pdf_url": "https://www.ntpcgreen.com/investors/rhp.pdf",
                "drhp_av_mp4_url": "https://www.ntpcgreen.com/investors/av/overview.mp4",
                "rhp_av_mp4_url": "https://www.ntpcgreen.com/investors/av/rhp_brief.mp4",
                "sebi_portal_url": "https://www.sebi.gov.in/filings/ntpcgreen_2026.html",
                "sebi_filing_date": "2026-09-18",
                "sebi_approval_date": "2026-10-22",
                "lead_counsel": "Trilegal",
                "statutory_auditors": "S.R. Batliboi & Co. LLP"
            },
            {
                "symbol": "WAAREE",
                "company_name": "Waaree Energies Limited",
                "drhp_pdf_url": "https://www.waaree.com/investor-relations/drhp.pdf",
                "rhp_pdf_url": "https://www.waaree.com/investor-relations/rhp.pdf",
                "drhp_av_mp4_url": "https://www.waaree.com/investor-relations/av_presentation.mp4",
                "rhp_av_mp4_url": "https://www.waaree.com/investor-relations/rhp_av.mp4",
                "sebi_portal_url": "https://www.sebi.gov.in/filings/waaree_2024.html",
                "sebi_filing_date": "2024-01-05",
                "sebi_approval_date": "2024-09-20",
                "lead_counsel": "Shardul Amarchand Mangaldas",
                "statutory_auditors": "KPMG Assurance LLP"
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
                "statutory_auditors": "Price Waterhouse LLP"
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
                "statutory_auditors": "S.R. Batliboi & Associates LLP"
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
                "symbol": "WAAREE",
                "channel_name": "CA Rachana Ranade",
                "video_title": "Waaree Energies IPO: Massive 100% GMP! Multi-bagger Analysis",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "view_count": 780000,
                "sentiment": "Super Bullish",
                "key_takeaway": "Dominant 21% domestic solar module market share; direct beneficiary of US tariffs on Chinese solar exports."
            },
            {
                "symbol": "SWIGGY",
                "channel_name": "Asset Yogi",
                "video_title": "Swiggy vs Zomato: Quick Commerce Battle Explained",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "view_count": 490000,
                "sentiment": "Neutral to Positive",
                "key_takeaway": "High market share in Tier-1 quick commerce; path to profitability depends on ad-monetization."
            }
        ])

        # Peer Comparison Multiples
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
                "symbol": "WAAREE",
                "peers": [
                    { "name": "Waaree Energies", "pe_ratio": 34.2, "roe_pct": 31.5, "pat_margin_pct": 11.8, "revenue_cr": 11397.0 },
                    { "name": "Premier Energies", "pe_ratio": 52.8, "roe_pct": 28.2, "pat_margin_pct": 14.2, "revenue_cr": 3143.0 },
                    { "name": "Websol Energy", "pe_ratio": 68.4, "roe_pct": 14.1, "pat_margin_pct": 8.5, "revenue_cr": 890.0 }
                ]
            }
        ])

    print("[SUCCESS] V2 Database seed completed!")

if __name__ == "__main__":
    seed_v2_all()
