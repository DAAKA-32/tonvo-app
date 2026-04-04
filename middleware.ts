import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://tonvo.co",
  "https://www.tonvo.co",
  "https://cue-app.vercel.app",
];

if (process.env.NODE_ENV === "development") {
  ALLOWED_ORIGINS.push("http://localhost:3000");
}

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow Vercel preview deployments
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const res = NextResponse.next();

  if (origin && isAllowedOrigin(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
  }

  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
