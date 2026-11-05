#!/usr/bin/env python3
"""
IPOWatch Live Intelligence Terminal (MARK4)
Main Entry Point
"""
import os
import sys

CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

MARK4_DIR = os.path.join(CURRENT_DIR, "mark4")
if MARK4_DIR not in sys.path:
    sys.path.insert(0, MARK4_DIR)

from mark4.backend.app import app
from mark4.backend import config

if __name__ == "__main__":
    port = int(os.environ.get("PORT", config.PORT))
    print("=" * 70)
    print("  IPOWatch Intelligence | MARK4 Terminal Active")
    print(f"  Port: {port} | Database: {config.SQLITE_DB_PATH}")
    print("=" * 70)
    app.run(host="0.0.0.0", port=port, debug=False)
