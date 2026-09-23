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
