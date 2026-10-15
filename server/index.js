import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { initDb, query } from './db.js';
import { authRateLimiter, apiRateLimiter } from './middleware/security.js';
import { initOrderSockets } from './sockets/orderSocket.js';
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
import orderRoutes from './routes/orders.js';
import refundRoutes from './routes/refunds.js';
import userRoutes from './routes/users.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// Initialize WebSockets
initOrderSockets(server);

// Security Headers & CORS
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General API rate limiting
app.use('/api', apiRateLimiter);

// Telemetry Buffer
const apiLogs = [];
let logIdCounter = 1;

app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const logEntry = {
      id: logIdCounter++,
      timestamp,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
    };

    apiLogs.unshift(logEntry);
    if (apiLogs.length > 50) apiLogs.pop();

    console.log(`[${timestamp}] ${req.method} ${req.url} -> ${res.statusCode} (${durationMs}ms)`);
  });

  next();
});

// Root Landing & Status Page
app.get(['/', '/api'], (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      name: 'BiteHub Backend API & WebSockets Server',
      status: 'ONLINE',
      port: PORT,
      timestamp: new Date().toISOString(),
      webAppUrl: 'http://localhost:5173',
      mlServiceUrl: 'http://localhost:8000/login',
      endpoints: {
        health: '/api/health',
        systemStatus: '/api/admin/system-status',
        restaurants: '/api/restaurants',
        orders: '/api/orders',
        refunds: '/api/refunds',
        auth: '/api/auth'
      }
    });
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BiteHub Backend API (Port 5001)</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        body {
          min-height: 100vh;
          background: radial-gradient(circle at 10% 20%, #f1f5f9 0%, #e2e8f0 100%);
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .card {
          width: 100%;
          max-width: 680px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(203, 213, 225, 0.8);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.03);
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
        }
        .badge-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
        h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; margin-bottom: 6px; }
        p.subtitle { color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }
        .metric-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
        }
        .metric-label { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
        .metric-val { font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 4px; }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff;
          box-shadow: 0 10px 20px -5px rgba(249, 115, 22, 0.35);
        }
        .btn-primary:hover {
          opacity: 0.95;
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -5px rgba(249, 115, 22, 0.45);
        }
        .btn-secondary {
          background: #f8fafc;
          color: #1e293b;
          border: 1px solid #cbd5e1;
        }
        .btn-secondary:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #94a3b8;
          transform: translateY(-1px);
        }
        .footer-note {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <h1>🍕 BiteHub Server</h1>
            <p style="color: #64748b; font-size: 13px; font-weight: 500; margin-top: 2px;">REST API & WebSocket Gateway</p>
          </div>
          <div class="badge">
            <span class="badge-dot"></span>
            PORT 5001 ACTIVE
          </div>
        </div>

        <p class="subtitle">
          The BiteHub backend server is running smoothly on port 5001. If you are looking for the customer-facing web application, click the button below to open the frontend on port 5173.
        </p>

        <div class="grid">
          <div class="metric-box">
            <div class="metric-label">Database</div>
            <div class="metric-val">SQLite 3 (Ready)</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">WebSockets</div>
            <div class="metric-val">Socket.io (Live Tracking)</div>
          </div>
        </div>

        <div class="actions">
          <a href="http://localhost:5173" class="btn btn-primary" target="_blank">
            <span>🚀 Open Web App UI (Port 5173)</span>
            <span>&rarr;</span>
          </a>
          <a href="/api/health" class="btn btn-secondary">
            <span>🩺 View Health Check JSON (/api/health)</span>
            <span>&rarr;</span>
          </a>
          <a href="/api/admin/system-status" class="btn btn-secondary">
            <span>📊 View Telemetry & DB Status</span>
            <span>&rarr;</span>
          </a>
          <a href="http://localhost:8000/login" class="btn btn-secondary" target="_blank">
            <span>🧠 Open Python ML Inspection Microservice (Port 8000)</span>
            <span>&rarr;</span>
          </a>
        </div>

        <div class="footer-note">
          BiteHub Microservices Architecture &bull; Node.js v20 &bull; Express 5
        </div>
      </div>
    </body>
    </html>
  `);
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString(), service: 'BiteHub Backend API & WebSockets' });
});

// System Telemetry
app.get('/api/admin/system-status', async (req, res) => {
  try {
    const memory = process.memoryUsage();
    const uptimeSeconds = Math.floor(process.uptime());

    const users = await query('SELECT id, name, email, phone, role, created_at FROM users LIMIT 20');
    const restaurants = await query('SELECT id, name, cuisines, rating, is_open FROM restaurants LIMIT 20');
    const orders = await query('SELECT id, user_id, restaurant_name, total, payment_method, status, created_at FROM orders ORDER BY datetime(created_at) DESC LIMIT 20');
    const refunds = await query('SELECT id, order_id, amount, reason, status, created_at FROM refunds ORDER BY datetime(created_at) DESC LIMIT 20');

    return res.json({
      server: {
        status: 'ONLINE',
        port: PORT,
        uptimeSeconds,
        serverTime: new Date().toISOString(),
        memoryUsageMb: Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100,
        dbEngine: 'SQLite 3 (server/data/bitehub.db)',
        websockets: 'Socket.io (Live Driver Tracking Enabled)',
      },
      stats: {
        userCount: users.length,
        restaurantCount: restaurants.length,
        orderCount: orders.length,
        refundCount: refunds.length,
      },
      recentLogs: apiLogs,
      tables: {
        users,
        restaurants: restaurants.map(r => ({ ...r, cuisines: JSON.parse(r.cuisines || '[]'), isOpen: Boolean(r.is_open) })),
        orders,
        refunds,
      },
    });
  } catch (err) {
    console.error('System status error:', err);
    return res.status(500).json({ error: 'Failed to fetch system status' });
  }
});

// Clear logs
app.post('/api/admin/clear-logs', (req, res) => {
  apiLogs.length = 0;
  return res.json({ success: true, message: 'API request logs cleared.' });
});

// Apply rate limiting to Auth endpoints
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/signup', authRateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/users', userRoutes);

// Initialize DB and start HTTP & WebSockets Server
async function start() {
  try {
    await initDb();
    server.listen(PORT, () => {
      console.log(`🚀 BiteHub Backend & WebSockets Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
