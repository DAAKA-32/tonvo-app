import { supabaseAdmin } from "./supabase-admin";
import { PLANS, type PlanId } from "./stripe";

export interface UserSubscription {
  plan: PlanId;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: "active" | "canceled" | "past_due" | "trialing" | "none";
  currentPeriodEnd: string | null;
  sessionsUsed: number;
  sessionsReset: string; // ISO date of last reset
}

const DEFAULT_SUB: UserSubscription = {
  plan: "free",
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  status: "none",
  currentPeriodEnd: null,
  sessionsUsed: 0,
  sessionsReset: new Date().toISOString(),
};

export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return DEFAULT_SUB;

  // Reset sessions counter monthly
  const resetDate = new Date(data.sessions_reset || 0);
  const now = new Date();
  const needsReset = resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear();

  if (needsReset) {
    await supabaseAdmin
      .from("subscriptions")
      .update({ sessions_used: 0, sessions_reset: now.toISOString() })
      .eq("user_id", userId);
  }

  return {
    plan: (data.plan || "free") as PlanId,
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
    status: data.status || "none",
    currentPeriodEnd: data.current_period_end,
    sessionsUsed: needsReset ? 0 : (data.sessions_used || 0),
    sessionsReset: needsReset ? now.toISOString() : data.sessions_reset,
  };
}

export async function canStartSession(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const sub = await getUserSubscription(userId);
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

export async function incrementSessionCount(userId: string): Promise<void> {
  const sub = await getUserSubscription(userId);

  if (sub.stripeSubscriptionId) {
    // Paid user -- no need to track
    return;
  }

  await supabaseAdmin
    .from("subscriptions")
    .upsert({
      user_id: userId,
      plan: "free",
      sessions_used: sub.sessionsUsed + 1,
      sessions_reset: sub.sessionsReset,
      status: "none",
    }, { onConflict: "user_id" });
}
