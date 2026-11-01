#!/usr/bin/env python3
"""
Stand-Alone Live Market Scraper & Pipeline Trigger
Run this anytime from terminal:
    python crawl_now.py
"""
import os
import sys
import sqlite3
import datetime

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, CURRENT_DIR)

from crawler.data_transformer import ingest_live_market_data, DB_PATH

def print_live_summary():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    print("\n" + "=" * 80)
    print("  LIVE INDIAN IPO MARKET CRAWLER | EXTRACTION SUMMARY")
    print(f"  Timestamp: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')}")
    print("=" * 80)
    print(f"{'STATUS':<11} | {'SYMBOL':<10} | {'COMPANY NAME':<35} | {'PRICE (₹)':<9} | {'ISSUE (Cr)':<10}")
    print("-" * 80)

    rows = c.execute("""
        SELECT symbol, company_name, status, price_band_max, total_issue_val_cr
        FROM ipos
        ORDER BY status_order ASC, open_date DESC
    """).fetchall()

    for r in rows:
        stat_color = "🟢" if r["status"] == "Open" else ("🔵" if r["status"] == "Upcoming" else "🟣")
        print(f"{stat_color} {r['status']:<9} | {r['symbol']:<10} | {r['company_name'][:33]:<35} | ₹{r['price_band_max']:<7} | ₹{r['total_issue_val_cr']:<8}")

    print("-" * 80)
    tot = len(rows)
    gmp_count = c.execute("SELECT count(*) FROM gmp_platform_records").fetchone()[0]
    eval_count = c.execute("SELECT count(*) FROM gmp_accuracy_eval").fetchone()[0]
    print(f"Total Live Offerings: {tot}  |  Multi-Source GMP Quotes: {gmp_count}  |  Accuracy Forensics: {eval_count}")
    print("=" * 80 + "\n")
    conn.close()

if __name__ == "__main__":
    print("[INIT] Starting live market crawler pipeline...")
    ingest_live_market_data()
    print_live_summary()
