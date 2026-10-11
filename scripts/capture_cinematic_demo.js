import { webkit } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.resolve(ROOT_DIR, 'screenshots');
const VIDEO_DIR = path.resolve(SCREENSHOTS_DIR, 'video');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR, { recursive: true });

async function resetDemoData() {
  const { run } = await import('../server/db.js');
  await run('DELETE FROM refunds WHERE order_id = ?', ['ORD003']);
  console.log('✅ Cleared prior refunds for ORD003 in SQLite database.');
}

const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function injectAids(page) {
  await page.evaluate(() => {
    // 1. Virtual Mouse Cursor
    if (!document.getElementById('__cursor')) {
      const c = document.createElement('div');
      c.id = '__cursor';
      c.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(239, 68, 68, 0.95);
        border: 2px solid #ffffff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999999;
        transform: translate(-50%, -50%);
        transition: transform 0.15s ease, opacity 0.2s ease;
        box-shadow: 0 0 14px rgba(239, 68, 68, 0.75);
        top: 250px;
        left: 250px;
      `;
      document.body.appendChild(c);

      window.__moveCursor = (x, y) => {
        const cur = document.getElementById('__cursor');
        if (cur) {
          cur.style.left = x + 'px';
          cur.style.top = y + 'px';
        }
      };

      window.__clickRipple = (x, y) => {
        const r = document.createElement('div');
        r.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.7);
          pointer-events: none;
          z-index: 9999998;
          transform: translate(-50%, -50%);
          animation: __ripple 0.45s ease-out forwards;
        `;
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 500);
      };

      const style = document.createElement('style');
      style.textContent = `
        @keyframes __ripple {
          0% { width: 8px; height: 8px; opacity: 1; border: 2px solid #fff; }
          100% { width: 60px; height: 60px; opacity: 0; border: 2px solid rgba(239, 68, 68, 0.2); }
        }
      `;
      document.head.appendChild(style);
    }

    // 2. Step Banner Pill
    if (!document.getElementById('__step_banner')) {
      const b = document.createElement('div');
      b.id = '__step_banner';
      b.style.cssText = `
        position: fixed;
        top: 14px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.94);
        backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.16);
        color: #f8fafc;
        padding: 9px 24px;
        border-radius: 9999px;
        z-index: 9999990;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 10px 32px rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        max-width: 90vw;
      `;
      b.innerHTML = `
        <span style="display:inline-block; width:9px; height:9px; background:#22c55e; border-radius:50%; box-shadow:0 0 8px #22c55e;"></span>
        <span id="__banner_step" style="font-size:11px; font-weight:800; letter-spacing:0.06em; text-transform:uppercase; color:#f97316;">STEP 1</span>
        <span style="width:1px; height:14px; background:rgba(255,255,255,0.2);"></span>
        <span id="__banner_title" style="font-size:13px; font-weight:700; color:#fff;">BiteHub Platform Demo</span>
        <span id="__banner_sub" style="font-size:12px; font-weight:500; color:#94a3b8; margin-left:4px;"></span>
      `;
      document.body.appendChild(b);
    }
  });
}

async function showStep(page, stepNum, title, sub) {
  console.log(`\n▶ [STEP ${stepNum}] ${title} — ${sub}`);
  await injectAids(page);
  await page.evaluate(({ stepNum, title, sub }) => {
    const s = document.getElementById('__banner_step');
    const t = document.getElementById('__banner_title');
    const sb = document.getElementById('__banner_sub');
    if (s) s.textContent = `STEP ${stepNum} OF 7`;
    if (t) t.textContent = title;
    if (sb) sb.textContent = `• ${sub}`;
  }, { stepNum, title, sub });
  await wait(800);
}

async function smoothMove(page, targetX, targetY, steps = 16) {
  const start = await page.evaluate(() => {
    const cur = document.getElementById('__cursor');
    if (!cur) return { x: 250, y: 250 };
    return { x: parseInt(cur.style.left || '250'), y: parseInt(cur.style.top || '250') };
  });

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ease = 1 - Math.pow(1 - t, 3);
    const currX = Math.round(start.x + (targetX - start.x) * ease);
    const currY = Math.round(start.y + (targetY - start.y) * ease);
    await page.evaluate(({ x, y }) => window.__moveCursor(x, y), { x: currX, y: currY });
    await wait(18);
  }
}

async function smoothClick(page, selector) {
  try {
    const loc = page.locator(selector).first();
    await loc.scrollIntoViewIfNeeded({ timeout: 5000 });
    await wait(200);
    const box = await loc.boundingBox();
    if (box) {
      const clickX = Math.round(box.x + box.width / 2);
      const clickY = Math.round(box.y + box.height / 2);
      await smoothMove(page, clickX, clickY);
      await wait(150);
      await page.evaluate(({ x, y }) => window.__clickRipple(x, y), { x: clickX, y: clickY });
      await loc.click();
      await wait(300);
    } else {
      await loc.click();
    }
  } catch {
    await page.locator(selector).first().click();
  }
}

async function smoothType(page, selector, text) {
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded({ timeout: 5000 });
  await wait(200);
  await smoothClick(page, selector);
  await wait(150);
  for (const char of text) {
    await page.type(selector, char, { delay: 30 + Math.random() * 20 });
  }
  await wait(300);
}

async function smoothScrollDown(page, distance = 400, steps = 10) {
  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => window.scrollBy({ top: d, behavior: 'smooth' }), distance / steps);
    await wait(50);
  }
  await wait(700);
}

async function smoothScrollUp(page, distance = 400, steps = 10) {
  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => window.scrollBy({ top: -d, behavior: 'smooth' }), distance / steps);
    await wait(50);
  }
  await wait(500);
}

async function run() {
  await resetDemoData();

  // Clear previous demo videos in folder
  fs.readdirSync(VIDEO_DIR).forEach(f => {
    if (f.endsWith('.webm') || f.endsWith('.mp4')) {
      try { fs.unlinkSync(path.join(VIDEO_DIR, f)); } catch {}
    }
  });

  console.log('🎥 Launching Cinematic WebKit Recorder (1440x900)...');
  const browser = await webkit.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();

  try {
    // -------------------------------------------------------------
    // Intro & Customer Login
    // -------------------------------------------------------------
    console.log('Navigating to BiteHub...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await injectAids(page);

    await showStep(page, 'INTRO', 'Food-Refund Fraud Challenge', 'AI Authenticity Verification Solution');
    await wait(2500);

    await showStep(page, '1', 'Customer Authentication', 'Signing into BiteHub User Portal');
    await smoothType(page, 'input[type="email"]', 'aarav@example.com');
    await smoothType(page, 'input[type="password"]', 'Demo@123');
    await smoothClick(page, 'button[type="submit"]');
    await wait(2500);

    // -------------------------------------------------------------
    // Step 1: Restaurant Browsing & Menu
    // -------------------------------------------------------------
    await showStep(page, '1', 'Restaurant Browsing', 'Discovering Cuisines, Trending Dishes & Menus');
    await wait(1500);
    await smoothScrollDown(page, 450);
    await wait(1500);
    await smoothScrollDown(page, 400);
    await wait(1500);
    await smoothScrollUp(page, 850);
    await wait(1000);

    // Restaurant Menu View
    await showStep(page, '1', 'Restaurant Menu & Dishes', 'The Spice Route — Authentic Dishes & Cart');
    await page.goto('http://localhost:5173/restaurant/R001', { waitUntil: 'networkidle' });
    await injectAids(page);
    await wait(1500);
    await smoothScrollDown(page, 420);
    await wait(2000);
    await smoothScrollUp(page, 420);
    await wait(1000);

    // -------------------------------------------------------------
    // Step 2: Order Tracking Interface
    // -------------------------------------------------------------
    await showStep(page, '2', 'Real-Time Order Tracking', 'Live WebSockets Driver Telemetry & Radar');
    await page.goto('http://localhost:5173/order-tracking/ORD001', { waitUntil: 'networkidle' });
    await injectAids(page);
    await wait(2000);
    await smoothScrollDown(page, 320);
    await wait(2500);
    await smoothScrollUp(page, 320);
    await wait(1000);

    // -------------------------------------------------------------
    // Step 3: Delivered Order & Refund Request Initiation
    // -------------------------------------------------------------
    await showStep(page, '3', 'Delivered Order Claim', 'Initiating Refund Complaint on Order #ORD003');
    await page.goto('http://localhost:5173/request-refund/ORD003', { waitUntil: 'networkidle' });
    await injectAids(page);
    await showStep(page, '3', 'Refund Request Interface', 'Selecting Complaint Reason & Uploading Evidence');
    await wait(2000);

    // Select reason: Food Quality Issue
    await smoothClick(page, 'label:has-text("Food Quality Issue"), input[value="FOOD_QUALITY"]');
    await wait(1200);

    // -------------------------------------------------------------
    // Step 4: Food Photograph Evidence Upload
    // -------------------------------------------------------------
    await showStep(page, '4', 'Evidence Attachment', 'Uploading Smartphone Photo of Damaged Food');
    await wait(1000);

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(SCREENSHOTS_DIR, 'assets', 'sample_refund_evidence.jpg'));
    await wait(2500); // Give viewer ample time to observe preview

    await showStep(page, '4', 'Photo Evidence Preview', 'Inspecting Smartphone Evidence Photo');
    await wait(2000);

    // Fill detailed explanation
    await showStep(page, '4', 'Claim Explanation', 'Entering Issue Description');
    await smoothType(page, 'textarea', 'Takeout container lid was crushed and opened during transit. Food was cold, sauce spilled across the bag, and items were spoiled.');
    await wait(1500);

    // Submit refund claim
    await showStep(page, '4', 'Submitting Refund Claim', 'Triggering Instant Asynchronous ML Webhook');
    await smoothClick(page, 'button[type="submit"]');
    await wait(3500);

    // -------------------------------------------------------------
    // Step 5: Synchronized Customer Timeline
    // -------------------------------------------------------------
    await injectAids(page);
    await showStep(page, '5', 'BiteHub Claims Timeline', 'Claim Synchronized & Awaiting AI Verification');
    await wait(2500);
    await smoothScrollDown(page, 300);
    await wait(2500);
    await smoothScrollUp(page, 300);
    await wait(1000);

    // -------------------------------------------------------------
    // Step 6: FoodForensics ML Audit Console
    // -------------------------------------------------------------
    await page.goto('http://localhost:8000/login', { waitUntil: 'networkidle' });
    await injectAids(page);
    await showStep(page, '6', 'FoodForensics ML Audit Console', 'Auditor Login to Visual Media Microservice');
    await wait(1500);

    await smoothType(page, '#email', 'admin@bitehub.com');
    await smoothType(page, '#password', 'MLAdmin@2026');
    await smoothClick(page, '#submitBtn');
    await wait(3500);

    // On FoodForensics dashboard
    await injectAids(page);
    await showStep(page, '6', 'Neural Inference & Texture Analysis', 'Image Authenticity Classification & Model Metrics');
    await wait(3000);
    await smoothScrollDown(page, 450);
    await wait(3500); // Viewer can clearly inspect the submitted claim and scores
    await smoothScrollDown(page, 350);
    await wait(2500);
    await smoothScrollUp(page, 800);
    await wait(1500);

    // Auditor Approval / Rejection
    await showStep(page, '6', 'Human-in-the-Loop Verification', 'Auditor Verifying & Approving Refund Ticket');
    const approveBtn = page.locator('button:has-text("Approve"), form button:has-text("Approve")').first();
    if (await approveBtn.isVisible()) {
      await smoothClick(page, 'button:has-text("Approve"), form button:has-text("Approve")');
      await wait(3000);
    }

    // -------------------------------------------------------------
    // Step 7: BiteHub System Operations Monitor
    // -------------------------------------------------------------
    // Clear customer session and login as BiteHub Admin
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await injectAids(page);
    await showStep(page, '7', 'BiteHub Admin Command Center', 'Signing into System Operations');
    await wait(1200);

    await smoothType(page, 'input[type="email"]', 'admin@example.com');
    await smoothType(page, 'input[type="password"]', 'Admin@123');
    await smoothClick(page, 'button[type="submit"]');
    await wait(3000);

    // System Monitor
    await page.goto('http://localhost:5173/admin/system-monitor', { waitUntil: 'domcontentloaded' });
    await injectAids(page);
    await showStep(page, '7', 'System Operations Monitor', 'Server Health, Memory, SQLite Queries & WebSocket Telemetry');
    await wait(3000);
    await smoothScrollDown(page, 450);
    await wait(3500);
    await smoothScrollDown(page, 400);
    await wait(3000);
    await smoothScrollUp(page, 850);
    await wait(2000);

    // Synchronized Refunds Admin Table
    await page.goto('http://localhost:5173/admin/refunds', { waitUntil: 'domcontentloaded' });
    await injectAids(page);
    await showStep(page, '7', 'Synchronized Claims Resolution', 'Verified Status Reflected in BiteHub Core Database');
    await wait(3500);
    await smoothScrollDown(page, 350);
    await wait(3000);
    await smoothScrollUp(page, 350);
    await wait(2000);

    // Final Outro Screen
    await showStep(page, 'COMPLETE', 'Integration Demonstrated', 'BiteHub & FoodForensics Seamless Workflow Verified');
    await wait(3000);

    console.log('🎉 Cinematic demonstration capture complete!');
  } catch (err) {
    console.error('Error during recording:', err);
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    try {
      const webmFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm'));
      if (webmFiles.length > 0) {
        const webmPath = path.join(VIDEO_DIR, webmFiles[0]);
        const finalWebm = path.join(VIDEO_DIR, 'bitehub_ai_verification_demo.webm');
        if (webmPath !== finalWebm) {
          if (fs.existsSync(finalWebm)) fs.unlinkSync(finalWebm);
          fs.renameSync(webmPath, finalWebm);
        }
        console.log(`🎬 High-definition master demonstration video saved: ${finalWebm}`);
      }
    } catch (e) {
      console.error('Finalize video warning:', e.message);
    }
  }
}

run();
