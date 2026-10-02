import { NextResponse } from "next/server";
import { SOCIAL_PROOF } from "@/lib/social-proof/config";
import { fetchStripeSubscriptionEvents } from "@/lib/social-proof/stripe-source";
import type { FeedResponse, SubscriptionEvent } from "@/lib/social-proof/types";

/*
 * Public feed of recent REAL subscriptions for the landing notifications.
 * Off until SOCIAL_PROOF_SOURCE=stripe is set; it never serves demo data.
 * Cached for 5 minutes so visitors never hit Stripe directly.
 */
export const revalidate = 300;

export async function GET() {
  let events: SubscriptionEvent[] = [];
  if ((process.env.SOCIAL_PROOF_SOURCE ?? "").trim() === "stripe") {
    try {
      events = await fetchStripeSubscriptionEvents({ maxAgeDays: SOCIAL_PROOF.maxAgeDays });
    } catch (err) {
      console.error("social-proof: Stripe read failed:", err instanceof Error ? err.message : "unknown error");
    }
  }
  const body: FeedResponse = { events };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
