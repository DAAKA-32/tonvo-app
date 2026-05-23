import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "*",
  "access-control-max-age": "86400",
  "cache-control": "no-store",
};

export function GET() {
  return NextResponse.json(
    { ok: true, service: "cue", ts: Date.now() },
    { headers: CORS_HEADERS },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
