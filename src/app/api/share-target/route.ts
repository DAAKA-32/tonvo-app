import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/share-target
 *
 * Receives shared content from the PWA Share Target API.
 * Stores images temporarily and redirects to analyze-text with params.
 *
 * For text shares, we redirect with the text as a query param.
 * For image shares, we store in a temp cache and redirect with a key.
 */

// In-memory cache for shared images (short-lived, cleared after retrieval)
const sharedImageCache = new Map<string, { files: Buffer[]; mimeTypes: string[]; timestamp: number }>();

// Clean old entries (older than 5 minutes)
function cleanCache() {
  const now = Date.now();
  for (const [key, val] of sharedImageCache) {
    if (now - val.timestamp > 5 * 60 * 1000) sharedImageCache.delete(key);
  }
}

export async function POST(req: NextRequest) {
  try {
    cleanCache();
    const formData = await req.formData();
    const text = formData.get("text") as string | null;
    const title = formData.get("title") as string | null;

    // Collect shared images
    const files: Buffer[] = [];
    const mimeTypes: string[] = [];
    formData.forEach((value, key) => {
      if (key === "images" && value instanceof File) {
        // We'll process async below
      }
    });

    const imageFiles: File[] = [];
    formData.forEach((value, key) => {
      if (key === "images" && value instanceof File) imageFiles.push(value);
    });

    if (imageFiles.length > 0) {
      for (const file of imageFiles.slice(0, 10)) {
        const buffer = Buffer.from(await file.arrayBuffer());
        files.push(buffer);
        mimeTypes.push(file.type || "image/jpeg");
      }
      const cacheKey = crypto.randomUUID();
      sharedImageCache.set(cacheKey, { files, mimeTypes, timestamp: Date.now() });
      return NextResponse.redirect(new URL(`/analyze-text?shared=true&key=${cacheKey}`, req.url));
    }

    if (text || title) {
      const sharedText = [title, text].filter(Boolean).join("\n\n");
      return NextResponse.redirect(
        new URL(`/analyze-text?shared=true&text=${encodeURIComponent(sharedText)}`, req.url)
      );
    }

    return NextResponse.redirect(new URL("/analyze-text", req.url));
  } catch {
    return NextResponse.redirect(new URL("/analyze-text", req.url));
  }
}

/** GET: Retrieve cached shared images */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "No key" }, { status: 400 });

  const cached = sharedImageCache.get(key);
  if (!cached) return NextResponse.json({ error: "Expired" }, { status: 404 });

  // Return images as JSON with base64
  const images = cached.files.map((buf, i) => ({
    data: buf.toString("base64"),
    mimeType: cached.mimeTypes[i],
  }));

  // Clean up after retrieval
  sharedImageCache.delete(key);

  return NextResponse.json({ images });
}
