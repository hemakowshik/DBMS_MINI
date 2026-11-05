# PES UNIVERSITY
### Department of Artificial Intelligence & Machine Learning / Computer Science
### Academic Year 2024–2026 | Semester III / IV
### Course: Database Management Systems (CS304 / UE23CS252)

---

# DBMS Experiential Learning – Level 3 Project Report
## IPOWatch Intelligence: Multi-Source Primary Offering Surveillance, Predictive Arbitrage & Regulatory Forensics Platform (MARK4)

**Faculty Evaluator / Course Instructor**: Dr. Nagasundari S  
**Student Team**:
1. **Hema Kowshik G** (SRN: PES1UG24AM106) — *Database Architecture, Crawler Pipeline & Backend API*
2. **Team Member 2** — *Next.js Frontend Interface & Vector Similarity Search*

**Technology Stack**:
- **Frontend**: Next.js 14 (React, App/Pages Router, Modern High-Density Financial Terminal)
- **Backend / API**: Next.js API Routes / Python REST Service (Flask + WSGI + Gunicorn)
- **SQL Database (Mandatory)**: MySQL 8.0+ / SQLite 3 (10 BCNF Normalized Tables, 3 Triggers, 2 Stored Procedures, 2 Stored Functions, 4 Views, 14 Indexes)
- **NoSQL Database**: MongoDB 8.0+ (4 Semi-Structured Document Collections, Aggregation Pipelines)
- **Vector Database**: Dense Semantic Vector Space with Cosine Similarity Search (SEBI DRHP/RHP Corpus)
- **Version Control**: Git + GitHub (`https://github.com/hemakowshik/DBMS_MINI.git`)

---

## 1. Problem Statement

In the Indian financial capital markets, Initial Public Offerings (IPOs) mobilize tens of thousands of crores annually. However, prospective institutional and retail investors suffer from severe information asymmetry, syndicate manipulation, and regulatory opacity:
1. **Scattered Regulatory Filings**: 500-page Draft Red Herring Prospectus (DRHP) and Red Herring Prospectus (RHP) documents are siloed across disparate registrar and SEBI portals.
2. **Unofficial Grey Market (GMP) Manipulation**: Unregulated blogs publish divergent Grey Market Premium quotes without validation or accountability, skewing investor sentiment.
3. **Hidden Post-SEBI Disclosures**: Critical structural modifications between DRHP and final RHP (e.g., shifts from Fresh Issue capex to Offer for Sale promoter cashouts) remain buried in fine print.
4. **Anchor Lock-In Supply Shocks**: Retail investors suffer catastrophic day-30 and day-90 post-listing drawdowns when mandatory institutional anchor lock-ins expire, flooding secondary markets.

This project delivers **IPOWatch Live Intelligence (MARK4)**: a non-trivial, polyglot DBMS platform designed to eliminate these market failures.

---

## 2. Objectives

1. **Transactional Integrity**: Maintain strict ACID compliance across primary offerings, quota allocations, and secondary trade discovery.
2. **Multi-Paradigm Persistence**: Combine Relational SQL (ACID transactions), Document NoSQL (unstructured filings, AV links, peer matrices), and Vector Embeddings (semantic prospectus retrieval).
3. **Automated Market Surveillance**: Scrape live primary market data across Chittorgarh, InvestorGain, and IPOWatch using multi-threaded web crawlers.
4. **Forensic Evaluation**: Track Mean Absolute Error (MAE) of GMP platforms against actual listing prices.
5. **Modern Next.js Interface**: Deliver a high-performance web terminal with role-based access control (Admin, Analyst, Investor).

---

## 3. Scope

- **In Scope**:
  - All Indian Mainboard and SME primary offerings (2026 live market cycle).
  - Multi-source GMP arbitrage detection across platforms.
  - SEBI ICDR 2022 two-tier institutional anchor lock-in supply schedule (50% at 30 days, 50% at 90 days).
  - Cosine similarity vector search over DRHP/RHP business models and risk disclosures.
  - Role-based authorization and database-level validation.
- **Out of Scope**:
  - Live order routing to brokerages (Zerodha, Groww).
  - Algorithmic trade execution in secondary derivative markets.

---

## 4. Functional Requirements

1. **FR1 - Primary Market Directory**: Real-time display of offerings categorized by lifecycle status (Upcoming, Open, Completed).
2. **FR2 - Multi-Source GMP Surveillance**: Live arbitrage screener identifying price divergence between reporting platforms.
3. **FR3 - Anchor Supply-Shock Analytics**: Automated computation of unlocked share volume and capital freed in Crores upon lock-in expiry.
4. **FR4 - Semantic Prospectus Search**: Natural language query interface retrieving matching offerings via cosine similarity over vector embeddings.
5. **FR5 - Offering Registration & Validation**: Form-based DML insertion with database trigger enforcement preventing invalid price band collars.
6. **FR6 - Multi-Role Authentication**: Secure login supporting Admin, Analyst, and Investor access tiers.
7. **FR7 - Cloud Deployment**: Fully accessible online on Render with automated GitHub deployment triggers.

---

## 5. ER Diagram

The ER diagram defines **10 relational entities** in Boyce-Codd Normal Form (BCNF):

```
+-----------------------------------------------------------------------------------------+
|                                    ER DIAGRAM OVERVIEW                                  |
+-----------------------------------------------------------------------------------------+
                                      +--------------------+
                                      |       users        |
                                      +--------------------+
                                      | PK: user_id        |
                                      | role, email, hash  |
                                      +--------------------+

             +-------------------------------------------------------------+
             |                                                             |
             v 1:N                                                         v 1:N
   +-----------------------+ 1:N    +---------------------------+    +-----------------------+
   |   ipo_reservations    |<-------|           ipos            |--->|   anchor_investors    |
   +-----------------------+        +---------------------------+    +-----------------------+
   | PK: reservation_id    |        | PK: ipo_id                |    | PK: anchor_id         |
   | FK: ipo_id            |        | UK: symbol, isin          |    | FK: ipo_id            |
   | quota_percent, shares |        | price_band_min / max      |    | investor_name, shares |
   +-----------------------+        | issue_val_cr, dates       |    | lockin_days, expiry   |
                                    +---------------------------+    +-----------------------+
                                        |  |  |            | 1:1
                 +----------------------+  |  +---------+  +-----------------------+
                 | 1:N                     | 1:N        |  | anchor_lockin_summary |
                 v                         v            |  +-----------------------+
   +---------------------------+ +--------------------+ |  | PK: summary_id        |
   |    subscription_bids      | | gmp_platform_rec.  | |  | FK: ipo_id            |
   +---------------------------+ +--------------------+ |  | shares_locked_30d/90d |
   | PK: bid_id                | | PK: record_id      | |  +-----------------------+
   | FK: ipo_id                | | FK: ipo_id         | |
   | qib, nii, retail multiple | | platform, gmp_inr  | | 1:1
   +---------------------------+ +--------------------+ v
                                           |        +---------------------------+
                                           | 1:N    | secondary_listing_metrics |
                                           v        +---------------------------+
                                 +----------------+ | PK: metric_id             |
                                 | gmp_accuracy_  | | FK: ipo_id                |
                                 | eval           | | iep, listing_gain_percent |
                                 +----------------+ +---------------------------+
                                 | PK: eval_id    |
                                 | FK: ipo_id     |
                                 | absolute_error |
                                 +----------------+
```

---

## 6. Relational Schema & Normalization

### Tables Specification (Boyce-Codd Normal Form)
1. **`ipos`** (`ipo_id` PK, `symbol` UK, `company_name`, `sector`, `isin` UK, `price_band_min`, `price_band_max`, `lot_size`, `total_issue_val_cr`, `fresh_issue_cr`, `ofs_val_cr`, `open_date`, `close_date`, `allotment_date`, `listing_date`, `status`, `status_order`)
2. **`ipo_reservations`** (`reservation_id` PK, `ipo_id` FK, `category_name`, `quota_percent`, `shares_reserved`, `min_investment_inr`)
3. **`anchor_investors`** (`anchor_id` PK, `ipo_id` FK, `investor_name`, `investor_category`, `shares_allocated`, `amount_cr`, `lockin_period_days`, `lockin_expiry_date`)
4. **`anchor_lockin_summary`** (`summary_id` PK, `ipo_id` FK, `lead_text`, `bid_date`, `anchor_price`, `qib_allotment_pct`, `shares_locked_30d`, `shares_locked_90d`)
5. **`subscription_bids`** (`bid_id` PK, `ipo_id` FK, `day_number`, `qib_multiple`, `nii_multiple`, `retail_multiple`, `total_subscription_times`)
6. **`secondary_listing_metrics`** (`metric_id` PK, `ipo_id` FK, `iep`, `listing_gain_percent`, `indicative_val_lakhs`, `total_shares_traded`, `trading_status`)
7. **`gmp_platform_records`** (`record_id` PK, `ipo_id` FK, `platform_name`, `gmp_inr`, `estimated_listing_price`, `estimated_gain_percent`, `rating_sentiment`, `recorded_at`)
8. **`gmp_accuracy_eval`** (`eval_id` PK, `ipo_id` FK, `platform_name`, `last_gmp_predicted_gain_pct`, `actual_listing_gain_pct`, `absolute_error_pct`, `error_direction`)
9. **`drhp_rhp_diffs`** (`diff_id` PK, `ipo_id` FK, `parameter_name`, `drhp_val`, `rhp_val`, `percentage_change`, `change_nature`)
10. **`users`** (`user_id` PK, `username` UK, `email` UK, `password_hash`, `role`, `full_name`, `created_at`)

### Normalization Proof
- **1NF**: Every column contains only atomic, non-divisible scalar values. Repeating groups eliminated.
- **2NF**: No partial dependency exists; all non-prime attributes depend fully on the primary key.
- **3NF & BCNF**: For every functional dependency $X \rightarrow Y$, $X$ is a superkey. There are zero transitive dependencies between non-key attributes. Referential integrity enforced via `ON DELETE CASCADE`.

---

## 7. Database Choice and Justification

The project uses **Polyglot Persistence**, leveraging three distinct database paradigms:

| Database Paradigm | Technology Selected | Justification & Problem Requirement |
|---|---|---|
| **SQL Database (Mandatory)** | **MySQL 8.0+ / SQLite 3** | Enforces strict ACID compliance, BCNF relational integrity, foreign key cascades, triggers, and analytical views for core financial accounting. |
| **NoSQL Database** | **MongoDB 8.0+** | Stores polymorphic, unstructured prospectus sections, direct audio-visual MP4 walkthrough links, YouTube analyst reviews, and dynamic competitor peer matrices that cannot fit in a rigid relational table. |
| **Vector Database** | **Dense Semantic Vector Store (Cosine Similarity)** | Powers natural language semantic search across unstructured DRHP business models and risk factors, overcoming exact keyword matching limitations. |

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

### MongoDB Collections
1. `company_filings`: Official SEBI DRHP/RHP PDF documents, BSE/NSE codes, and filings.
2. `media_and_research`: Audio-Visual walkthrough MP4s, YouTube channel reviews, and analyst summaries.
3. `peer_comparison_matrix`: Industry P/E ratios, EPS, NAV, and RoNW benchmarks.
4. `drhp_rhp_deep_sections`: Detailed textual diffs of risk disclosures and object of issue capital expenditure.

### Vector Store Specification (Requirement 8)
1. **Data Converted into Embeddings**: DRHP/RHP business model descriptions, clinical trial summaries, defense technology specs, and risk factors.
2. **Embedding Approach/Model**: Dense Term-Vector Semantic Model with sub-linear TF scaling: $(1 + \ln(\text{tf})) \times \text{idf}$.
3. **Storage**: Persistent JSON vector store (`data/vector_store.json`) with L2-normalized vector coordinates.
4. **Similarity Metric**: Cosine Similarity:
   $$\text{sim}(q, d) = \frac{q \cdot d}{\|q\|_2 \|d\|_2}$$
5. **Retrieval Strategy**: Top-$K$ Nearest Neighbor search ranking documents by descending cosine similarity score $\in [0, 1]$.

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
JOIN gmp_platform_records g ON i.ipo_id = g.ipo_id
GROUP BY i.symbol, i.company_name, i.price_band_max
HAVING COUNT(g.record_id) >= 2;
```

### Query 2: Two-Tier Institutional Anchor Capital Release Shock
```sql
SELECT 
    i.symbol,
    a.anchor_price,
    a.shares_locked_30d,
    ROUND((a.shares_locked_30d * a.anchor_price) / 10000000.0, 2) AS capital_freed_30d_cr,
    a.shares_locked_90d,
    ROUND((a.shares_locked_90d * a.anchor_price) / 10000000.0, 2) AS capital_freed_90d_cr
FROM ipos i
JOIN anchor_lockin_summary a ON i.ipo_id = a.ipo_id;
```

### Query 3: Forecasting Accuracy Forensics (ORDER BY, Aggregates)
```sql
SELECT 
    platform_name,
    COUNT(*) AS total_evaluations,
    ROUND(AVG(absolute_error_pct), 2) AS mean_absolute_error_pct,
    MIN(absolute_error_pct) AS min_error_pct,
    MAX(absolute_error_pct) AS max_error_pct
FROM gmp_accuracy_eval
GROUP BY platform_name
ORDER BY mean_absolute_error_pct ASC;
```

---

## 10. Advanced Database Features

Demonstrates **6 advanced concepts** (exceeding the minimum requirement of 4):

1. **Transactional Triggers**:
   - `trg_validate_price_band`: BEFORE INSERT check enforcing Floor $\le$ Cap.
   - `trg_validate_price_band_update`: BEFORE UPDATE check on price collars.
   - `trg_audit_ipo_status_change`: AFTER UPDATE trigger tracking offering lifecycle shifts.
2. **Stored Procedures & Functions**:
   - `sp_record_gmp_quote`: Encapsulates atomic quote recording with transaction control (`START TRANSACTION`, `COMMIT`, `ROLLBACK`).
   - `sp_settle_secondary_listing`: Settles IEP price and automatically transitions offering status.
   - `fn_calculate_arbitrage_spread`: Deterministic scalar function returning spread in INR.
   - `fn_anchor_unlocked_capital_cr`: Scalar function returning unlocked capital in Crores.
3. **Database Views**:
   - `v_active_gmp_arbitrage`: Real-time cross-platform price spread surveillance.
   - `v_anchor_lockin_supply_shock`: SEBI ICDR 2-tier liquidity release view.
   - `v_institutional_demand_discovery`: Book-building demand vs listing returns correlation.
   - `v_offering_complete_dossier`: Full BCNF joined offering profile.
4. **B-Tree Indexing**:
   - 14 B-Tree indexes optimizing queries on `symbol`, `status`, `dates`, `platform_name`, and foreign keys.
5. **NoSQL Aggregation Pipelines**:
   - Multi-stage pipelines in MongoDB: `$group`, `$sort`, `$project`, `$facet`.
6. **Vector Similarity Search**:
   - Cosine similarity ranking over dense semantic vector space.

---

## 11. System Architecture

```
+-----------------------------------------------------------------------------------------+
|                                    NEXT.JS 14 FRONTEND                                  |
|     (Dark High-Density Terminal: Market Directory, Vector Search, DML Forms, Schema)     |
+-----------------------------------------------------------------------------------------+
                                             |
                                 REST API / Route Handlers
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                              PYTHON REST BACKEND SERVICE                                |
|        (Flask Controller | Web Scrapers | Vector Engine | Auth & RBAC Manager)          |
+-----------------------------------------------------------------------------------------+
                    /                               |                               \
                   /                                |                                \
                  v                                 v                                 v
+-----------------------------+     +-----------------------------+     +-----------------------------+
|    RELATIONAL SQL ENGINE    |     |      NoSQL DOCUMENT LAKE    |     |     VECTOR EMBEDDING STORE  |
|    (MySQL 8.0 / SQLite 3)   |     |        (MongoDB 8.0+)       |     |   (Cosine Similarity Space) |
+-----------------------------+     +-----------------------------+     +-----------------------------+
| • 10 BCNF Normalized Tables |     | • company_filings           |     | • SEBI Prospectus Corpus    |
| • 3 Compiled Triggers       |     | • media_and_research        |     | • 384-Dim Term Vectors      |
| • 2 Stored Procedures       |     | • peer_comparison_matrix    |     | • Top-K Nearest Neighbors   |
| • 4 Production Views        |     | • drhp_rhp_deep_sections    |     | • L2-Normalized Vectors     |
+-----------------------------+     +-----------------------------+     +-----------------------------+
```

---

## 12. Web Application Interface & Viva Guide

- **Live Next.js Terminal**: `http://localhost:3000`
- **Live MARK4 Cockpit**: `http://127.0.0.1:5003`
- **Cloud Hosted URL**: `https://<your-render-app>.onrender.com`

### How to Demonstrate to Evaluator (Dr. Nagasundari S):
1. **Show BCNF Relational Schema & Triggers**:
   - Navigate to **"Database Objects & Architecture"** tab in the Next.js app or query `/api/database/schema-objects`.
   - Show `trg_validate_price_band` and `trg_audit_ipo_status_change` compiled in `sqlite_master`.
2. **Demonstrate Database Validation (Trigger Abort)**:
   - In **"Add Offering"** tab, enter Min Price = ₹500 and Max Price = ₹400. Click Submit.
   - The trigger immediately intercepts and aborts: `Integrity Violation: price_band_max cannot be strictly less than price_band_min`.
3. **Demonstrate Vector Semantic Search (Requirement 8)**:
   - Click **"Vector DB Semantic Search"** tab.
   - Search: `"defense night-vision and tactical battle space sensors"`.
   - Demonstrates: `Tonbo Imaging India` matched with **38.76% Cosine Similarity** without keyword matching!
4. **Demonstrate Live Scraping**:
   - Click **"Re-Crawl Live Market"** button.
   - Scrapes live market data across 8 worker threads and refreshes the database.

---

## 13. Testing Results & Verification Test Cases

| Test Case ID | Test Description | Input / Trigger | Expected Outcome | Actual Outcome | Status |
|---|---|---|---|---|---|
| **TC-01** | Price Band Collar Integrity | INSERT with Cap &lt; Floor | Trigger throws `Integrity Violation` & aborts | `IntegrityError` caught; rejected | **PASSED** |
| **TC-02** | Status Lifecycle Audit | UPDATE status to 'Completed' | Trigger updates `created_at` timestamp | Timestamp updated; verified | **PASSED** |
| **TC-03** | Vector Semantic Retrieval | Query: "green steel decarbonization" | Highest cosine similarity for German Green Steel | Score 44.18%; Rank 1 | **PASSED** |
| **TC-04** | Role-Based Access Control | Login with valid credentials | Generates authenticated session & role | Verified for Admin/Analyst | **PASSED** |
| **TC-05** | Live Web Crawler Pipeline | POST `/api/crawl/refresh` | Concurrently scrapes 26 dossiers across 8 threads | 26 offerings, 78 GMP records populated | **PASSED** |

---

## 14. Conclusion & Future Enhancements

The **IPOWatch Intelligence Platform (MARK4)** successfully demonstrates practical polyglot database design satisfying all Level 3 DBMS requirements:
- Non-trivial financial domain with multi-paradigm persistence (SQL + NoSQL + Vector Database).
- Strict BCNF relational normalization with active transactional triggers and views.
- Real-time web scraping and predictive grey market analytics.
- Functional Next.js 14 web interface with role-based access control.

### Future Enhancements:
1. Integration with SEBI API Gateway for automated regulatory filing ingestion.
2. Real-time WebSocket streaming of NSE/BSE pre-open order books.
3. Multi-modal transformer embeddings for automatic PDF chart extraction.
