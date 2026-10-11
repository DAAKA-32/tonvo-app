import { after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { deriveSource, type AnalyticsEvent, type Attribution, type ServerEvent } from "@/lib/analytics/events";

/**
 * Server side of the first-party funnel analytics.
 * Recording never throws and never blocks the request it rides on: analytics must not break the product.
 */

export interface EventRow {
  event: AnalyticsEvent;
  anon_id?: string | null;
  user_id?: string | null;
  path?: string | null;
  source?: string | null;
  ref?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  referrer_host?: string | null;
  country?: string | null;
  device?: "mobile" | "tablet" | "desktop" | null;
  props?: Record<string, string | number | boolean>;
}

let lastErrorLog = 0;

/** Insert one event. Duplicates of one-per-account events (signup, first_session) are silently ignored. */
export async function recordEvent(row: EventRow): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from("analytics_events").insert({ ...row, props: row.props ?? {} });
    if (error && error.code !== "23505" && Date.now() - lastErrorLog > 60_000) {
      lastErrorLog = Date.now();
      console.error("[analytics] insert failed:", error.message);
    }
  } catch (err) {
    if (Date.now() - lastErrorLog > 60_000) {
      lastErrorLog = Date.now();
      console.error("[analytics] insert threw:", err instanceof Error ? err.message : "unknown");
    }
  }
}

/**
 * Run analytics work after the response is sent (Next `after`), so it never delays the user.
 * Outside a request scope (unit tests, scripts) it simply runs in the background. Never throws.
 */
export function afterResponse(task: () => Promise<void>): void {
  const safe = () => task().catch(() => undefined);
  try {
    after(safe);
  } catch {
    void safe();
  }
}

/** Events only the server can vouch for: a LIVE session was created, a checkout was opened or paid. */
export function recordServerEvent(
  event: ServerEvent,
  userId: string,
  props?: Record<string, string | number | boolean>,
): Promise<void> {
  return recordEvent({ event, user_id: userId, props });
}

/** Columns copied from a validated first-touch attribution. */
export function attributionColumns(a: Attribution | undefined) {
  return {
    source: deriveSource(a),
    ref: a?.ref || null,
    utm_source: a?.utm_source || null,
    utm_medium: a?.utm_medium || null,
    utm_campaign: a?.utm_campaign || null,
    utm_content: a?.utm_content || null,
    utm_term: a?.utm_term || null,
    referrer_host: a?.referrer_host || null,
  };
}

const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime|curl|wget|python-requests|axios|node-fetch/i;

export function isBot(userAgent: string | null): boolean {
  return !userAgent || BOT_RE.test(userAgent);
}

export function deviceFromUA(userAgent: string | null): "mobile" | "tablet" | "desktop" {
  const ua = userAgent ?? "";
  if (/ipad|tablet|kindle|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
}

// ── Dashboard aggregation (pure, unit-tested) ────────────────────────────────

export interface StoredEvent {
  event: AnalyticsEvent;
  anon_id: string | null;
  user_id: string | null;
  path: string | null;
  source: string | null;
  props: Record<string, unknown> | null;
  created_at: string;
}

export interface FunnelCounts {
  visitors: number;
  clicks: number;
  signups: number;
  activated: number;
  checkoutStarted: number;
  paid: number;
}

export interface FunnelReport {
  totals: FunnelCounts;
  bySource: Array<FunnelCounts & { source: string }>;
  topPages: Array<{ path: string; visitors: number }>;
  vsl: { sound: number; fullscreen: number };
}

const UNTRACKED = "before tracking";

const emptyCounts = (): FunnelCounts => ({ visitors: 0, clicks: 0, signups: 0, activated: 0, checkoutStarted: 0, paid: 0 });

/**
 * Funnel over a window of events (ordered or not).
 * - Visitors and clicks are counted per anonymous visitor, attributed to that visitor's first-touch source.
 * - Signups, activation and payment are counted per account, attributed to the source carried by the signup event.
 *   Accounts created before tracking started count under "before tracking".
 */
export function computeFunnel(rows: StoredEvent[]): FunnelReport {
  const sorted = [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at));

  const visitorSource = new Map<string, string>();
  const userSource = new Map<string, string>();
  const visitors = new Set<string>();
  const clicked = new Set<string>();
  const signups = new Set<string>();
  const activated = new Set<string>();
  const checkout = new Set<string>();
  const paid = new Set<string>();
  const pageVisitors = new Map<string, Set<string>>();
  const vsl = { sound: 0, fullscreen: 0 };

  for (const r of sorted) {
    if (r.anon_id && !visitorSource.has(r.anon_id)) visitorSource.set(r.anon_id, r.source || "direct");
    switch (r.event) {
      case "page_view":
        if (r.anon_id) {
          visitors.add(r.anon_id);
          const p = (r.path || "/").split("?")[0];
          if (!pageVisitors.has(p)) pageVisitors.set(p, new Set());
          pageVisitors.get(p)!.add(r.anon_id);
        }
        break;
      case "cta_click":
        if (r.anon_id) clicked.add(r.anon_id);
        break;
      case "signup":
        if (r.user_id) {
          signups.add(r.user_id);
          userSource.set(r.user_id, r.source || "direct");
        }
        break;
      case "first_session":
        if (r.user_id) activated.add(r.user_id);
        break;
      case "checkout_started":
        if (r.user_id) checkout.add(r.user_id);
        break;
      case "checkout_completed":
        if (r.user_id) paid.add(r.user_id);
        break;
      case "vsl_sound":
        vsl.sound++;
        break;
      case "vsl_fullscreen":
        vsl.fullscreen++;
        break;
      default:
        break;
    }
  }

  const bySourceMap = new Map<string, FunnelCounts>();
  const bucket = (s: string) => {
    if (!bySourceMap.has(s)) bySourceMap.set(s, emptyCounts());
    return bySourceMap.get(s)!;
  };
  for (const v of visitors) bucket(visitorSource.get(v) || "direct").visitors++;
  for (const v of clicked) bucket(visitorSource.get(v) || "direct").clicks++;
  for (const u of signups) bucket(userSource.get(u) || UNTRACKED).signups++;
  for (const u of activated) bucket(userSource.get(u) || UNTRACKED).activated++;
  for (const u of checkout) bucket(userSource.get(u) || UNTRACKED).checkoutStarted++;
  for (const u of paid) bucket(userSource.get(u) || UNTRACKED).paid++;

  return {
    totals: {
      visitors: visitors.size,
      clicks: clicked.size,
      signups: signups.size,
      activated: activated.size,
      checkoutStarted: checkout.size,
      paid: paid.size,
    },
    bySource: [...bySourceMap.entries()]
      .map(([source, c]) => ({ source, ...c }))
      .sort((a, b) => b.visitors - a.visitors || b.signups - a.signups),
    topPages: [...pageVisitors.entries()]
      .map(([path, set]) => ({ path, visitors: set.size }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10),
    vsl,
  };
}
