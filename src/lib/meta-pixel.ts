/**
 * Meta Pixel client-side helper.
 * Base script is initialized in src/app/layout.tsx via <Script> when NEXT_PUBLIC_FB_PIXEL_ID is set.
 * Server-side mirroring (Conversions API) lives at src/app/api/meta-capi/route.ts.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

/**
 * Generates a UUID-shaped event_id for client/server CAPI deduplication.
 * Both the browser fbq call and the server CAPI call use the same id so Meta dedupes.
 */
function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Track a Meta standard event (PageView, CompleteRegistration, Subscribe, Lead, Purchase, etc.).
 * Returns the event_id used so the caller can mirror to CAPI server-side with the same id.
 */
export function trackPixel(
  event: string,
  params?: Record<string, unknown>,
): string | undefined {
  if (typeof window === "undefined" || !window.fbq) return undefined;
  const eventId = newEventId();
  window.fbq("track", event, params || {}, { eventID: eventId });
  return eventId;
}

/**
 * Track a custom (non-standard) event. Use sparingly — Meta's algo optimizes better against standard events.
 */
export function trackPixelCustom(
  event: string,
  params?: Record<string, unknown>,
): string | undefined {
  if (typeof window === "undefined" || !window.fbq) return undefined;
  const eventId = newEventId();
  window.fbq("trackCustom", event, params || {}, { eventID: eventId });
  return eventId;
}

/**
 * Mirror an event to Meta CAPI (Conversions API) server-side.
 * Call this AFTER trackPixel() on the client, passing the same event_id for deduplication.
 * No-ops if the API route is not configured (returns silently).
 */
export async function mirrorToCAPI(
  event: string,
  eventId: string | undefined,
  userData?: { email?: string; userId?: string },
  customData?: Record<string, unknown>,
): Promise<void> {
  if (!eventId) return;
  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        eventId,
        eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
        userData,
        customData,
      }),
      keepalive: true,
    });
  } catch {
    // Silent fail — CAPI is best-effort; client Pixel still fired.
  }
}

/**
 * Convenience: track signup with both standard CompleteRegistration (Meta optimizes against this)
 * AND a custom Signup event (matches Tonvo Meta Ads campaign brief naming convention).
 */
export function trackSignup(userData?: { email?: string; userId?: string }): void {
  const eventId = trackPixel("CompleteRegistration", {
    content_name: "tonvo_free_signup",
    status: true,
  });
  trackPixelCustom("Signup", { method: "free_tier" });
  void mirrorToCAPI(
    "CompleteRegistration",
    eventId,
    userData,
    { content_name: "tonvo_free_signup" },
  );
}
