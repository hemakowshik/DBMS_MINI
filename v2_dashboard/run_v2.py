#!/usr/bin/env python3
"""
IPOWatch Financial Terminal (V2 - Dual Mode Architecture)
- Mode 1: Company-First Cockpit ("Features in Companies")
- Mode 2: Cross-Market Comparison ("Companies in Features")
"""
import os
import sys
import webbrowser
import threading
import time

CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, CURRENT_DIR)

from backend.seed_data import seed_v2_all
from backend.app import app
from backend import config

def open_browser():
    time.sleep(1.2)
    url = f"http://127.0.0.1:{config.PORT}"
    print(f"\n[INFO] Opening V2 Dual-Mode Dashboard in browser: {url}")
    webbrowser.open(url)

if __name__ == "__main__":
    print("=" * 70)
    print("  IPOWatch Intelligence | Dual-Mode Capital Market Terminal v2.0")
    print("  Mode 1: Company-First Cockpit (Features in Companies)")
    print("  Mode 2: Market Comparison (Companies in Features)")
    print(f"  Listening on: http://127.0.0.1:{config.PORT}")
    print("=" * 70)

    # Initialize & seed V2 database
    seed_v2_all()

    # Launch browser automatically
    threading.Thread(target=open_browser, daemon=True).start()

    print(f"\n[SERVER] Application running at http://127.0.0.1:{config.PORT}")
    print("[SERVER] Press Ctrl+C to stop the server.\n")
    app.run(host="127.0.0.1", port=config.PORT, debug=False)
