import express from 'express';
import { query, getOne, run } from '../db.js';

const router = express.Router();

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

// ─── GET /api/users (Admin Directory) ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM users ORDER BY datetime(created_at) DESC');
    return res.json(rows.map(formatUser));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ─── PUT /api/users/profile (Update Profile) ──────────────────────────────────
router.put('/profile', async (req, res) => {
  try {
    const { userId, name, phone, avatar } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });

    const existing = await getOne('SELECT * FROM users WHERE id = ?', [userId]);
    if (!existing) return res.status(404).json({ error: 'User not found.' });

    const newName = name !== undefined ? name : existing.name;
    const newPhone = phone !== undefined ? phone : existing.phone;
    const newAvatar = avatar !== undefined ? avatar : existing.avatar;

    await run(
      'UPDATE users SET name = ?, phone = ?, avatar = ? WHERE id = ?',
      [newName, newPhone, newAvatar, userId]
    );

    const updated = await getOne('SELECT * FROM users WHERE id = ?', [userId]);
    return res.json(formatUser(updated));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ─── POST /api/users/address (Add Address) ────────────────────────────────────
router.post('/address', async (req, res) => {
  try {
    const { userId, label, street, city, state, pincode, isDefault } = req.body;
    if (!userId || !street || !city) {
      return res.status(400).json({ error: 'User ID, street, and city are required.' });
    }

    const existing = await getOne('SELECT * FROM users WHERE id = ?', [userId]);
    if (!existing) return res.status(404).json({ error: 'User not found.' });

    let addresses = JSON.parse(existing.addresses || '[]');
    const newAddressId = `A${String(Math.floor(100 + Math.random() * 900))}`;

    if (isDefault || addresses.length === 0) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }

    const newAddress = {
      id: newAddressId,
      label: label || 'Home',
      street,
      city,
      state: state || 'Maharashtra',
      pincode: pincode || '411001',
      isDefault: isDefault || addresses.length === 0,
    };

    addresses.push(newAddress);

    await run(
      'UPDATE users SET addresses = ? WHERE id = ?',
      [JSON.stringify(addresses), userId]
    );

    const updated = await getOne('SELECT * FROM users WHERE id = ?', [userId]);
    return res.json(formatUser(updated));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add address' });
  }
});

export default router;
