import { chromium } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";

const URL = process.env.URL ?? "http://localhost:3010/demo/session";
const VIEWPORT = { width: 360, height: 779 };
const DURATION_MS = 15000;
const OUT_DIR = "c:/tmp/tonvo-capture";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

console.log(`Launching chromium @ ${VIEWPORT.width}x${VIEWPORT.height}`);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 3,
  recordVideo: { dir: OUT_DIR, size: VIEWPORT },
});
const page = await context.newPage();

console.log(`Navigating to ${URL}`);
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForLoadState("load").catch(() => {});
await page.waitForTimeout(2000); // wait for fonts + initial render

console.log(`Recording ${DURATION_MS}ms...`);
await page.waitForTimeout(DURATION_MS);

const video = page.video();
await context.close();
await browser.close();

if (video) {
  const path = await video.path();
  console.log(`✓ saved → ${path}`);
} else {
  console.error("× no video produced");
  process.exit(1);
}
