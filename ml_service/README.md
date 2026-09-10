# BiteHub Media Audit & Verification Microservice

Independent Python FastAPI service that ingests refund claims and image evidence via webhook, runs authenticity inference models (`model_training.py`), and provides an administrative console for reviewing claim telemetry and approving/rejecting refund requests.

---

## Quickstart

### 1. Install Dependencies
```bash
cd ml_service
pip install -r requirements.txt
```

### 2. Start the Service
```bash
python main.py
```
Or with uvicorn:
```bash
uvicorn main.py:app --port 8000 --reload
```

---

## Endpoints & Console

* **Console Login**: `http://localhost:8000/login`
  * **Email**: `admin@bitehub.com` (or `mlexpert@ai-detector.org`)
  * **Password**: `MLAdmin@2026`
* **Inspection Dashboard**: `http://localhost:8000/dashboard`
* **Webhook Receiver**: `POST http://localhost:8000/webhook/refund-submitted`
* **Telemetry API**: `GET http://localhost:8000/api/history`

---

## Model Pipeline & Custom Weights

To plug in custom weights or a specialized neural network:
1. Edit [`model_training.py`](model_training.py).
2. Load weights (`torch.load`, `tf.keras.models.load_model`, ONNX runtime, etc.).
3. Update `predict_image_authenticity(image_data)` to return model classifications and confidence scores.
