# PES UNIVERSITY
### Department of Artificial Intelligence & Machine Learning
### Academic Year 2024–2026 | Semester III / IV
### Course: Database Management Systems (UE23CS252)

---

# Mini Project Report
## Comprehensive IPO Intelligence, Multi-Source GMP Analytics & Regulatory Tracker
**A Polyglot Persistence DBMS (MySQL/SQLite Relational + MongoDB Document Store)**

**Evaluator**: Prof. Smitha GR, Faculty of AIML, RR Campus, PES University  
**Student Name**: Hema Kowshik G  
**Student SRN**: PES1UG24AM106  
**Target Directory**: `C:\DBMS_MINI`  
**Submission / Evaluation Date**: 26th October 2026  

---

## 1. Executive Summary & Problem Statement

In the Indian financial capital markets, Initial Public Offerings (IPOs) are a critical instrument for capital mobilization. However, retail investors face significant information asymmetry and platform fragmentation:
1. **Scattered Regulatory Data**: The Draft Red Herring Prospectus (DRHP) and final Red Herring Prospectus (RHP) are published across fragmented SEBI and registrar websites.
2. **Unofficial Grey Market Manipulation**: Grey Market Premium (GMP) data is reported by diverse unofficial blogs with conflicting quotes, vulnerable to syndicate hype.
3. **Hidden Post-SEBI Regulatory Alterations**: Critical structural modifications between DRHP and final RHP (e.g., changes in Fresh Capital vs Offer for Sale [OFS] ratio, promoter cashouts, revised litigation disclosures) are buried inside 500-page prospectus documents.
4. **Anchor Lock-In Supply Shocks**: Retail investors often get trapped by post-listing price drops when mandatory 30-day and 90-day institutional anchor investor lock-ins expire, releasing large share supplies.

### Objectives
This project designs and implements a **Polyglot DBMS Architecture** that:
- Relational Database (RDBMS): Enforces strict ACID transactional integrity for financial offerings, quotas, order cancellations, and price discoveries across 8 normalized tables.
- Document NoSQL Database (MongoDB): Manages semi-structured prospectus filings, direct Audio-Visual MP4 links (such as Tonbo Imaging DRHP/RHP AV walkthroughs), YouTube research channel reviews, and competitor peer matrices.
- Novelty 1: Features a **GMP Accuracy Scoreboard** that evaluates and ranks external trackers by Mean Absolute Error (MAE) against actual exchange listing prices.
- Novelty 2: Provides a **DRHP vs RHP Regulatory Amendment Diff Tracker** highlighting key shifts between draft and final filings.

---

## 2. Polyglot Database Architecture

```
+---------------------------------------------------------------------------------+
|                               WEB USER INTERFACE                                |
|        (Modern Terminal Dashboard: Primary IPOs, GMP Heatmap, Reports, Diff)   |
+---------------------------------------------------------------------------------+
                                       |
                                       v
+---------------------------------------------------------------------------------+
|                                FLASK BACKEND                                    |
|          RESTful API Controller | Analytical Reports Engine | Query Router      |
+---------------------------------------------------------------------------------+
                 /                                             \
                v                                               v
+------------------------------------+         +----------------------------------+
|     RELATIONAL RDBMS ENGINE        |         |       NoSQL DOCUMENT STORE       |
|       (MySQL Server / SQLite)      |         |          (MongoDB 8.2)           |
+------------------------------------+         +----------------------------------+
| 1. ipos                            |         | 1. company_filings               |
| 2. ipo_reservations                |         | 2. drhp_rhp_deep_sections        |
| 3. anchor_investors                |         | 3. media_and_research            |
| 4. subscription_bids               |         | 4. peer_comparison_matrix        |
| 5. secondary_listing_metrics       |         |                                  |
| 6. gmp_platform_records            |         | - Flexible, dynamic schemas      |
| 7. gmp_accuracy_eval (Novelty)     |         | - Unstructured text diffs        |
| 8. drhp_rhp_diffs (Novelty)        |         | - Media URLs (MP4 videos/PDFs)   |
+------------------------------------+         +----------------------------------+
```

---

## 3. Relational Schema & Normalization

### Tables Overview
1. `ipos`: Primary master table (`ipo_id` PK, `symbol` UK, `isin` UK, issue parameters, dates, lead managers).
2. `ipo_reservations`: Child table (`reservation_id` PK, `ipo_id` FK, category, quota %).
3. `anchor_investors`: Child table (`anchor_id` PK, `ipo_id` FK, investor name, category, lock-in days, expiry date).
4. `subscription_bids`: Child table (`bid_id` PK, `ipo_id` FK, day number, bidding multiples).
5. `secondary_listing_metrics`: Listing session discovery table (`metric_id` PK, `ipo_id` FK UK, IEP, listing gain %, order cancellations).
6. `gmp_platform_records`: Daily quotes from external trackers (`record_id` PK, `ipo_id` FK, platform, quote date, GMP INR).
7. `gmp_accuracy_eval`: Evaluation benchmark (`eval_id` PK, `ipo_id` FK, predicted gain %, actual gain %, absolute error %).
8. `drhp_rhp_diffs`: Regulatory amendment changes (`diff_id` PK, `ipo_id` FK, parameter, DRHP value, RHP value, % change).

### Normalization Proof
- **1NF**: Every field contains only atomic, scalar values (no array or repeating columns).
- **2NF**: All non-prime attributes are fully functionally dependent on primary keys.
- **3NF & BCNF**: Every functional dependency $X \rightarrow Y$ has $X$ as a candidate / super key. There are zero transitive dependencies between non-key attributes.

---

## 4. Analytical Reports & SQL / NoSQL Aggregations

### Report 1: Sector & Issue-Type Aggregation Report (Analog to Dept Average Salary)
```sql
SELECT 
    i.sector,
    i.sale_type,
    COUNT(i.ipo_id) AS total_ipos,
    ROUND(SUM(i.total_issue_val_cr), 2) AS total_capital_raised_cr,
    ROUND(AVG(i.total_issue_val_cr), 2) AS avg_issue_size_cr,
    ROUND(AVG(s.listing_gain_percent), 2) AS avg_listing_gain_pct
FROM ipos i
LEFT JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
GROUP BY i.sector, i.sale_type
ORDER BY total_capital_raised_cr DESC;
```

### Report 2: GMP Platform Accuracy & Reliability Leaderboard (Novelty)
```sql
SELECT 
    platform_name,
    COUNT(*) AS total_evaluated_ipos,
    ROUND(AVG(absolute_error_pct), 2) AS mean_absolute_error_pct,
    ROUND(MIN(absolute_error_pct), 2) AS best_prediction_error_pct,
    ROUND(MAX(absolute_error_pct), 2) AS worst_prediction_error_pct,
    SUM(CASE WHEN error_direction = 'Overestimated' THEN 1 ELSE 0 END) AS overestimation_count,
    SUM(CASE WHEN error_direction = 'Underestimated' THEN 1 ELSE 0 END) AS underestimation_count
FROM gmp_accuracy_eval
GROUP BY platform_name
ORDER BY mean_absolute_error_pct ASC;
```

### Report 3: Institutional Demand (QIB) vs Listing Day Discovery
```sql
SELECT 
    i.symbol,
    i.company_name,
    b.qib_subscription_times,
    b.total_subscription_times,
    s.prev_close AS issue_price,
    s.iep AS preopen_equilibrium_price,
    s.listing_gain_percent
FROM ipos i
JOIN subscription_bids b ON i.ipo_id = b.ipo_id AND b.day_number = 3
JOIN secondary_listing_metrics s ON i.ipo_id = s.ipo_id
ORDER BY b.qib_subscription_times DESC;
```

### Report 4: Anchor Investor Lock-In Capital Exposure
```sql
SELECT 
    i.symbol,
    a.lockin_period_days,
    a.lockin_expiry_date,
    COUNT(a.anchor_id) AS total_anchor_funds,
    SUM(a.shares_allocated) AS total_shares_locked,
    ROUND(SUM(a.amount_cr), 2) AS total_capital_unlocking_cr
FROM ipos i
JOIN anchor_investors a ON i.ipo_id = a.ipo_id
GROUP BY i.symbol, a.lockin_period_days, a.lockin_expiry_date
ORDER BY a.lockin_expiry_date ASC;
```

### Report 5: MongoDB Aggregation Pipeline
```javascript
db.media_and_research.aggregate([
  {
    $group: {
      _id: "$symbol",
      total_research_videos: { $sum: 1 },
      total_views: { $sum: "$view_count" },
      sentiments: { $push: "$sentiment" }
    }
  }
]);
```

---

## 5. Novelty Highlights
1. **Multi-Source GMP Aggregation & Accuracy Scoreboard**: Replaces anecdotal grey market rumors with an empirical Mean Absolute Error (MAE) benchmarking model.
2. **DRHP vs RHP Regulatory Amendment Diff Tracker**: Automates the detection of post-SEBI review adjustments (Fresh issue ratio, promoter dilution, litigation disclosures).
3. **Institutional Lock-in Expiry Timeline**: Provides early warning of upcoming 30-day and 90-day supply unlocks.

---

## 6. Conclusion
The developed system satisfies all four mandatory criteria evaluated by Prof. Smitha GR for the DBMS Lab on the 26th:
- It maintains **8 normalized relational tables** in its ER model (far exceeding the 5-table minimum).
- It successfully pairs an **ACID-compliant relational engine with a flexible MongoDB document store**.
- It provides **5 comprehensive analytical reports** demonstrating real-world complex SQL aggregations and NoSQL pipelines.
- It introduces **genuine domain-specific novelty** in financial prediction accuracy and regulatory compliance diffing.
