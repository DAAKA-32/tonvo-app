import { writeFileSync } from "fs";
import { deflateSync } from "zlib";

// Create a minimal valid PNG with a colored circle
function createPNG(size) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;
  const innerR = r * 0.4;

  // Create raw pixel data (RGBA)
  const pixels = Buffer.alloc(size * size * 4, 0);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: dark (#111114)
      const cornerDist = Math.max(Math.abs(x - cx), Math.abs(y - cy));
      const roundedR = size * 0.4;
      if (cornerDist > roundedR) {
        // Rough rounded corners - transparent
        pixels[i] = 0; pixels[i + 1] = 0; pixels[i + 2] = 0; pixels[i + 3] = 0;
      } else if (dist <= innerR) {
        // Inner circle: dark
        pixels[i] = 9; pixels[i + 1] = 9; pixels[i + 2] = 11; pixels[i + 3] = 255;
      } else if (dist <= r) {
        // Outer circle: silver
        pixels[i] = 200; pixels[i + 1] = 200; pixels[i + 2] = 216; pixels[i + 3] = 255;
      } else {
        // Background
        pixels[i] = 17; pixels[i + 1] = 17; pixels[i + 2] = 20; pixels[i + 3] = 255;
      }
    }
  }

  // Build PNG file
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);  // width
  ihdrData.writeUInt32BE(size, 4);  // height
  ihdrData[8] = 8;                   // bit depth
  ihdrData[9] = 6;                   // color type (RGBA)
  ihdrData[10] = 0;                  // compression
  ihdrData[11] = 0;                  // filter
  ihdrData[12] = 0;                  // interlace
  const ihdr = makeChunk("IHDR", ihdrData);

  // IDAT chunk - add filter byte (0 = none) before each row
  const rawData = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    rawData[y * (size * 4 + 1)] = 0; // filter: none
    pixels.copy(rawData, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const compressed = deflateSync(rawData);
  const idat = makeChunk("IDAT", compressed);

  // IEND chunk
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const crcInput = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

for (const size of [16, 48, 128]) {
  const png = createPNG(size);
  writeFileSync(`assets/icons/icon-${size}.png`, png);
  console.log(`Generated icon-${size}.png (${png.length} bytes)`);
}
