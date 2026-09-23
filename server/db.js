import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'bitehub.db');
const db = new sqlite3.Database(dbPath);

// Helper wrapper for async query execution
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export async function initDb() {
  // Create tables
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'USER',
      addresses TEXT NOT NULL DEFAULT '[]',
      favorite_restaurants TEXT NOT NULL DEFAULT '[]',
      favorite_dishes TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      cover_image TEXT,
      logo TEXT,
      cuisines TEXT NOT NULL,
      rating REAL NOT NULL,
      review_count INTEGER NOT NULL,
      price_for_two INTEGER NOT NULL,
      delivery_time INTEGER NOT NULL,
      delivery_fee INTEGER NOT NULL,
      distance TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      opening_hours TEXT NOT NULL,
      offers TEXT NOT NULL DEFAULT '[]',
      is_vegetarian INTEGER NOT NULL DEFAULT 0,
      is_open INTEGER NOT NULL DEFAULT 1,
      categories TEXT NOT NULL DEFAULT '[]'
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      restaurant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      is_vegetarian INTEGER NOT NULL DEFAULT 0,
      is_popular INTEGER NOT NULL DEFAULT 0,
      is_available INTEGER NOT NULL DEFAULT 1,
      tags TEXT DEFAULT '[]',
      FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      restaurant_id TEXT NOT NULL,
      restaurant_name TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      delivery_fee INTEGER NOT NULL,
      tax INTEGER NOT NULL,
      discount INTEGER NOT NULL,
      total INTEGER NOT NULL,
      address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      estimated_delivery TEXT,
      notes TEXT
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS refunds (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      restaurant_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      timeline TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      resolved_at TEXT,
      admin_note TEXT,
      image TEXT
    );
  `);

  try {
    await run('ALTER TABLE refunds ADD COLUMN image TEXT');
  } catch {
    // column already exists
  }

  for (const colSql of [
    'ALTER TABLE refunds ADD COLUMN ml_verdict TEXT',
    'ALTER TABLE refunds ADD COLUMN ml_confidence REAL',
    'ALTER TABLE refunds ADD COLUMN ml_reason TEXT',
    'ALTER TABLE refunds ADD COLUMN ml_manipulation_prob TEXT',
  ]) {
    try {
      await run(colSql);
    } catch {
      // column already exists
    }
  }

  console.log('✅ Database tables verified.');

  // Seed default admin and initial users if users table is empty
  const userCountRow = await getOne('SELECT COUNT(*) as count FROM users');
  if (userCountRow.count === 0) {
    console.log('🌱 Seeding initial users...');
    const hashedUserPass = await bcrypt.hash('Demo@123', 10);
    const hashedAdminPass = await bcrypt.hash('Admin@123', 10);

    const initialUsers = [
      { id: 'USR001', name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 98765 43210', avatar: 'https://i.pravatar.cc/150?img=1', role: 'USER', password_hash: hashedUserPass, addresses: JSON.stringify([{ id: 'A001', label: 'Home', street: '12 Senapati Bapat Road', city: 'Pune', state: 'Maharashtra', pincode: '411016', isDefault: true }]), favorite_restaurants: JSON.stringify(['R001', 'R004']), favorite_dishes: JSON.stringify(['M004', 'M027']), created_at: '2025-03-10T09:00:00Z' },
      { id: 'USR002', name: 'Priya Mehta', email: 'priya@example.com', phone: '+91 98765 11111', avatar: 'https://i.pravatar.cc/150?img=2', role: 'USER', password_hash: hashedUserPass, addresses: JSON.stringify([{ id: 'A003', label: 'Home', street: '7 Koregaon Park Lane', city: 'Pune', state: 'Maharashtra', pincode: '411001', isDefault: true }]), favorite_restaurants: JSON.stringify(['R002', 'R010']), favorite_dishes: JSON.stringify(['M011', 'M070']), created_at: '2025-05-20T11:30:00Z' },
      { id: 'USR003', name: 'Rohan Verma', email: 'rohan@example.com', phone: '+91 98765 22222', avatar: 'https://i.pravatar.cc/150?img=3', role: 'USER', password_hash: hashedUserPass, addresses: JSON.stringify([{ id: 'A004', label: 'Home', street: '22 Baner Hills', city: 'Pune', state: 'Maharashtra', pincode: '411045', isDefault: true }]), favorite_restaurants: JSON.stringify(['R003', 'R006']), favorite_dishes: JSON.stringify(['M022', 'M041']), created_at: '2025-01-15T08:00:00Z' },
      { id: 'ADM001', name: 'Admin User', email: 'admin@example.com', phone: '+91 99999 00000', avatar: 'https://i.pravatar.cc/150?img=11', role: 'ADMIN', password_hash: hashedAdminPass, addresses: '[]', favorite_restaurants: '[]', favorite_dishes: '[]', created_at: '2024-01-01T00:00:00Z' },
    ];

    for (const u of initialUsers) {
      await run(
        `INSERT INTO users (id, name, email, phone, password_hash, avatar, role, addresses, favorite_restaurants, favorite_dishes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.phone, u.password_hash, u.avatar, u.role, u.addresses, u.favorite_restaurants, u.favorite_dishes, u.created_at]
      );
    }
  }
}

export default db;
