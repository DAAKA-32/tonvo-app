/**
 * Meta Conversions API (CAPI) server-side mirror.
 * Receives client events and forwards them to Meta with hashed user data,
 * using the same event_id as the browser Pixel call so Meta dedupes.
 *
 * Required env:
 *   NEXT_PUBLIC_FB_PIXEL_ID  — same pixel id used by client
 *   FB_CAPI_ACCESS_TOKEN     — server access token from Meta Events Manager
 *   FB_CAPI_TEST_EVENT_CODE  — optional, for Test Events panel during setup
 *
 * No-ops gracefully if env is unset (returns 204 silently — client Pixel still fires).
 */
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import {
  assertJsonSize,
  getClientIp,
  JSON_BODY_LIMIT,
  rateLimitGuard,
} from "@/lib/security";

interface CAPIRequestBody {
  event: string;
  eventId: string;
  eventSourceUrl?: string;
  userData?: { email?: string; userId?: string };
  customData?: Record<string, unknown>;
}

// Allow-list the standard Meta events we actually fire. Anything else is
// rejected to prevent attackers from polluting analytics with arbitrary
// event names or inflating CAPI usage.
const ALLOWED_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "Lead",
  "CompleteRegistration",
  "AddPaymentInfo",
  "InitiateCheckout",
  "AddToCart",
  "Purchase",
  "Subscribe",
  "StartTrial",
  "Contact",
]);

// 60 requests per minute per IP. Pixel events are high-volume by design
// (every PageView fires one), so the cap is generous but bounded.
const META_CAPI_RATE = { maxRequests: 60, windowMs: 60_000 } as const;

const ALLOWED_DOMAINS = new Set<string>([
  "tonvo.co",
  "www.tonvo.co",
]);

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function safeEventSourceUrl(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return undefined;
    // Only accept URLs from our own domains — prevents attackers from
    // reporting events as if they originated from another site.
    if (!ALLOWED_DOMAINS.has(u.hostname) && !u.hostname.endsWith(".vercel.app")) {
      return undefined;
    }
    return u.toString();
  } catch {
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  const sizeErr = assertJsonSize(req, JSON_BODY_LIMIT);
  if (sizeErr) return sizeErr;

  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const accessToken = process.env.FB_CAPI_ACCESS_TOKEN;
  const testEventCode = process.env.FB_CAPI_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    return new NextResponse(null, { status: 204 });
  }

  const ip = getClientIp(req);
  const rateLimited = await rateLimitGuard("meta_capi", ip, META_CAPI_RATE);
  if (rateLimited) return rateLimited;

  let body: CAPIRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { event, eventId, eventSourceUrl, userData, customData } = body;
  if (!event || !eventId) {
    return NextResponse.json({ error: "missing_event_or_event_id" }, { status: 400 });
  }

  // Validate event name and id formats
  if (typeof event !== "string" || !ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  }
  if (typeof eventId !== "string" || eventId.length > 128 || !/^[a-zA-Z0-9._-]+$/.test(eventId)) {
    return NextResponse.json({ error: "invalid_event_id" }, { status: 400 });
  }

  const safeSourceUrl = safeEventSourceUrl(eventSourceUrl);
  const userAgent = req.headers.get("user-agent")?.slice(0, 512) ?? undefined;

  const userDataPayload: Record<string, string | string[] | undefined> = {
    client_ip_address: ip,
    client_user_agent: userAgent,
  };
  if (userData?.email) userDataPayload.em = [sha256(userData.email)];
  if (userData?.userId) userDataPayload.external_id = [sha256(userData.userId)];

  // Clamp customData size to prevent abuse — Meta CAPI charges per event,
  // and we don't need arbitrarily-large blobs forwarded.
  let safeCustomData: Record<string, unknown> = {};
  if (customData && typeof customData === "object") {
    try {
      const serialized = JSON.stringify(customData);
      if (serialized.length <= 8 * 1024) {
        safeCustomData = customData;
      }
    } catch {
      /* ignore non-serializable input */
    }
  }

  const eventPayload = {
    event_name: event,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: safeSourceUrl,
    action_source: "website",
    user_data: userDataPayload,
    custom_data: safeCustomData,
  };

  const fbBody: Record<string, unknown> = {
    data: [eventPayload],
    access_token: accessToken,
  };
  if (testEventCode) fbBody.test_event_code = testEventCode;

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fbBody),
      },
    );
    if (!fbRes.ok) {
      const text = await fbRes.text();
      console.error("[meta-capi] non-2xx:", fbRes.status, text);
      return NextResponse.json({ error: "capi_failed", status: fbRes.status }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[meta-capi] network error:", err);
    return NextResponse.json({ error: "network" }, { status: 502 });
  }
}
