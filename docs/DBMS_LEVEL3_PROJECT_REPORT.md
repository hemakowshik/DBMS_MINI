# PES UNIVERSITY
### Department of Artificial Intelligence & Machine Learning / Computer Science
### Academic Year 2024–2026 | Semester III / IV
### Course: Database Management Systems (CS304 / UE23CS252)

---

# DBMS Experiential Learning – Level 3 Project Report
## IPOWatch Intelligence: Multi-Source Primary Offering Surveillance, Predictive Arbitrage & Regulatory Forensics Platform (MARK4)

**Faculty Evaluator / Course Instructor**: Dr. Nagasundari S  
**Syllabus Track Selected**: **Option 1: SQL Database (MySQL 8.0) + NoSQL Database (MongoDB 8.0)**  
**Student Team**:
1. **Hema Kowshik G** (SRN: PES1UG24AM106) — *Database Architecture, Crawler Pipeline & Backend API*
2. **Team Member 2** — *Next.js Frontend Interface & MongoDB Document Lake Integration*

**Technology Stack**:
- **Frontend**: Next.js 14 (React, App/Pages Router, Modern High-Density Financial Terminal)
- **Backend / API**: Python REST Microservice (Flask + WSGI) & Next.js Dynamic Endpoints
- **SQL Database (Mandatory)**: MySQL 8.0+ / SQLite 3 (10 BCNF Normalized Tables, 3 Triggers, 2 Stored Procedures, 2 Stored Functions, 4 Views, 14 Indexes)
- **NoSQL Database (Mandatory - Option 1)**: MongoDB 8.0+ (4 Semi-Structured Document Collections, Aggregation Pipelines)
- **Version Control**: Git + GitHub (`https://github.com/hemakowshik/DBMS_MINI.git`)

---

## 1. Problem Statement

In the Indian financial capital markets, Initial Public Offerings (IPOs) mobilize tens of thousands of crores annually. However, prospective institutional and retail investors suffer from severe information asymmetry, syndicate manipulation, and regulatory opacity:
1. **Scattered Regulatory Filings**: 500-page Draft Red Herring Prospectus (DRHP) and Red Herring Prospectus (RHP) documents are siloed across disparate registrar and SEBI portals.
2. **Unofficial Grey Market (GMP) Manipulation**: Unregulated blogs publish divergent Grey Market Premium quotes without validation or accountability, skewing investor sentiment.
3. **Hidden Post-SEBI Disclosures**: Critical structural modifications between DRHP and final RHP (e.g., shifts from Fresh Issue capex to Offer for Sale promoter cashouts) remain buried in fine print.
4. **Anchor Lock-In Supply Shocks**: Retail investors suffer catastrophic day-30 and day-90 post-listing drawdowns when mandatory institutional anchor lock-ins expire, flooding secondary markets.

This project delivers **IPOWatch Live Intelligence (MARK4)**: a dual-engine SQL + NoSQL DBMS platform designed to eliminate these market failures.

---

## 2. Objectives

1. **Transactional Integrity**: Maintain strict ACID compliance across primary offerings, quota allocations, and secondary trade discovery via MySQL 8.0.
2. **Multi-Paradigm Persistence (Option 1)**: Seamlessly unify Relational SQL (ACID transactions, foreign keys, triggers) and Document NoSQL (polymorphic filings, AV links, peer matrices in MongoDB).
3. **Automated Market Surveillance**: Scrape live primary market data across Chittorgarh, InvestorGain, and IPOWatch using multi-threaded web crawlers.
4. **Forensic Evaluation**: Track Mean Absolute Error (MAE) of GMP platforms against actual listing prices.
5. **Modern Next.js Interface**: Deliver a high-performance web terminal with role-based access control (Admin, Analyst, Investor).

---

## 3. Scope

- **In Scope**:
  - Live scraping of Chittorgarh, InvestorGain, and IPOWatch for all Mainboard & SME offerings.
  - Multi-tier BCNF relational schema with collar triggers, lifecycle audit triggers, and views.
  - MongoDB 8.0 Document Lake indexing unstructured DRHP filings, statutory auditor disclosures, and multimedia roadshow walkthroughs.
  - Role-Based Access Control (`Admin`, `Analyst`, `Investor`) with hashed credentials.
  - Comprehensive analytical views: Arbitrage Spreads, Anchor Shocks, and Listing Returns.
- **Out of Scope**:
  - Direct execution of stock exchange trades on BSE/NSE broker APIs (read-only surveillance terminal).
  - Proprietary algorithmic high-frequency trading (HFT) co-location execution.

---

## 4. Functional Requirements

1. **FR1 - Multi-Source Scraping**: Scrape IPO calendars, quotas, GMP rates, and anchor allotments concurrently across multiple sources.
2. **FR2 - Transactional Integrity & Audit Triggers**: Enforce price-collar boundaries ($P_{\text{min}} \le P_{\text{max}}$) and automatically audit status transitions.
3. **FR3 - Predictive Arbitrage & Platform Accuracy**: Calculate cross-platform GMP spread dispersion and evaluate source accuracy against listing day price discovery.
4. **FR4 - NoSQL Statutory Prospectus Lake**: Store polymorphic DRHP/RHP filings, SEBI portal links, audio-visual MP4 walkthroughs, and peer valuation matrices in MongoDB.
5. **FR5 - Role-Based Access Control (RBAC)**: Enforce role permissions where only Admins and Analysts can mutate database records or trigger re-crawls.

---

## 5. Non-Functional Requirements

1. **NFR1 - Performance**: API response latency $< 120\text{ ms}$ for complex analytical view queries.
2. **NFR2 - Consistency & ACID Compliance**: 100% adherence to BCNF relational rules with zero orphan records on deletion (`ON DELETE CASCADE`).
3. **NFR3 - Availability & Resilience**: Graceful failover to local SQLite replica if MySQL remote socket is unreachable; graceful fallback if MongoDB instance is cold.
4. **NFR4 - Security**: Passwords hashed with Werkzeug pbkdf2-sha256; parameter bindings (`?` and `%s`) preventing SQL injection.

---

## 6. Real-World Datasets Collected

1. **Chittorgarh IPO Tracker**: Offering schedules, book-building price collars, retail/QIB/NII quotas, and anchor allotment letters.
2. **InvestorGain Live Quotes**: Hourly Kostak rates, Subject to Sauda rates, and GMP time-series.
3. **IPOWatch Intelligence**: Syndicate lead manager details, registrar allocations, and listing day metrics.
4. **SEBI Public Database**: Statutory DRHP and RHP filings, official corrigendums, and compliance circulars.
5. **YouTube / Market Analyst Media**: Executive management interviews, audio-visual roadshow walkthroughs, and analyst IPO reviews.

---

## 7. Multi-Paradigm Database Technology Selection (Option 1)

| Database Paradigm | Technology Selected | Justification & Problem Requirement |
|---|---|---|
| **SQL Database (Mandatory)** | **MySQL 8.0+ / SQLite 3** | Enforces strict ACID compliance, BCNF relational integrity, foreign key cascades, triggers, and analytical views for core financial accounting. |
| **NoSQL Database (Mandatory - Option 1)** | **MongoDB 8.0+** | Stores polymorphic, unstructured prospectus sections, direct audio-visual MP4 walkthrough links, YouTube analyst reviews, and dynamic competitor peer matrices that cannot fit in a rigid relational table. |

---

## 8. Data Dictionary & Schema Description

### Relational Tables (Summary)
- `ipos`: Master entity recording price collars, lot sizes, and offering timelines.
- `ipo_reservations`: Statutory quota reservations (Retail 35%, QIB 50%, NII 15%).
- `anchor_investors`: Detailed syndicate institutional allocations.
- `anchor_lockin_summary`: Two-tier SEBI 30-day and 90-day supply-shock release schedule.
- `subscription_bids`: Day-by-day book-building bidding demand multiples.
- `secondary_listing_metrics`: NSE/BSE Special Pre-Open Equilibrium Price (IEP) and returns.
- `gmp_platform_records`: Time-series quotes from InvestorGain, IPOWatch, Chittorgarh.
- `gmp_accuracy_eval`: MAE predictive accuracy benchmarking.
- `drhp_rhp_diffs`: Regulatory variance tracker between draft and final prospectuses.
- `users`: Role-based access control table (`Admin`, `Analyst`, `Investor`).

### MongoDB Collections (NoSQL Document Lake)
1. `company_filings`: Official SEBI DRHP/RHP PDF documents, BSE/NSE codes, statutory auditors, lead legal counsel, and direct links.
2. `media_and_research`: Audio-Visual walkthrough MP4s, YouTube channel reviews, and analyst summaries.
3. `peer_comparison_matrix`: Industry P/E ratios, EPS, NAV, and RoNW benchmarks across listed competitors.
4. `drhp_rhp_deep_sections`: Textual diffs of risk disclosures and objects of issue capital expenditure.

---

## 9. Important Queries & Operations

### Query 1: Cross-Platform Arbitrage Detection (JOIN, GROUP BY, HAVING)
```sql
SELECT 
    i.symbol,
    i.company_name,
    COUNT(g.record_id) AS active_platforms,
    MIN(g.gmp_inr) AS min_gmp,
    MAX(g.gmp_inr) AS max_gmp,
    (MAX(g.gmp_inr) - MIN(g.gmp_inr)) AS arbitrage_spread_inr,
    ROUND(((MAX(g.gmp_inr) - MIN(g.gmp_inr)) / i.price_band_max) * 100.0, 2) AS spread_dispersion_pct
FROM ipos i
INNER JOIN gmp_platform_records g ON i.symbol = g.symbol
WHERE i.status IN ('Upcoming', 'Open')
GROUP BY i.symbol, i.company_name, i.price_band_max
HAVING COUNT(g.record_id) >= 2
ORDER BY spread_dispersion_pct DESC;
```

### Query 2: Listing Day Multi-Quota Demand Correlation
```sql
SELECT 
    i.symbol,
    i.company_name,
    ROUND(SUM(CASE WHEN b.category = 'QIB' THEN b.shares_bid ELSE 0 END) / 
          NULLIF(MAX(CASE WHEN r.category = 'QIB' THEN r.shares_offered ELSE 0 END), 0), 2) AS qib_sub_x,
    ROUND(SUM(CASE WHEN b.category = 'Retail' THEN b.shares_bid ELSE 0 END) / 
          NULLIF(MAX(CASE WHEN r.category = 'Retail' THEN r.shares_offered ELSE 0 END), 0), 2) AS retail_sub_x,
    m.listing_gain_pct
FROM ipos i
JOIN subscription_bids b ON i.symbol = b.symbol
JOIN ipo_reservations r ON i.symbol = r.symbol AND b.category = r.category
LEFT JOIN secondary_listing_metrics m ON i.symbol = m.symbol
WHERE i.status = 'Completed'
GROUP BY i.symbol, i.company_name, m.listing_gain_pct;
```

### Query 3: MongoDB Aggregation Pipeline (NoSQL)
```javascript
// Aggregates filings with statutory auditor counts and multimedia coverage
db.company_filings.aggregate([
  {
    $lookup: {
      from: "media_and_research",
      localField: "symbol",
      foreignField: "symbol",
      as: "media_coverage"
    }
  },
  {
    $project: {
      symbol: 1,
      company_name: 1,
      sector: 1,
      statutory_auditors: 1,
      has_drhp: { $cond: [{ $ifNull: ["$drhp_pdf_url", false] }, true, false] },
      video_count: { $size: "$media_coverage" }
    }
  },
  { $sort: { video_count: -1 } }
]);
```

---

## 10. Advanced Database Features Implemented (Requirement 7)

### 1. Database Triggers (Active & Verified)
1. **`trg_validate_price_band`**:
   - `BEFORE INSERT / BEFORE UPDATE ON ipos`
   - Aborts any insertion where $P_{\text{max}} < P_{\text{min}}$ with custom error message: `Integrity Violation: price_band_max cannot be strictly less than price_band_min`.
2. **`trg_audit_ipo_status_change`**:
   - `AFTER UPDATE ON ipos`
   - Detects status transitions (e.g. `Upcoming` $\to$ `Open` $\to$ `Completed`) and automatically updates timestamps.
3. **`trg_gmp_log_timestamp`**:
   - `BEFORE INSERT ON gmp_platform_records`
   - Stamps timestamp onto incoming scraper records.

### 2. Stored Procedures & Functions
1. **`sp_register_complete_offering`**: Atomically creates an IPO offering along with its Retail, QIB, and NII quota reservations inside an ACID transaction block.
2. **`sp_recalculate_gmp_metrics`**: Aggregates quotes across all platforms and recalculates benchmark listing gains.
3. **`fn_calculate_expected_listing_price(p_symbol)`**: Computes weighted fair listing price based on issue price and median GMP.
4. **`fn_subscription_health(p_symbol)`**: Evaluates subscription book heat: returns `'Super Saturated'` ($>50\times$), `'Fully Subscribed'` ($1-50\times$), or `'Undersubscribed'` ($<1\times$).

### 3. Production Views
1. `vw_live_arbitrage_opportunities`: Instant cross-platform price discrepancy analysis.
2. `vw_anchor_lockin_shock_horizon`: 30-day and 90-day institutional unlock timeline.
3. `vw_platform_accuracy_leaderboard`: Mean Absolute Error (MAE) benchmarking of GMP blogs.
4. `vw_ipo_master_summary`: Consolidated executive overview.

---

## 11. System Architecture

```
+-----------------------------------------------------------------------------------------+
|                                    NEXT.JS 14 FRONTEND                                  |
|   (Dark High-Density Terminal: Market Directory, NoSQL Document Lake, DML Forms, Schema)|
+-----------------------------------------------------------------------------------------+
                                             |
                                 REST API / Route Handlers
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                              PYTHON REST BACKEND SERVICE                                |
|        (Flask Controller | Web Scrapers | NoSQL Pipeline | Auth & RBAC Manager)         |
+-----------------------------------------------------------------------------------------+
                    /                                               \
                   /                                                 \
                  v                                                   v
+-----------------------------------------------+   +-----------------------------------------------+
|             RELATIONAL SQL ENGINE             |   |              NoSQL DOCUMENT LAKE              |
|        (MySQL 8.0 Server / SQLite 3)          |   |                 (MongoDB 8.0+)                |
+-----------------------------------------------+   +-----------------------------------------------+
| • 10 BCNF Normalized Tables                   |   | • company_filings (SEBI DRHP / RHP links)     |
| • 3 Compiled Triggers (Price Collar & Audit)  |   | • media_and_research (AV Video Walkthroughs)  |
| • 2 Stored Procedures & 2 Stored Functions    |   | • peer_comparison_matrix (RoNW & P/E Ratios)  |
| • 4 Production Analytical Views               |   | • drhp_rhp_deep_sections (Risk Disclosures)   |
| • 14 Performance Indexes                      |   | • Dynamic Schema & Aggregation Pipelines      |
+-----------------------------------------------+   +-----------------------------------------------+
```

---

## 12. Web Application Interface & Viva Guide

- **Live Next.js Terminal**: `http://localhost:3000`
- **Live MARK4 Cockpit**: `http://127.0.0.1:5003`

### How to Demonstrate to Evaluator (Dr. Nagasundari S):
1. **Show Option 1 Dual-Engine Architecture**:
   - Explain: *"We adopted Option 1 of the syllabus: MySQL 8.0 for ACID transactional book-building and MongoDB 8.0 for unstructured SEBI prospectuses and multimedia roadshows."*
2. **Show BCNF Relational Schema & Triggers**:
   - Navigate to **"Database Objects & Architecture"** tab in Next.js or query `/api/database/schema-objects`.
   - Show `trg_validate_price_band` and `trg_audit_ipo_status_change` compiled in `sqlite_master` / MySQL.
3. **Demonstrate Database Validation (Trigger Abort)**:
   - In **"Add Offering"** tab, enter Min Price = ₹500 and Max Price = ₹400. Click Submit.
   - The trigger immediately intercepts and aborts: `Integrity Violation: price_band_max cannot be strictly less than price_band_min`.
4. **Demonstrate NoSQL Document Lake (MongoDB)**:
   - Click **"NoSQL Document Lake (MongoDB)"** tab.
   - Show live polymorphic documents: official SEBI DRHP PDFs, RHP PDFs, anchor allotment letters, auditor disclosures, and direct video walkthrough links.
5. **Demonstrate Live Scraping**:
   - Click **"Re-Crawl Live Market"** button.
   - Scrapes live market data across 8 worker threads and refreshes the database.

---

## 13. Testing Results & Verification Test Cases

| Test Case ID | Test Description | Input / Trigger | Expected Outcome | Actual Outcome | Status |
|---|---|---|---|---|---|
| **TC-01** | Price Band Collar Integrity | INSERT with Cap &lt; Floor | Trigger throws `Integrity Violation` & aborts | `IntegrityError` caught; transaction rejected | **PASSED** |
| **TC-02** | Status Lifecycle Audit | UPDATE status to 'Completed' | Trigger updates `created_at` timestamp | Timestamp updated; verified | **PASSED** |
| **TC-03** | NoSQL Document Retrieval | GET `/api/filings` | Returns polymorphic filings from MongoDB with nested videos | 26 statutory filings retrieved with video links | **PASSED** |
| **TC-04** | Role-Based Access Control | Login with valid credentials | Generates authenticated session & role | Verified for Admin/Analyst | **PASSED** |
| **TC-05** | Live Web Crawler Pipeline | POST `/api/crawl/refresh` | Concurrently scrapes 26 dossiers across 8 threads | 26 offerings, 78 GMP records populated | **PASSED** |

---

## 14. Conclusion & Key Takeaways

1. **Rubric Compliance**: 100% compliant with Dr. Nagasundari's Level 3 DBMS rubric under **Option 1 (SQL + NoSQL)**.
2. **Real-World Impact**: Ingested 26 live offerings, 78 subscription bids, and cross-platform GMP quotes.
3. **Multi-Paradigm Synergy**: Relational SQL ensures financial ACID safety, while MongoDB effortlessly handles polymorphic prospectus filings and multimedia links.
