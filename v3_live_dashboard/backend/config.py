import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Database Configuration
SQLITE_DB_PATH = os.path.join(BASE_DIR, "database", "ipo_intelligence_live.db")

# MongoDB Settings
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "ipo_nosql_live_db")

# Server Port (Port 5002 to run concurrently without conflict)
PORT = int(os.environ.get("PORT", 5002))
DEBUG = True
