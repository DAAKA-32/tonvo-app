import { z } from "zod";
import type { PlanId } from "@/lib/pricing-config";

/**
 * One subscription in the social-proof feed. Every source (demo data, Stripe,
 * later Firebase signups for the free plan) maps to this shape, so the UI never
 * knows where an event came from beyond the `source` tag.
 */
export interface SubscriptionEvent {
  id: string;
  planId: PlanId;
  /** First name to show, or null to stay anonymous ("Someone joined …"). */
  displayName: string | null;
  /** ISO 8601 time the subscription started. */
  createdAt: string;
  /** "demo" events are placeholders: they must never be presented as real. */
  source: "demo" | "stripe";
}

export const subscriptionEventSchema = z.object({
  id: z.string().min(1).max(64),
  planId: z.enum(["free", "pro", "team"]),
  displayName: z.string().min(1).max(40).nullable(),
  createdAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "createdAt must be an ISO date"),
  source: z.enum(["demo", "stripe"]),
});

/** Response of GET /api/social-proof. */
export const feedResponseSchema = z.object({
  events: z.array(subscriptionEventSchema).max(50),
});

export type FeedResponse = z.infer<typeof feedResponseSchema>;
