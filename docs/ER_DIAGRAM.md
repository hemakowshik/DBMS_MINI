# Entity-Relationship (ER) Diagram & Relational Schema
**Project**: IPO Intelligence & Multi-Source GMP Analytics Platform  
**Evaluator**: Prof. Smitha GR, Faculty of AIML, RR Campus, PES University  
**Subject**: DBMS Mini Project Evaluation  

---

## 1. High-Level Architecture Overview
This project employs a **Polyglot Persistence (Hybrid RDBMS + NoSQL)** architecture:
- **Relational DBMS (MySQL / SQLite)**: Enforces ACID guarantees, entity integrity, foreign keys, and complex transactional relational queries for financial accounting data, bids, order cancellation metrics, and accuracy evaluations.
- **Document NoSQL (MongoDB)**: Stores dynamic, multi-modal documents including DRHP/RHP audio-visual MP4 video links, SEBI filing documents, YouTube research channel metadata, and dynamic peer comparison matrices.

---

## 2. ER Diagram (Mermaid Fenced Code Block)

```mermaid
erDiagram
    IPOS ||--|{ IPO_RESERVATIONS : "has category quotas (1:N)"
    IPOS ||--|{ ANCHOR_INVESTORS : "allocates shares to (1:N)"
    IPOS ||--|{ SUBSCRIPTION_BIDS : "records daily bidding (1:N)"
    IPOS ||--|| SECONDARY_LISTING_METRICS : "discovers IEP on listing (1:1)"
    IPOS ||--|{ GMP_PLATFORM_RECORDS : "tracks multi-source quotes (1:N)"
    IPOS ||--|{ GMP_ACCURACY_EVAL : "evaluated against actual gain (1:N)"
    IPOS ||--|{ DRHP_RHP_DIFFS : "tracks regulatory amendments (1:N)"

    IPOS {
        int ipo_id PK
        string company_name
        string symbol UK
        string isin UK
        string bse_code
        string listing_exchange
        string issue_type
        string sale_type
        decimal face_value
        decimal price_band_min
        decimal price_band_max
        decimal issue_price
        int lot_size
        decimal employee_discount
        bigint total_issue_shares
        decimal total_issue_val_cr
        decimal fresh_issue_cr
        decimal ofs_val_cr
        date open_date
        date close_date
        date allotment_date
        date refund_date
        date listing_date
        date anchor_lockin_30d
        date anchor_lockin_90d
        date pre_ipo_lockin_180d
        string brlm_lead_manager
        string registrar_name
        string sector
        string status
    }

    IPO_RESERVATIONS {
        int reservation_id PK
        int ipo_id FK
        string category_name
        decimal quota_percent
        bigint shares_reserved
        decimal min_investment_inr
        decimal max_investment_inr
    }

    ANCHOR_INVESTORS {
        int anchor_id PK
        int ipo_id FK
        string investor_name
        string investor_category
        bigint shares_allocated
        decimal bid_price
        decimal amount_cr
        int lockin_period_days
        date lockin_expiry_date
    }

    SUBSCRIPTION_BIDS {
        int bid_id PK
        int ipo_id FK
        int day_number
        date bidding_date
        decimal qib_subscription_times
        decimal nii_subscription_times
        decimal retail_subscription_times
        decimal employee_subscription_times
        decimal total_subscription_times
    }

    SECONDARY_LISTING_METRICS {
        int metric_id PK
        int ipo_id FK, UK
        decimal prev_close
        decimal iep
        decimal listing_day_open
        decimal listing_day_high
        decimal listing_day_low
        decimal listing_day_close
        decimal listing_gain_percent
        bigint ieq
        decimal indicative_val_lakhs
        int cancelled_buy_orders_count
        int cancelled_sell_orders_count
        bigint cancelled_buy_qty
        bigint cancelled_sell_qty
        string trading_status
    }

    GMP_PLATFORM_RECORDS {
        int record_id PK
        int ipo_id FK
        string platform_name
        date quote_date
        decimal gmp_inr
        decimal estimated_listing_price
        decimal estimated_gain_percent
        string rating_sentiment
    }

    GMP_ACCURACY_EVAL {
        int eval_id PK
        int ipo_id FK
        string platform_name
        decimal last_gmp_predicted_gain_pct
        decimal actual_listing_gain_pct
        decimal absolute_error_pct
        string error_direction
    }

    DRHP_RHP_DIFFS {
        int diff_id PK
        int ipo_id FK
        string parameter_name
        string drhp_val
        string rhp_val
        decimal percentage_change
        string change_nature
        boolean sebi_observation_noted
    }
```

---

## 3. Entity & Cardinality Descriptions

| Relationship | Cardinality | Explanation |
|---|---|---|
| `IPOS` &rarr; `IPO_RESERVATIONS` | 1 : N (One-to-Many) | An IPO has multiple investor quotas (QIB: 50%, NII: 15%, Retail: 35%, Employee). |
| `IPOS` &rarr; `ANCHOR_INVESTORS` | 1 : N (One-to-Many) | An IPO brings in dozens of institutional anchor institutions allocated with 30-day and 90-day lock-ins. |
| `IPOS` &rarr; `SUBSCRIPTION_BIDS` | 1 : N (One-to-Many) | An IPO bidding process lasts typically 3 trading days; each day records separate category bidding multiples. |
| `IPOS` &rarr; `SECONDARY_LISTING_METRICS` | 1 : 1 (One-to-One) | Once listed, an IPO has a single official listing session discovery record with Indicative Equilibrium Price (IEP) and order cancellations. |
| `IPOS` &rarr; `GMP_PLATFORM_RECORDS` | 1 : N (One-to-Many) | Multiple external grey market trackers (Chittorgarh, InvestorGain, IPOWatch) quote daily GMP premiums. |
| `IPOS` &rarr; `GMP_ACCURACY_EVAL` | 1 : N (One-to-Many) | Each tracking platform's final prediction is evaluated against the actual Day 1 closing listing gain. |
| `IPOS` &rarr; `DRHP_RHP_DIFFS` | 1 : N (One-to-Many) | Multiple parameters (fresh issue ratio, OFS value, issue size, valuation PE) change after SEBI's regulatory review. |

---

## 4. Normalization Status (1NF to BCNF)
- **1NF**: All table columns are atomic; no repeating groups.
- **2NF**: Every non-key attribute is fully functionally dependent on the entire primary key.
- **3NF**: There are no transitive dependencies (`X -> Y` where `Y` is non-prime and `X` is not a superkey).
- **BCNF**: For every functional dependency `X -> A`, `X` is a super key.
