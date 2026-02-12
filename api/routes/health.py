from flask import Blueprint, jsonify
from db import _db

bp = Blueprint("health", __name__)

@bp.get("/health")
def health():
    return jsonify({"status": "ok"})

@bp.get("/ready")
def ready():
    try:
        _db.command("ping")
        return jsonify({"status": "ready"})
    except Exception as e:
        return jsonify({"status": "not_ready", "error": str(e)}), 503
