import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server";
import { RATE_LIMITS } from "@/lib/rate-limit";
import { rateLimitGuard } from "@/lib/security";

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

/**
 * POST /api/transcribe-token
 *
 * Mints a single-use, short-lived AssemblyAI streaming token for browser-side
 * WebSocket connections. The raw API key never leaves the server.
 *
 * Auth: Firebase ID token in `Authorization: Bearer <token>` header.
 * Rate-limited per user.
 *
 * Returns: { token: string, expiresIn: number }
 */
export async function POST(req: NextRequest) {
  if (!ASSEMBLYAI_API_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate-limit token mints per user, prefixed so it doesn't share the same
  // counter as /api/transcribe (which has its own quota).
  const rateLimited = await rateLimitGuard(
    "transcribe_token",
    user.uid,
    RATE_LIMITS.transcribe,
  );
  if (rateLimited) return rateLimited;

  // Token validity (seconds): 1–600. We pick 600 (10 min) so the user has time
  // to grant mic permission and start speaking before token redemption.
  // Once redeemed, the WebSocket session lasts up to max_session_duration_seconds (3 h default).
  const expiresInSeconds = 600;

  try {
    const url = new URL("https://streaming.assemblyai.com/v3/token");
    url.searchParams.set("expires_in_seconds", String(expiresInSeconds));
    // Cap session duration at 3 hours (default) — implicit, no override needed

    const aaRes = await fetch(url.toString(), {
      method: "GET",
      // AssemblyAI uses raw key, no Bearer prefix (different from their Voice Agent API)
      headers: { Authorization: ASSEMBLYAI_API_KEY },
    });

    if (!aaRes.ok) {
      const detail = await aaRes.text().catch(() => "");
      console.error(
        `[transcribe-token] AssemblyAI ${aaRes.status}: ${detail.slice(0, 200)}`,
      );
      return NextResponse.json(
        { error: "Failed to mint streaming token" },
        { status: 502 },
      );
    }

    const { token } = (await aaRes.json()) as { token: string };
    if (!token) {
      return NextResponse.json(
        { error: "AssemblyAI returned no token" },
        { status: 502 },
      );
    }

    return NextResponse.json({ token, expiresIn: expiresInSeconds });
  } catch (err) {
    console.error("[transcribe-token] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
