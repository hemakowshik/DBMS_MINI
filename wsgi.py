"""
WSGI entry point for Render and Gunicorn cloud hosting.
Routes directly to the latest MARK4 backend application.
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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5003))
    app.run(host="0.0.0.0", port=port)
