import sqlite3
import os
from . import config

def get_db_connection():
    os.makedirs(os.path.dirname(config.SQLITE_DB_PATH), exist_ok=True)
    conn = sqlite3.connect(config.SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn, "sqlite"

def execute_query(sql, params=None):
    conn, engine = get_db_connection()
    try:
        cursor = conn.cursor()
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
        formatted_sql = sql.replace("%s", "?")
        cursor.execute(formatted_sql, params or ())
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()
