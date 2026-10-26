import os

# Database Configuration
# You can set DB_ENGINE to 'sqlite' or 'mysql'
DB_ENGINE = os.environ.get("DB_ENGINE", "sqlite")  # Defaults to SQLite for instant plug-and-play, switches to MySQL seamlessly

# MySQL Settings (used if DB_ENGINE='mysql')
MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.environ.get("MYSQL_PORT", 3306))
MYSQL_USER = os.environ.get("MYSQL_USER", "root")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "")
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE", "ipo_intelligence_db")

# SQLite Settings
SQLITE_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "database", "ipo_intelligence.db")

# MongoDB Settings
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "ipo_nosql_db")

# App Port
PORT = int(os.environ.get("PORT", 5000))
DEBUG = True
