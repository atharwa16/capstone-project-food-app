import { validate, orderSchema } from '../middleware/validate.js';
import { sendOrderReceiptEmail } from '../services/emailService.js';
import { emitOrderStatusChange } from '../sockets/orderSocket.js';

const router = express.Router();

// Seed initial orders if DB table is empty
async function seedOrdersIfEmpty() {
  const countRow = await getOne('SELECT COUNT(*) as count FROM orders');
  if (countRow && countRow.count > 0) return;

  console.log('🌱 Seeding initial orders into DB...');
  const { sampleOrders } = await import('../seedData.js');

  for (const o of sampleOrders) {
    await run(
      `INSERT INTO orders (
        id, user_id, restaurant_id, restaurant_name, items, subtotal, delivery_fee,
        tax, discount, total, address, payment_method, status, created_at, updated_at, estimated_delivery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        o.id, o.userId, o.restaurantId, o.restaurantName, JSON.stringify(o.items),
        o.subtotal, o.deliveryFee, o.tax, o.discount, o.total, JSON.stringify(o.address),
        o.paymentMethod, o.status, o.createdAt, o.updatedAt, o.estimatedDelivery || ''
      ]
    );
  }
}

function formatOrder(row) {
  return {
    id: row.id,
    userId: row.user_id,
    restaurantId: row.restaurant_id,
    restaurantName: row.restaurant_name,
    items: JSON.parse(row.items || '[]'),
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    tax: row.tax,
    discount: row.discount,
    total: row.total,
    address: JSON.parse(row.address || '{}'),
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    estimatedDelivery: row.estimated_delivery,
    notes: row.notes,
  };
}

// ─── GET /api/orders ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    await seedOrdersIfEmpty();
    const { userId } = req.query;
    let sql = 'SELECT * FROM orders ORDER BY datetime(created_at) DESC';
    let params = [];

    if (userId) {
      sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY datetime(created_at) DESC';
      params = [userId];
    }

    const rows = await query(sql, params);
    return res.json(rows.map(formatOrder));
  } catch (err) {
    console.error('Fetch orders error:', err);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ─── GET /api/orders/:id ───────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    await seedOrdersIfEmpty();
    const row = await getOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Order not found' });
    return res.json(formatOrder(row));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// ─── POST /api/orders ──────────────────────────────────────────────────────────
router.post('/', validate(orderSchema), async (req, res) => {
  try {
    const { userId, restaurantId, restaurantName, items, subtotal, deliveryFee, tax, discount, total, address, paymentMethod, notes } = req.body;

    const countRow = await getOne('SELECT COUNT(*) as count FROM orders');
    const orderNum = (countRow.count || 0) + 1;
    const id = `ORD${String(orderNum).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const estDelivery = new Date(Date.now() + 35 * 60000).toISOString();

    await run(
      `INSERT INTO orders (
        id, user_id, restaurant_id, restaurant_name, items, subtotal, delivery_fee,
        tax, discount, total, address, payment_method, status, created_at, updated_at, estimated_delivery, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?, ?, ?, ?)`,
      [
        id, userId, restaurantId, restaurantName, JSON.stringify(items),
        subtotal, deliveryFee, tax, discount, total, JSON.stringify(address),
        paymentMethod || 'UPI', now, now, estDelivery, notes || ''
      ]
    );

    const insertedRow = await getOne('SELECT * FROM orders WHERE id = ?', [id]);
    const formatted = formatOrder(insertedRow);

    // Fetch customer email to dispatch receipt
    const userRow = await getOne('SELECT email FROM users WHERE id = ?', [userId]);
    sendOrderReceiptEmail(formatted, userRow?.email || 'customer@example.com');
    emitOrderStatusChange(id, 'CONFIRMED');

    return res.status(201).json(formatted);
  } catch (err) {
    console.error('Place order error:', err);
    return res.status(500).json({ error: 'Failed to place order' });
  }
});

// ─── PATCH /api/orders/:id/status ─────────────────────────────────────────────
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required.' });

    const now = new Date().toISOString();
    await run('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?', [status, now, req.params.id]);

    const updatedRow = await getOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!updatedRow) return res.status(404).json({ error: 'Order not found' });

    emitOrderStatusChange(req.params.id, status);

    return res.json(formatOrder(updatedRow));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
