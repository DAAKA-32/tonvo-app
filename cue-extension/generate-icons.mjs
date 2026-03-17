// Generate simple PNG icons from canvas for the extension
// Run with: node generate-icons.mjs

import { writeFileSync } from "fs";

// Create a simple SVG icon and convert to a data URL
function createIconSVG(size) {
  const r = size * 0.35;
  const cx = size / 2;
  const cy = size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#111114"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#c8c8d8"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="#09090b"/>
  </svg>`;
}

for (const size of [16, 48, 128]) {
  const svg = createIconSVG(size);
  writeFileSync(`assets/icons/icon-${size}.svg`, svg);
  console.log(`Generated icon-${size}.svg`);
}

console.log("\nNote: Chrome requires PNG icons. Convert these SVGs to PNG, or use them as SVG.");
console.log("For development, you can also update manifest.json to omit icons temporarily.");
