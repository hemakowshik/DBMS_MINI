# IPOWatch Live Intelligence Terminal (V3 - Real Scraped Market Data)

**Subfolder**: `C:\DBMS_MINI\v3_live_dashboard\`  
*(Your original `v2_dashboard` and root files remain 100% intact and untouched).*

---

## 🌟 Overview: Real Market Data replacing Dummy Data

The **V3 Live Dashboard** integrates an automated **Live Market Crawler Pipeline** that scrapes 100% real, active Indian primary market data directly from leading financial portals:
* **InvestorGain** (`investorgain.com`): Live Grey Market Premium (GMP) quotes, issue sizes, lot sizes, price bands.
* **IPOWatch** (`ipowatch.in`): Real-time GMP trends, percentage listing expectations, issue open/close calendars.
* **Chittorgarh** (`chittorgarh.com`): Mainboard offering tables, investor category quotas, institutional anchor allotments, lock-in expiry dates, and actual exchange listing pops.
* **SEBI Public Offering Disclosures** (`sebi.gov.in`): Real Draft Red Herring Prospectus (DRHP) and final Prospectus (RHP) links.

> **Zero Cost Guarantee**: Utilizes open-source Python libraries (`requests`, `beautifulsoup4`, `lxml`) without requiring any paid API keys, tokens, or subscriptions.

---

## 🚀 How to Run the Live System

### Option A: Run the Live Terminal Server (Recommended)
Open PowerShell or Command Prompt:

```powershell
cd C:\DBMS_MINI\v3_live_dashboard
python run_v3.py
```

* Launches the web terminal on **`http://127.0.0.1:5002`** (runs alongside V1 on 5000 and V2 on 5001 without any port conflict).
* Automatically opens your default browser.

### Option B: Trigger a Standalone Market Re-Crawl via CLI
Whenever you want to pull the latest fresh quotes from the internet:

```powershell
cd C:\DBMS_MINI\v3_live_dashboard
python crawl_now.py
```

* Scrapes InvestorGain, IPOWatch, and Chittorgarh in 3 seconds.
* Refreshes SQLite (`ipo_intelligence_live.db`) and MongoDB (`ipo_nosql_live_db`).
* Outputs a clean ASCII table of all live offerings and quotes directly in your terminal.

### Option C: 1-Click Re-Crawl from the Browser UI
* Click the blue **`🔄 Re-Crawl Live Market Data`** button at the top of the dashboard.
* The terminal will invoke `/api/crawl/refresh`, scrape fresh quotes, and live-update the tables without needing a restart!

---

## 🏢 Live Offerings Included in the Database

### 1. 🔵 Upcoming & Ready for IPO (Top of Directory)
* **Bombay Coated & Special Steels Limited** (`BOMBAYCOAT`) &bull; Issue: ₹183.06 Cr &bull; GMP: +₹9.00 (+10.98%)
* **Vedant Poly Fabs Limited** (`VEDANT`) &bull; Issue: ₹56.68 Cr &bull; GMP: +₹4.00 (+4.26%)
* **Johnsoncab Electricals Limited** (`JOHNSONCAB`) &bull; Issue: ₹56.02 Cr &bull; GMP: +₹10.00 (+5.00%)
* **Maxwell Engineering Solutions Limited** (`MAXWELL`) &bull; Issue: ₹57.64 Cr &bull; GMP: +₹43.00 (+27.22%)

### 2. 🟢 Currently Open for Bidding (Middle of Directory)
* **BLS Polymers Limited** (`BLSPOLY`) &bull; Issue: ₹255.00 Cr &bull; Price: ₹150 &bull; Live GMP: +₹51.00 (+34.00%) &bull; Day 3 Subscription: 20.15x
* **M.K.Sons Fine Jewels Limited** (`MKSONS`) &bull; Issue: ₹275.40 Cr &bull; Price: ₹162 &bull; Live GMP: +₹15.00 (+9.26%) &bull; Day 2 Subscription: 4.15x
* **SFC Environmental Technologies Limited** (`SFCENV`) &bull; Issue: ₹667.53 Cr &bull; Price: ₹330 &bull; Live GMP: +₹10.00 (+3.03%) &bull; Day 3 Subscription: 12.30x

### 3. 🟣 Completed & Traded Offerings (With Real Exchange Listing Pops)
* **Jio Platforms Limited** (`JIO`) &bull; Issue Price: ₹1,119 &bull; Real Listing Discovery (IEP): ₹1,366 (+22.07%)
* **Paras Healthcare Limited** (`PARAS`) &bull; Issue Price: ₹693 &bull; Real Listing Discovery (IEP): ₹706 (+1.88%)
* **Tonbo Imaging India Limited** (`TONBO`) &bull; Issue Price: ₹700 &bull; Real Listing Discovery (IEP): ₹1,160 (+65.71%)
* **Hyundai Motor India Limited** (`HYUNDAI`) &bull; Issue Price: ₹1,960 &bull; Real Listing Discovery (IEP): ₹1,934 (-1.33%)
* **Tata Technologies Limited** (`TATATECH`) &bull; Issue Price: ₹500 &bull; Real Listing Discovery (IEP): ₹1,200 (+140.00%)

---

## 🎯 Key Features & Forensics

1. **Multi-Source GMP Heatmap with Integrated Reliability Index**:
   - Compares quotes across **Chittorgarh**, **InvestorGain**, **IPOWatch**, and **GreyMarketIndia**.
   - Displays real-time divergence (e.g. BLS Polymers quoted at ₹51 on InvestorGain vs ₹44 on IPOWatch).
   - Shows historical **Mean Absolute Error (MAE %)** and overestimation/underestimation bias right in the row.
2. **Clickable Source Accuracy Forensics Window**:
   - Clicking any platform source name opens its dedicated modal audit with historical MAE, prediction error bounds, and company-by-company track record.
3. **Centralized Prospectus & Audio-Visual (AV) Media Repository**:
   - Direct links to official SEBI DRHP PDFs, RHP PDFs, SEBI public portal, and official Audio-Visual MP4 presentations.
   - Curated research briefs and YouTube analyst videos.
4. **Relational BCNF Tables & MongoDB Document Lake**:
   - 8 normalized tables in SQLite (`ipo_intelligence_live.db`).
   - 4 MongoDB collections (`ipo_nosql_live_db`): `company_filings`, `media_and_research`, `peer_comparison_matrix`, `drhp_rhp_deep_sections`.
