#!/usr/bin/env python3
"""
IPO Intelligence & GMP Analytics Platform
PES University - AIML Department - DBMS Mini Project
Faculty Evaluator: Prof. Smitha GR
"""
import os
import sys
import webbrowser
import threading
import time

# Ensure backend package can be imported
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.seed_data import seed_all
from backend.app import app
from backend import config

def open_browser():
    time.sleep(1.2)
    url = f"http://localhost:{config.PORT}"
    print(f"\n[INFO] Opening Dashboard in browser: {url}")
    webbrowser.open(url)

if __name__ == "__main__":
    print("=" * 70)
    print("  IPOWatch Intelligence | Capital Market Terminal v2.4")
    print("  Real-Time Primary Issue Surveillance & Forensics")
    print("  Architecture: High-Throughput Relational Storage + Document Lake")
    print("=" * 70)

    # Initialize and seed databases
    seed_all()

    # Launch browser automatically
    threading.Thread(target=open_browser, daemon=True).start()

    print(f"\n[SERVER] Web application listening at http://127.0.0.1:{config.PORT}")
    print("[SERVER] Press Ctrl+C to stop the server.\n")
    app.run(host="127.0.0.1", port=config.PORT, debug=False)
