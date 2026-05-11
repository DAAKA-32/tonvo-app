import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitGuard } from "@/lib/security";

/**
 * POST /api/share-target
 *
 * Receives shared content from the PWA Share Target API. Cannot require
 * Firebase auth because the OS share sheet doesn't propagate the user's
 * session — the user lands here, then signs in inside the app.
 *
 * Defences in place:
 * - Rate-limited per IP (cheap to abuse without it: each POST allocates
 *   buffers up to MAX_IMAGES * MAX_IMAGE_BYTES bytes in process memory).
 * - Hard caps on image count, image size, and text length.
 * - MIME allow-list for images.
 * - Cache entries expire after 5 minutes and are deleted on retrieval.
 */

const MAX_IMAGES = 10;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MiB per image
const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20 MiB total per share
const MAX_TEXT_LEN = 8 * 1024; // 8 KiB combined text
const CACHE_TTL_MS = 5 * 60 * 1000;

const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const SHARE_RATE = { maxRequests: 10, windowMs: 60_000 } as const;

const sharedImageCache = new Map<
  string,
  { files: Buffer[]; mimeTypes: string[]; timestamp: number }
>();

function cleanCache() {
  const now = Date.now();
  for (const [key, val] of sharedImageCache) {
    if (now - val.timestamp > CACHE_TTL_MS) sharedImageCache.delete(key);
  }
  // Cap total cache entries as a last line of defence against memory bloat
  if (sharedImageCache.size > 500) {
    const overflow = sharedImageCache.size - 500;
    let i = 0;
    for (const key of sharedImageCache.keys()) {
      sharedImageCache.delete(key);
      if (++i >= overflow) break;
    }
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimited = await rateLimitGuard("share_target", ip, SHARE_RATE);
  if (rateLimited) return rateLimited;

  try {
    cleanCache();
    const formData = await req.formData();
    const text = formData.get("text") as string | null;
    const title = formData.get("title") as string | null;

    // Collect shared images (cap count + per-file size + total size).
    const imageFiles: File[] = [];
    formData.forEach((value, key) => {
      if (key === "images" && value instanceof File && imageFiles.length < MAX_IMAGES) {
        imageFiles.push(value);
      }
    });

    if (imageFiles.length > 0) {
      const files: Buffer[] = [];
      const mimeTypes: string[] = [];
      let totalBytes = 0;

      for (const file of imageFiles) {
        const mime = (file.type || "image/jpeg").toLowerCase();
        if (!ALLOWED_IMAGE_MIME.has(mime)) continue;
        if (file.size > MAX_IMAGE_BYTES) continue;
        totalBytes += file.size;
        if (totalBytes > MAX_TOTAL_BYTES) break;
        const buffer = Buffer.from(await file.arrayBuffer());
        files.push(buffer);
        mimeTypes.push(mime);
      }

      if (files.length === 0) {
        return NextResponse.redirect(new URL("/analyze-text", req.url));
      }

      const cacheKey = crypto.randomUUID();
      sharedImageCache.set(cacheKey, { files, mimeTypes, timestamp: Date.now() });
      return NextResponse.redirect(
        new URL(`/analyze-text?shared=true&key=${cacheKey}`, req.url),
      );
    }

    if (text || title) {
      const safeText = (text ?? "").slice(0, MAX_TEXT_LEN);
      const safeTitle = (title ?? "").slice(0, MAX_TEXT_LEN);
      const sharedText = [safeTitle, safeText].filter(Boolean).join("\n\n").slice(0, MAX_TEXT_LEN);
      return NextResponse.redirect(
        new URL(`/analyze-text?shared=true&text=${encodeURIComponent(sharedText)}`, req.url),
      );
    }

    return NextResponse.redirect(new URL("/analyze-text", req.url));
  } catch {
    return NextResponse.redirect(new URL("/analyze-text", req.url));
  }
}

/** GET: Retrieve cached shared images */
export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimited = await rateLimitGuard("share_target_get", ip, SHARE_RATE);
  if (rateLimited) return rateLimited;

  const key = req.nextUrl.searchParams.get("key");
  if (!key || !/^[a-f0-9-]{32,40}$/i.test(key)) {
    return NextResponse.json({ error: "No key" }, { status: 400 });
  }

  const cached = sharedImageCache.get(key);
  if (!cached) return NextResponse.json({ error: "Expired" }, { status: 404 });

  const images = cached.files.map((buf, i) => ({
    data: buf.toString("base64"),
    mimeType: cached.mimeTypes[i],
  }));

  // Clean up after retrieval
  sharedImageCache.delete(key);

  return NextResponse.json({ images });
}
