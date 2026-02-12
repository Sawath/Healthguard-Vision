from flask import Flask, jsonify
from flask_cors import CORS
from routes.health import bp as health_bp
from routes.analyze import bp as analyze_bp
from routes.history import bp as history_bp
from routes.patients import bp as patients_bp

def create_app():
    app = Flask(__name__)

    CORS(
        app,
        resources={r"/v1/*": {
            "origins": "http://localhost:8081",
            "Access-Control-Allow-Origin": "http://localhost:8081"
            }}
        # ou plus large : resources={r"/": {"origins": "http://localhost:8081"}}
    )

    @app.get("/")
    def index():
        return jsonify({
            "service": "healthguard-api",
            "endpoints": {
                "health": "GET /health",
                "analyze": "POST /v1/analyze (multipart form-data: image, patient_id, modality)",
                "history": "GET /v1/analyses/<patient_id>",
                "patients_create": "POST /v1/patients (json: {name})",
                "patients_list": "GET /v1/patients"
            }
        })

    app.register_blueprint(health_bp)
    app.register_blueprint(analyze_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(patients_bp)

    return app

app = create_app()
