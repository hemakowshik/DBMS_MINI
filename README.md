# IPOWatch Live Intelligence: DBMS Experiential Learning (Level 3 Project)
**Course**: Database Management Systems (CS304 / UE23CS252)  
**Faculty Evaluator / Course Instructor**: Dr. Nagasundari S, Department of AIML / CSE, PES University  
**Student Team**:
1. **Hema Kowshik G** (SRN: PES1UG24AM106)
2. **Team Member 2**  
**Repository**: `https://github.com/hemakowshik/DBMS_MINI.git`  
**Target Directory**: `C:\DBMS_MINI`

---

## 🌟 Architecture & Paradigm Compliance (Level 3 Rubric)

| Rubric Requirement | Implementation in MARK4 Platform | Reference Code / Object |
|---|---|---|
| **SQL Database (Mandatory)** | **MySQL 8.0+ / SQLite 3**: 10 BCNF tables, 3 Triggers, 2 Stored Procedures, 2 Stored Functions, 4 Views, 14 B-Tree Indexes. | `database/sql/00_mysql_master_deploy.sql`, `mark4/database/schema_live.sql` |
| **NoSQL Database** | **MongoDB 8.0+**: 4 Collections (`company_filings`, `media_and_research`, `peer_comparison_matrix`, `drhp_rhp_deep_sections`). | `mark4/database/mongodb/` |
| **Vector Database (Requirement 8)** | **Cosine Similarity Vector Store**: Semantic retrieval across unstructured DRHP/RHP Prospectus corpus. | `mark4/backend/vector_engine.py`, `/api/vector-search` |
| **Web Frontend (Requirement 9)** | **Next.js 14 Web Application**: High-performance financial terminal with Role-Based Access Control, live market tables, and interactive DML forms. | `frontend_nextjs/` (`http://localhost:3000`) |
| **Advanced Features (Req 7)** | **Transactions, Views, Stored Procedures, Triggers, Indexes, Vector Similarity, NoSQL Aggregation** (7 features). | `database/sql/05_stored_procedures_functions.sql` |
| **Auth & Security (Req 11, 13)** | **PBKDF2/SHA-256 Hashed Passwords**, Role-Based Access Control (`Admin`, `Analyst`, `Investor`), `.env` environment isolation. | `users` table, `/api/auth/login`, `.env.example` |

---

## 🚀 Quick Execution Guide

### 1. Launch Next.js Web Frontend (Port 3000)
```powershell
cd C:\DBMS_MINI\frontend_nextjs
npm run dev
```
*Opens interactive Next.js Terminal on `http://localhost:3000`.*

### 2. Launch MARK4 Backend & Python Live Cockpit (Port 5003)
```powershell
cd C:\DBMS_MINI
python mark4/run_mark4.py
```
*Opens MARK4 Live Cockpit on `http://127.0.0.1:5003`.*

### 3. Run Stand-Alone Live Market Scraper
```powershell
python C:\DBMS_MINI\mark4\crawl_now.py
```
*Concurrently scrapes 26 primary market offerings across 8 threads and updates both SQL & MongoDB.*

### 4. Deploy Relational Database in MySQL 8.0
```powershell
# In MySQL Workbench or MySQL CLI:
mysql -u root -p < C:\DBMS_MINI\database\sql\00_mysql_master_deploy.sql
```

---

## 🧪 Viva Demonstration Guide for Dr. Nagasundari S

1. **Demonstrate Active Database Triggers**:
   - Query live schema objects via browser: [`http://127.0.0.1:5003/api/database/schema-objects`](http://127.0.0.1:5003/api/database/schema-objects).
   - Proves `trg_validate_price_band` and `trg_audit_ipo_status_change` are active inside `sqlite_master`.
2. **Demonstrate Database Constraint Enforcement**:
   - In Next.js app ("Add Offering" tab) or via curl: enter Min Price = ₹500 and Max Price = ₹400.
   - The trigger aborts with: `Integrity Violation: price_band_max cannot be strictly less than price_band_min`.
3. **Demonstrate Vector Semantic Search (Requirement 8)**:
   - Go to "Vector DB Semantic Search" tab in Next.js or query:
     `GET /api/vector-search?q=defense+night+vision+electro+optics`
   - Returns **Tonbo Imaging India (TONBO)** with **38.76% Cosine Similarity** without keyword matching!
4. **Demonstrate Role-Based Access Control**:
   - Switch between **Admin**, **Analyst**, and **Investor** to demonstrate authorization boundaries.
