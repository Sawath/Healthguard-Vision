
# 🚀 HealthGuard Vision — AI Preventive Screening Platform

## 📌 Overview
HealthGuard Vision is an AI-powered preventive health screening system that analyzes smartphone images to estimate early health risks.

The application analyzes:
- Eyes
- Skin
- Nails

Estimated risks:
- Anemia
- Diabetes
- Nutritional deficiencies

⚠️ This application is a screening tool only and is NOT a medical diagnosis system.

---

## 🧠 Concept
The goal is to democratize early health awareness by allowing users to perform preliminary screenings directly from their smartphone using AI.

---

## 🏗 Architecture

Mobile App (React Native)
        ↓
REST API (Flask + Gunicorn)
        ↓
ML Engine (TensorFlow Lite)
        ↓
MongoDB Database

---

## ⚙️ Tech Stack

### Backend
- Python 3.11
- Flask
- MongoDB
- TensorFlow Lite
- NumPy
- Pillow

### Mobile
- React Native (Expo)
- Image Picker
- AsyncStorage

### DevOps
- Docker
- GitHub Actions
- CI/CD pipelines
- Containerized services

---

## 🤖 Machine Learning Pipeline

1. Dataset preparation
2. Transfer learning (MobileNet)
3. Fine‑tuning
4. SavedModel export
5. Conversion → TensorFlow Lite
6. API integration

---

## 📡 API Endpoints

### Health
GET /health

### Analyze
POST /v1/analyze

Form-data:
- image
- patient_id
- modality (eye | skin | nail)

### History
GET /v1/analyses/{patient_id}

---

## 🔐 Privacy & Compliance

- Patient consent required
- Secure storage
- Analysis logs saved
- No diagnosis generated
- Designed for HIPAA‑compatible deployment

---

## 📂 Project Structure

healthguard-vision/
│
├── api/
│   ├── routes/
│   ├── models/
│   ├── tests/
│   ├── Dockerfile
│   └── app.py
│
├── ml/
│   ├── train_multitask.py
│   ├── export_tflite.py
│
├── mobile/
│
├── infra/
│   └── docker-compose.yml
│
└── .github/workflows/

---

## 🧪 Automated Testing

CI pipeline runs:
- API tests
- Validation tests
- Dependency checks

---

## 🚀 Deployment Strategy

Production‑ready design supports:
- Container registry
- Cloud deployment
- Blue‑Green deployments
- Monitoring integration

---

## 📊 DevOps Principles Applied

- Automation
- Continuous Delivery
- Collaboration
- Monitoring readiness

---

## 📱 Mobile Features

- Camera capture
- Gallery upload
- Image preview
- Risk level results
- Medical recommendations
- Consent system

---

## ⚠️ Medical Disclaimer

HealthGuard Vision does NOT provide medical diagnosis.  
Always consult a healthcare professional.

---

## 🎓 Academic Context
Project developed as part of an Agile & DevOps engineering program.

---

## 👨‍💻 Author
VITALSCAN GROUP
