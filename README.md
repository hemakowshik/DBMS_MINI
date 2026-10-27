# IPOWatch Analytics: DBMS Mini Project
**Course**: Database Management Systems Lab (UE23CS252 / AIML)  
**Evaluator**: Prof. Smitha GR, Faculty of AIML, RR Campus, PES University  
**Student SRN**: PES1UG24AM106  
**Directory**: `C:\DBMS_MINI`  

---

## 🚀 Quick Start (1-Command Run)

Run the entire system in one command from PowerShell or Command Prompt:

```powershell
cd C:\DBMS_MINI
python run.py
```

This will automatically:
1. Initialize the Relational schema (8 normalized tables).
2. Populate the database with realistic seed data.
3. Seed MongoDB collections (`localhost:27017`).
4. Start the interactive web dashboard on `http://127.0.0.1:5000` and open your default browser.

### 🌟 V2 Dual-Mode Terminal (Enhanced Review Dashboard)
To run the dual-mode capital market terminal (Company-First Cockpit + Market Comparison + Clickable Source Accuracy Forensics Modal):
```powershell
cd C:\DBMS_MINI\v2_dashboard
python run_v2.py
```
*(Runs on `http://127.0.0.1:5001`. See `v2_dashboard/README_V2.md` for full architecture and documentation).*

---

## 📋 Faculty Requirements Compliance Checklist

| Evaluator Requirement | Project Implementation | File Reference |
|---|---|---|
| **1. Minimum 5 tables in ER Diagram** | **8 normalized relational tables** in BCNF (`ipos`, `ipo_reservations`, `anchor_investors`, `subscription_bids`, `secondary_listing_metrics`, `gmp_platform_records`, `gmp_accuracy_eval`, `drhp_rhp_diffs`). | `database/schema.sql`, `docs/ER_DIAGRAM.md` |
| **2. Use RDBMS + NoSQL** | **Hybrid Architecture**: Relational (MySQL / SQLite) for transactional financial bidding data + **MongoDB 8.2** for unstructured filings, AV MP4 videos, and peer matrices. | `backend/db_relational.py`, `backend/db_nosql.py`, `database/mongo_init.js` |
| **3. Reports in Project Demo** | **5 live analytical reports** executing complex SQL aggregations (`GROUP BY`, `HAVING`, `SUM`, `AVG`, `JOIN`, Window/Case logic) and MongoDB Aggregation Pipelines. | `backend/reports.py`, Dashboard Tab "Faculty Demo Reports" |
| **4. Novelty in Project** | **(1) Multi-Platform GMP Accuracy Scoreboard**: Ranks websites by Mean Absolute Error (MAE) against actual exchange listing gains.<br>**(2) DRHP vs RHP Regulatory Amendment Diff Tracker**: Surfaces structural changes post SEBI review. | `backend/seed_data.py`, Dashboard Tabs "GMP Accuracy Scoreboard" & "DRHP vs RHP Diff Tracker" |

---

## 📂 Project Directory Structure

```
C:\DBMS_MINI\
├── run.py                       # Single-command launcher (seeds DB & opens dashboard)
├── README.md                    # Project documentation & run guide
├── backend\
│   ├── app.py                   # Flask REST API server and routing
│   ├── config.py                # Database configurations & environment toggles
│   ├── db_relational.py         # Relational database manager (MySQL + SQLite fallback)
│   ├── db_nosql.py              # MongoDB client & collection handlers
│   ├── seed_data.py             # Realistic seed generator for all 8 tables + MongoDB
│   └── reports.py               # 5 advanced SQL and NoSQL aggregation reports
├── database\
│   ├── schema.sql               # MySQL/MariaDB schema with DDL, constraints & indexes
│   ├── sqlite_schema.sql        # SQLite compatible DDL schema
│   ├── mongo_init.js            # MongoDB initialization script
│   └── ipo_intelligence.db      # Pre-generated SQLite database
├── templates\
│   └── index.html               # Modern interactive terminal dashboard
├── static\
│   ├── css\style.css            # Dark financial-terminal styling
│   └── js\dashboard.js          # Dynamic UI controls, search filters & modal drilldown
└── docs\
    ├── ER_DIAGRAM.md            # Mermaid ER diagram & cardinality documentation
    ├── VIVA_VOCE_PREP.md        # Comprehensive viva voce preparation guide for 26th
    └── PROJECT_REPORT.md        # Complete academic mini project report
```

---

## 🧪 Switching Relational Engines (SQLite vs MySQL)

The system automatically runs on **SQLite** out-of-the-box for instant portability, and seamlessly connects to **MySQL Server 8.0** if preferred:

To run on MySQL:
1. Open MySQL Workbench and execute `database/schema.sql`.
2. In `backend/config.py`, set:
   ```python
   DB_ENGINE = "mysql"
   MYSQL_PASSWORD = "your_mysql_password"
   ```
3. Restart `python run.py`.

---

## 📊 Live Reports Showcase

1. **Report 1: Sector & Issue-Type Capital Aggregation**  
   *SQL:* `GROUP BY sector, sale_type`, `SUM()`, `AVG()`, `COUNT()` (Direct analog to average department salary).
2. **Report 2: Multi-Source GMP Accuracy Scoreboard**  
   *SQL:* Computes Mean Absolute Error (MAE) ranking Chittorgarh, InvestorGain, IPOWatch, and GreyMarketIndia.
3. **Report 3: Institutional Demand (QIB) vs Listing Day Discovery**  
   *SQL:* 3-table `JOIN` correlating final day QIB subscription multiples with first-day listing pop.
4. **Report 4: Anchor Lock-In Capital Exposure Report**  
   *SQL:* Highlights total shares and capital (₹ Cr) unlocking upon 30-day and 90-day expiry.
5. **Report 5: Hybrid NoSQL Sentiment vs Relational Listing Return**  
   *Hybrid:* MongoDB aggregation pipeline on YouTube research reviews correlated with SQL listing returns.
