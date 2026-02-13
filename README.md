
# 🚀 HealthGuard Vision — AI Preventive Screening Platform

## 📌 Overview
HealthGuard Vision est un système de dépistage préventif basé sur l'intelligence artificielle qui analyse les images prises avec un smartphone afin d'évaluer les risques précoces pour la santé.

L'application analyse :
- Les yeux
- La peau
- Les ongles

Risques estimés :
- Anémie
- Diabète
- Carences nutritionnelles

⚠️ Cette application est uniquement un outil de dépistage et n'est PAS un système de diagnostic médical.

---

## 🧠 Concept
L'objectif est de démocratiser la sensibilisation précoce à la santé en permettant aux utilisateurs d'effectuer des dépistages préliminaires directement depuis leur smartphone à l'aide de l'IA.

---

## 🏗 Architecture

Mobile App (React Native)
        ↓
REST API (Flask + Gunicorn)
        ↓
Moteur ML (TensorFlow Lite)
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
- Services conteneurisés

---

## 🤖 Machine Learning Pipeline

1. Préparation du jeu de données
2. Transfert d'apprentissage (MobileNet)
3. Réglage fin
4. Exportation du modèle enregistré
5. Conversion → TensorFlow Lite
6. Intégration de l'API

---

## 📡 API Endpoints

### Health
GET /health

### Analyze
POST /v1/analyze

Form-data:
- image
- patient_id
- modality (œil | peau | ongle)

### Histoire
GET /v1/analyses/{patient_id}

---

## 🔐 Confidentialité et conformité

- Consentement du patient requis
- Stockage sécurisé
- Journaux d'analyse enregistrés
- Aucun diagnostic généré
- Conçu pour un déploiement compatible HIPAA

---

## 📂 Project Structure

```text
healthguard-vision/
├── api/
│   ├── routes/
│   ├── models/
│   ├── tests/
│   ├── Dockerfile
│   └── app.py
├── ml/
│   ├── train_multitask.py
│   └── export_tflite.py
├── mobile/
├── infra/
│   └── docker-compose.yml
└── .github/workflows/

---

## 🧪 Automated Testing

Le pipeline CI exécute :
- Tests API
- Tests de validation
- Vérifications des dépendances

---

## 🚀 Stratégie de déploiement

La conception prête pour la production prend en charge :
- Le registre de conteneurs
- Le déploiement dans le cloud
- Les déploiements bleu-vert
- L'intégration de la surveillance

---

## 📊 Principes DevOps appliqués

- Automatisation
- Livraison continue
- Collaboration
- Surveillance de l'état de préparation

---

## 📱 Fonctionnalités mobiles

- Capture photo
- Téléchargement dans la galerie
- Aperçu des images
- Résultats du niveau de risque
- Recommandations médicales
- Système de consentement

---

## ⚠️ Avertissement médical

HealthGuard Vision ne fournit PAS de diagnostic médical.  
Consultez toujours un professionnel de santé.

---

## 🎓 Contexte académique
Projet développé dans le cadre d'un programme d'ingénierie Agile & DevOps.

---

## 👨‍💻 Auteur
VITALSCAN GROUP
