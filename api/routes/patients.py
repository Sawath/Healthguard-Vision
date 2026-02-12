from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from db import patients

bp = Blueprint("patients", __name__)

@bp.post("/v1/patients")
def create_patient():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()

    if not name:
        return jsonify({"error": "name is required"}), 400

    doc = {
        "name": name,
        "created_at": datetime.now(timezone.utc),
    }

    res = patients.insert_one(doc)

    doc["_id"] = str(res.inserted_id)
    # JSON friendly
    doc["created_at"] = doc["created_at"].isoformat().replace("+00:00", "Z")
    return jsonify(doc), 201


@bp.get("/v1/patients")
def list_patients():
    docs = list(patients.find({}).sort("created_at", -1).limit(100))
    for d in docs:
        d["_id"] = str(d["_id"])
    return jsonify({"items": docs})
