"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { getPlanFeatures, type PlanId, type PlanFeatures } from "@/lib/plan-features";

interface PlanState {
  plan: PlanId;
  features: PlanFeatures;
  sessionsUsed: number;
  sessionsLimit: number;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  loading: boolean;
  /** Check if a feature is available on the current plan */
  can: (feature: keyof PlanFeatures) => boolean;
  /** Remaining sessions (-1 = unlimited) */
  sessionsRemaining: number;
  /** Whether the user is on a paid plan */
  isPaid: boolean;
  /** Refresh subscription data */
  refresh: () => void;
}

/**
 * Client-side hook to access the current user's plan and features.
 * Fetches subscription once on mount, caches for the session.
 */
export function usePlan(): PlanState {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanId>("free");
  const [sessionsUsed, setSessionsUsed] = useState(0);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSub = useCallback(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.plan) setPlan(data.plan as PlanId);
        if (data.sessionsUsed != null) setSessionsUsed(data.sessionsUsed);
        if (data.currentPeriodEnd) setCurrentPeriodEnd(data.currentPeriodEnd);
        if (data.cancelAtPeriodEnd != null) setCancelAtPeriodEnd(data.cancelAtPeriodEnd);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchSub();
  }, [fetchSub]);

  const features = getPlanFeatures(plan);

  const can = useCallback(
    (feature: keyof PlanFeatures): boolean => {
      const val = features[feature];
      if (typeof val === "boolean") return val;
      if (typeof val === "number") return val !== 0;
      return false;
    },
    [features]
  );

  const sessionsLimit = features.sessionsPerMonth;
  const sessionsRemaining = sessionsLimit === -1 ? -1 : Math.max(0, sessionsLimit - sessionsUsed);
  const isPaid = plan !== "free";

  return {
    plan,
    features,
    sessionsUsed,
    sessionsLimit,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    loading,
    can,
    sessionsRemaining,
    isPaid,
    refresh: fetchSub,
  };
}
