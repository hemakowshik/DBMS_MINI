# IPOWatch Intelligence Terminal (V2 - Dual-Mode Architecture)

**Subfolder**: `C:\DBMS_MINI\v2_dashboard\`  
*(Your original dashboard in `C:\DBMS_MINI` remains 100% intact).*

---

## 🚀 How to Run the V2 Dashboard Locally

Open PowerShell or Command Prompt:

```powershell
cd C:\DBMS_MINI\v2_dashboard
python run_v2.py
```

The browser will automatically open: **`http://127.0.0.1:5001`**

---

## 🌟 The 2 Exploration Modes

### 1. Mode 1: 🏢 Company-First Mode ("Features in Companies")
Designed for when an investor or reviewer has a specific company in mind, or wants to explore offerings by timeline:

1. **Chronological IPO Directory**:
   * **Upcoming & Ready for IPO (Top)**: Companies opening shortly (*Tonbo Imaging*, *NTPC Green Energy*, *Urban Company*).
   * **Currently Open for Bidding (Middle)**: Actively accepting bids (*Swiggy*, *Waaree Energies*).
   * **Completed & Listed (Bottom)**: Traded on the exchange with first-day listing pops (*Hyundai Motor India*, *Tata Technologies*, *Bajaj Housing Finance*, *Premier Energies*).
2. **Dedicated Company Cockpit ("Second Window")**:
   * Clicking **any company name** transitions into its dedicated intelligence cockpit.
   * Inside, all features are selectable **one at a time** via quick tabs:
     * **Multi-Source GMP & Accuracy Benchmark**: Real-time Grey Market quotes from Chittorgarh, InvestorGain, IPOWatch, and GreyMarketIndia **with each platform's historical Mean Absolute Error (MAE %), Prediction Bias, and Reliability Verdict right in the table for immediate estimation**.
     * **Forecast Accuracy Benchmark**: Platform-wide predictive leaderboard.
     * **Regulatory Variance Tracker**: Side-by-side inspection of post-SEBI review changes between Draft (DRHP) and Final (RHP) prospectus.
     * **Timeline & Lock-in Expiry**: Key bidding milestones and institutional 30-day/90-day anchor lock-in release dates.
     * **Prospectus & AV Media**: Official SEBI registration links, DRHP/RHP PDFs, and official Audio-Visual MP4 presentation links (e.g. Tonbo DRHP AV and RHP AV).
     * **Analytics & Financial Allocations**: Investor category quotas, institutional anchor allotments, day-wise bidding multiples, and secondary market equilibrium (IEP) discovery.

---

### 2. Mode 2: 📊 Market Comparison Mode ("Companies in Features")
Designed for cross-sectional market analysis across all IPOs simultaneously:
* **Multi-Source GMP Heatmap**: Cross-company view of Grey Market sentiment spreads.
* **Forecast Accuracy Benchmark**: Platform error benchmarking across all evaluated offerings.
* **Regulatory Variance Tracker**: Cross-offering structural amendment diffs.
* **Timeline Matrix**: Milestone schedules across the entire market.
* **Prospectus & AV Media Repository**: Centralized cross-company directory of DRHP/RHP PDFs, official SEBI Audio-Visual MP4 presentations, and analyst videos across all offerings.
* **Analytics & Aggregations**: 5 deep relational SQL and MongoDB aggregation reports.

---

### 🔍 Dedicated Source Accuracy & Error Forensics Window
- In both the **GMP Heatmap** and **Scoreboard**, clicking any platform name (e.g., **Chittorgarh**, **InvestorGain**, **IPOWatch**, **GreyMarketIndia**) opens the **Source Accuracy Forensics Modal**.
- Displays:
  - **Reliability Verdict Badge** (`Highly Reliable`, `Moderate Bias`, `Significant Error Bias`)
  - **Algorithmic Assessment Narrative**
  - **Statistical Metrics Grid**: MAE %, historical sample size, best/worst prediction error, signed bias %, and overestimation vs. underestimation counts.
  - **Historical Track Record Table**: Every evaluated IPO offering with predicted gain, actual listing gain, and error direction.

---

## ☁️ Deployment on Render (Render.com)

- **Auto-Deploy on Git Push**: Render automatically detects pushes to `main` and initiates a rebuild and deployment.
- **Start Command**:
  ```bash
  gunicorn v2_dashboard.backend.app:app
  ```
  *(Configured via `Procfile` and `render.yaml`)*.
