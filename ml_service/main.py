import json
import os
import sys
import time
from typing import Optional
from fastapi import FastAPI, Request, Response, HTTPException, status
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from model_training import predict_image_authenticity, load_and_preprocess_dataset

# Force UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

app = FastAPI(title="BiteHub Media Audit Service", version="1.0.0")

@app.on_event("startup")
def on_startup():
    info = load_and_preprocess_dataset()
    print(f"[ML Service] Initialized. Dataset samples: {info.get('num_samples', 0)}, classes: {info.get('classes', [])}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HISTORY_FILE = os.path.join(os.path.dirname(__file__), "ml_history.json")
BITEHUB_API_URL = os.environ.get("BITEHUB_API_URL", "http://localhost:5001/api")

def load_history():
    if not os.path.exists(HISTORY_FILE):
        save_history([])
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_history(records):
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)
    except Exception as e:
        print("[ML Service] Error persisting history:", e)

def is_authenticated(request: Request) -> bool:
    session = request.cookies.get("ml_admin_session")
    return session == "authenticated_admin_token"

# ─── GET /login ───────────────────────────────────────────────────────────────
@app.get("/login", response_class=HTMLResponse)
def get_login_page(request: Request):
    if is_authenticated(request):
        return RedirectResponse(url="/dashboard", status_code=303)

    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BiteHub — Media Audit Console</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6 antialiased selection:bg-slate-700 selection:text-white">
  <div class="w-full max-w-md">
    
    <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-8 shadow-xl space-y-6">
      <div class="space-y-2">
        <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-200">
          <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 class="text-xl font-semibold text-white tracking-tight">Media Verification Console</h1>
        <p class="text-xs text-slate-400">Authenticate to inspect customer claims and visual telemetry.</p>
      </div>

      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">Administrator Email</label>
          <input 
            type="email" 
            id="email" 
            required 
            placeholder="admin@bitehub.com"
            class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition" 
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-medium text-slate-300">Password</label>
            <button type="button" id="togglePasswordBtn" class="text-xs text-slate-400 hover:text-slate-200 focus:outline-none transition">Show</button>
          </div>
          <input 
            type="password" 
            id="password" 
            required 
            placeholder="••••••••••••"
            class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition" 
          />
        </div>

        <div id="errMsg" class="hidden text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 p-3 rounded-lg"></div>

        <button 
          type="submit" 
          id="submitBtn"
          class="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-sm text-sm"
        >
          Sign in
        </button>
      </form>

      <div class="pt-4 border-t border-slate-800/80 text-center">
        <p class="text-xs text-slate-500">Authorized personnel only. All access is logged.</p>
      </div>
    </div>
  </div>

  <script>
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePasswordBtn');
    toggleBtn.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'Hide';
      } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = 'Show';
      }
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const errMsg = document.getElementById('errMsg');
      const submitBtn = document.getElementById('submitBtn');

      errMsg.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Authenticating...';

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (res.ok) {
          window.location.href = '/dashboard';
        } else {
          const data = await res.json();
          errMsg.textContent = data.detail || 'Invalid login credentials.';
          errMsg.classList.remove('hidden');
        }
      } catch (err) {
        errMsg.textContent = 'Network error. Verify service connectivity.';
        errMsg.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign in';
      }
    });
  </script>
</body>
</html>"""

# ─── POST /api/login ──────────────────────────────────────────────────────────
@app.post("/api/login")
async def api_login(request: Request, response: Response):
    body = await request.json()
    email = body.get("email", "").strip()
    password = body.get("password", "").strip()

    # Accept configured admin credentials
    allowed_emails = {"mlexpert@ai-detector.org", "admin@bitehub.com", "admin@example.com"}
    allowed_passwords = {"MLAdmin@2026", "Admin@123"}
    if email in allowed_emails and password in allowed_passwords:
        response.set_cookie(key="ml_admin_session", value="authenticated_admin_token", max_age=86400, httponly=True)
        return {"success": True, "message": "Authenticated."}
    
    raise HTTPException(status_code=401, detail="Invalid email or password.")

# ─── GET /logout ──────────────────────────────────────────────────────────────
@app.get("/logout")
def logout(response: Response):
    res = RedirectResponse(url="/login", status_code=303)
    res.delete_cookie("ml_admin_session")
    return res

# ─── GET / & GET /dashboard ───────────────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
@app.get("/dashboard", response_class=HTMLResponse)
def get_dashboard(request: Request):
    if not is_authenticated(request):
        return RedirectResponse(url="/login", status_code=303)

    records = load_history()
    total_count = len(records)
    real_count = sum(1 for r in records if r.get("prediction", {}).get("is_authentic") is True)
    fake_count = sum(1 for r in records if r.get("prediction", {}).get("is_authentic") is False)

    real_pct = f"{round((real_count / total_count * 100), 1)}%" if total_count > 0 else "—"
    fake_pct = f"{round((fake_count / total_count * 100), 1)}%" if total_count > 0 else "—"

    rows_html = ""
    for r in records:
        pred = r.get("prediction", {})
        is_real = pred.get("is_authentic", True)
        confidence = pred.get("confidence_score", 0.0)
        pct = int(confidence * 100) if confidence else 0
        img_url = r.get("image")

        tb = pred.get("texture_breakdown", {})
        organic_entropy = tb.get("organic_entropy", "Standard")
        diffusion_noise = tb.get("diffusion_noise", "None")

        if is_real:
            badge_html = f"""
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/50">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Authentic ({pct}%)
            </span>
            """
        else:
            badge_html = f"""
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-950/40 text-rose-300 border border-rose-800/50">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Synthetic / Flagged ({pct}%)
            </span>
            """

        status_val = r.get("status", "PENDING")
        if status_val == "APPROVED":
            status_html = '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">Approved</span>'
        elif status_val == "REJECTED":
            status_html = '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-950/50 text-rose-400 border border-rose-800/50">Rejected</span>'
        else:
            status_html = '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-950/50 text-amber-400 border border-amber-800/50">Pending</span>'

        image_cell = f"""
        <a href="{img_url}" target="_blank" rel="noopener noreferrer" class="block w-12 h-12 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/60 hover:opacity-80 transition">
          <img src="{img_url}" alt="Claim Evidence" class="w-full h-full object-cover" />
        </a>
        """ if img_url else '<span class="text-xs text-slate-500">No media</span>'

        rows_html += f"""
        <tr class="hover:bg-slate-900/60 transition-colors">
          <td class="px-5 py-3.5 font-mono text-xs text-slate-300 font-medium whitespace-nowrap">
            #{r.get('orderId', '—')}
          </td>
          <td class="px-5 py-3.5">
            <div class="text-xs font-medium text-slate-200">{r.get('customerName') or 'Customer'}</div>
            <div class="text-[11px] text-slate-400">{r.get('customerEmail') or '—'}</div>
            <div class="text-[11px] text-slate-500 font-mono">{r.get('customerPhone') or '—'}</div>
          </td>
          <td class="px-5 py-3.5">
            <div class="text-xs text-slate-300">{r.get('restaurantName') or 'Merchant'}</div>
            <div class="text-[11px] text-slate-400 mt-0.5 font-mono">{r.get('reason') or '—'}</div>
          </td>
          <td class="px-5 py-3.5 text-xs text-slate-200 font-medium whitespace-nowrap">
            ₹{r.get('amount', 0)}
          </td>
          <td class="px-5 py-3.5">
            {image_cell}
          </td>
          <td class="px-5 py-3.5">
            {badge_html}
            <div class="mt-1 text-[11px] text-slate-400 space-y-0.5">
              <div><span class="text-slate-500">Entropy:</span> {organic_entropy}</div>
              <div><span class="text-slate-500">Noise:</span> {diffusion_noise}</div>
            </div>
          </td>
          <td class="px-5 py-3.5 whitespace-nowrap">
            {status_html}
          </td>
          <td class="px-5 py-3.5 text-right whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5">
              <button onclick="syncDecision('{r.get('refundId')}', 'APPROVED')" class="px-2.5 py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 rounded-md transition">
                Approve
              </button>
              <button onclick="syncDecision('{r.get('refundId')}', 'REJECTED')" class="px-2.5 py-1 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/60 rounded-md transition">
                Reject
              </button>
            </div>
          </td>
        </tr>
        """

    empty_state_html = """
    <tr>
      <td colspan="8" class="px-6 py-16 text-center">
        <div class="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p class="text-sm font-medium text-slate-300">No audit records yet</p>
        <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">Live refund telemetry and media submissions from BiteHub will appear here automatically.</p>
      </td>
    </tr>
    """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BiteHub — Media Audit Console</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }}
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen antialiased">
  
  <!-- Navigation Header -->
  <header class="bg-slate-900 border-b border-slate-800/80 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-sm text-white tracking-tight">BiteHub Media Audit</span>
          <span class="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">v1.0</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Service Operational</span>
        </div>
        <div class="h-4 w-px bg-slate-800"></div>
        <a href="/logout" class="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition">
          Sign out
        </a>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-6 py-8 space-y-6">
    
    <!-- Header Summary & KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-4">
        <span class="text-xs font-medium text-slate-400">Total Claims Ingested</span>
        <div class="text-2xl font-semibold text-white mt-1">{total_count}</div>
        <span class="text-[11px] text-slate-500 mt-0.5 block">Via BiteHub Webhook</span>
      </div>

      <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-400">Verified Authentic</span>
          <span class="text-xs font-medium text-emerald-400 font-mono">{real_pct}</span>
        </div>
        <div class="text-2xl font-semibold text-emerald-400 mt-1">{real_count}</div>
        <span class="text-[11px] text-slate-500 mt-0.5 block">Natural texture confirmed</span>
      </div>

      <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-400">Flagged for Review</span>
          <span class="text-xs font-medium text-rose-400 font-mono">{fake_pct}</span>
        </div>
        <div class="text-2xl font-semibold text-rose-400 mt-1">{fake_count}</div>
        <span class="text-[11px] text-slate-500 mt-0.5 block">Synthetic artifacts detected</span>
      </div>

      <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-4">
        <span class="text-xs font-medium text-slate-400">Webhook Status</span>
        <div class="text-sm font-medium text-slate-200 mt-2 font-mono flex items-center gap-1.5 truncate" title="POST /webhook/refund-submitted">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          /webhook/refund-submitted
        </div>
        <span class="text-[11px] text-slate-500 mt-1 block">Port 8000 · Listening</span>
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
      <div class="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-semibold text-white">Media Inspection & Claim Resolution</h2>
          <p class="text-xs text-slate-400 mt-0.5">Inspect visual evidence and review model classification results.</p>
        </div>
        <button onclick="window.location.reload()" class="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/60 transition">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-950/40 border-b border-slate-800/80 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              <th class="px-5 py-3">Order ID</th>
              <th class="px-5 py-3">Customer</th>
              <th class="px-5 py-3">Merchant / Reason</th>
              <th class="px-5 py-3">Amount</th>
              <th class="px-5 py-3">Evidence</th>
              <th class="px-5 py-3">Model Analysis</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            {rows_html if rows_html else empty_state_html}
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <script>
    async function syncDecision(refundId, status) {{
      if (!confirm(`Confirm updating claim #${{refundId}} status to ${{status}}?`)) return;

      try {{
        const res = await fetch('/api/sync-decision', {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify({{ refundId, status }})
        }});

        if (res.ok) {{
          window.location.reload();
        }} else {{
          alert('Failed to synchronize status with server.');
        }}
      }} catch (err) {{
        alert('Network error while updating claim.');
      }}
    }}
  </script>
</body>
</html>"""

# ─── POST /webhook/refund-submitted ─────────────────────────────────────────
@app.post("/webhook/refund-submitted")
async def receive_refund_webhook(request: Request):
    payload = await request.json()
    refund_id = payload.get("refundId")
    order_id = payload.get("orderId")
    image_data = payload.get("image")

    print(f"[ML Webhook] Ingesting claim #{refund_id} for Order #{order_id}")

    prediction = predict_image_authenticity(image_data)

    records = load_history()
    existing = next((r for r in records if r.get("refundId") == refund_id), None)

    record_data = {
        "id": f"AUD_{len(records)+1:04d}",
        "refundId": refund_id,
        "orderId": order_id,
        "userId": payload.get("userId"),
        "customerName": payload.get("customerName", ""),
        "customerEmail": payload.get("customerEmail", ""),
        "customerPhone": payload.get("customerPhone", ""),
        "restaurantName": payload.get("restaurantName", ""),
        "amount": payload.get("amount", 0),
        "reason": payload.get("reason", ""),
        "description": payload.get("description", ""),
        "image": image_data or None,
        "prediction": prediction,
        "status": "PENDING",
        "submittedAt": payload.get("submittedAt", time.strftime("%Y-%m-%dT%H:%M:%SZ"))
    }

    if existing:
        records = [r if r.get("refundId") != refund_id else record_data for r in records]
    else:
        records.insert(0, record_data)

    save_history(records)

    return {
        "status": "success",
        "refundId": refund_id,
        "prediction": prediction
    }

# ─── POST /webhook/update-status (from BiteHub Backend) ──────────────────────
@app.post("/webhook/update-status")
async def webhook_update_status(request: Request):
    try:
        body = await request.json()
        refund_id = body.get("refundId")
        status_val = body.get("status")

        if refund_id and status_val:
            records = load_history()
            for r in records:
                if r.get("refundId") == refund_id:
                    r["status"] = status_val
                    break
            save_history(records)
            return {"status": "success", "refundId": refund_id, "newStatus": status_val}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    return {"status": "ignored"}

# ─── POST /api/sync-decision ─────────────────────────────────────────────────
@app.post("/api/sync-decision")
async def sync_decision(request: Request):
    if not is_authenticated(request):
        raise HTTPException(status_code=401, detail="Unauthorized.")

    body = await request.json()
    refund_id = body.get("refundId")
    status_val = body.get("status")

    records = load_history()
    for r in records:
        if r.get("refundId") == refund_id:
            r["status"] = status_val
            break
    save_history(records)

    # Sync back to BiteHub API
    try:
        url = f"{BITEHUB_API_URL}/refunds/{refund_id}/status"
        res = requests.patch(
            url, 
            json={"status": status_val, "note": f"Claim status updated to {status_val} via Media Audit Console."}, 
            timeout=2
        )
        if res.status_code == 200:
            return {"status": "success", "message": f"Claim #{refund_id} marked {status_val}."}
    except Exception:
        pass

    return {"status": "success", "message": f"Claim #{refund_id} updated locally."}

# ─── GET /api/history ─────────────────────────────────────────────────────────
@app.get("/api/history")
def get_history(request: Request):
    if not is_authenticated(request):
        raise HTTPException(status_code=401, detail="Unauthorized.")
    return load_history()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
