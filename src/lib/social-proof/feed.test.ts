import { describe, it, expect } from "vitest";
import { demoSubscriptionEvents } from "./demo-events";
import { isJustNow, relativeTime, selectLiveEvents } from "./feed";
import type { SubscriptionEvent } from "./types";

const NOW = Date.parse("2026-10-02T12:00:00Z");
const OPTS = { maxAgeDays: 14, minLiveEvents: 3 };

function ev(id: string, minutesAgo: number, source: SubscriptionEvent["source"] = "stripe"): SubscriptionEvent {
  return { id, planId: "pro", displayName: null, createdAt: new Date(NOW - minutesAgo * 60_000).toISOString(), source };
}

describe("selectLiveEvents", () => {
  it("never lets demo data through, however many events there are", () => {
    expect(selectLiveEvents(demoSubscriptionEvents(NOW), NOW, OPTS)).toEqual([]);
  });

  it("drops events older than the window", () => {
    const old = ev("old", 15 * 24 * 60);
    const result = selectLiveEvents([ev("a", 5), ev("b", 50), ev("c", 500), old], NOW, OPTS);
    expect(result.map((e) => e.id)).toEqual(["a", "b", "c"]);
  });

  it("returns nothing below the minimum count", () => {
    expect(selectLiveEvents([ev("a", 5), ev("b", 50)], NOW, OPTS)).toEqual([]);
  });

  it("sorts newest first", () => {
    const result = selectLiveEvents([ev("c", 300), ev("a", 1), ev("b", 60)], NOW, OPTS);
    expect(result.map((e) => e.id)).toEqual(["a", "b", "c"]);
  });
});

describe("demoSubscriptionEvents", () => {
  it("is ten events, all tagged demo", () => {
    const events = demoSubscriptionEvents(NOW);
    expect(events).toHaveLength(10);
    expect(events.every((e) => e.source === "demo")).toBe(true);
  });

  it("mixes minutes, hours and days, alternating from the first notifications", () => {
    const ages = demoSubscriptionEvents(NOW, () => 0.5).map((e) => relativeTime(e.createdAt, NOW, "en"));
    expect(ages).toEqual([
      "2 minutes ago", "2 hours ago", "17 minutes ago", "yesterday", "38 minutes ago",
      "5 hours ago", "8 minutes ago", "3 days ago", "1 hour ago", "2 days ago",
    ]);
  });

  it("nudges each age by at most 20% per page load", () => {
    const base = demoSubscriptionEvents(NOW, () => 0.5).map((e) => NOW - Date.parse(e.createdAt));
    for (const r of [0, 0.999]) {
      demoSubscriptionEvents(NOW, () => r).forEach((e, i) => {
        const ratio = (NOW - Date.parse(e.createdAt)) / base[i];
        expect(ratio).toBeGreaterThanOrEqual(0.79);
        expect(ratio).toBeLessThanOrEqual(1.21);
      });
    }
  });
});

describe("isJustNow", () => {
  it("splits at the threshold", () => {
    expect(isJustNow(ev("a", 14).createdAt, NOW, 15)).toBe(true);
    expect(isJustNow(ev("a", 16).createdAt, NOW, 15)).toBe(false);
  });
});

describe("relativeTime", () => {
  it("formats minutes, hours and days", () => {
    expect(relativeTime(ev("a", 0.2).createdAt, NOW, "en")).toBe("now");
    expect(relativeTime(ev("a", 2).createdAt, NOW, "en")).toBe("2 minutes ago");
    expect(relativeTime(ev("a", 180).createdAt, NOW, "en")).toBe("3 hours ago");
    expect(relativeTime(ev("a", 24 * 60).createdAt, NOW, "en")).toBe("yesterday");
  });
});
