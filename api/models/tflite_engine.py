import os
import io
import numpy as np
from PIL import Image

try:
    import tflite_runtime.interpreter as tflite
except Exception:
    tflite = None


class MultiTaskTFLiteEngine:
    """
    Modèle attendu :
      - input  : [1, H, W, 3] float32
      - outputs: 3 sorties (diabetes, anemia, nutrition)
    """

    def __init__(self, models_dir: str):
        self.models_dir = models_dir
        self.model_path = os.path.join(models_dir, "model.tflite")

        self.interpreter = None
        self.input_details = None
        self.output_details = None

        self.model_versions = {
            "diabetes": "m1.0.0",
            "anemia": "m1.0.0",
            "nutrition": "m1.0.0"
        }

        self._load()

    def _load(self):
        if tflite is None:
            print("⚠️ tflite-runtime not available → heuristic fallback mode enabled")
            return

        if not os.path.exists(self.model_path):
            print("⚠️ model.tflite not found → heuristic fallback mode enabled")
            return

        try:
            self.interpreter = tflite.Interpreter(model_path=self.model_path)
            self.interpreter.allocate_tensors()
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            print("✅ TFLite model loaded successfully")
        except Exception as e:
            print(f"❌ Failed to load TFLite model: {e}")
            self.interpreter = None

    # ---------------------------
    # QUALITY CHECK (bloque photos absurdes)
    # ---------------------------
    def quality_check(self, image_bytes: bytes) -> dict:
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception:
            return {"ok": False, "reasons": ["invalid_image_format"]}

        w, h = img.size
        arr = np.asarray(img).astype(np.float32) / 255.0

        brightness = float(arr.mean())
        contrast = float(arr.std())

        gray = (0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2])
        gy, gx = np.gradient(gray)
        sharpness = float((gx * gx + gy * gy).mean())

        ok = True
        reasons = []

        if w < 200 or h < 200:
            ok = False
            reasons.append("resolution_too_low")
        if brightness < 0.15:
            ok = False
            reasons.append("too_dark")
        if contrast < 0.03:
            ok = False
            reasons.append("low_contrast")
        if sharpness < 0.0008:
            ok = False
            reasons.append("too_blurry")

        return {
            "ok": ok,
            "reasons": reasons,
            "width": w,
            "height": h,
            "brightness": brightness,
            "contrast": contrast,
            "sharpness": sharpness,
        }

    # ---------------------------
    # PREPROCESS (TFLite)
    # ---------------------------
    def _preprocess(self, image_bytes: bytes) -> np.ndarray:
        if not self.input_details:
            raise RuntimeError("Model input details not available")

        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception:
            raise ValueError("Invalid image format")

        _, height, width, _ = self.input_details[0]["shape"]
        img = img.resize((width, height))
        arr = np.array(img).astype(np.float32) / 255.0
        arr = np.expand_dims(arr, axis=0)
        return arr

    # ---------------------------
    # HEURISTIC FEATURES (fallback)
    # ---------------------------
    def _simple_features(self, image_bytes: bytes) -> dict:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((256, 256))
        arr = np.asarray(img).astype(np.float32) / 255.0

        mean_rgb = arr.mean(axis=(0, 1))
        std_rgb = arr.std(axis=(0, 1))

        # saturation approximée
        mx = arr.max(axis=2)
        mn = arr.min(axis=2)
        sat = float(np.mean((mx - mn) / (mx + 1e-6)))

        brightness = float(arr.mean())
        contrast = float(arr.std())

        # indices couleur simples
        r, g, b = mean_rgb
        redness = float((r - (g + b) / 2.0))
        yellowness = float(((r + g) / 2.0 - b))

        return {
            "brightness": brightness,
            "contrast": contrast,
            "sat": sat,
            "redness": redness,
            "yellowness": yellowness,
            "mean_r": float(r),
            "mean_g": float(g),
            "mean_b": float(b),
            "std_r": float(std_rgb[0]),
            "std_g": float(std_rgb[1]),
            "std_b": float(std_rgb[2]),
        }

    def _clamp01(self, x: float) -> float:
        return float(np.clip(x, 0.0, 1.0))

    def _heuristic_predict(self, image_bytes: bytes, modality: str) -> dict:
        """
        ⚠️ Ce n'est PAS un diagnostic médical.
        C'est un fallback "concret" qui varie selon les pixels
        pour tester l'appli end-to-end.
        """
        f = self._simple_features(image_bytes)

        # Base modulée par qualité visuelle (contrast/sat)
        base = 0.35 + 0.25 * f["contrast"] + 0.20 * f["sat"]

        # Ajustements par modality (juste pour différencier comportement)
        if modality == "eye":
            # plus de rouge/contraste → score un peu plus élevé
            diabetes = base + 0.20 * max(0.0, f["redness"]) + 0.10 * f["contrast"]
            anemia = base + 0.15 * max(0.0, 0.25 - f["sat"]) + 0.05 * (0.45 - f["mean_r"])
            nutrition = base + 0.10 * max(0.0, 0.20 - f["sat"]) + 0.10 * (0.55 - f["brightness"])
        elif modality == "skin":
            diabetes = base + 0.10 * max(0.0, f["yellowness"]) + 0.05 * (0.45 - f["brightness"])
            anemia = base + 0.20 * max(0.0, 0.20 - f["mean_r"]) + 0.05 * (0.35 - f["sat"])
            nutrition = base + 0.15 * max(0.0, 0.18 - f["sat"]) + 0.10 * (0.50 - f["brightness"])
        else:  # nail
            diabetes = base + 0.05 * max(0.0, f["yellowness"]) + 0.05 * f["contrast"]
            anemia = base + 0.25 * max(0.0, 0.22 - f["mean_r"]) + 0.10 * max(0.0, 0.30 - f["sat"])
            nutrition = base + 0.20 * max(0.0, 0.22 - f["sat"]) + 0.08 * (0.55 - f["brightness"])

        return {
            "diabetes_risk": self._clamp01(diabetes),
            "anemia_risk": self._clamp01(anemia),
            "nutrition_deficiency_risk": self._clamp01(nutrition),
        }

    # ---------------------------
    # INFERENCE
    # ---------------------------
    def predict(self, image_bytes: bytes, modality: str = "eye") -> dict:
        # ✅ Fallback heuristic mode (si modèle absent)
        if self.interpreter is None:
            return self._heuristic_predict(image_bytes, modality=modality)

        try:
            x = self._preprocess(image_bytes)

            self.interpreter.set_tensor(
                self.input_details[0]["index"],
                x
            )
            self.interpreter.invoke()

            outputs = []
            for od in self.output_details[:3]:
                y = self.interpreter.get_tensor(od["index"])
                y = float(np.squeeze(y))
                outputs.append(np.clip(y, 0.0, 1.0))

            return {
                "diabetes_risk": float(outputs[0]),
                "anemia_risk": float(outputs[1]),
                "nutrition_deficiency_risk": float(outputs[2])
            }

        except Exception as e:
            print(f"❌ Inference error: {e}")
            return self._heuristic_predict(image_bytes, modality=modality)
