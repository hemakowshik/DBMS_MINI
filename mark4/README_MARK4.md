# IPOWatch Live Intelligence Terminal (MARK4)
## Real-Time Scraped Indian Primary Market Feed + Chittorgarh Syndicate Scraping + Google Sheets Integration

---

### Key Capabilities in Mark4

1. **Strict Offering Lifecycle Classification (Fixed Bidding Status)**:
   - Offerings with `open_date <= today <= close_date` are strictly listed under **Currently Open for Bidding** (`MAXWELL`, `BOMBAYCOAT`, `MKSONS`).
   - Offerings whose bidding window has passed (`today > close_date`) are strictly moved into **Completed & Listed Offerings** (`BLSPOLY`, `SFCENV`, `EAAA`, etc.).
   - Offerings whose bidding opens in the future (`today < open_date`) are listed under **Upcoming & Ready for IPO** (`VEDANT`, `JOHNSON`).

2. **Chittorgarh Anchor & Subscription Scraper for ALL Offerings**:
   - **Institutional Anchor Syndicate Allotments**: Scrapes `#anchorinvestorlist` from `https://www.chittorgarh.com/ipo_subscription/{slug}/{ipo_id}/` (e.g. 9 real anchor investors for Maxwell Engineering ID 2704, 9 real anchor investors for M.K.Sons ID 3100, 7 anchors for BLS Polymers ID 2559).
   - **Day-by-Day Bidding Multiples**: Scrapes real Day 1, Day 2, Day 3 multiples (`QIB`, `NII`, `Retail`, `Total`) or live cumulative subscription FAQ multiples ("How much {Company} IPO subscribed?").
   - Automatically re-scrapes and updates whenever the **Re-Crawl Live Market Data** button or `python crawl_now.py` is run.

3. **Google Sheets & Spreadsheet Linking Engine**:
   - **Pre-formatted CSV Templates** located in `mark4/data/sheets/`:
     - `regulatory_variances.csv`: Side-by-side SEBI variance records (Company, Parameter Name, DRHP value, RHP value, Change %, Regulatory Outcome).
     - `timeline_lockin.csv`: Milestone schedule and lock-in expiry dates (Symbol, Company, Milestone Name, Milestone Date, Event Details).
     - `prospectus_media_links.csv`: Official documents & media links (Symbol, Company, RHP Direct PDF, DRHP Direct PDF, Anchor PDF, BSE/NSE Portal, SEBI AV MP4, YouTube Analyst Videos).
   - **Live In-Terminal Sync Modal (`#sheets-sync-modal`)**:
     - One-click reload from local CSV spreadsheets (`mark4/data/sheets/`).
     - Live Google Sheets URL integration: Paste published Google Sheets CSV links to sync directly without touching code.
     - Accessible via top navigation bar button or direct "Edit in Google Sheets / CSV" buttons in Tabs 3, 4, and 5.

4. **Prospectus & AV Media Table Overhaul (Full-Width High-Density Layout)**:
   - Replaced narrow stacked vertical cards with a full-viewport-width compact institutional table.
   - Lists RHP Direct PDF, DRHP Direct PDF, Anchor Letter PDF, BSE/NSE Portals, and SEBI AV Presentation MP4 in a clean, high-density row format.
   - No vertical scrolling needed to access document links.
   - Curated Analyst YouTube Briefings displayed in a responsive horizontal grid.

5. **Isolated Runtime & Database**:
   - Port: `5003` (`http://127.0.0.1:5003`)
   - SQLite Database: `C:\DBMS_MINI\mark4\database\ipo_intelligence_mark4.db`
   - MongoDB Database: `ipo_nosql_mark4_db`
   - Completely independent from `v3_live_dashboard` (Port 5002) and `v2_dashboard` (Port 5001).

---

### How to Run MARK4

```bash
# Terminal 1: Run the Mark4 Terminal Server (Port 5003)
cd C:\DBMS_MINI\mark4
python run_mark4.py

# Terminal 2: Run live market crawler on demand anytime
cd C:\DBMS_MINI\mark4
python crawl_now.py
```
