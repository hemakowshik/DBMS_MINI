# DBMS Mini Project Viva Voce Preparation Guide
**Course**: Database Management Systems Lab (UE23CS252 / AIML)  
**Evaluator**: Prof. Smitha GR, Faculty of AIML, RR Campus, PES University  
**Project Title**: Comprehensive IPO Intelligence, Multi-Source GMP Analytics & Regulatory Tracker  
**Student SRN**: PES1UG24AM106  
**Architecture**: Polyglot Persistence (8 Normalized Relational Tables + MongoDB Document Store)  

---

## Part 1: Defense of the 4 Mandatory Evaluation Components

### Component 1: Minimum 5 Tables in ER Diagram
> **Faculty Requirement**: ER Diagram must contain at least 5 tables.  
> **Our Project**: Implements **8 fully normalized relational tables** in BCNF/3NF with foreign keys, primary keys, unique constraints, and check constraints:

1. `ipos`: Primary master entity storing core IPO offering data (ISIN, Symbol, Price Band, Issue Price, Issue Size in ₹ Cr, Dates, Lead Managers, Registrar).
2. `ipo_reservations`: Child table storing investor quota reservations (`1:N` from `ipos` - QIB 50%, NII 15%, Retail 35%, Employee).
3. `anchor_investors`: Child table tracking institutional anchor allotments (`1:N` - FII, Mutual Funds, Insurance) and lock-in period tranches (30-day and 90-day).
4. `subscription_bids`: Child table recording day-by-day bidding progress (`1:N` - Day 1, Day 2, Day 3 bidding multiples across categories).
5. `secondary_listing_metrics`: Listing session discovery table (`1:1` with `ipos` - Indicative Equilibrium Price [IEP], % listing gain, cancelled buy/sell order counts and quantities).
6. `gmp_platform_records`: Multi-source Grey Market Premium quote tracking (`1:N` - Chittorgarh, InvestorGain, IPOWatch, GreyMarketIndia).
7. `gmp_accuracy_eval` (Novelty Table): Benchmarking table comparing predicted GMP gain vs actual Day 1 listing gain to calculate Mean Absolute Error (MAE).
8. `drhp_rhp_diffs` (Novelty Table): Structural regulatory diff table recording post-SEBI review adjustments (Fresh issue upsize, OFS downsize, price ceiling adjustments).

---

### Component 2: Hybrid RDBMS + NoSQL Architecture
> **Faculty Requirement**: Must combine relational DBMS with NoSQL.  
> **Viva Question**: *"Why did you use both? Why not store everything in MySQL or everything in MongoDB?"*

**Answer**:
1. **Relational Database (MySQL / SQLite)**:
   - **Why RDBMS?** Financial transactions, quota reservations, order quantities, price discoveries, and error evaluations demand **strict ACID guarantees (Atomicity, Consistency, Isolation, Durability)**, strong entity integrity, referential integrity (`ON DELETE CASCADE`), and complex relational joins.
   - Example: An anchor investor allocation must refer to a valid `ipo_id`. If an offering is withdrawn, cascading integrity guarantees no orphan allocations remain.
2. **Document NoSQL Database (MongoDB)**:
   - **Why NoSQL?** Regulatory prospectus filings (DRHP, RHP, SEBI observation letters), multi-modal assets (audio-visual MP4 walkthrough links such as Tonbo Imaging DRHP/RHP AVs), community research videos, and industry peer matrices are **semi-structured, polymorphic, and deeply nested**.
   - MongoDB Collections:
     - `company_filings`: Stores document URLs, direct audio-visual MP4 video links, SEBI filing dates, and counsel metadata.
     - `drhp_rhp_deep_sections`: Stores unstructured textual comparisons (e.g. detailed *Objects of the Issue* and *Litigation Clauses*).
     - `media_and_research`: Curated YouTube analyst reviews with dynamic metadata (views, sentiment, key takeaways).
     - `peer_comparison_matrix`: Nested JSON arrays of competitor multiples (P/E, ROE, PAT margin, revenue) where peer attributes vary by industry.

---

### Component 3: Project Demo Reports (Aggregation Analytics)
> **Faculty Requirement**: Reports in Project Demo (e.g., Average salary of every department in company DB).  
> **Our Equivalent Reports**:

#### Report 1: Sector & Issue-Type Capital Aggregation Report
- **DBMS Concept**: `GROUP BY sector, sale_type`, `SUM()`, `AVG()`, `COUNT()`, `LEFT JOIN`
- **Query**:
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
- **Analogy to Dept Salary**: Computes average issue size and listing pop per sector and sale type, exactly how corporate databases compute average salary per department!

#### Report 2: Multi-Platform GMP Accuracy & MAE Leaderboard
- **DBMS Concept**: Aggregations with conditional `CASE` statements to evaluate algorithmic bias:
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

#### Report 3: Institutional Demand (QIB) vs Listing Day Discovery
- **DBMS Concept**: 3-Table Inner Join with Day-3 condition:
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

#### Report 4: Anchor Lock-In Capital Exposure Report
- **DBMS Concept**: Date ordering and aggregated institutional exposure:
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

#### Report 5: Hybrid NoSQL Aggregation Pipeline + SQL Cross-Correlation
- **DBMS Concept**: MongoDB Aggregation Pipeline (`$group`, `$sum`, `$push`) correlated with SQL listing returns.

---

### Component 4: Novelty in the Project (Original Engineering)
> **Faculty Requirement**: Novelty in project that is not generic / not from LLM.  
> **How to articulate our 2 Core Novelties**:

1. **Novelty 1: Multi-Platform GMP Accuracy Scoreboard (Forecasting Reliability Engine)**
   - *Problem in the market*: Retail investors rely blindly on single unofficial Grey Market Premium (GMP) websites (like Chittorgarh, InvestorGain, or IPOWatch) which are prone to syndicate manipulation and artificial hype.
   - *Our Solution*: We aggregate GMP across 4 distinct platforms, compare their final predictions against the **ACTUAL listing day closing price**, and compute a mathematical **Mean Absolute Error (MAE)**.
   - *Result*: The system ranks platforms on honesty and transparency, revealing whether a site systematically overestimates (hyping up retail) or underestimates.

2. **Novelty 2: DRHP vs RHP Regulatory Amendment Diff Tracker**
   - *Problem in the market*: Between the Draft Prospectus (DRHP) submitted to SEBI and the final Red Herring Prospectus (RHP) approved for public bidding, companies make quiet, critical structural alterations post SEBI scrutiny.
   - *Our Solution*: Our system systematically parses and displays structured diffs—such as changes in the Fresh Capital vs OFS ratio (promoter cash-out vs real growth capex), valuation multiples, and added litigation risk factors.

3. **Novelty 3: Anchor Lock-in Expiry Liquidity Shock Countdown**
   - Tracks the exact dates when the mandatory 30-day and 90-day institutional anchor lock-ins expire, alerting retail investors to massive potential supply unlocks that historically drive sharp share price dips.

---

## Part 2: Quick Reference for Standard DBMS Viva Questions

1. **What is Normalization? Which normal form is your schema in?**
   - Our relational schema is in **BCNF (Boyce-Codd Normal Form) / 3NF**.
   - Every attribute is atomic (1NF).
   - There are no partial dependencies on compound keys (2NF).
   - There are no transitive functional dependencies (3NF).
   - For every functional dependency $X \rightarrow Y$, $X$ is a superkey (BCNF).

2. **What are ACID properties? How are they guaranteed?**
   - **Atomicity**: Either all operations in a transaction succeed, or all are rolled back.
   - **Consistency**: Invariants and constraints (e.g., `CHECK (price_band_max >= price_band_min)`) are never violated.
   - **Isolation**: Concurrent transactions do not interfere; achieved via two-phase locking (2PL) or MVCC.
   - **Durability**: Committed data survives system crashes via write-ahead logging (WAL / Redo log).

3. **What is the CAP Theorem and how does MongoDB fit?**
   - CAP stands for Consistency, Availability, Partition Tolerance. A distributed system can only guarantee 2 out of 3 under network partitions.
   - MongoDB is typically configured as a **CP system** (Consistent and Partition Tolerant) using Replica Sets with a single primary node for writes.

4. **What indexes did you create and why?**
   - Indexes on `symbol`, `sector`, `listing_date`, `platform_name`, and `lockin_expiry_date`.
   - Uses **B+ Trees** in relational DB for efficient range queries ($O(\log N)$) during filtering and joins.
