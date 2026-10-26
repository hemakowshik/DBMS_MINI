import pymongo
from . import config

def get_mongo_client():
    try:
        client = pymongo.MongoClient(config.MONGO_URI, serverSelectionTimeoutMS=2000)
        # Test connection
        client.admin.command('ping')
        return client
    except Exception as e:
        print(f"[WARN] MongoDB not reachable at {config.MONGO_URI}: {e}")
        return None

def get_nosql_db():
    client = get_mongo_client()
    if client:
        return client[config.MONGO_DB_NAME]
    return None

def get_company_filings(symbol=None):
    db = get_nosql_db()
    if db is None:
        return []
    query = {"symbol": symbol} if symbol else {}
    docs = list(db.company_filings.find(query, {"_id": 0}))
    return docs

def get_drhp_rhp_sections(symbol=None):
    db = get_nosql_db()
    if db is None:
        return []
    query = {"symbol": symbol} if symbol else {}
    docs = list(db.drhp_rhp_deep_sections.find(query, {"_id": 0}))
    return docs

def get_media_and_research(symbol=None):
    db = get_nosql_db()
    if db is None:
        return []
    query = {"symbol": symbol} if symbol else {}
    docs = list(db.media_and_research.find(query, {"_id": 0}))
    return docs

def get_peer_comparison(symbol=None):
    db = get_nosql_db()
    if db is None:
        return []
    query = {"symbol": symbol} if symbol else {}
    docs = list(db.peer_comparison_matrix.find(query, {"_id": 0}))
    return docs
