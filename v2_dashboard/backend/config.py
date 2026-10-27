import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Database Configuration
DB_ENGINE = os.environ.get("DB_ENGINE", "sqlite")

# SQLite Database for V2 Dashboard
SQLITE_DB_PATH = os.path.join(BASE_DIR, "database", "ipo_intelligence_v2.db")

# MySQL Settings (optional if switched)
MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.environ.get("MYSQL_PORT", 3306))
MYSQL_USER = os.environ.get("MYSQL_USER", "root")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "")
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE", "ipo_intelligence_db")

# MongoDB Settings
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "ipo_nosql_db")

# Server Port (default 5001 to run alongside or 5000)
PORT = int(os.environ.get("PORT", 5001))
DEBUG = True
