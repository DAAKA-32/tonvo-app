import { NextRequest, NextResponse } from "next/server";
import { trackBodySchema } from "@/lib/analytics/events";
import { attributionColumns, deviceFromUA, isBot, recordEvent } from "@/lib/analytics/server";
import { verifyAuth } from "@/lib/auth-server";
import { assertJsonSize, getClientIp, rateLimitGuard } from "@/lib/security";
import { RATE_LIMITS } from "@/lib/rate-limit";

/**
 * POST /api/track — first-party funnel analytics from the browser (see lib/analytics).
 *
 * Stores: event, random visitor id, page path, first-touch source, country code, device class, small props.
 * Never stores: IP address, email, user agent, free text. The IP is used only for rate limiting.
 * A signed-in caller's Firebase uid is attached when a valid ID token is sent; "signup" requires one.
 * Always answers 204 for valid input (even when the write fails) so tracking can never break a page.
 */
export async function POST(req: NextRequest) {
  const tooBig = assertJsonSize(req, 8 * 1024);
  if (tooBig) return tooBig;

  const ua = req.headers.get("user-agent");
  if (isBot(ua)) return new NextResponse(null, { status: 204 });

  const limited = await rateLimitGuard("track", getClientIp(req), RATE_LIMITS.track);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = trackBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid body" }, { status: 400 });
  }
  const { event, anonId, path, attribution, props } = parsed.data;

  const user = req.headers.get("authorization") ? await verifyAuth(req) : null;
  if (event === "signup" && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const country = req.headers.get("x-vercel-ip-country");
  await recordEvent({
    event,
    anon_id: anonId,
    user_id: user?.uid ?? null,
    path: path.split("?")[0].slice(0, 300),
    ...attributionColumns(attribution),
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    device: deviceFromUA(ua),
    props,
  });
  return new NextResponse(null, { status: 204 });
}
