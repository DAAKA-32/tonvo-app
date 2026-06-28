import { chromium } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";

/*
 * Records the REAL /session page running in scripted demo mode (?demo=1) into a
 * webm for the landing hero demo video. The page itself plays the fake call —
 * see the demo-driver effect in src/app/session/page.tsx.
 *
 *   node scripts/capture-demo-live.mjs
 */

const URL = process.env.URL ?? "http://localhost:3000/session?demo=1";
const VIEWPORT = { width: 1440, height: 900 };
const DURATION_MS = Number(process.env.DURATION_MS ?? 37000);
const OUT_DIR = process.env.OUT_DIR ?? "c:/tmp/tonvo-capture";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });

// --- 1. Warm-up pass: compile the (heavy) /session route, no recording ---
console.log(`Warming ${URL} ...`);
{
  const warm = await browser.newContext({ viewport: VIEWPORT });
  const wp = await warm.newPage();
  await wp.goto(URL, { waitUntil: "load", timeout: 180000 });
  await wp.waitForSelector(".live-grid", { timeout: 120000 }).catch(() => {});
  await wp.waitForTimeout(3000);
  await warm.close();
}

// --- 2. Recorded pass: clean timeline from page load ---
console.log(`Recording ${DURATION_MS}ms @ ${VIEWPORT.width}x${VIEWPORT.height} ...`);
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  recordVideo: { dir: OUT_DIR, size: VIEWPORT },
});
const page = await context.newPage();
page.on("pageerror", (e) => console.error("PAGE ERROR:", e.message.split("\n")[0]));
await page.goto(URL, { waitUntil: "load", timeout: 180000 });
// Hide the Next.js dev indicator / error toast so it never shows in the capture.
await page.addStyleTag({
  content: "nextjs-portal,[data-nextjs-toast],[data-next-badge-root],[data-nextjs-dev-tools-button],#__next-build-watcher{display:none!important;opacity:0!important}",
}).catch(() => {});
await page.waitForTimeout(DURATION_MS);

const video = page.video();
await context.close();
await browser.close();

if (video) {
  console.log(`OK saved webm -> ${await video.path()}`);
} else {
  console.error("x no video produced");
  process.exit(1);
}
