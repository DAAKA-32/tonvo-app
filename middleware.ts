import { NextRequest, NextResponse } from "next/server";

// Production allow-list. Vercel preview deployments are NOT auto-allowed
// because any attacker can mint an arbitrary <subdomain>.vercel.app and would
// then be able to make cross-origin requests from their own page.
const PROD_ORIGINS = new Set<string>([
  "https://tonvo.co",
  "https://www.tonvo.co",
  "https://cue-app.vercel.app",
]);

// Optional comma-separated list for additional trusted origins
// (e.g. internal staging URLs). Set in env, never expose to the client.
const EXTRA_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string): boolean {
  if (PROD_ORIGINS.has(origin)) return true;
  if (EXTRA_ORIGINS.includes(origin)) return true;
  if (process.env.NODE_ENV === "development") {
    // Only localhost in dev — never wildcard *.vercel.app
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
    if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
  }
  return false;
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const res = NextResponse.next();

  // Only set CORS headers for known origins. Unknown origins get no
  // Access-Control-Allow-Origin header, so the browser blocks the response.
  if (origin && isAllowedOrigin(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // We do NOT set Access-Control-Allow-Credentials — auth uses Bearer tokens,
    // not cookies. Keeping credentials off prevents cross-origin cookie leaks.
  }

  if (req.method === "OPTIONS") {
    // Preflight: if origin not allowed, deny. Otherwise echo the headers above.
    if (!origin || !isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 403 });
    }
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
