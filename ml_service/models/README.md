# 🧠 ML Model Weights Directory

Place your trained neural network weight files directly inside this folder:

```
ml_service/
└── models/
    ├── food_authenticity_model.pt     <-- PyTorch (.pt or .pth)
    │   OR
    ├── food_authenticity_model.h5     <-- TensorFlow / Keras (.h5 or SavedModel)
    │   OR
    └── model.onnx                     <-- ONNX Runtime
```

---

## How It Connects to Inference

Your inference script [`ml_service/model_training.py`](../model_training.py) will automatically check this directory for your weights file:

1. **Drop your weights file here** (e.g., `model.pt` or `model.h5`).
2. **In [`model_training.py`](../model_training.py)**, load the weights on startup:
   ```python
   import torch
   # Load weights
   model = torch.load("models/food_authenticity_model.pt")
   model.eval()
   ```
3. Inside `predict_image_authenticity(image_data)`, pass your preprocessed image tensor to `model(tensor)`.
