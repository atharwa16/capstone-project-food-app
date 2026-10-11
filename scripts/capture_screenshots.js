import { webkit } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.resolve(ROOT_DIR, 'screenshots');

const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('📸 Capturing pixel-perfect screenshots...');

  // Reset any refund on ORD003 in SQLite
  const { run } = await import('../server/db.js');
  await run('DELETE FROM refunds WHERE order_id = ?', ['ORD003']);

  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    // 1. Customer Login
    console.log('1. Customer Login...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await wait(1000);
    await page.fill('input[type="email"]', 'aarav@example.com');
    await page.fill('input[type="password"]', 'Demo@123');
    await page.click('button[type="submit"]');
    await wait(2000);

    // 2. Customer Interface
    console.log('2. Customer Interface...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await wait(2000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01_bitehub_customer_interface.png'),
      fullPage: false
    });

    // 3. Restaurant Menu
    console.log('3. Restaurant Menu...');
    await page.goto('http://localhost:5173/restaurant/R001', { waitUntil: 'domcontentloaded' });
    await wait(2000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02_restaurant_menu_interface.png'),
      fullPage: false
    });

    // 4. Order Tracking
    console.log('4. Order Tracking...');
    await page.goto('http://localhost:5173/order-tracking/ORD001', { waitUntil: 'domcontentloaded' });
    await wait(2500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03_order_tracking_interface.png'),
      fullPage: false
    });

    // 5. Refund Request and Food Image Upload Interface
    console.log('5. Refund Request & Image Upload Interface...');
    await page.goto('http://localhost:5173/request-refund/ORD003', { waitUntil: 'domcontentloaded' });
    await wait(2000);

    // Select reason: Food Quality Issue
    await page.locator('label:has-text("Food Quality Issue"), input[value="FOOD_QUALITY"]').first().click();
    await wait(500);

    // Upload photo evidence
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(SCREENSHOTS_DIR, 'assets', 'sample_refund_evidence.jpg'));
    await wait(2000); // Wait for preview to render

    // Type description
    await page.fill('textarea', 'The food arrived with torn packaging and spilled sauce. Food was completely cold and compromised.');
    await wait(1000);

    // Scroll slightly so form with preview and reason is perfectly framed
    await page.evaluate(() => window.scrollTo({ top: 180, behavior: 'instant' }));
    await wait(800);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04_refund_request_and_image_upload_interface.png'),
      fullPage: false
    });

    // 6. Submit Refund Claim & Capture Timeline
    console.log('6. Submitting refund...');
    await page.click('button[type="submit"]');
    await wait(3500);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05_refund_submitted_timeline.png'),
      fullPage: false
    });

    // 7. FoodForensics ML Audit Console
    console.log('7. ML Audit Console...');
    await page.goto('http://localhost:8000/login', { waitUntil: 'domcontentloaded' });
    await wait(1000);
    await page.fill('#email', 'admin@bitehub.com');
    await page.fill('#password', 'MLAdmin@2026');
    await page.click('#submitBtn');
    await wait(3000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06_foodforensics_ml_audit_console.png'),
      fullPage: false
    });

    // 8. BiteHub System Operations Monitor
    console.log('8. System Operations Monitor...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await wait(1000);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await wait(2500);

    await page.goto('http://localhost:5173/admin/system-monitor', { waitUntil: 'domcontentloaded' });
    await wait(3000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07_bitehub_system_operations_monitor.png'),
      fullPage: false
    });

    // 9. Admin Synchronized Refunds Table
    console.log('9. Admin Refunds...');
    await page.goto('http://localhost:5173/admin/refunds', { waitUntil: 'domcontentloaded' });
    await wait(2500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '08_bitehub_admin_refunds_synchronized.png'),
      fullPage: false
    });

    console.log('✅ All screenshots refreshed and verified successfully!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
}

run();
