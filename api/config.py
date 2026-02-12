import os

class Config:
    ENV = os.getenv("ENV", "dev")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB = os.getenv("MONGO_DB", "healthguard")
    MODELS_DIR = os.getenv("MODELS_DIR", "./models")
    MAX_IMAGE_MB = float(os.getenv("MAX_IMAGE_MB", "8"))
