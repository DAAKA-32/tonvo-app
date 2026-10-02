import type { PlanId } from "@/lib/pricing-config";
import { getStripe, PLANS } from "@/lib/stripe";
import { toSubscriptionEvent } from "./stripe-mapping";
import type { SubscriptionEvent } from "./types";

/** Server only: reads Stripe with the secret key. Never import from client code. */

function priceToPlan(): Record<string, PlanId> {
  const map: Record<string, PlanId> = {};
  for (const id of [PLANS.pro.priceId, PLANS.pro.yearlyPriceId]) if (id) map[id] = "pro";
  for (const id of [PLANS.team.priceId, PLANS.team.yearlyPriceId]) if (id) map[id] = "team";
  return map;
}

/**
 * Recent active paid subscriptions, newest first. Read-only. The free plan
 * has no Stripe subscription, so Starter events need another source (signups).
 */
export async function fetchStripeSubscriptionEvents({
  maxAgeDays,
  limit = 20,
}: {
  maxAgeDays: number;
  limit?: number;
}): Promise<SubscriptionEvent[]> {
  const since = Math.floor(Date.now() / 1000) - maxAgeDays * 86_400;
  const page = await getStripe().subscriptions.list({
    status: "active",
    created: { gte: since },
    limit,
    expand: ["data.customer"],
  });
  const plans = priceToPlan();
  return page.data
    .map((sub) => toSubscriptionEvent(sub, plans))
    .filter((e): e is SubscriptionEvent => e !== null);
}
