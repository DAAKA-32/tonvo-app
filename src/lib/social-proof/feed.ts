import type { SubscriptionEvent } from "./types";

const MINUTE = 60_000;

/**
 * Real events worth showing: never demo data, only recent ones, newest first,
 * and nothing at all below the minimum count.
 */
export function selectLiveEvents(
  events: SubscriptionEvent[],
  now: number,
  { maxAgeDays, minLiveEvents }: { maxAgeDays: number; minLiveEvents: number },
): SubscriptionEvent[] {
  const oldest = now - maxAgeDays * 24 * 60 * MINUTE;
  const recent = events
    .filter((e) => e.source !== "demo")
    .filter((e) => {
      const t = Date.parse(e.createdAt);
      return t >= oldest && t <= now + MINUTE;
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return recent.length >= minLiveEvents ? recent : [];
}

export function isJustNow(createdAt: string, now: number, justNowMinutes: number): boolean {
  return now - Date.parse(createdAt) < justNowMinutes * MINUTE;
}

/** "2 minutes ago", "il y a 2 heures", "昨日"… localized by the browser's Intl data. */
export function relativeTime(createdAt: string, now: number, lang: string): string {
  const seconds = Math.round((Date.parse(createdAt) - now) / 1000);
  const abs = Math.abs(seconds);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  if (abs < 60) return rtf.format(0, "second");
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (abs < 86_400) return rtf.format(Math.round(seconds / 3600), "hour");
  return rtf.format(Math.round(seconds / 86_400), "day");
}
