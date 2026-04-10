/**
 * Generate PWA icons from the source Tonvo logo.
 *
 * Output:
 *   public/icon-192.png        — 192×192 edge-to-edge, "any" purpose
 *   public/icon-512.png        — 512×512 edge-to-edge, "any" purpose
 *   public/icon-maskable.png   — 512×512 with safe-zone padding (~80%), "maskable" purpose
 *   public/apple-touch-icon.png — 180×180 edge-to-edge for iOS
 *
 * Run: node scripts/generate-pwa-icons.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public", "logo-tonvo-remove.png");
const OUT = path.join(ROOT, "public");

const BG = "#09090b"; // brand dark background — matches manifest theme/background colors

/**
 * Trim transparent padding around the logo and crop to the logo's tight bounds.
 * This gives us the raw "soundwave + dark rounded square" content.
 */
async function getTrimmedLogo() {
  return sharp(SRC).trim().toBuffer();
}

/**
 * Build an edge-to-edge square icon at the given size.
 * The brand dark background (#09090b) fills the entire canvas, and the trimmed
 * logo is scaled to cover the full canvas (since the logo's own background is
 * already #09090b, this produces a seamless full-bleed look).
 */
async function buildFullBleed(size, outFile) {
  const trimmed = await getTrimmedLogo();
  const resized = await sharp(trimmed)
    .resize(size, size, { fit: "cover", position: "center" })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(path.join(OUT, outFile));

  console.log(`✓ ${outFile} (${size}×${size}, full-bleed)`);
}

/**
 * Build a maskable icon: brand dark background fills the canvas, and the
 * logo content sits inside the central 80% safe zone. This guarantees that
 * Android adaptive masks (circle, squircle, rounded square) never crop the
 * logo, while the surrounding dark fills any masked area cleanly.
 */
async function buildMaskable(size, outFile) {
  const trimmed = await getTrimmedLogo();
  const inner = Math.round(size * 0.8);
  const resizedInner = await sharp(trimmed)
    .resize(inner, inner, { fit: "contain", background: BG })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: resizedInner, gravity: "center" }])
    .png()
    .toFile(path.join(OUT, outFile));

  console.log(`✓ ${outFile} (${size}×${size}, maskable / 80% safe zone)`);
}

await buildFullBleed(192, "icon-192.png");
await buildFullBleed(512, "icon-512.png");
await buildMaskable(512, "icon-maskable.png");
await buildFullBleed(180, "apple-touch-icon.png");
await buildFullBleed(180, "apple-touch-icon-precomposed.png");

console.log("\nAll PWA icons generated.");
