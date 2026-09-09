import express from 'express';
import { query, getOne, run } from '../db.js';

const router = express.Router();

// Seed database with initial restaurants if empty
async function seedRestaurantsIfEmpty() {
  const countRow = await getOne('SELECT COUNT(*) as count FROM restaurants');
  if (countRow && countRow.count > 0) return;

  console.log('🌱 Seeding restaurants and menus into DB...');
  const { restaurants } = await import('../seedData.js');

  for (const r of restaurants) {
    await run(
      `INSERT INTO restaurants (
        id, name, description, cover_image, logo, cuisines, rating, review_count,
        price_for_two, delivery_time, delivery_fee, distance, address, city,
        opening_hours, offers, is_vegetarian, is_open, categories
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id, r.name, r.description, r.coverImage, r.logo,
        JSON.stringify(r.cuisines), r.rating, r.reviewCount, r.priceForTwo,
        r.deliveryTime, r.deliveryFee, r.distance, r.address, r.city,
        JSON.stringify(r.openingHours), JSON.stringify(r.offers),
        r.isVegetarian ? 1 : 0, r.isOpen ? 1 : 0, JSON.stringify(r.categories)
      ]
    );

    if (r.menuItems && r.menuItems.length > 0) {
      for (const item of r.menuItems) {
        await run(
          `INSERT INTO menu_items (
            id, restaurant_id, name, description, price, image, category,
            is_vegetarian, is_popular, is_available, tags
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id, item.restaurantId, item.name, item.description, item.price,
            item.image, item.category, item.isVegetarian ? 1 : 0,
            item.isPopular ? 1 : 0, item.isAvailable ? 1 : 0, JSON.stringify(item.tags || [])
          ]
        );
      }
    }
  }
  console.log('✅ Restaurants & menus seeded successfully.');
}

// ─── GET /api/restaurants ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    await seedRestaurantsIfEmpty();
    const rows = await query('SELECT * FROM restaurants');
    const formatted = rows.map(r => ({
      ...r,
      coverImage: r.cover_image,
      reviewCount: r.review_count,
      priceForTwo: r.price_for_two,
      deliveryTime: r.delivery_time,
      deliveryFee: r.delivery_fee,
      cuisines: JSON.parse(r.cuisines || '[]'),
      openingHours: JSON.parse(r.opening_hours || '{}'),
      offers: JSON.parse(r.offers || '[]'),
      categories: JSON.parse(r.categories || '[]'),
      isVegetarian: Boolean(r.is_vegetarian),
      isOpen: Boolean(r.is_open),
    }));
    return res.json(formatted);
  } catch (err) {
    console.error('Fetch restaurants error:', err);
    return res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// ─── GET /api/restaurants/:id ──────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    await seedRestaurantsIfEmpty();
    const r = await getOne('SELECT * FROM restaurants WHERE id = ?', [req.params.id]);
    if (!r) return res.status(404).json({ error: 'Restaurant not found' });

    const menuRows = await query('SELECT * FROM menu_items WHERE restaurant_id = ?', [req.params.id]);
    const menuItems = menuRows.map(m => ({
      ...m,
      restaurantId: m.restaurant_id,
      isVegetarian: Boolean(m.is_vegetarian),
      isPopular: Boolean(m.is_popular),
      isAvailable: Boolean(m.is_available),
      tags: JSON.parse(m.tags || '[]'),
    }));

    const formatted = {
      ...r,
      coverImage: r.cover_image,
      reviewCount: r.review_count,
      priceForTwo: r.price_for_two,
      deliveryTime: r.delivery_time,
      deliveryFee: r.delivery_fee,
      cuisines: JSON.parse(r.cuisines || '[]'),
      openingHours: JSON.parse(r.opening_hours || '{}'),
      offers: JSON.parse(r.offers || '[]'),
      categories: JSON.parse(r.categories || '[]'),
      isVegetarian: Boolean(r.is_vegetarian),
      isOpen: Boolean(r.is_open),
      menuItems,
    };

    return res.json(formatted);
  } catch (err) {
    console.error('Fetch restaurant detail error:', err);
    return res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
});

// ─── PATCH /api/restaurants/:id/toggle ───────────────────────────────────────
router.patch('/:id/toggle', async (req, res) => {
  try {
    const r = await getOne('SELECT is_open FROM restaurants WHERE id = ?', [req.params.id]);
    if (!r) return res.status(404).json({ error: 'Restaurant not found' });

    const nextState = r.is_open ? 0 : 1;
    await run('UPDATE restaurants SET is_open = ? WHERE id = ?', [nextState, req.params.id]);
    return res.json({ id: req.params.id, isOpen: Boolean(nextState) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to toggle status' });
  }
});

export default router;
