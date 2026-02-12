import uuid
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from config import Config
from db import analyses
from models.schema import AnalyzeResponse, ConditionResult
from models.tflite_engine import MultiTaskTFLiteEngine

bp = Blueprint("analyze", __name__)
CORS(bp, resources={r"/v1/*": {"origins": "http://localhost:8081"}})
engine = MultiTaskTFLiteEngine(Config.MODELS_DIR)

def level_from_score(s: float) -> str:
    if s >= 0.50: return "high"
    if s >= 0.20: return "medium"
    return "low"

def recommendations_for(condition: str, level: str) -> list[str]:
    base = ["If symptoms persist, consult a healthcare professional."]
    if condition == "diabetes_risk":
        if level == "high":
            return ["Consider a fasting glucose / HbA1c test.", "Reduce sugary beverages, increase activity."] + base
        if level == "medium":
            return ["Track blood sugar risk factors.", "Consider a check-up if you have risk factors."] + base
        return ["Maintain a balanced diet and routine activity."] + base

    if condition == "anemia_risk":
        if level == "high":
            return ["Consider a CBC (complete blood count) test.", "Discuss iron/B12 evaluation with a clinician."] + base
        if level == "medium":
            return ["Increase iron-rich foods (lentils, spinach, red meat)."] + base
        return ["Keep a varied diet with adequate iron and B vitamins."] + base

    if condition == "nutrition_deficiency_risk":
        if level == "high":
            return ["Consider nutritional bloodwork (vitamins/minerals).", "Review diet diversity and intake."] + base
        if level == "medium":
            return ["Add protein + vegetables + healthy fats daily."] + base
        return ["Continue a diverse diet and hydration."] + base

    return base

@bp.post("/v1/analyze")
def analyze():
    # form-data: image + patient_id + modality
    if "image" not in request.files:
        return jsonify({"error": "image is required"}), 400

    patient_id = request.form.get("patient_id", "").strip()
    modality = request.form.get("modality", "").strip()  # eye|skin|nail (pour log/historique)
    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400
    if modality not in ("eye", "skin", "nail"):
        return jsonify({"error": "modality must be eye|skin|nail"}), 400

    f = request.files["image"]
    image_bytes = f.read()

    max_bytes = int(Config.MAX_IMAGE_MB * 1024 * 1024)
    if len(image_bytes) > max_bytes:
        return jsonify({"error": f"image too large (max {Config.MAX_IMAGE_MB} MB)"}), 413

    scores = engine.predict(image_bytes)

    results = []
    for cond, sc in scores.items():
        lvl = level_from_score(sc)
        results.append(ConditionResult(
            condition=cond,
            score=float(sc),
            level=lvl,
            recommendations=recommendations_for(cond, lvl),
        ))

    analysis_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc)

    doc = {
        "analysis_id": analysis_id,
        "patient_id": patient_id,
        "modality": modality,
        "created_at": created_at,
        "model_versions": engine.model_versions,
        "results": [r.model_dump() for r in results],
        "disclaimer": "Screening only. Not a medical diagnosis."
    }
    analyses.insert_one(doc)

    resp = AnalyzeResponse(
        analysis_id=analysis_id,
        patient_id=patient_id,
        created_at=created_at,
        model_versions=engine.model_versions,
        results=results,
        disclaimer=doc["disclaimer"]
    )
    return jsonify(resp.model_dump(mode="json"))
