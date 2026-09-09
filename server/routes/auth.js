import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getOne, run } from '../db.js';

import { validate, loginSchema, signupSchema } from '../middleware/validate.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bitehub_super_secret_jwt_key_2026';

// Helper to format user response
function formatUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    avatar: row.avatar,
    role: row.role,
    addresses: JSON.parse(row.addresses || '[]'),
    favoriteRestaurants: JSON.parse(row.favorite_restaurants || '[]'),
    favoriteDishes: JSON.parse(row.favorite_dishes || '[]'),
    createdAt: row.created_at,
  };
}

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const row = await getOne('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, row.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const formattedUser = formatUser(row);
    const token = jwt.sign({ id: row.id, role: row.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      user: formattedUser,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// ─── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post('/signup', validate(signupSchema), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await getOne('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const id = `USR${String(Math.floor(1000 + Math.random() * 9000))}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const avatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(normalizedEmail)}`;
    const createdAt = new Date().toISOString();

    await run(
      `INSERT INTO users (id, name, email, phone, password_hash, avatar, role, addresses, favorite_restaurants, favorite_dishes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'USER', '[]', '[]', '[]', ?)`,
      [id, name.trim(), normalizedEmail, phone || '', passwordHash, avatar, createdAt]
    );

    const newUserRow = await getOne('SELECT * FROM users WHERE id = ?', [id]);
    const formattedUser = formatUser(newUserRow);
    const token = jwt.sign({ id: formattedUser.id, role: formattedUser.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      user: formattedUser,
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// ─── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const userRow = await getOne('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (!userRow) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    return res.json(formatUser(userRow));
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
});

export default router;
