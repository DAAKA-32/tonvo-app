"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { ConversationSignal, SuggestedResponse } from "@/types/analysis";

interface CopilotSignal {
  signal: ConversationSignal;
  label: string;
  time: number;
}

interface SmartCopilotOverlayProps {
  coachingTip: string;
  liveInsight: string;
  suggestion: string;
  suggestedResponses: SuggestedResponse[];
  signals: CopilotSignal[];
  qualityScore: number;
  engagementScore: number;
  speakerBalance?: number;
  elapsed: number;
  currentTone: string;
  classification: string;
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

const INTENT_ICONS: Record<string, string> = {
  empathize: "💬",
  redirect: "↩",
  close: "🎯",
  probe: "🔍",
  agree: "✓",
  challenge: "⚡",
  clarify: "💡",
  deflect: "🛡",
};

const TONE_COLORS: Record<string, string> = {
  positive: "var(--color-positive)",
  neutral: "var(--color-neutral)",
  negative: "var(--color-negative)",
  hesitant: "#fb923c",
};

const CLASS_COLORS: Record<string, string> = {
  very_positive: "#34d399",
  positive: "#6ee7b7",
  neutral: "#fbbf24",
  awkward: "#fb923c",
  negative: "#f87171",
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

export default function SmartCopilotOverlay({
  coachingTip,
  liveInsight,
  suggestion,
  suggestedResponses,
  signals,
  qualityScore,
  engagementScore,
  speakerBalance,
  elapsed,
  currentTone,
  classification,
  onStop,
}: SmartCopilotOverlayProps) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"responses" | "dashboard">("responses");
  const prevResponsesRef = useRef<SuggestedResponse[]>([]);
  const [animatingResponses, setAnimatingResponses] = useState(false);

  const recentSignals = signals.slice(-4);
  const balance = speakerBalance ?? 0.5;
  const youPct = Math.round(balance * 100);
  const themPct = 100 - youPct;

  // Animate when responses change
  useEffect(() => {
    const prev = prevResponsesRef.current;
    const changed = suggestedResponses.length > 0 &&
      (prev.length !== suggestedResponses.length || prev.some((p, i) => p.text !== suggestedResponses[i]?.text));
    if (changed) {
      setAnimatingResponses(true);
      const timer = setTimeout(() => setAnimatingResponses(false), 400);
      prevResponsesRef.current = suggestedResponses;
      return () => clearTimeout(timer);
    }
  }, [suggestedResponses]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  if (collapsed) {
    return (
      <div className="smart-overlay smart-overlay--collapsed" onClick={() => setCollapsed(false)}>
        <div className="smart-overlay__collapsed-inner">
          <div className="smart-overlay__pulse" />
          <span className="smart-overlay__collapsed-label">AI Copilot</span>
          <span className="smart-overlay__collapsed-time">{formatTime(elapsed)}</span>
          {suggestedResponses.length > 0 && (
            <span className="smart-overlay__response-count">{suggestedResponses.length}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="smart-overlay smart-overlay--expanded">
      {/* Header bar */}
      <div className="smart-overlay__header">
        <div className="smart-overlay__header-left">
          <div className="smart-overlay__pulse" />
          <span className="smart-overlay__title">AI Copilot</span>
          <span className="smart-overlay__timer">{formatTime(elapsed)}</span>
        </div>
        <div className="smart-overlay__header-right">
          {/* Tone badge */}
          <span
            className="smart-overlay__badge"
            style={{
              color: TONE_COLORS[currentTone] || "var(--color-neutral)",
              backgroundColor: (TONE_COLORS[currentTone] || "var(--color-neutral)") + "1a",
            }}
          >
            {currentTone}
          </span>
          {classification && classification !== "neutral" && (
            <span
              className="smart-overlay__badge"
              style={{
                color: CLASS_COLORS[classification] || "#fbbf24",
                backgroundColor: (CLASS_COLORS[classification] || "#fbbf24") + "1a",
              }}
            >
              {classification.replace("_", " ")}
            </span>
          )}
          <button
            className="smart-overlay__collapse-btn"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        </div>
      </div>

      {/* Scores strip */}
      <div className="smart-overlay__scores">
        <div className="smart-overlay__score">
          <span className="smart-overlay__score-label">Quality</span>
          <span className="smart-overlay__score-value" style={{ color: qualityScore > 0 ? getScoreColor(qualityScore) : "var(--color-text-muted)" }}>
            {qualityScore > 0 ? qualityScore : "--"}
          </span>
        </div>
        <div className="smart-overlay__score-divider" />
        <div className="smart-overlay__score">
          <span className="smart-overlay__score-label">Engagement</span>
          <span className="smart-overlay__score-value" style={{ color: engagementScore > 0 ? getScoreColor(engagementScore) : "var(--color-text-muted)" }}>
            {engagementScore > 0 ? engagementScore : "--"}
          </span>
        </div>
        {speakerBalance != null && (
          <>
            <div className="smart-overlay__score-divider" />
            <div className="smart-overlay__score smart-overlay__score--balance">
              <span className="smart-overlay__score-label">Balance</span>
              <div className="smart-overlay__mini-balance">
                <div className="smart-overlay__mini-bar">
                  <div className="smart-overlay__mini-you" style={{ width: `${youPct}%` }} />
                  <div className="smart-overlay__mini-them" style={{ width: `${themPct}%` }} />
                </div>
                <span className="smart-overlay__mini-pct">{youPct}/{themPct}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tab switcher */}
      <div className="smart-overlay__tabs">
        <button
          className={`smart-overlay__tab ${viewMode === "responses" ? "smart-overlay__tab--active" : ""}`}
          onClick={() => setViewMode("responses")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Say This
          {suggestedResponses.length > 0 && (
            <span className="smart-overlay__tab-count">{suggestedResponses.length}</span>
          )}
        </button>
        <button
          className={`smart-overlay__tab ${viewMode === "dashboard" ? "smart-overlay__tab--active" : ""}`}
          onClick={() => setViewMode("dashboard")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Coaching
        </button>
      </div>

      {/* Content area — dynamic height */}
      <div className="smart-overlay__content">
        {viewMode === "responses" ? (
          <div className={`smart-overlay__responses ${animatingResponses ? "smart-overlay__responses--animating" : ""}`}>
            {suggestedResponses.length > 0 ? (
              suggestedResponses.map((resp, i) => (
                <div key={`${resp.text.slice(0, 20)}-${i}`} className="smart-overlay__response-card" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="smart-overlay__response-header">
                    <span className="smart-overlay__response-icon">{INTENT_ICONS[resp.intent] || "💬"}</span>
                    <span className="smart-overlay__response-label">{resp.label}</span>
                    <button
                      className={`smart-overlay__copy-btn ${copiedIdx === i ? "smart-overlay__copy-btn--copied" : ""}`}
                      onClick={() => handleCopy(resp.text, i)}
                      title="Copy to clipboard"
                    >
                      {copiedIdx === i ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                      )}
                    </button>
                  </div>
                  <p className="smart-overlay__response-text">{resp.text}</p>
                </div>
              ))
            ) : (
              <div className="smart-overlay__empty">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Listening... suggestions will appear here</span>
              </div>
            )}

            {/* Quick suggestion (single line) always visible below responses */}
            {suggestion && (
              <div className="smart-overlay__quick-tip">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                <span>{suggestion}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="smart-overlay__dashboard">
            {/* Coaching */}
            <div className="smart-overlay__section">
              <div className="smart-overlay__section-header">
                <div className="smart-overlay__section-dot" style={{ background: "#818cf8" }} />
                <span style={{ color: "#818cf8" }}>{t("copilot.coaching")}</span>
              </div>
              <p className="smart-overlay__section-text">
                {coachingTip || t("copilot.noCoaching")}
              </p>
            </div>

            {/* Live Insight */}
            <div className="smart-overlay__section">
              <div className="smart-overlay__section-header">
                <div className="smart-overlay__section-dot" style={{ background: "#38bdf8" }} />
                <span style={{ color: "#38bdf8" }}>{t("copilot.insight")}</span>
              </div>
              <p className="smart-overlay__section-text">
                {liveInsight || t("copilot.noInsight")}
              </p>
            </div>

            {/* Speaker Balance */}
            {speakerBalance != null && (
              <div className="smart-overlay__section">
                <div className="smart-overlay__section-header">
                  <div className="smart-overlay__section-dot" style={{ background: "#c8c8d8" }} />
                  <span style={{ color: "#c8c8d8" }}>{t("copilot.speakerBalance")}</span>
                </div>
                <div className="smart-overlay__balance-detail">
                  <div className="smart-overlay__balance-labels">
                    <span>{t("copilot.you")} {youPct}%</span>
                    <span>{t("copilot.them")} {themPct}%</span>
                  </div>
                  <div className="smart-overlay__balance-bar">
                    <div className="smart-overlay__balance-you" style={{ width: `${youPct}%` }} />
                    <div className="smart-overlay__balance-them" style={{ width: `${themPct}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* Signals */}
            {recentSignals.length > 0 && (
              <div className="smart-overlay__section">
                <div className="smart-overlay__section-header">
                  <div className="smart-overlay__section-dot" style={{ background: "#fbbf24" }} />
                  <span style={{ color: "#fbbf24" }}>{t("copilot.signals")}</span>
                </div>
                <div className="smart-overlay__signals">
                  {recentSignals.map((s, i) => {
                    const cfg = SIGNAL_COLORS[s.signal] || SIGNAL_COLORS.key_point;
                    return (
                      <div key={i} className="smart-overlay__signal-badge" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                        <span className="smart-overlay__signal-dot" style={{ backgroundColor: cfg.color }} />
                        <span>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stop button */}
      <button className="smart-overlay__stop" onClick={onStop}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
        Stop Session
      </button>
    </div>
  );
}
