/**
 * Central source of truth for plan features and limits.
 * Used by BOTH backend (API route gating) and frontend (UI gating).
 */

export type PlanId = "free" | "pro" | "team";

export interface PlanFeatures {
  sessionsPerMonth: number; // -1 = unlimited
  maxSessionDurationSec: number; // -1 = unlimited
  coachingTips: boolean;
  liveInsight: boolean;
  screenAnalysis: boolean;
  signalDetection: boolean;
  speakerBalance: boolean;
  analyzeText: boolean;
  analyticsPage: boolean;
  exportPdfCsv: boolean;
  historyRetentionDays: number; // -1 = unlimited
  copilotOverlay: boolean;
  copilotPiP: boolean;
  maxSegmentsPerSession: number; // -1 = unlimited
  prioritySupport: boolean;
  teamDashboard: boolean;
}

export const PLAN_FEATURES: Record<PlanId, PlanFeatures> = {
  free: {
    sessionsPerMonth: 3,
    maxSessionDurationSec: 5 * 60, // 5 minutes
    coachingTips: false,
    liveInsight: false,
    screenAnalysis: false,
    signalDetection: false,
    speakerBalance: false,
    analyzeText: true,
    analyticsPage: false,
    exportPdfCsv: false,
    historyRetentionDays: 7,
    copilotOverlay: false,
    copilotPiP: false,
    maxSegmentsPerSession: 10,
    prioritySupport: false,
    teamDashboard: false,
  },
  pro: {
    sessionsPerMonth: -1,
    maxSessionDurationSec: -1,
    coachingTips: true,
    liveInsight: true,
    screenAnalysis: true,
    signalDetection: true,
    speakerBalance: true,
    analyzeText: true,
    analyticsPage: true,
    exportPdfCsv: true,
    historyRetentionDays: -1,
    copilotOverlay: true,
    copilotPiP: true,
    maxSegmentsPerSession: -1,
    prioritySupport: true,
    teamDashboard: false,
  },
  team: {
    sessionsPerMonth: -1,
    maxSessionDurationSec: -1,
    coachingTips: true,
    liveInsight: true,
    screenAnalysis: true,
    signalDetection: true,
    speakerBalance: true,
    analyzeText: true,
    analyticsPage: true,
    exportPdfCsv: true,
    historyRetentionDays: -1,
    copilotOverlay: true,
    copilotPiP: true,
    maxSegmentsPerSession: -1,
    prioritySupport: true,
    teamDashboard: true,
  },
};

/** Get features for a plan ID (falls back to free) */
export function getPlanFeatures(plan: string | undefined | null): PlanFeatures {
  return PLAN_FEATURES[(plan as PlanId) || "free"] || PLAN_FEATURES.free;
}

/** Check if a specific feature is available for a plan */
export function hasFeature(plan: string | undefined | null, feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures(plan);
  const val = features[feature];
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  return false;
}

/** Human-readable plan labels */
export const PLAN_LABELS: Record<PlanId, string> = {
  free: "Free",
  pro: "Pro",
  team: "Team",
};
