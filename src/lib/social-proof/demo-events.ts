/*
 * DEMO DATA ONLY. These are placeholder subscriptions, not customers. The
 * widget shows them whenever there are not enough real subscriptions, and
 * always with a visible "Demo" badge so no visitor can take them for real
 * activity. Never show them without the badge, never mix them with real events.
 */
import type { PlanId } from "@/lib/pricing-config";
import type { SubscriptionEvent } from "./types";

const HOUR = 60;
const DAY = 24 * HOUR;

/*
 * Display order. Ages alternate between minutes, hours and days so the
 * first few notifications already feel like a live, uneven feed.
 */
const DEMO: { name: string; planId: PlanId; minutesAgo: number }[] = [
  { name: "Alex", planId: "free", minutesAgo: 2 },
  { name: "Emma", planId: "pro", minutesAgo: 2 * HOUR + 10 },
  { name: "Lucas", planId: "team", minutesAgo: 17 },
  { name: "Sofia", planId: "pro", minutesAgo: DAY + 3 * HOUR },
  { name: "Noah", planId: "free", minutesAgo: 38 },
  { name: "Lina", planId: "pro", minutesAgo: 5 * HOUR + 20 },
  { name: "Hugo", planId: "free", minutesAgo: 8 },
  { name: "Maya", planId: "team", minutesAgo: 3 * DAY + 4 * HOUR },
  { name: "Ethan", planId: "pro", minutesAgo: HOUR + 12 },
  { name: "Clara", planId: "free", minutesAgo: 2 * DAY + 2 * HOUR },
];

/** Each age is nudged by up to ±20% per page load, so the examples never read as a fixed script. */
const JITTER = 0.2;

export function demoSubscriptionEvents(
  now: number = Date.now(),
  random: () => number = Math.random,
): SubscriptionEvent[] {
  return DEMO.map((d, i) => {
    const minutes = Math.max(1, d.minutesAgo * (1 - JITTER + random() * 2 * JITTER));
    return {
      id: `demo-${i + 1}`,
      planId: d.planId,
      displayName: d.name,
      createdAt: new Date(now - minutes * 60_000).toISOString(),
      source: "demo",
    };
  });
}
