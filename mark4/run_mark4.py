#!/usr/bin/env python3
"""
IPOWatch Live Intelligence Terminal (MARK4 - Full Scraped & Spreadsheet Linked)
Multi-Source Web Crawler + Dual-Mode Terminal + Google Sheets Sync
Port: 5003 (Runs concurrently alongside V1 5000, V2 5001, V3 5002)
"""
import os
import sys
import webbrowser
import threading
import time

CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, CURRENT_DIR)

from crawler.data_transformer import ingest_live_market_data, DB_PATH
from backend.app import app
from backend import config

def open_browser():
    time.sleep(1.2)
    url = f"http://127.0.0.1:{config.PORT}"
    print(f"\n[INFO] Opening MARK4 Live Terminal in browser: {url}")
    webbrowser.open(url)

if __name__ == "__main__":
    print("=" * 75)
    print("  IPOWatch Intelligence | MARK4 Full Scraped & Sheets-Linked Terminal")
    print(f"  Port: {config.PORT} | Database: {config.SQLITE_DB_PATH}")
    print("  Chittorgarh Live Anchor & Bidding Scraper Active")
    print(f"  Listening on: http://127.0.0.1:{config.PORT}")
    print("=" * 75)

    if not os.path.exists(DB_PATH) or os.path.getsize(DB_PATH) == 0:
        print("[INFO] Initializing mark4 database with real live scraped data...")
        ingest_live_market_data()

    threading.Thread(target=open_browser, daemon=True).start()

    print(f"\n[SERVER] MARK4 Terminal running at http://127.0.0.1:{config.PORT}")
    print("[SERVER] Press Ctrl+C to stop the server.\n")
    app.run(host="127.0.0.1", port=config.PORT, debug=False, threaded=True)
