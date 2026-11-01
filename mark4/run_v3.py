#!/usr/bin/env python3
"""
IPOWatch Live Intelligence Terminal (V3 - Real-Time Indian Market Data)
Multi-Source Web Crawler + Dual-Mode Terminal
Port: 5002 (Runs alongside V1 on 5000 and V2 on 5001)
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
    print(f"\n[INFO] Opening V3 Live Terminal in browser: {url}")
    webbrowser.open(url)

if __name__ == "__main__":
    print("=" * 75)
    print("  IPOWatch Live Intelligence | Real-Time Market Terminal v3.0")
    print("  Data Source: Live Web Crawler (InvestorGain, IPOWatch, Chittorgarh)")
    print(f"  Listening on: http://127.0.0.1:{config.PORT}")
    print("=" * 75)

    # If database does not exist, run initial crawl
    if not os.path.exists(DB_PATH) or os.path.getsize(DB_PATH) == 0:
        print("[INFO] Initializing live database with real market data...")
        ingest_live_market_data()

    # Launch browser automatically
    threading.Thread(target=open_browser, daemon=True).start()

    print(f"\n[SERVER] Live Market Terminal running at http://127.0.0.1:{config.PORT}")
    print("[SERVER] Press Ctrl+C to stop the server.\n")
    app.run(host="127.0.0.1", port=config.PORT, debug=False)
