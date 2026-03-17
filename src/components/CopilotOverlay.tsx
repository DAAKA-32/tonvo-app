"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ConversationSignal } from "@/types/analysis";

interface CopilotSignal {
  signal: ConversationSignal;
  label: string;
  time: number;
}

interface CopilotOverlayProps {
  coachingTip: string;
  liveInsight: string;
  suggestion: string;
  signals: CopilotSignal[];
  qualityScore: number;
  engagementScore: number;
  speakerBalance?: number; // 0-1, 0.5 = balanced
  elapsed: number;
  onStop: () => void;
}

const SIGNAL_COLORS: Record<string, { color: string; bg: string }> = {
  objection:   { color: "var(--color-negative)",     bg: "rgba(248, 113, 113, 0.12)" },
  question:    { color: "var(--color-neutral)",      bg: "rgba(251, 191, 36, 0.12)" },
  opportunity: { color: "var(--color-positive)",     bg: "rgba(52, 211, 153, 0.12)" },
  hesitation:  { color: "var(--color-neutral)",      bg: "rgba(251, 191, 36, 0.12)" },
  agreement:   { color: "var(--color-positive)",     bg: "rgba(52, 211, 153, 0.12)" },
  key_point:   { color: "var(--color-accent-light)", bg: "rgba(200, 200, 216, 0.12)" },
};

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getScoreColor(score: number) {
  if (score >= 70) return "var(--color-positive)";
  if (score >= 40) return "var(--color-neutral)";
  return "var(--color-negative)";
}

export default function CopilotOverlay({
  coachingTip,
  liveInsight,
  suggestion,
  signals,
  qualityScore,
  engagementScore,
  speakerBalance,
  elapsed,
  onStop,
}: CopilotOverlayProps) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const recentSignals = signals.slice(-4);
  const balance = speakerBalance ?? 0.5;
  const youPct = Math.round(balance * 100);
  const themPct = 100 - youPct;

  if (collapsed) {
    return (
      <div className="copilot-overlay copilot-collapsed" onClick={() => setCollapsed(false)}>
        <div className="copilot-collapsed-inner">
          <div className="copilot-pulse-dot" />
          <span className="copilot-collapsed-label">{t("copilot.title")}</span>
          <span className="copilot-collapsed-time">{formatTime(elapsed)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="copilot-overlay copilot-expanded">
      {/* Header */}
      <div className="copilot-header">
        <div className="copilot-header-left">
          <div className="copilot-pulse-dot" />
          <span className="copilot-title">{t("copilot.title")}</span>
          <span className="copilot-timer">{formatTime(elapsed)}</span>
        </div>
        <button
          className="copilot-collapse-btn"
          onClick={() => setCollapsed(true)}
          aria-label={t("copilot.collapse")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Scores row */}
      <div className="copilot-scores">
        <div className="copilot-score-item">
          <span className="copilot-score-label">Quality</span>
          <span className="copilot-score-value" style={{ color: qualityScore > 0 ? getScoreColor(qualityScore) : "var(--color-text-muted)" }}>
            {qualityScore > 0 ? qualityScore : "--"}
          </span>
        </div>
        <div className="copilot-score-divider" />
        <div className="copilot-score-item">
          <span className="copilot-score-label">Engagement</span>
          <span className="copilot-score-value" style={{ color: engagementScore > 0 ? getScoreColor(engagementScore) : "var(--color-text-muted)" }}>
            {engagementScore > 0 ? engagementScore : "--"}
          </span>
        </div>
      </div>

      {/* Coaching */}
      <div className="copilot-section">
        <div className="copilot-section-header">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span style={{ color: "#818cf8" }}>{t("copilot.coaching")}</span>
        </div>
        <p className="copilot-section-text">
          {coachingTip || t("copilot.noCoaching")}
        </p>
      </div>

      {/* Live Insight */}
      <div className="copilot-section">
        <div className="copilot-section-header">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span style={{ color: "#38bdf8" }}>{t("copilot.insight")}</span>
        </div>
        <p className="copilot-section-text">
          {liveInsight || t("copilot.noInsight")}
        </p>
      </div>

      {/* Suggestion */}
      {suggestion && (
        <div className="copilot-section">
          <div className="copilot-section-header">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span style={{ color: "var(--color-positive)" }}>{t("copilot.suggestion")}</span>
          </div>
          <p className="copilot-section-text">{suggestion}</p>
        </div>
      )}

      {/* Speaker Balance */}
      {speakerBalance != null && (
        <div className="copilot-section">
          <div className="copilot-section-header">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span style={{ color: "var(--color-accent-light)" }}>{t("copilot.speakerBalance")}</span>
          </div>
          <div className="copilot-balance">
            <div className="copilot-balance-labels">
              <span>{t("copilot.you")} {youPct}%</span>
              <span>{t("copilot.them")} {themPct}%</span>
            </div>
            <div className="copilot-balance-bar">
              <div className="copilot-balance-fill copilot-balance-you" style={{ width: `${youPct}%` }} />
              <div className="copilot-balance-fill copilot-balance-them" style={{ width: `${themPct}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Recent Signals */}
      {recentSignals.length > 0 && (
        <div className="copilot-section">
          <div className="copilot-section-header">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span style={{ color: "var(--color-neutral)" }}>{t("copilot.signals")}</span>
          </div>
          <div className="copilot-signals">
            {recentSignals.map((s, i) => {
              const cfg = SIGNAL_COLORS[s.signal] || SIGNAL_COLORS.key_point;
              return (
                <div key={i} className="copilot-signal-badge" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  <span className="copilot-signal-dot" style={{ backgroundColor: cfg.color }} />
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stop button */}
      <button className="copilot-stop-btn" onClick={onStop}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
        Stop Session
      </button>
    </div>
  );
}
