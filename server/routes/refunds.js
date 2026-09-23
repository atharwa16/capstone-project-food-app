import express from 'express';
import { query, getOne, run } from '../db.js';
import { dispatchRefundToMlService } from '../services/mlWebhookService.js';

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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ML_HISTORY_PATH = path.resolve(__dirname, '../../ml_service/ml_history.json');

function getMlPredictionFromHistory(refundId) {
  try {
    if (fs.existsSync(ML_HISTORY_PATH)) {
      const data = JSON.parse(fs.readFileSync(ML_HISTORY_PATH, 'utf8'));
      const item = data.find(r => r.refundId === refundId);
      if (item && item.prediction) {
        return {
          mlVerdict: item.prediction.label || null,
          mlConfidence: item.prediction.confidence_score != null ? item.prediction.confidence_score : null,
          mlReason: item.prediction.reason || null,
          mlManipulationProb: item.prediction.texture_breakdown?.manipulation_probability || null,
        };
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function formatRefund(row) {
  let mlVerdict = row.ml_verdict || null;
  let mlConfidence = row.ml_confidence != null ? row.ml_confidence : null;
  let mlReason = row.ml_reason || null;
  let mlManipulationProb = row.ml_manipulation_prob || null;

  if (!mlVerdict) {
    const historyPred = getMlPredictionFromHistory(row.id);
    if (historyPred) {
      mlVerdict = historyPred.mlVerdict;
      mlConfidence = historyPred.mlConfidence;
      mlReason = historyPred.mlReason;
      mlManipulationProb = historyPred.mlManipulationProb;
    }
  }

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
    image: row.image || null,
    mlVerdict,
    mlConfidence,
    mlReason,
    mlManipulationProb,
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
    const { orderId, userId, restaurantId, amount, reason, description, image } = req.body;
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
        status, timeline, created_at, updated_at, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?)`,
      [id, orderId, userId, restaurantId || 'R001', amount, reason, description || '', JSON.stringify(initialTimeline), now, now, image || null]
    );

    const insertedRow = await getOne('SELECT * FROM refunds WHERE id = ?', [id]);
    const formatted = formatRefund(insertedRow);

    // Enrich with customer and restaurant info for ML dashboard
    let customerName = 'Customer';
    let customerEmail = 'customer@example.com';
    let customerPhone = '+91 98765 43210';
    try {
      const userRow = await getOne('SELECT name, email, phone FROM users WHERE id = ?', [userId]);
      if (userRow) {
        customerName = userRow.name;
        customerEmail = userRow.email;
        customerPhone = userRow.phone || customerPhone;
      }
    } catch { /* non-fatal */ }

    // Dispatch webhook to independent ML service on port 8000 and record prediction
    try {
      const mlRes = await dispatchRefundToMlService({ ...formatted, customerName, customerEmail, customerPhone });
      if (mlRes && mlRes.prediction) {
        const p = mlRes.prediction;
        const manipProb = p.texture_breakdown?.manipulation_probability || null;
        await run(
          'UPDATE refunds SET ml_verdict = ?, ml_confidence = ?, ml_reason = ?, ml_manipulation_prob = ? WHERE id = ?',
          [p.label, p.confidence_score, p.reason, manipProb, id]
        );
        formatted.mlVerdict = p.label;
        formatted.mlConfidence = p.confidence_score;
        formatted.mlReason = p.reason;
        formatted.mlManipulationProb = manipProb;
      }
    } catch { /* non-fatal */ }

    return res.status(201).json(formatted);
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

    // Sync status change to ML service if running
    try {
      fetch('http://localhost:8000/webhook/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refundId: req.params.id, status }),
      }).catch(() => {});
    } catch {
      // non-fatal
    }

    const updatedRow = await getOne('SELECT * FROM refunds WHERE id = ?', [req.params.id]);
    return res.json(formatRefund(updatedRow));
  } catch (err) {
    console.error('Update refund error:', err);
    return res.status(500).json({ error: 'Failed to update refund status' });
  }
});

export default router;
