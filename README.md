# 🍔 Capstone Food Delivery App

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.18-green.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey.svg)](https://www.sqlite.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black.svg)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)](https://tailwindcss.com/)

**Capstone Food App** is a full-stack, enterprise-grade food delivery application featuring restaurant discovery, menu customization, real-time driver telemetry tracking, AI-powered nutritional image analysis, automated refund processing, and an interactive **Visual Operations & System Monitor** for platform administrators.

---

## ✨ Features Breakdown

### 🛒 1. Customer Experience & Ordering System
* **Dynamic Restaurant Discovery**: Filter by cuisine, dietary options (Veg/Jain/Gluten-Free), ratings, delivery times, and price points.
* **Smart Menu & Cart**: Multi-item cart validation, cross-restaurant order safeguards, tax & delivery charge calculations.
* **Real-Time GPS Order Tracking**: Live driver telemetry powered by **WebSockets (Socket.io)** displaying real-time vehicle movement (`lat`, `lng`, `ETA`).
* **AI Food Image Analysis**: Drag-and-drop food image inspection estimating caloric content, macro nutrients, and health recommendations.
* **Order History & Instant Refunds**: In-app refund claims with automated eligibility checks and live progress tracking.

### 🛡️ 2. Production Security & Data Validation
* **Strict Payload Validation**: Zod schema validation (`server/middleware/validate.js`) guarding all authentication and transaction endpoints.
* **Rate Limiting**: `express-rate-limit` safeguards against brute-force login attacks and API exploitation.
* **Security Headers**: **Helmet** dynamic headers enforcing HTTP security standards (XSS protection, HSTS, frame options).

### 📊 3. Admin Operations Console & System Monitor (`/admin/system-monitor`)
* **Real-Time System Telemetry**: Live CPU/Memory health metrics, active SQLite connections, and WebSocket client counts.
* **Terminal-Style HTTP Log Stream**: Interactive real-time server activity console logging all incoming REST calls and status codes.
* **Live Database Inspector**: Browse, query, and verify raw database records across `Users`, `Restaurants`, `Orders`, and `Refunds`.
* **1-Click Test Event Generators**: Trigger simulated live orders or driver GPS updates directly from the dashboard.

---

## 🛠️ Technology Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Framer Motion |
| **Backend API** | Node.js, Express.js, SQLite (`better-sqlite3`), Socket.io, Zod, Nodemailer |
| **Security & Middleware** | Helmet, Express Rate Limit, Cors, Zod Validation |
| **DevOps & Cloud** | Docker, Render manifest (`render.yaml`), npm-run-all |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/atharwa16/capstone-project-food-app.git
   cd capstone-project-food-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Full-Stack App (Frontend + Backend concurrently)**:
   ```bash
   npm run dev:all
   ```
   * **Frontend Application**: `http://localhost:5173`
   * **Express REST & WebSocket Server**: `http://localhost:5000`

---

## 🔑 Demo Credentials

Quick login credentials pre-populated in the database for easy demonstration:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@bitehub.com` | `admin123` | Full Access + `/admin/system-monitor` |
| **Customer (Rahul)** | `rahul@example.com` | `user123` | Customer Ordering & Refunds |
| **Customer (Priya)** | `priya@example.com` | `user123` | Customer Ordering & Refunds |

---

## 🔌 API Reference Overview

### Authentication (`/api/auth`)
* `POST /api/auth/signup` — Register new user (Zod validated)
* `POST /api/auth/login` — Login user with rate-limit protection

### Restaurants & Menus (`/api/restaurants`)
* `GET /api/restaurants` — List all restaurants with menu counts
* `GET /api/restaurants/:id` — Get restaurant detail with full menu items

### Orders & Tracking (`/api/orders`)
* `POST /api/orders` — Place new food order
* `GET /api/orders/user/:userId` — Fetch order history for a customer
* `GET /api/orders/:id` — Fetch order details & telemetry status

### Admin Operations (`/api/admin`)
* `GET /api/admin/system-status` — Fetch live server health metrics & system logs
* `POST /api/admin/clear-logs` — Clear active HTTP log buffer

---

## ☁️ Deployment

### Running with Docker

```bash
# Build Docker Image
docker build -t capstone-food-app .

# Run Docker Container
docker run -p 5000:5000 -p 5173:5173 capstone-food-app
```

### Cloud Deployment (Render / Railway)
The project includes a production `render.yaml` manifest. You can connect your GitHub repository directly to [Render](https://render.com) for automatic 1-click full-stack deployment.

---

## 📄 License
This project is released under the **MIT License**.
