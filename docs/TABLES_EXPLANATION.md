# Detailed Table-by-Table Architectural Reference & Viva Defense
**Course**: Database Management Systems (UE23CS252 / AIML)  
**Evaluator**: Prof. Smitha GR, Faculty of AIML, RR Campus, PES University  
**Topic**: Comprehensive IPO Intelligence, Multi-Source GMP Analytics & Regulatory Tracker  

---

## 1. `ipos` (Primary Master Entity)

### Purpose in Financial Domain
This is the **central master table** of the entire relational database. It stores the official corporate identity, issue pricing parameters, regulatory identifiers, capital structure, and timeline milestones for every company going public on the National Stock Exchange (NSE) and Bombay Stock Exchange (BSE).

### Key Attributes & Constraints
- `ipo_id`: `INT AUTO_INCREMENT` &mdash; **Primary Key (PK)**. Unique surrogate key identifying each offering.
- `symbol`: `VARCHAR(30) UNIQUE NOT NULL` &mdash; Official stock ticker (e.g., `TONBO`, `TATATECH`, `SWIGGY`).
- `isin`: `VARCHAR(20) UNIQUE NOT NULL` &mdash; International Securities Identification Number (e.g., `INE0LDG01026` for Tonbo Imaging). Guarantees global uniqueness.
- `bse_code`: `VARCHAR(20)` &mdash; BSE numerical scrip identifier (e.g., `544101`).
- `issue_type`: `VARCHAR(40)` &mdash; `Book Building` (bidding within a price band) vs `Fixed Price`.
- `sale_type`: `VARCHAR(40)` &mdash; `Fresh Issue` (new shares issued to raise corporate growth capital), `OFS` (Offer for Sale &mdash; existing promoters/investors cashing out), or `Combination`.
- `price_band_min`, `price_band_max`: `DECIMAL(10,2)` &mdash; Bidding range (e.g., ₹520 to ₹550).
- `issue_price`: `DECIMAL(10,2)` &mdash; Final cut-off allotment price discovered via bidding.
- `lot_size`: `INT` &mdash; Minimum bundle of shares retail investors must bid for (e.g., 27 shares).
- `total_issue_val_cr`: `DECIMAL(12,2)` &mdash; Total fund raise in ₹ Crores (e.g., ₹1,200.00 Cr).
- `fresh_issue_cr`, `ofs_val_cr`: `DECIMAL(12,2)` &mdash; Split of capital between fresh company equity and promoter cashout.
- `open_date`, `close_date`, `allotment_date`, `refund_date`, `listing_date`: `DATE` &mdash; Official lifecycle dates.
- `anchor_lockin_30d`, `anchor_lockin_90d`: `DATE` &mdash; SEBI-mandated institutional lock-in expiry dates.
- `brlm_lead_manager`: `VARCHAR(255)` &mdash; Merchant bankers underwriting the IPO (e.g., Kotak Mahindra Capital, Axis Capital).
- `registrar_name`: `VARCHAR(150)` &mdash; Registrar managing share allotments (e.g., KFin Technologies, Link Intime).

### Integrity Constraints
- `CONSTRAINT chk_price_band CHECK (price_band_max >= price_band_min)`
- `CONSTRAINT chk_lot_size CHECK (lot_size > 0)`
- `CONSTRAINT chk_dates CHECK (close_date >= open_date AND listing_date >= close_date)`

### Viva Question & Defense
> **Prof. Smitha**: *"Why did you separate Fresh Issue and OFS into two columns instead of just Total Issue Size?"*  
> **Your Answer**: *"In corporate finance, Fresh Issue brings new cash into the company's balance sheet for capex, while OFS simply transfers cash to selling promoters without enriching the company. Separating them allows our SQL reports to analyze whether retail investors are funding company expansion or funding promoter exit."*

---

## 2. `ipo_reservations` (Investor Category Quota Limits)

### Purpose in Financial Domain
Under SEBI ICDR (Issue of Capital and Disclosure Requirements) regulations, shares in an IPO cannot be sold indiscriminately. They must be legally divided into reserved quotas for different classes of investors. This table enforces category reservation percentages and financial investment thresholds.

### Key Attributes & Constraints
- `reservation_id`: `INT AUTO_INCREMENT` &mdash; **Primary Key (PK)**.
- `ipo_id`: `INT NOT NULL` &mdash; **Foreign Key (FK)** referencing `ipos(ipo_id) ON DELETE CASCADE`.
- `category_name`: `VARCHAR(50)` &mdash; e.g., `QIB (Qualified Institutional)`, `NII / HNI (Non-Institutional)`, `Retail Individual Investors`, `Employee Reservation`.
- `quota_percent`: `DECIMAL(5,2)` &mdash; Mandatory quota percentage (e.g., QIB: 50%, NII: 15%, Retail: 35%).
- `shares_reserved`: `BIGINT` &mdash; Exact number of shares earmarked for that bucket.
- `min_investment_inr`, `max_investment_inr`: `DECIMAL(12,2)` &mdash; Bid limits (e.g., Retail has an upper limit of ₹2,00,000; NII Small is ₹2L to ₹10L).

### Relationship & Cardinality
- `ipos` &rarr; `ipo_reservations`: **1 : N (One-to-Many)**. One IPO has multiple category reservation rows.

### Integrity Constraints
- `CONSTRAINT chk_quota CHECK (quota_percent >= 0 AND quota_percent <= 100)`

---

## 3. `anchor_investors` (Anchor Institutional Allocations & Lock-in Tranches)

### Purpose in Financial Domain
Anchor investors are large institutional entities (sovereign funds like ADIA/GIC, foreign institutional investors like Goldman Sachs, domestic mutual funds like SBI MF) who subscribe to shares 1 day before the public bidding opens to give market confidence. In return, SEBI forces them into mandatory **Lock-in Periods** (50% locked for 30 days, 50% locked for 90 days) during which they cannot sell a single share. This table tracks who bought shares, how much capital they invested, and the exact date their lock-in ends.

### Key Attributes & Constraints
- `anchor_id`: `INT AUTO_INCREMENT` &mdash; **Primary Key (PK)**.
- `ipo_id`: `INT NOT NULL` &mdash; **Foreign Key (FK)** referencing `ipos(ipo_id) ON DELETE CASCADE`.
- `investor_name`: `VARCHAR(150)` &mdash; Name of the fund (e.g., *Abu Dhabi Investment Authority (ADIA)*, *SBI Mutual Fund*).
- `investor_category`: `VARCHAR(60)` &mdash; `Mutual Fund`, `FII`, `Insurance`, `Domestic Corp`.
- `shares_allocated`: `BIGINT` &mdash; Number of shares allotted.
- `bid_price`: `DECIMAL(10,2)` &mdash; Issue price at which anchors were allotted.
- `amount_cr`: `DECIMAL(12,2)` &mdash; Institutional capital invested in ₹ Crores.
- `lockin_period_days`: `INT` &mdash; `30` or `90` days.
- `lockin_expiry_date`: `DATE` &mdash; The exact calendar date the lock expires.

### Relationship & Cardinality
- `ipos` &rarr; `anchor_investors`: **1 : N (One-to-Many)**. One IPO brings in dozens of anchor investors.

### Viva Question & Defense
> **Prof. Smitha**: *"Why is tracking lock-in expiry dates significant for database analytics?"*  
> **Your Answer**: *"When a 30-day or 90-day anchor lock-in expires, millions of shares suddenly become eligible for open market sale. Historically, this causes supply overhang and sharp price corrections. Our Report 4 performs SQL date arithmetic to alert investors to upcoming capital unlock dates."*

---

## 4. `subscription_bids` (Day-by-Day Bidding Multiples)

### Purpose in Financial Domain
Indian IPO public biddings stay open for 3 consecutive trading days. On each day, the stock exchange collects bid applications from QIBs, NIIs, Retailers, and Employees. This table stores time-series bidding multiples (how many times each category was oversubscribed).

### Key Attributes & Constraints
- `bid_id`: `INT AUTO_INCREMENT` &mdash; **Primary Key (PK)**.
- `ipo_id`: `INT NOT NULL` &mdash; **Foreign Key (FK)** referencing `ipos(ipo_id) ON DELETE CASCADE`.
- `day_number`: `INT` &mdash; `1`, `2`, or `3`.
- `bidding_date`: `DATE` &mdash; Date the bidding took place.
- `qib_subscription_times`: `DECIMAL(8,2)` &mdash; e.g., Day 1: 1.25x, Day 3: 72.40x.
- `nii_subscription_times`: `DECIMAL(8,2)` &mdash; e.g., 54.10x.
- `retail_subscription_times`: `DECIMAL(8,2)` &mdash; e.g., 28.30x.
- `employee_subscription_times`: `DECIMAL(8,2)` &mdash; e.g., 4.20x.
- `total_subscription_times`: `DECIMAL(8,2)` &mdash; Weighted aggregate demand (e.g., 51.60x).

### Integrity Constraints
- `CONSTRAINT unq_ipo_day UNIQUE (ipo_id, day_number)` &mdash; Prevents duplicate daily entries for the same IPO.

---

## 5. `secondary_listing_metrics` (Listing Session Pre-Open Price Discovery)

### Purpose in Financial Domain
On listing day between 9:00 AM and 9:45 AM, the stock exchange runs a special **Call Auction (Pre-Open Session)** to discover the opening price before regular trading starts. It matches buy and sell orders to compute the **Indicative Equilibrium Price (IEP)** and **Indicative Equilibrium Quantity (IEQ)**. It also captures order cancellations (traders placing and cancelling spoof orders). This table records the discovered market metrics.

### Key Attributes & Constraints
- `metric_id`: `INT AUTO_INCREMENT` &mdash; **Primary Key (PK)**.
- `ipo_id`: `INT NOT NULL UNIQUE` &mdash; **Foreign Key (FK)** referencing `ipos(ipo_id) ON DELETE CASCADE`.
- `prev_close`: `DECIMAL(10,2)` &mdash; Base cut-off issue price (e.g., ₹550.00).
- `iep`: `DECIMAL(10,2)` &mdash; Discovered Indicative Equilibrium Price (e.g., ₹935.00).
- `listing_day_open`, `listing_day_high`, `listing_day_low`, `listing_day_close`: `DECIMAL(10,2)` &mdash; Full first-day OHLC market data.
- `listing_gain_percent`: `DECIMAL(8,2)` &mdash; Percentage pop on listing day:  
  $$\text{listing\_gain\_pct} = \frac{\text{listing\_day\_close} - \text{prev\_close}}{\text{prev\_close}} \times 100$$
- `ieq`: `BIGINT` &mdash; Matched volume quantity during pre-open.
- `indicative_val_lakhs`: `DECIMAL(14,2)` &mdash; Total rupee turnover matched in pre-open.
- `cancelled_buy_orders_count`, `cancelled_sell_orders_count`: `INT` &mdash; Tracks pre-open fake bid manipulation.
- `cancelled_buy_qty`, `cancelled_sell_qty`: `BIGINT` &mdash; Quantity of shares cancelled before equilibrium match.

### Relationship & Cardinality
- `ipos` &rarr; `secondary_listing_metrics`: **1 : 1 (One-to-One)**. An IPO has exactly one official listing session record. Enforced by `UNIQUE (ipo_id)`.

---

## 6. `gmp_platform_records` (Multi-Source Grey Market Aggregation)

### Purpose in Financial Domain
The "Grey Market" is an unofficial, off-exchange over-the-counter market where individuals trade IPO application rights and shares before listing. Websites like *Chittorgarh*, *InvestorGain*, *IPOWatch*, and *GreyMarketIndia* publish daily Grey Market Premiums (GMP). Because single sources are prone to syndicate manipulation, this table aggregates quotes from all distinct portals to give an unbiased side-by-side view.

### Key Attributes & Constraints
- `record_id`: `INT AUTO_INCREMENT` &mdash; **Primary Key (PK)**.
- `ipo_id`: `INT NOT NULL` &mdash; **Foreign Key (FK)** referencing `ipos(ipo_id) ON DELETE CASCADE`.
- `platform_name`: `VARCHAR(100)` &mdash; Name of the tracking portal.
- `quote_date`: `DATE` &mdash; Date GMP was quoted.
- `gmp_inr`: `DECIMAL(10,2)` &mdash; Quoted premium above issue price (e.g., +₹390.00).
- `estimated_listing_price`: `DECIMAL(10,2)` &mdash; $\text{Issue Price} + \text{GMP}$ (e.g., ₹550 + ₹390 = ₹940).
- `estimated_gain_percent`: `DECIMAL(8,2)` &mdash; Quoted percentage return expected.
- `rating_sentiment`: `VARCHAR(30)` &mdash; `Very Bullish`, `Bullish`, `Neutral`, `Bearish`.

### Relationship & Cardinality
- `ipos` &rarr; `gmp_platform_records`: **1 : N (One-to-Many)**. One IPO has multiple GMP quotes from multiple tracking platforms across multiple dates.

---

## 7. `gmp_accuracy_eval` (NOVELTY 1: Forecasting Error & Reliability Scoreboard)

### Purpose in Financial Domain (Novelty Defense)
This table embodies the **first major novelty** of the project. Retail investors often ask: *"Which GMP website is actually telling the truth and which one is hyping up a bad IPO?"*  
This table benchmarks each website's last predicted gain against the **real exchange listing gain**, computes the **Absolute Error Percentage**, and classifies the platform's bias (*Overestimated*, *Underestimated*, or *Accurate*).

### Key Attributes & Constraints
- `eval_id`: `INT AUTO_INCREMENT` &mdash; **Primary Key (PK)**.
- `ipo_id`: `INT NOT NULL` &mdash; **Foreign Key (FK)** referencing `ipos(ipo_id) ON DELETE CASCADE`.
- `platform_name`: `VARCHAR(100)` &mdash; Portal under evaluation.
- `last_gmp_predicted_gain_pct`: `DECIMAL(8,2)` &mdash; The prediction made by the site prior to listing day.
- `actual_listing_gain_pct`: `DECIMAL(8,2)` &mdash; The real first-day percentage gain recorded in `secondary_listing_metrics`.
- `absolute_error_pct`: `DECIMAL(8,2)` &mdash; Absolute mathematical deviation:
  $$\text{absolute\_error\_pct} = |\text{last\_gmp\_predicted\_gain\_pct} - \text{actual\_listing\_gain\_pct}|$$
- `error_direction`: `VARCHAR(30)` &mdash; `Overestimated` (site artificially hyped up the IPO), `Underestimated` (conservative), or `Accurate` (error $\le 1\%$).

### Why This is Academic Novelty
It transforms subjective hearsay into an empirical database benchmarking engine. Report 2 calculates the **Mean Absolute Error (MAE)** to rank website credibility.

---

## 8. `drhp_rhp_diffs` (NOVELTY 2: Regulatory Prospectus Post-SEBI Amendment Tracker)

### Purpose in Financial Domain (Novelty Defense)
This table embodies the **second major novelty** of the project. A company first submits a **Draft Red Herring Prospectus (DRHP)** to SEBI. SEBI reviews it, issues observation letters, and points out deficiencies. The company then alters its terms and publishes the final **Red Herring Prospectus (RHP)**.  
Crucial corporate changes happen quietly between these two drafts (e.g., upsizing fresh issues, promoters scaling down secondary sales, upward valuation hikes, or restated net profits). This table captures and categorizes these regulatory diffs.

### Key Attributes & Constraints
- `diff_id`: `INT AUTO_INCREMENT` &mdash; **Primary Key (PK)**.
- `ipo_id`: `INT NOT NULL` &mdash; **Foreign Key (FK)** referencing `ipos(ipo_id) ON DELETE CASCADE`.
- `parameter_name`: `VARCHAR(120)` &mdash; Attribute being compared (e.g., *Total Issue Size*, *Fresh Issue vs OFS Split*, *Price Band Ceiling*, *Restated PAT Margin*).
- `drhp_val`: `VARCHAR(120)` &mdash; Value stated in initial draft prospectus.
- `rhp_val`: `VARCHAR(120)` &mdash; Modified value in final approved prospectus.
- `percentage_change`: `DECIMAL(8,2)` &mdash; Percentage variance between draft and final.
- `change_nature`: `VARCHAR(100)` &mdash; Description of commercial significance (e.g., *Issue Size Expanded*, *Fresh Growth Capital Prioritized*, *Valuation Multiple Upward Adjustment*).
- `sebi_observation_noted`: `BOOLEAN DEFAULT TRUE` &mdash; Whether change was prompted by official SEBI regulatory pushback.

---

## Summary Matrix of Relational Tables

| # | Table Name | Cardinality with `ipos` | Primary Key | Foreign Key | Real-World Role |
|---|---|---|---|---|---|
| **1** | `ipos` | **Parent Table** | `ipo_id` | None | Primary master record (pricing, dates, BRLMs, registrar) |
| **2** | `ipo_reservations` | **1 : N** | `reservation_id` | `ipo_id` &rarr; `ipos` | Category allocation quotas (QIB 50%, NII 15%, Retail 35%) |
| **3** | `anchor_investors` | **1 : N** | `anchor_id` | `ipo_id` &rarr; `ipos` | Institutional anchor allotments & 30d/90d lock-in tracking |
| **4** | `subscription_bids` | **1 : N** | `bid_id` | `ipo_id` &rarr; `ipos` | Day 1, 2, 3 bidding multiples across investor categories |
| **5** | `secondary_listing_metrics`| **1 : 1** | `metric_id` | `ipo_id` &rarr; `ipos` (UK) | Pre-open price discovery (IEP) & order cancellation counts |
| **6** | `gmp_platform_records` | **1 : N** | `record_id` | `ipo_id` &rarr; `ipos` | Daily quotes from Chittorgarh, InvestorGain, IPOWatch |
| **7** | `gmp_accuracy_eval` | **1 : N** | `eval_id` | `ipo_id` &rarr; `ipos` | **Novelty 1**: Platform Mean Absolute Error (MAE) benchmarking |
| **8** | `drhp_rhp_diffs` | **1 : N** | `diff_id` | `ipo_id` &rarr; `ipos` | **Novelty 2**: Post-SEBI regulatory prospectus modification diffs |

---

## Bonus: How MongoDB NoSQL Collections Complement These Tables

When Prof. Smitha asks: *"You explained the 8 relational tables, now explain what is in MongoDB?"*

1. `company_filings`: Stores document links, SEBI public registration portal URLs, and direct links to official **Audio-Visual MP4 Walkthroughs** (specifically Tonbo Imaging DRHP AV MP4 and RHP AV MP4, which are unstructured binary/video URLs).
2. `drhp_rhp_deep_sections`: Stores unstructured textual clauses (*Objects of the Issue*, *Litigations*, *Risk Factors*) that cannot be neatly modeled in fixed SQL columns.
3. `media_and_research`: Curated YouTube analyst videos (Finology, Akshat Shrivastava, Rachana Ranade) with flexible view counts and analyst ratings (*Very Bullish*, *Avoid*).
4. `peer_comparison_matrix`: Dynamic competitor JSON matrices (Tonbo vs Data Patterns vs Zen Tech) where competitors have varying financial ratios.
