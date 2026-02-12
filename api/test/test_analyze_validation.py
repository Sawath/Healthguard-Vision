from app import create_app
import io

def test_analyze_requires_image():
    app = create_app()
    c = app.test_client()
    r = c.post("/v1/analyze", data={"patient_id":"p1","modality":"eye"})
    assert r.status_code == 400

def test_analyze_requires_patient_id():
    app = create_app()
    c = app.test_client()
    fake = (io.BytesIO(b"fake"), "x.jpg")
    r = c.post("/v1/analyze", data={"modality":"eye","image": fake}, content_type="multipart/form-data")
    assert r.status_code == 400
