import { NextResponse } from "next/server";
import { getUserSubscription } from "./subscription";
import { getPlanFeatures, type PlanFeatures } from "./plan-features";

interface GateResult {
  allowed: boolean;
  plan: string;
  features: PlanFeatures;
  response?: NextResponse;
}

/**
 * Backend plan gate — checks if a user's plan allows a specific feature.
 * Returns a pre-built 403 NextResponse if denied.
 *
 * Usage in API routes:
 * ```
 * const gate = await checkPlanFeature(userId, "screenAnalysis");
 * if (!gate.allowed) return gate.response!;
 * ```
 */
export async function checkPlanFeature(
  userId: string | null | undefined,
  feature: keyof PlanFeatures,
  email?: string | null
): Promise<GateResult> {
  if (!userId) {
    return {
      allowed: false,
      plan: "free",
      features: getPlanFeatures("free"),
      response: NextResponse.json(
        { error: "Authentication required", upgrade: true },
        { status: 401 }
      ),
    };
  }

  const sub = await getUserSubscription(userId, email);
  const features = getPlanFeatures(sub.plan);
  const val = features[feature];
  const allowed = typeof val === "boolean" ? val : typeof val === "number" ? val !== 0 : false;

  if (!allowed) {
    const minPlan = feature === "teamDashboard" ? "Team" : "Pro";
    return {
      allowed: false,
      plan: sub.plan,
      features,
      response: NextResponse.json(
        {
          error: `This feature requires the ${minPlan} plan.`,
          requiredPlan: minPlan.toLowerCase(),
          currentPlan: sub.plan,
          upgrade: true,
        },
        { status: 403 }
      ),
    };
  }

  return { allowed: true, plan: sub.plan, features };
}

/**
 * Check session limits (count-based).
 * Replaces the old canStartSession function with plan-aware logic.
 */
export async function checkSessionLimit(userId: string, email?: string | null): Promise<GateResult & { sessionsUsed: number; sessionsLimit: number }> {
  const sub = await getUserSubscription(userId, email);
  const features = getPlanFeatures(sub.plan);

  if (features.sessionsPerMonth === -1) {
    return {
      allowed: true,
      plan: sub.plan,
      features,
      sessionsUsed: sub.sessionsUsed,
      sessionsLimit: -1,
    };
  }

  if (sub.sessionsUsed >= features.sessionsPerMonth) {
    return {
      allowed: false,
      plan: sub.plan,
      features,
      sessionsUsed: sub.sessionsUsed,
      sessionsLimit: features.sessionsPerMonth,
      response: NextResponse.json(
        {
          error: `You've used all ${features.sessionsPerMonth} free sessions this month. Upgrade to Pro for unlimited sessions.`,
          sessionsUsed: sub.sessionsUsed,
          sessionsLimit: features.sessionsPerMonth,
          upgrade: true,
        },
        { status: 403 }
      ),
    };
  }

  return {
    allowed: true,
    plan: sub.plan,
    features,
    sessionsUsed: sub.sessionsUsed,
    sessionsLimit: features.sessionsPerMonth,
  };
}
