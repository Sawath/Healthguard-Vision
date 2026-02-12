from flask import Blueprint, jsonify
from db import analyses

bp = Blueprint("history", __name__)

@bp.get("/v1/analyses/<patient_id>")
def history(patient_id: str):
    docs = list(analyses.find({"patient_id": patient_id}).sort("created_at", -1).limit(50))
    for d in docs:
        d["_id"] = str(d["_id"])
    return jsonify({"patient_id": patient_id, "items": docs})
