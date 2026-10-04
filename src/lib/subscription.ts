import { supabaseAdmin } from "./supabase-admin";
import { PLANS, type PlanId } from "./stripe";

export interface UserSubscription {
  plan: PlanId;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: "active" | "canceled" | "past_due" | "trialing" | "none";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  sessionsUsed: number;
  sessionsReset: string; // ISO date of last reset
}

const DEFAULT_SUB: UserSubscription = {
  plan: "free",
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  status: "none",
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  sessionsUsed: 0,
  sessionsReset: new Date().toISOString(),
};

/**
 * Permanent plan overrides — these accounts always get the specified plan regardless of Stripe/DB state.
 * Format: "email:plan,email:plan" (e.g., "admin@example.com:team,test@example.com:pro")
 */
function parsePlanOverrides(): Record<string, PlanId> {
  const raw = process.env.PLAN_OVERRIDES || "";
  const overrides: Record<string, PlanId> = {};
  for (const entry of raw.split(",")) {
    const [email, plan] = entry.trim().split(":");
    if (email && plan && ["free", "pro", "team"].includes(plan)) {
      overrides[email.toLowerCase().trim()] = plan as PlanId;
    }
  }
  return overrides;
}

const PLAN_OVERRIDES = parsePlanOverrides();

/** Permanent override plan for this email, if any. */
export function getPlanOverride(email?: string | null): PlanId | null {
  if (!email) return null;
  return PLAN_OVERRIDES[email.toLowerCase().trim()] ?? null;
}

// The subscription lookup sits on the hot path of every live analysis call:
// bound it so a slow or dead database degrades to the Free plan instead of
// stalling or failing the request.
const SUB_LOOKUP_TIMEOUT_MS = 1_500;
let lastLookupWarnAt = 0;

function warnLookup(reason: string): void {
  const now = Date.now();
  if (now - lastLookupWarnAt > 60_000) {
    lastLookupWarnAt = now;
    console.warn(`[subscription] lookup failed, defaulting to free: ${reason}`);
  }
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms);
    Promise.resolve(promise).then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

/**
 * Resolve a user's subscription. Never throws: overrides first, then the
 * database (time-bounded), else the Free default.
 */
export async function getUserSubscription(userId: string, email?: string | null): Promise<UserSubscription> {
  // Check permanent overrides first
  const override = getPlanOverride(email);
  if (override) {
    return { ...DEFAULT_SUB, plan: override, status: "active" };
  }

  let data: Record<string, unknown> | null = null;
  try {
    const res = await withTimeout(
      supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
      SUB_LOOKUP_TIMEOUT_MS,
    );
    if (res.error) {
      warnLookup(res.error.message);
      return { ...DEFAULT_SUB };
    }
    data = res.data as Record<string, unknown> | null;
  } catch (err) {
    warnLookup(err instanceof Error ? err.message : String(err));
    return { ...DEFAULT_SUB };
  }

  if (!data) return { ...DEFAULT_SUB };

  // Reset sessions counter monthly
  const resetDate = new Date((data.sessions_reset as string | null) || 0);
  const now = new Date();
  const needsReset = resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear();

  if (needsReset) {
    try {
      await supabaseAdmin
        .from("subscriptions")
        .update({ sessions_used: 0, sessions_reset: now.toISOString() })
        .eq("user_id", userId);
    } catch (err) {
      warnLookup(err instanceof Error ? err.message : String(err));
    }
  }

  return {
    plan: ((data.plan as string) || "free") as PlanId,
    stripeCustomerId: (data.stripe_customer_id as string | null) ?? null,
    stripeSubscriptionId: (data.stripe_subscription_id as string | null) ?? null,
    status: ((data.status as UserSubscription["status"]) || "none"),
    currentPeriodEnd: (data.current_period_end as string | null) ?? null,
    cancelAtPeriodEnd: (data.cancel_at_period_end as boolean | null) ?? false,
    sessionsUsed: needsReset ? 0 : ((data.sessions_used as number | null) || 0),
    sessionsReset: needsReset ? now.toISOString() : (data.sessions_reset as string),
  };
}

export async function canStartSession(userId: string, email?: string | null): Promise<{ allowed: boolean; reason?: string }> {
  const sub = await getUserSubscription(userId, email);
  const plan = PLANS[sub.plan];

  // Paid plans: unlimited
  if (plan.sessionsPerMonth === -1) {
    return { allowed: true };
  }

  // Free plan: check limit
  if (sub.sessionsUsed >= plan.sessionsPerMonth) {
    return {
      allowed: false,
      reason: `You've used all ${plan.sessionsPerMonth} free sessions this month. Upgrade to Pro for unlimited sessions.`,
    };
  }

  return { allowed: true };
}

export async function incrementSessionCount(userId: string, email?: string | null): Promise<void> {
  const sub = await getUserSubscription(userId, email);

  if (sub.plan !== "free") {
    // Paid/override user -- no need to track session count
    return;
  }

  try {
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .upsert({
        user_id: userId,
        plan: "free",
        sessions_used: sub.sessionsUsed + 1,
        sessions_reset: sub.sessionsReset,
        status: "none",
      }, { onConflict: "user_id" });
    if (error) warnLookup(error.message);
  } catch (err) {
    warnLookup(err instanceof Error ? err.message : String(err));
  }
}
