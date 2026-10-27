import sqlite3
import pymysql
import os
from . import config

def get_db_connection():
    if config.DB_ENGINE == "mysql":
        try:
            conn = pymysql.connect(
                host=config.MYSQL_HOST,
                user=config.MYSQL_USER,
                password=config.MYSQL_PASSWORD,
                database=config.MYSQL_DATABASE,
                port=config.MYSQL_PORT,
                cursorclass=pymysql.cursors.DictCursor,
                autocommit=True
            )
            return conn, "mysql"
        except Exception as e:
            pass

    # SQLite connection
    os.makedirs(os.path.dirname(config.SQLITE_DB_PATH), exist_ok=True)
    conn = sqlite3.connect(config.SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn, "sqlite"

def execute_query(sql, params=None):
    conn, engine = get_db_connection()
    try:
        cursor = conn.cursor()
        formatted_sql = sql
        if engine == "sqlite":
            formatted_sql = sql.replace("%s", "?")
        
        cursor.execute(formatted_sql, params or ())
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

def execute_dml(sql, params=None):
    conn, engine = get_db_connection()
    try:
        cursor = conn.cursor()
        formatted_sql = sql
        if engine == "sqlite":
            formatted_sql = sql.replace("%s", "?")
        
        cursor.execute(formatted_sql, params or ())
        if engine == "sqlite":
            conn.commit()
            last_id = cursor.lastrowid
        else:
            last_id = cursor.lastrowid
        return last_id
    finally:
        conn.close()

def init_relational_db():
    conn, engine = get_db_connection()
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    try:
        schema_path = os.path.join(base_dir, "database", "sqlite_schema.sql")
        with open(schema_path, "r", encoding="utf-8") as f:
            script = f.read()
        conn.executescript(script)
        conn.commit()
        print("[INFO] V2 SQLite Schema initialized.")
    finally:
        conn.close()
