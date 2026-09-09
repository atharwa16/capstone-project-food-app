import express from 'express';
import { query, getOne, run } from '../db.js';

const router = express.Router();

// Seed initial refunds if DB table is empty
async function seedRefundsIfEmpty() {
  const countRow = await getOne('SELECT COUNT(*) as count FROM refunds');
  if (countRow && countRow.count > 0) return;

  console.log('🌱 Seeding initial refund claims into DB...');
  const { sampleRefunds } = await import('../seedData.js');

  for (const r of sampleRefunds) {
    await run(
      `INSERT INTO refunds (
        id, order_id, user_id, restaurant_id, amount, reason, description,
        status, timeline, created_at, updated_at, resolved_at, admin_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id, r.orderId, r.userId, r.restaurantId, r.amount, r.reason, r.description,
        r.status, JSON.stringify(r.timeline), r.createdAt, r.updatedAt, r.resolvedAt || null, r.adminNote || null
      ]
    );
  }
}

function formatRefund(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id,
    restaurantId: row.restaurant_id,
    amount: row.amount,
    reason: row.reason,
    description: row.description,
    status: row.status,
    timeline: JSON.parse(row.timeline || '[]'),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at,
    adminNote: row.admin_note,
  };
}

// ─── GET /api/refunds ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    await seedRefundsIfEmpty();
    const { userId } = req.query;
    let sql = 'SELECT * FROM refunds ORDER BY datetime(created_at) DESC';
    let params = [];

    if (userId) {
      sql = 'SELECT * FROM refunds WHERE user_id = ? ORDER BY datetime(created_at) DESC';
      params = [userId];
    }

    const rows = await query(sql, params);
    return res.json(rows.map(formatRefund));
  } catch (err) {
    console.error('Fetch refunds error:', err);
    return res.status(500).json({ error: 'Failed to fetch refund tickets' });
  }
});

// ─── POST /api/refunds ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { orderId, userId, restaurantId, amount, reason, description } = req.body;
    if (!orderId || !userId || !amount || !reason) {
      return res.status(400).json({ error: 'Missing required refund request fields.' });
    }

    const countRow = await getOne('SELECT COUNT(*) as count FROM refunds');
    const refNum = (countRow.count || 0) + 1;
    const id = `RF${String(refNum).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const initialTimeline = [{ status: 'PENDING', date: now, note: 'Refund ticket submitted by customer.' }];

    await run(
      `INSERT INTO refunds (
        id, order_id, user_id, restaurant_id, amount, reason, description,
        status, timeline, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?)`,
      [id, orderId, userId, restaurantId || 'R001', amount, reason, description || '', JSON.stringify(initialTimeline), now, now]
    );

    const insertedRow = await getOne('SELECT * FROM refunds WHERE id = ?', [id]);
    return res.status(201).json(formatRefund(insertedRow));
  } catch (err) {
    console.error('Create refund error:', err);
    return res.status(500).json({ error: 'Failed to create refund request' });
  }
});

// ─── PATCH /api/refunds/:id/status ────────────────────────────────────────────
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required.' });

    const row = await getOne('SELECT * FROM refunds WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Refund ticket not found.' });

    const timeline = JSON.parse(row.timeline || '[]');
    const now = new Date().toISOString();
    timeline.push({ status, date: now, note: note || `Refund status updated to ${status}.` });

    let resolvedAt = row.resolved_at;
    if (status === 'APPROVED' || status === 'REJECTED' || status === 'COMPLETED') {
      resolvedAt = now;
    }

    await run(
      'UPDATE refunds SET status = ?, timeline = ?, updated_at = ?, resolved_at = ?, admin_note = ? WHERE id = ?',
      [status, JSON.stringify(timeline), now, resolvedAt, note || null, req.params.id]
    );

    const updatedRow = await getOne('SELECT * FROM refunds WHERE id = ?', [req.params.id]);
    return res.json(formatRefund(updatedRow));
  } catch (err) {
    console.error('Update refund error:', err);
    return res.status(500).json({ error: 'Failed to update refund status' });
  }
});

export default router;
