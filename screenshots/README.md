# BiteHub & FoodForensics Demonstration Kit

This directory contains full-resolution interface screenshots, demonstration recordings, and structured walkthrough documentation demonstrating the integration between the **BiteHub Customer Food Platform** and the **FoodForensics AI Media Audit Microservice**.

---

## 📁 Directory Overview

```
screenshots/
├── 01_bitehub_customer_interface.png               # BiteHub Customer Portal (Hero, Cuisines, Restaurants)
├── 02_restaurant_menu_interface.png                # Restaurant Menu & Ordering Cart Interface
├── 03_order_tracking_interface.png                 # Live Driver Telemetry & Radar Order Tracking
├── 04_refund_request_and_image_upload_interface.png # Complaint Reason & Food Photographic Evidence Preview
├── 05_refund_submitted_timeline.png               # Synchronized Customer Refund Claim Timeline
├── 06_foodforensics_ml_audit_console.png           # FoodForensics ML Inspection Console & Prediction Breakdown
├── 07_bitehub_system_operations_monitor.png        # BiteHub Operations Monitor & Real-Time Telemetry
├── 08_bitehub_admin_refunds_synchronized.png       # BiteHub Admin Synchronized Claim Resolution
├── video/
│   └── bitehub_ai_verification_demo.webm           # Automated Demonstration Video Recording (15 MB, 1440×900)
└── README.md                                       # Comprehensive Documentation & Video Script
```

---

## 🎬 Video Demonstration Walkthrough & Script

### **Video Link**: `[To be inserted after the final demonstration video is uploaded]`
* **Local Master Recording**: [`screenshots/video/bitehub_ai_verification_demo.webm`](./video/bitehub_ai_verification_demo.webm)
* **File Size**: 15 MB
* **Resolution**: 1440 × 900 (High Definition)
* **Production Features**:
  - **Interactive Step Banners**: Glassmorphism title overlays marking every phase from Problem Statement through ML Verification.
  - **Visible Animated Pointer**: Eased cursor trajectory with click-ripple animations.
  - **Human-Paced Interaction**: Character-by-character realistic typing and incremental smooth scrolling.
  - **Dedicated Viewing Pauses**: 2.5 to 3.5-second pauses on evidence preview, model prediction confidence, and system telemetry.

---

### Phase 1: Problem Context & Motivation
> **Narrative Script:**
> *"Online food delivery platforms face millions of dollars in losses annually due to fraudulent refund claims. Dishonest actors submit recycled internet photos, manipulated visuals, or staged claims to exploit instant-refund policies. BiteHub addresses this through end-to-end integration with FoodForensics—an independent neural verification microservice."*

---

### Phase 2: Customer Browsing & Ordering
* **Screenshot**: [`01_bitehub_customer_interface.png`](./01_bitehub_customer_interface.png) and [`02_restaurant_menu_interface.png`](./02_restaurant_menu_interface.png)
* **Demonstration Action**:
  1. Open BiteHub at `http://localhost:5173/`.
  2. Browse top-rated restaurants, cuisine filters (North Indian, Italian, Biryani, Desserts).
  3. Select items, configure options, and review cart.
  4. Track active order with real-time driver coordinates on the interactive radar map ([`03_order_tracking_interface.png`](./03_order_tracking_interface.png)).

---

### Phase 3: Refund Request & Evidence Photo Upload
* **Screenshot**: [`04_refund_request_and_image_upload_interface.png`](./04_refund_request_and_image_upload_interface.png)
* **Demonstration Action**:
  1. Open a delivered order (`ORD_DEMO_01`).
  2. Initiate a refund request via the customer claims workflow.
  3. Select complaint reason: **Food Quality Issue** / **Packaging Damaged**.
  4. Enter issue details: *"Takeout packaging was crushed and container lid opened during transit. Food was cold and sauce spilled across the package."*
  5. Upload smartphone camera photographic evidence (`sample_refund_evidence.jpg`).
  6. Confirm preview is displayed and submit the claim.

---

### Phase 4: Instant AI Verification & Telemetry Synchronization
* **Screenshot**: [`05_refund_submitted_timeline.png`](./05_refund_submitted_timeline.png)
* **Demonstration Action**:
  1. BiteHub dispatches an immediate asynchronous webhook to `http://localhost:8000/webhook/refund-submitted`.
  2. The customer's ticket updates with an audit reference and timestamped timeline.

---

### Phase 5: FoodForensics ML Audit Console
* **Screenshot**: [`06_foodforensics_ml_audit_console.png`](./06_foodforensics_ml_audit_console.png)
* **Demonstration Action**:
  1. Open FoodForensics Console at `http://localhost:8000/login`.
  2. Authenticate as ML Auditor (`admin@bitehub.com` / `MLAdmin@2026`).
  3. View the incoming queue in the Media Verification Console:
     - Inspection candidate: Order `#ORD_DEMO_01`
     - Evidence photo displayed with tamper-detection overlay.
     - Model prediction: Class probability breakdown, confidence score, and error bounds.
     - Explanation note: Inconclusive/review zone breakdown prompting human auditor sign-off.

---

### Phase 6: Claim Decision Synchronization
* **Screenshot**: [`07_ml_audit_claim_decision_updated.png`](./07_ml_audit_claim_decision_updated.png) & [`09_bitehub_admin_refunds_synchronized.png`](./09_bitehub_admin_refunds_synchronized.png)
* **Demonstration Action**:
  1. Auditor reviews evidence and clicks **Approve** (or **Reject**).
  2. The decision immediately triggers a webhook sync back to BiteHub Server (`http://localhost:5001/api/refunds/:id/status`).
  3. The refund ticket on BiteHub updates to verified state without requiring manual re-entry.

---

### Phase 7: BiteHub System Operations Monitor
* **Screenshot**: [`08_bitehub_system_operations_monitor.png`](./08_bitehub_system_operations_monitor.png)
* **Demonstration Action**:
  1. Authenticate to BiteHub Admin (`admin@example.com` / `Admin@123`).
  2. Navigate to `http://localhost:5173/admin/system-monitor`.
  3. Inspect real-time operational health:
     - SQLite Database health and query performance.
     - Active WebSocket connections for driver dispatch and telemetry.
     - Node process uptime and memory allocation buffer.
     - Real-time HTTP access log telemetry.

---

## 🛠 Re-running the Demonstration & Automation
To regenerate all screenshots and video at any time, run:
```bash
node scripts/capture_demo.js
```
