"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { SuggestedResponse, DetectedQuestion } from "@/types/analysis";
import type { Participant } from "@/hooks/useParticipants";
import ParticipantsList from "./ParticipantsList";

// Prep mode data from /api/copilot-prep
export interface PrepData {
  greeting: string;
  prepTips: Array<{ icon: string; title: string; text: string }>;
  openingLines: Array<{ text: string; label: string; intent: string }>;
  anticipatedQuestions: Array<{ question: string; suggestedAnswer: string }>;
}

interface SmartCopilotOverlayProps {
  mode: "prep" | "live";
  // Live mode
  suggestion?: string;
  suggestedResponses?: SuggestedResponse[];
  detectedQuestion?: DetectedQuestion | null;
  elapsed?: number;
  onStop?: () => void;
  participants?: Participant[];
  // Prep mode
  prepData?: PrepData | null;
  prepLoading?: boolean;
  onStartSession?: () => void;
}

const INTENT_ICONS: Record<string, string> = {
  empathize: "💬",
  redirect: "↩",
  close: "🎯",
  probe: "🔍",
  agree: "✓",
  challenge: "⚡",
  clarify: "💡",
  deflect: "🛡",
  warm: "👋",
  direct: "➡",
  curious: "🤔",
};

const URGENCY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  high:   { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
  medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.06)",  border: "rgba(251,191,36,0.2)" },
  low:    { color: "#818cf8", bg: "rgba(129,140,248,0.06)", border: "rgba(129,140,248,0.15)" },
};

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function SmartCopilotOverlay({
  mode,
  suggestion = "",
  suggestedResponses = [],
  detectedQuestion = null,
  elapsed = 0,
  onStop,
  participants = [],
  prepData,
  prepLoading = false,
  onStartSession,
}: SmartCopilotOverlayProps) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const prevResponsesRef = useRef<SuggestedResponse[]>([]);
  const [animatingResponses, setAnimatingResponses] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);

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

  // Animate question appearance
  useEffect(() => {
    if (detectedQuestion) {
      setQuestionVisible(false);
      const timer = setTimeout(() => setQuestionVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setQuestionVisible(false);
    }
  }, [detectedQuestion?.text]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  // ── COLLAPSED STATE ──
  if (collapsed) {
    return (
      <div className="smart-overlay smart-overlay--collapsed" onClick={() => setCollapsed(false)}>
        <div className="smart-overlay__collapsed-inner">
          <div className="smart-overlay__pulse" />
          <span className="smart-overlay__collapsed-label">{t("copilot.title")}</span>
          {mode === "live" && <span className="smart-overlay__collapsed-time">{formatTime(elapsed)}</span>}
          {mode === "prep" && <span className="smart-overlay__collapsed-time">{t("copilot.prepMode")}</span>}
          {detectedQuestion && (
            <span className="smart-overlay__question-badge">?</span>
          )}
          {suggestedResponses.length > 0 && (
            <span className="smart-overlay__response-count">{suggestedResponses.length}</span>
          )}
        </div>
      </div>
    );
  }

  // ── PREP MODE ──
  if (mode === "prep") {
    return (
      <div className="smart-overlay smart-overlay--expanded smart-overlay--prep">
        {/* Header */}
        <div className="smart-overlay__header">
          <div className="smart-overlay__header-left">
            <div className="smart-overlay__pulse smart-overlay__pulse--prep" />
            <span className="smart-overlay__title">{t("copilot.title")}</span>
            <span className="smart-overlay__badge" style={{ color: "#818cf8", backgroundColor: "rgba(129,140,248,0.15)" }}>
              {t("copilot.prepMode")}
            </span>
          </div>
          <div className="smart-overlay__header-right">
            <button className="smart-overlay__collapse-btn" onClick={() => setCollapsed(true)} aria-label={t("copilot.collapse")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>
        </div>

        <div className="smart-overlay__content">
          {prepLoading ? (
            <div className="smart-overlay__prep-loading">
              <div className="smart-overlay__prep-spinner" />
              <span>{t("copilot.preparing")}</span>
            </div>
          ) : prepData ? (
            <div className="smart-overlay__prep-content">
              {/* Greeting */}
              <div className="smart-overlay__prep-greeting">
                {prepData.greeting}
              </div>

              {/* Prep tips */}
              {prepData.prepTips.length > 0 && (
                <div className="smart-overlay__prep-section">
                  <div className="smart-overlay__section-header">
                    <div className="smart-overlay__section-dot" style={{ background: "#818cf8" }} />
                    <span style={{ color: "#818cf8" }}>{t("copilot.preparation")}</span>
                  </div>
                  <div className="smart-overlay__prep-tips">
                    {prepData.prepTips.map((tip, i) => (
                      <div key={i} className="smart-overlay__prep-tip">
                        <span className="smart-overlay__prep-tip-icon">{tip.icon}</span>
                        <div>
                          <span className="smart-overlay__prep-tip-title">{tip.title}</span>
                          <span className="smart-overlay__prep-tip-text">{tip.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opening lines */}
              {prepData.openingLines.length > 0 && (
                <div className="smart-overlay__prep-section">
                  <div className="smart-overlay__section-header">
                    <div className="smart-overlay__section-dot" style={{ background: "#34d399" }} />
                    <span style={{ color: "#34d399" }}>{t("copilot.openingLines")}</span>
                  </div>
                  <div className="smart-overlay__prep-openers">
                    {prepData.openingLines.map((line, i) => (
                      <div key={i} className="smart-overlay__response-card">
                        <div className="smart-overlay__response-header">
                          <span className="smart-overlay__response-icon">{INTENT_ICONS[line.intent] || "💬"}</span>
                          <span className="smart-overlay__response-label">{line.label}</span>
                          <button
                            className={`smart-overlay__copy-btn ${copiedIdx === 100 + i ? "smart-overlay__copy-btn--copied" : ""}`}
                            onClick={() => handleCopy(line.text, 100 + i)}
                            title="Copy to clipboard"
                          >
                            {copiedIdx === 100 + i ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                            )}
                          </button>
                        </div>
                        <p className="smart-overlay__response-text">{line.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anticipated questions */}
              {prepData.anticipatedQuestions.length > 0 && (
                <div className="smart-overlay__prep-section">
                  <div className="smart-overlay__section-header">
                    <div className="smart-overlay__section-dot" style={{ background: "#fbbf24" }} />
                    <span style={{ color: "#fbbf24" }}>{t("copilot.theyMightAsk")}</span>
                  </div>
                  <div className="smart-overlay__prep-questions">
                    {prepData.anticipatedQuestions.map((q, i) => (
                      <div key={i} className="smart-overlay__prep-qa">
                        <div className="smart-overlay__prep-q">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                          <span>{q.question}</span>
                        </div>
                        <div className="smart-overlay__prep-a">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                          <span>{q.suggestedAnswer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="smart-overlay__empty">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" style={{ opacity: 0.4 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
              <span>{t("copilot.selectMode")}</span>
            </div>
          )}
        </div>

        {/* Start button */}
        {onStartSession && (
          <button className="smart-overlay__start" onClick={onStartSession}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            {t("copilot.startSession")}
          </button>
        )}
      </div>
    );
  }

  // ── LIVE MODE (minimal) ──
  return (
    <div className="smart-overlay smart-overlay--expanded">
      {/* Header bar */}
      <div className="smart-overlay__header">
        <div className="smart-overlay__header-left">
          <div className="smart-overlay__pulse" />
          <span className="smart-overlay__title">{t("copilot.title")}</span>
          <span className="smart-overlay__timer">{formatTime(elapsed)}</span>
        </div>
        <div className="smart-overlay__header-right">
          <button className="smart-overlay__collapse-btn" onClick={() => setCollapsed(true)} aria-label={t("copilot.collapse")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        </div>
      </div>

      {/* Detected Question Banner */}
      {detectedQuestion && (
        <div
          className={`smart-overlay__detected-question ${questionVisible ? "smart-overlay__detected-question--visible" : ""}`}
          style={{
            backgroundColor: URGENCY_COLORS[detectedQuestion.urgency]?.bg,
            borderColor: URGENCY_COLORS[detectedQuestion.urgency]?.border,
          }}
        >
          <div className="smart-overlay__dq-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={URGENCY_COLORS[detectedQuestion.urgency]?.color || "#fbbf24"} strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="smart-overlay__dq-speaker" style={{ color: URGENCY_COLORS[detectedQuestion.urgency]?.color }}>
              {detectedQuestion.speaker}
            </span>
            {detectedQuestion.urgency === "high" && (
              <span className="smart-overlay__dq-urgent">{t("copilot.respondNow")}</span>
            )}
          </div>
          <p className="smart-overlay__dq-text">&ldquo;{detectedQuestion.text}&rdquo;</p>
        </div>
      )}

      {/* Participants */}
      {participants.length > 0 && <ParticipantsList participants={participants} />}

      {/* Suggested Responses */}
      <div className="smart-overlay__content">
        <div className={`smart-overlay__responses ${animatingResponses ? "smart-overlay__responses--animating" : ""}`}>
          {suggestedResponses.length > 0 ? (
            suggestedResponses.map((resp, i) => (
              <div key={`${resp.text.slice(0, 20)}-${i}`} className={`smart-overlay__response-card ${i === 0 && detectedQuestion ? "smart-overlay__response-card--hero" : ""}`} style={{ animationDelay: `${i * 80}ms` }}>
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
              <span>{t("copilot.listening")}</span>
            </div>
          )}

          {suggestion && (
            <div className="smart-overlay__quick-tip">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              <span>{suggestion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stop button */}
      {onStop && (
        <button className="smart-overlay__stop" onClick={onStop}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
          {t("copilot.stopSession")}
        </button>
      )}
    </div>
  );
}
