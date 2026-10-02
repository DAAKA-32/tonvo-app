import type Stripe from "stripe";
import type { PlanId } from "@/lib/pricing-config";
import type { SubscriptionEvent } from "./types";

/**
 * Customer metadata flag that allows showing a subscriber's first name.
 * Without it the notification stays anonymous ("Someone joined Closer"):
 * a name shown publicly is personal data, so it needs the customer's consent.
 */
export const NAME_CONSENT_KEY = "social_proof_consent";

type CustomerRef = Stripe.Subscription["customer"] | null | undefined;

/** First name to display, only when the customer opted in. */
export function consentedFirstName(customer: CustomerRef): string | null {
  if (!customer || typeof customer === "string" || customer.deleted) return null;
  if (customer.metadata?.[NAME_CONSENT_KEY] !== "true") return null;
  const first = (customer.name ?? "").trim().split(/\s+/)[0] ?? "";
  // Letters, apostrophes and hyphens only; anything else stays anonymous.
  if (!/^[\p{L}'-]{1,24}$/u.test(first)) return null;
  return first.charAt(0).toLocaleUpperCase() + first.slice(1);
}

/** Short stable id for React keys, without exposing the Stripe subscription id. */
function publicId(subscriptionId: string): string {
  let h = 0;
  for (let i = 0; i < subscriptionId.length; i++) h = (Math.imul(31, h) + subscriptionId.charCodeAt(i)) | 0;
  return `stripe-${(h >>> 0).toString(36)}`;
}

export function toSubscriptionEvent(
  sub: Pick<Stripe.Subscription, "id" | "created" | "customer" | "items">,
  priceToPlan: Readonly<Record<string, PlanId>>,
): SubscriptionEvent | null {
  const priceId = sub.items?.data?.[0]?.price?.id;
  const planId = priceId ? priceToPlan[priceId] : undefined;
  if (!planId) return null;
  return {
    id: publicId(sub.id),
    planId,
    displayName: consentedFirstName(sub.customer),
    createdAt: new Date(sub.created * 1000).toISOString(),
    source: "stripe",
  };
}
