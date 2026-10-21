/**
 * Consent for optional tracking (today: the Meta Pixel and its server-side mirror).
 *
 * - Nothing optional loads until the visitor accepts. "No answer" means "no".
 * - A Global Privacy Control or Do Not Track signal counts as a refusal, and the banner is not shown.
 * - The choice lives in localStorage (key below) and can be changed at any time from the cookie policy.
 * - Our own audience measurement is separate: it is anonymous, sets no cookie, and has its own opt-out on
 *   the privacy page (src/lib/analytics/client.ts).
 *
 * Browser only: every function is a no-op on the server.
 */

export type Consent = "granted" | "denied";

const KEY = "tonvo_consent_v1";
/** Fired on window whenever the stored choice changes, so the pixel and the banner stay in sync. */
export const CONSENT_EVENT = "tonvo:consent";

export function privacySignalOn(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1";
}

/** The visitor's choice, or null when they have not answered yet. A privacy signal always reads as "denied". */
export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  if (privacySignalOn()) return "denied";
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null; // storage blocked: ask again next time rather than assume yes
  }
}

/** Store a choice, or clear it (null) so the banner asks again. */
export function writeConsent(value: Consent | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, value);
  } catch {
    /* storage blocked: the choice only lasts for this page view */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
