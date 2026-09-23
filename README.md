# 🍔 BiteHub & FoodForensics AI Platform

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.2-green.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey.svg)](https://www.sqlite.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal.svg)](https://fastapi.tiangolo.com/)
[![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime-1.15+-yellow.svg)](https://onnxruntime.ai/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black.svg)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-cyan.svg)](https://tailwindcss.com/)

**BiteHub** is an enterprise-grade full-stack food delivery application integrated with an AI-powered visual forensics pipeline (**FoodForensics**). It pairs modern customer ordering, real-time driver GPS tracking, and administrator operations with deep-learning image forensics (EfficientNetV2-S ONNX) to automatically detect fraudulent or manipulated food refund claims.

---

## 🏛️ System Architecture

The platform runs as a coordinated three-tier system:

```text
┌─────────────────────────────────────────────────────────────┐
│                 Client Browser (Vite / React)               │
│                     http://localhost:5173                   │
└──────────────┬───────────────────────────────┬──────────────┘
               │ REST / WebSocket              │ Direct Console
               ▼                               ▼
┌───────────────────────────────┐     ┌─────────────────────────────────┐
│     BiteHub Node.js API       │     │     FoodForensics ML Service    │
│    (Express + SQLite3 + WS)   │◄───►│   (FastAPI + ONNX Runtime)      │
│      http://localhost:5001    │Sync │       http://localhost:8000     │
└───────────────────────────────┘     └─────────────────────────────────┘
```

1. **BiteHub Frontend (`localhost:5173`)**: Customer storefront, menu customizer, live order tracking, and refund submission with image uploads.
2. **BiteHub Backend Server (`localhost:5001`)**: REST API, SQLite database with transactions, user session management, WebSocket driver telemetry, and webhook communication.
3. **FoodForensics AI Engine (`localhost:8000`)**: Standalone FastAPI service running an ONNX-optimized **EfficientNetV2-S** neural network with temperature-scaled calibration for image forgery detection, complete with an interactive **Media Audit Console** (`/dashboard`).

---

## ✨ Key Features

### 🛒 1. Customer Ordering & Real-Time Tracking
- **Restaurant Discovery**: Filter by cuisine, dietary options (Veg/Jain/Gluten-Free), ratings, and delivery times.
- **Cart & Order Flow**: Multi-item validation, delivery fee calculation, and order placement.
- **Live GPS Telemetry**: WebSockets (`Socket.io`) dispatching real-time simulated driver updates (`lat`, `lng`, `ETA`).
- **Instant Refund Filing**: Customer claim flow with photo upload for tampered, damaged, or incorrect food items.

### 🔬 2. FoodForensics AI Verification Engine
- **Model Architecture**: Pre-trained **EfficientNetV2-S** (`tf_efficientnetv2_s.in21k_ft_in1k`) converted to ONNX runtime for ultra-fast, CPU-friendly inference (<150ms).
- **Temperature-Scaled Calibration**: Calibrated decision boundaries avoiding raw sigmoid overconfidence:
  - **Authentic (`p_manip ≤ 0.20`)**: Verified real photo — eligible for automated refund approval.
  - **Uncertain (`0.20 < p_manip < 0.95`)**: Flagged for human review in the ML Audit Console.
  - **Manipulated / AI-Generated (`p_manip ≥ 0.95`)**: Tampered or AI-generated artifact detected.
- **Bi-Directional Webhook Sync**: When a refund is requested on BiteHub, it immediately syncs to the ML engine for analysis. Decisions made in the ML Audit Console sync back to update the BiteHub refund status.

### 🛡️ 3. Operations & System Monitor
- **BiteHub System Monitor** (`/admin/system-monitor`): Live CPU/Memory health metrics, WebSocket connections, raw database explorer, and event triggers.
- **ML Audit Console** (`http://localhost:8000/dashboard`): Dedicated dashboard for auditing flagged images, reviewing model confidence scores, and approving/rejecting refund tickets.

---

## 💻 Setup Guide: Installing on Another Device

Follow these instructions to clone, install, and run the entire platform on a new device (macOS, Linux, or Windows).

### 📋 Prerequisites

Ensure your system has the following installed:
- **Git**: [git-scm.com](https://git-scm.com/)
- **Node.js**: `v18.0.0` or `v20.x` or higher ([nodejs.org](https://nodejs.org/))
- **Python**: `3.10` or higher (with `pip` and `venv`) ([python.org](https://www.python.org/))

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/atharwa16/capstone-project-food-app.git
cd capstone-project-food-app
```

---

### Step 2: Install Node.js Dependencies (Frontend & Backend)

From the project root directory, install all required Node.js packages:

```bash
npm install
```

---

### Step 3: Set Up Python ML Service & Virtual Environment

The ML service uses a dedicated Python virtual environment to avoid dependency conflicts.

#### On macOS / Linux:

```bash
cd ml_service

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Return to root directory
cd ..
```

#### On Windows (PowerShell):

```powershell
cd ml_service

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Note: If script execution is restricted, run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Return to root directory
cd ..
```

#### Verify Model Files
Verify that the following files are present inside `ml_service/models/food_forensics_v1/`:
- `model.onnx` (the trained ONNX model weights)
- `pipeline.py` (model preprocessing & inference logic)
- `classes.json`
- `config.json`
- `temperature.json`

*(All of these files are included in the repository).*

---

### Step 4: Run the Application Services

To run all features, launch the three services in separate terminal windows:

#### Terminal 1 — BiteHub Backend Server (Port 5001)
```bash
# In the project root:
npm run server
```
*Console should log:* `🚀 BiteHub Server running on http://localhost:5001` and `✅ Database tables verified.`

---

#### Terminal 2 — FoodForensics ML Service (Port 8000)
**On macOS / Linux:**
```bash
cd ml_service
source .venv/bin/activate
python main.py
```

**On Windows:**
```powershell
cd ml_service
.\.venv\Scripts\activate
python main.py
```
*Console should log:* `[FoodForensics] Loading ONNX model from ...` and `Application startup complete.`

---

#### Terminal 3 — BiteHub Frontend Client (Port 5173)
```bash
# In the project root:
npm run dev
```
*Console should log:* `VITE v6.x ready in ... http://localhost:5173`

---

## 🌐 Network Map & Service URLs

| Service | URL | Description |
| :--- | :--- | :--- |
| **BiteHub Web App** | `http://localhost:5173` | Customer storefront, ordering, live tracking, and refund filing |
| **BiteHub Backend API** | `http://localhost:5001` | Express REST API, SQLite queries, and WebSocket server |
| **System Operations Console** | `http://localhost:5173/admin/system-monitor` | Real-time system health, database inspector, and log stream |
| **ML Audit Console** | `http://localhost:8000/dashboard` | Visual media forensic inspection and refund claim audit console |
| **ML Service API Docs** | `http://localhost:8000/docs` | Interactive Swagger API documentation for ML endpoints |

---

## 🔑 Demo Login Credentials

The SQLite database is automatically seeded on first launch with sample accounts:

### 1. Customer Accounts (BiteHub App)
| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Aarav Sharma** | `aarav@example.com` | `Demo@123` | Customer |
| **Priya Mehta** | `priya@example.com` | `Demo@123` | Customer |
| **Rohan Verma** | `rohan@example.com` | `Demo@123` | Customer |

### 2. Administrator Accounts (BiteHub & System Monitor)
| Name | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin User** | `admin@example.com` | `Admin@123` | Full Access + `/admin/system-monitor` |

### 3. ML Media Audit Console (`http://localhost:8000/login`)
| Email | Password | Description |
| :--- | :--- | :--- |
| `admin@bitehub.com` | `Admin@123` | Platform Admin |
| `admin@example.com` | `Admin@123` | Master Admin |
| `mlexpert@ai-detector.org` | `MLAdmin@2026` | Forensic Auditor |

---

## 🧪 Testing the AI Refund Flow End-to-End

To see the real-time AI classification and sync in action:

1. Open `http://localhost:5173` in your browser.
2. Sign in as `aarav@example.com` / `Demo@123`.
3. Add food items to your cart and place an order.
4. Go to **Orders** from the top navigation bar.
5. Click **Request Refund** on any delivered or placed order.
6. Select a reason (e.g. *"Spoiled / Unhygienic"*), write a brief note, and upload a food photo:
   - Uploading an authentic photo will be classified as **REAL / AUTHENTIC**.
   - Uploading an edited/AI-generated photo will be flagged as **UNCERTAIN** or **AI_GENERATED**.
7. Submit the claim.
8. Open the **ML Audit Console** at `http://localhost:8000/dashboard` (login with `admin@example.com` / `Admin@123`).
9. You will immediately see the ticket, the uploaded image preview, the model's prediction, and confidence score.
10. Click **Approve** or **Reject** in the ML Audit Console — the status updates immediately and syncs back to BiteHub.

---

## 🛠️ Project Structure

```text
capstone-project-food-app/
├── ml_service/                       # Python FoodForensics Microservice
│   ├── models/
│   │   └── food_forensics_v1/        # Trained EfficientNetV2-S ONNX Bundle
│   │       ├── model.onnx            # Pre-trained ONNX neural network weights
│   │       ├── pipeline.py           # Self-contained preprocessing & inference engine
│   │       ├── classes.json          # Label mappings
│   │       ├── config.json           # Model metadata & normalization parameters
│   │       └── temperature.json      # Calibrated temperature scaling parameter
│   ├── main.py                       # FastAPI application & ML audit web console
│   ├── model_training.py             # Inference bridge between FastAPI and ONNX pipeline
│   ├── ml_history.json               # Persisted audit history and verdicts
│   └── requirements.txt              # Python package requirements
├── server/                           # BiteHub Node.js Express Backend
│   ├── middleware/                   # Security, rate limiting, and Zod validators
│   ├── routes/                       # REST routes (auth, orders, refunds, restaurants)
│   ├── sockets/                      # Socket.io live driver telemetry simulation
│   ├── db.js                         # SQLite initialization and seed loader
│   ├── seedData.js                   # Seed restaurants, menus, and dishes
│   └── index.js                      # Express server entry point
├── src/                              # Vite + React Frontend Application
│   ├── components/                   # Shared UI components and layout
│   ├── contexts/                     # Auth, Cart, and Orders state contexts
│   ├── pages/                        # Home, Restaurant, Orders, Admin Monitor views
│   └── App.tsx                       # Main application router
├── package.json                      # Node.js dependencies and script runners
├── vite.config.ts                    # Vite config with backend proxy (/api -> 5001)
└── README.md                         # Project documentation
```

---

## ❓ Troubleshooting & FAQs

### 1. `EADDRINUSE: address already in use :::5001` or `:::8000`
Another instance of the backend or ML service is already running on that port.
- **macOS / Linux**:
  ```bash
  lsof -ti :5001 | xargs kill -9
  lsof -ti :8000 | xargs kill -9
  ```
- **Windows (PowerShell)**:
  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5001).OwningProcess -Force
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
  ```

### 2. `Execution of scripts is disabled on this system` (Windows)
When activating Python virtual environments in Windows PowerShell:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### 3. `PayloadTooLargeError: request entity too large`
Large base64 photo uploads are supported up to **10MB**. Both `server/index.js` and `ml_service/main.py` are configured to accept payloads up to 10MB.

### 4. `ModuleNotFoundError: No module named 'onnxruntime'`
Ensure you have activated the virtual environment inside `ml_service`:
```bash
cd ml_service
source .venv/bin/activate   # (or .\.venv\Scripts\activate on Windows)
pip install -r requirements.txt
```

---

## 📄 License
This project is developed for educational and demonstration purposes under the **MIT License**.
