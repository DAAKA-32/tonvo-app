"use client";

import { getAuthHeaders } from "@/lib/api-client";
import type { Attribution, ClientEvent } from "@/lib/analytics/events";

/**
 * Browser side of the first-party funnel analytics (server: /api/track, dashboard: /admin/analytics).
 *
 * - One random visitor id in localStorage, created once and kept 13 months (never extended on later visits).
 * - First-touch attribution: ?ref=, utm_* and the referring site, captured on the first visit only.
 * - Nothing is sent when the visitor opted out (privacy page), sends Global Privacy Control or Do Not Track,
 *   or is not on tonvo.co (local dev and preview deployments stay out of the numbers).
 * Every storage access is wrapped: a blocked localStorage just means no tracking.
 */

const ID_KEY = "tonvo_aid";
const ATTR_KEY = "tonvo_attr";
const OPT_OUT_KEY = "tonvo_analytics_optout";
const DEV_KEY = "tonvo_track_dev"; // set to "1" to test tracking on localhost
const ID_LIFETIME_MS = 395 * 24 * 3600 * 1000; // 13 months
const PROD_HOSTS = new Set(["tonvo.co", "www.tonvo.co"]);
const ATTR_PARAMS = ["ref", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage blocked: tracking simply stays off */
  }
}

export function isOptedOut(): boolean {
  return storageGet(OPT_OUT_KEY) === "1";
}

export function setOptOut(optOut: boolean): void {
  if (optOut) {
    storageSet(OPT_OUT_KEY, "1");
    try {
      window.localStorage.removeItem(ID_KEY);
      window.localStorage.removeItem(ATTR_KEY);
    } catch {
      /* ignore */
    }
  } else {
    try {
      window.localStorage.removeItem(OPT_OUT_KEY);
    } catch {
      /* ignore */
    }
  }
}

function trackingAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (isOptedOut()) return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.globalPrivacyControl === true || nav.doNotTrack === "1") return false;
  return PROD_HOSTS.has(window.location.hostname) || storageGet(DEV_KEY) === "1";
}

function newId(): string {
  try {
    return crypto.randomUUID().replace(/-/g, "");
  } catch {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  }
}

/** The visitor id, or null when it cannot be stored (then nothing is tracked). */
function getAnonId(): string | null {
  const raw = storageGet(ID_KEY);
  if (raw) {
    try {
      const { id, exp } = JSON.parse(raw) as { id: string; exp: number };
      if (typeof id === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(id) && exp > Date.now()) return id;
    } catch {
      /* fall through: re-create */
    }
  }
  const id = newId();
  storageSet(ID_KEY, JSON.stringify({ id, exp: Date.now() + ID_LIFETIME_MS }));
  return storageGet(ID_KEY) ? id : null;
}

/** First-touch attribution. Captured on the first tracked page view, then reused for every event. */
export function captureAttribution(): Attribution {
  const stored = storageGet(ATTR_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Attribution;
    } catch {
      /* re-capture */
    }
  }
  const attr: Attribution = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of ATTR_PARAMS) {
      const v = params.get(key);
      if (v) attr[key] = v.trim().slice(0, 120);
    }
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host && host !== window.location.hostname.replace(/^www\./, "")) attr.referrer_host = host.slice(0, 200);
    }
  } catch {
    /* malformed referrer or URL: keep what we have */
  }
  storageSet(ATTR_KEY, JSON.stringify(attr));
  return attr;
}

/**
 * Send one event. Fire-and-forget: never throws, never blocks navigation (keepalive).
 * The Firebase ID token is attached when someone is signed in, so the account is linked server-side.
 */
export function track(event: ClientEvent, props?: Record<string, string | number | boolean>): void {
  if (!trackingAllowed()) return;
  const anonId = getAnonId();
  if (!anonId) return;
  const attribution = captureAttribution();
  void (async () => {
    try {
      const auth = await getAuthHeaders();
      await fetch("/api/track", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ event, anonId, path: window.location.pathname, attribution, props }),
      });
    } catch {
      /* analytics must never break the page */
    }
  })();
}
