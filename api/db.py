import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://hg_mongo:27017")
DB_NAME = os.getenv("DB_NAME", "healthguard")

_client = MongoClient(MONGO_URI)
_db = _client[DB_NAME]

analyses = _db["analyses"]
patients = _db["patients"]
