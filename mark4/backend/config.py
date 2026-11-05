import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Relational Database Configuration (Environment variable driven)
SQLITE_DB_PATH = os.environ.get("SQLITE_DB_PATH", os.path.join(BASE_DIR, "database", "ipo_intelligence_mark4.db"))
MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.environ.get("MYSQL_PORT", 3306))
MYSQL_USER = os.environ.get("MYSQL_USER", "root")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "")
MYSQL_DB = os.environ.get("MYSQL_DB", "ipo_intelligence_db")

# NoSQL MongoDB Settings
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "ipo_nosql_mark4_db")

# Vector Database Settings
VECTOR_STORE_PATH = os.environ.get("VECTOR_STORE_PATH", os.path.join(BASE_DIR, "data", "vector_store.json"))

# Security & Secrets
SECRET_KEY = os.environ.get("SECRET_KEY", "pes-aiml-dbms-level3-secret-key-2026")

# Server Port
PORT = int(os.environ.get("PORT", 5003))
DEBUG = os.environ.get("DEBUG", "False").lower() in ("true", "1")
