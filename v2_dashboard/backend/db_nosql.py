import pymongo
from . import config

def get_mongo_client():
    try:
        client = pymongo.MongoClient(config.MONGO_URI, serverSelectionTimeoutMS=1500)
        client.admin.command('ping')
        return client
    except Exception:
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
    return list(db.company_filings.find(query, {"_id": 0}))

def get_drhp_rhp_sections(symbol=None):
    db = get_nosql_db()
    if db is None:
        return []
    query = {"symbol": symbol} if symbol else {}
    return list(db.drhp_rhp_deep_sections.find(query, {"_id": 0}))

def get_media_and_research(symbol=None):
    db = get_nosql_db()
    if db is None:
        return []
    query = {"symbol": symbol} if symbol else {}
    return list(db.media_and_research.find(query, {"_id": 0}))

def get_peer_comparison(symbol=None):
    db = get_nosql_db()
    if db is None:
        return []
    query = {"symbol": symbol} if symbol else {}
    return list(db.peer_comparison_matrix.find(query, {"_id": 0}))
