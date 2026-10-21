"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { ConversationSignal, DetectedQuestion } from "@/types/analysis";

interface SignalEntry {
  signal: ConversationSignal;
  label: string;
  time: number;
}

interface SuggestedResponse {
  text: string;
  intent: string;
  label: string;
}

interface LiveCopilotPanelProps {
  coachingTip: string;
  liveInsight: string;
  suggestion: string;
  suggestedResponses: SuggestedResponse[];
  signals: SignalEntry[];
  speakerBalance?: number;
  qualityScore: number;
  engagementScore: number;
  paused: boolean;
  onTogglePause: () => void;
  onAsk: (question: string) => void;
  asking: boolean;
  answer: string;
  /** Question the other party asked that still needs an answer. */
  detectedQuestion?: DetectedQuestion | null;
  /** Free plan: coaching, insight, signals and balance are shown as a locked teaser. */
  proLocked?: boolean;
  labels: {
    coaching: string;
    insight: string;
    suggestion: string;
    signals: string;
    speakerBalance: string;
    you: string;
    them: string;
    askPlaceholder: string;
    paused: string;
    pause: string;
    resume: string;
    quality: string;
    engagement: string;
    listening: string;
    suggestedResponses: string;
  };
}

const SIGNAL_TINT: Record<ConversationSignal, { color: string; bg: string }> = {
  objection:   { color: "var(--color-negative)",     bg: "rgba(248, 113, 113, 0.12)" },
  question:    { color: "var(--color-neutral)",      bg: "rgba(251, 191, 36, 0.12)" },
  opportunity: { color: "var(--color-positive)",     bg: "rgba(52, 211, 153, 0.12)" },
  hesitation:  { color: "var(--color-neutral)",      bg: "rgba(251, 191, 36, 0.12)" },
  agreement:   { color: "var(--color-positive)",     bg: "rgba(52, 211, 153, 0.12)" },
  key_point:   { color: "var(--color-accent-light)", bg: "rgba(129, 140, 248, 0.12)" },
  none:        { color: "",                          bg: "" },
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function LiveCopilotPanel({
  coachingTip,
  liveInsight,
  suggestion,
  suggestedResponses,
  signals,
  speakerBalance,
  qualityScore,
  engagementScore,
  paused,
  onTogglePause,
  onAsk,
  asking,
  answer,
  detectedQuestion,
  proLocked = false,
  labels,
}: LiveCopilotPanelProps) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [question, setQuestion] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copiedTimer.current) clearTimeout(copiedTimer.current); }, []);

  // A suggested reply is something to SAY: clicking copies it (e.g. to paste in the meeting chat).
  const copyReply = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopiedIndex(index);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopiedIndex(null), 1500);
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || asking) return;
    onAsk(q);
    setQuestion("");
  };

  const getScoreColor = (s: number) =>
    s >= 70 ? "var(--color-positive)" : s >= 40 ? "var(--color-neutral)" : "var(--color-negative)";

  return (
    <aside className="lcp-root">
      {/* Header */}
      <header className="lcp-header">
        <div className="lcp-brand">
          <span className={`lcp-dot ${paused ? "is-paused" : "is-live"}`} aria-hidden />
          <span className="lcp-brand-label">{t("copilot.title", "Tonvo Copilot")}</span>
        </div>
        <button
          type="button"
          onClick={onTogglePause}
          className="lcp-pause-btn"
          aria-label={paused ? labels.resume : labels.pause}
        >
          {paused ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="4" x2="6" y2="20" /><line x1="18" y1="4" x2="18" y2="20" /></svg>
          )}
          <span>{paused ? labels.resume : labels.pause}</span>
        </button>
      </header>

      {/* Score row */}
      {(qualityScore > 0 || engagementScore > 0) && (
        <div className="lcp-scores">
          {qualityScore > 0 && (
            <div className="lcp-score">
              <span className="lcp-score-label">{labels.quality}</span>
              <span className="lcp-score-value" style={{ color: getScoreColor(qualityScore) }}>{qualityScore}</span>
            </div>
          )}
          {engagementScore > 0 && (
            <div className="lcp-score">
              <span className="lcp-score-label">{labels.engagement}</span>
              <span className="lcp-score-value" style={{ color: getScoreColor(engagementScore) }}>{engagementScore}</span>
            </div>
          )}
        </div>
      )}

      {/* Question the other party is waiting on */}
      <AnimatePresence mode="wait">
        {detectedQuestion && detectedQuestion.text && (
          <motion.section
            key={detectedQuestion.text}
            className={`lcp-block lcp-block--question ${detectedQuestion.urgency === "high" ? "is-urgent" : ""}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <div className="lcp-block-head">
              <span className="lcp-block-label lcp-question-label">
                {t("copilot.questionToAnswer", "Question to answer")}
              </span>
              {detectedQuestion.urgency === "high" && (
                <span className="lcp-urgent">{t("copilot.respondNow", "Respond now")}</span>
              )}
            </div>
            <p className="lcp-text lcp-question-text">&ldquo;{detectedQuestion.text}&rdquo;</p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Suggestion (primary call-to-say) */}
      <AnimatePresence mode="wait">
        {suggestion && (
          <motion.section
            key={suggestion}
            className="lcp-block lcp-block--suggestion"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.32, ease: easeOut }}
          >
            <div className="lcp-block-head">
              <span className="lcp-block-icon" style={{ color: "var(--color-positive)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </span>
              <span className="lcp-block-label" style={{ color: "var(--color-positive)" }}>{labels.suggestion}</span>
            </div>
            <p className="lcp-suggestion">{suggestion}</p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Suggested responses (quick-pick) */}
      {suggestedResponses && suggestedResponses.length > 0 && (
        <section className="lcp-block">
          <div className="lcp-block-head">
            <span className="lcp-block-label">{labels.suggestedResponses}</span>
          </div>
          <div className="lcp-quickreplies">
            {suggestedResponses.slice(0, 3).map((r, i) => (
              <motion.button
                key={`${r.intent}-${i}`}
                type="button"
                className="lcp-quickreply"
                onClick={() => copyReply(r.text, i)}
                title={t("copilot.copyReply", "Copy")}
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                <span className="lcp-quickreply-head">
                  <span className="lcp-quickreply-label">{r.label}</span>
                  <span className="lcp-quickreply-copy">
                    {copiedIndex === i ? t("copilot.copied", "Copied") : t("copilot.copyReply", "Copy")}
                  </span>
                </span>
                <span className="lcp-quickreply-text">{r.text}</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Coaching */}
      <AnimatePresence mode="wait">
        {coachingTip && (
          <motion.section
            key={coachingTip}
            className="lcp-block"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <div className="lcp-block-head">
              <span className="lcp-block-icon" style={{ color: "#818cf8" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              </span>
              <span className="lcp-block-label" style={{ color: "#818cf8" }}>{labels.coaching}</span>
            </div>
            <p className="lcp-text">{coachingTip}</p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Insight */}
      <AnimatePresence mode="wait">
        {liveInsight && (
          <motion.section
            key={liveInsight}
            className="lcp-block"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <div className="lcp-block-head">
              <span className="lcp-block-icon" style={{ color: "#38bdf8" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </span>
              <span className="lcp-block-label" style={{ color: "#38bdf8" }}>{labels.insight}</span>
            </div>
            <p className="lcp-text">{liveInsight}</p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Speaker balance */}
      {speakerBalance != null && (
        <section className="lcp-block">
          <div className="lcp-block-head">
            <span className="lcp-block-label">{labels.speakerBalance}</span>
          </div>
          <div className="lcp-balance-meta">
            <span>{labels.you} {Math.round(speakerBalance * 100)}%</span>
            <span>{labels.them} {100 - Math.round(speakerBalance * 100)}%</span>
          </div>
          <div className="lcp-balance-bar">
            <motion.div
              className="lcp-balance-fill lcp-balance-you"
              animate={{ width: `${Math.round(speakerBalance * 100)}%` }}
              transition={{ duration: 0.5, ease: easeOut }}
            />
            <motion.div
              className="lcp-balance-fill lcp-balance-them"
              animate={{ width: `${100 - Math.round(speakerBalance * 100)}%` }}
              transition={{ duration: 0.5, ease: easeOut }}
            />
          </div>
        </section>
      )}

      {/* Signals */}
      {signals.length > 0 && (
        <section className="lcp-block">
          <div className="lcp-block-head">
            <span className="lcp-block-label">{labels.signals}</span>
          </div>
          <div className="lcp-signals">
            <AnimatePresence initial={false}>
              {signals.slice(-6).map((s) => {
                const tint = SIGNAL_TINT[s.signal];
                return (
                  <motion.span
                    key={`${s.time}-${s.signal}`}
                    className="lcp-signal"
                    style={{ background: tint.bg, color: tint.color }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.22, ease: easeOut }}
                  >
                    <span className="lcp-signal-dot" style={{ background: tint.color }} />
                    {s.label}
                  </motion.span>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Free plan: what the paid copilot adds */}
      {proLocked && (
        <section className="lcp-block lcp-block--locked">
          <div className="lcp-block-head">
            <span className="lcp-block-icon" aria-hidden>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </span>
            <span className="lcp-block-label">{t("copilot.proLockedTitle", "Live coaching")}</span>
          </div>
          <p className="lcp-text lcp-locked-text">
            {t("copilot.proLockedText", "Coaching tips, buying signals and talk-time balance, live during the call.")}
          </p>
          <Link href="/plans" className="lcp-locked-cta">
            {t("copilot.proLockedCta", "See plans")}
          </Link>
        </section>
      )}

      {/* Idle state */}
      {!suggestion && !coachingTip && !liveInsight && signals.length === 0
        && suggestedResponses.length === 0 && !(detectedQuestion && detectedQuestion.text) && (
        <div className="lcp-idle">
          <div className="lcp-idle-bars" aria-hidden>
            <span /><span /><span /><span />
          </div>
          <p>{labels.listening}</p>
        </div>
      )}

      {/* Ask box (sticky bottom) */}
      <form className="lcp-ask" onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={labels.askPlaceholder}
          className="lcp-ask-input"
          disabled={asking}
        />
        <button type="submit" className="lcp-ask-btn" disabled={!question.trim() || asking} aria-label="Ask">
          {asking ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="lcp-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          )}
        </button>
      </form>
      <AnimatePresence>
        {answer && (
          <motion.div
            className="lcp-answer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <span className="lcp-answer-label">Tonvo</span>
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global (lcp- prefixed) rather than scoped: styled-jsx does not tag
          framer-motion's motion.* elements, so scoped rules never matched them. */}
      <style jsx global>{`
        .lcp-root {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          background: var(--color-surface);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
        }

        .lcp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--color-border);
        }
        .lcp-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lcp-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-positive);
        }
        .lcp-dot.is-live { animation: lcpPulse 1.4s ease-in-out infinite; }
        .lcp-dot.is-paused { background: var(--color-neutral); animation: none; }
        .lcp-brand-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text);
        }
        .lcp-pause-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: 999px;
          color: var(--color-text-muted);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .lcp-pause-btn:hover { color: var(--color-text); border-color: var(--color-accent); }

        .lcp-scores {
          display: flex;
          gap: 12px;
          padding: 8px 10px;
          background: var(--color-surface-2);
          border-radius: 10px;
        }
        .lcp-score {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .lcp-score-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }
        .lcp-score-value {
          font-size: 18px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .lcp-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lcp-block--suggestion {
          padding: 12px 14px;
          background: linear-gradient(180deg, rgba(52, 211, 153, 0.08), transparent);
          border: 1px solid rgba(52, 211, 153, 0.20);
          border-radius: 12px;
        }
        .lcp-block-head {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lcp-block-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .lcp-block-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }
        .lcp-suggestion {
          margin: 0;
          font-size: 14px;
          line-height: 1.55;
          color: var(--color-text);
          font-weight: 500;
        }
        .lcp-text {
          margin: 0;
          font-size: 13px;
          line-height: 1.55;
          color: var(--color-text);
        }

        .lcp-quickreplies {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lcp-quickreply {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 10px 12px;
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          color: var(--color-text);
          text-align: left;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .lcp-quickreply:hover {
          border-color: var(--color-accent);
          background: rgba(129, 140, 248, 0.06);
        }
        .lcp-quickreply-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .lcp-quickreply-copy {
          font-size: 9.5px;
          font-weight: 600;
          color: var(--color-text-muted);
          opacity: 0.7;
        }
        .lcp-quickreply:hover .lcp-quickreply-copy { opacity: 1; color: var(--color-text); }
        .lcp-block--question {
          padding: 12px 14px;
          background: rgba(251, 191, 36, 0.07);
          border: 1px solid rgba(251, 191, 36, 0.25);
          border-radius: 12px;
        }
        .lcp-block--question.is-urgent {
          background: rgba(248, 113, 113, 0.08);
          border-color: rgba(248, 113, 113, 0.3);
        }
        .lcp-question-label { color: #d97706; }
        .lcp-block--question.is-urgent .lcp-question-label { color: var(--color-negative); }
        .lcp-urgent {
          margin-left: auto;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-negative);
        }
        .lcp-question-text { font-weight: 500; }
        .lcp-block--locked {
          padding: 12px 14px;
          border: 1px dashed var(--color-border);
          border-radius: 12px;
          color: var(--color-text-muted);
        }
        .lcp-locked-text { color: var(--color-text-muted); font-size: 12.5px; }
        .lcp-locked-cta {
          align-self: flex-start;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--color-accent-light);
          text-decoration: none;
        }
        .lcp-locked-cta:hover { text-decoration: underline; }
        .lcp-quickreply-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent-light);
        }
        .lcp-quickreply-text {
          font-size: 12.5px;
          line-height: 1.45;
        }

        .lcp-balance-meta {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: var(--color-text-muted);
          margin-bottom: 4px;
        }
        .lcp-balance-bar {
          display: flex;
          height: 5px;
          border-radius: 999px;
          overflow: hidden;
          background: var(--color-surface-2);
        }
        .lcp-balance-fill { height: 100%; }
        .lcp-balance-you  { background: #818cf8; }
        .lcp-balance-them { background: var(--color-accent-light); }

        .lcp-signals {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .lcp-signal {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          font-size: 10.5px;
          font-weight: 600;
          border-radius: 999px;
        }
        .lcp-signal-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .lcp-idle {
          padding: 24px 10px;
          text-align: center;
          color: var(--color-text-muted);
        }
        .lcp-idle p {
          margin: 8px 0 0;
          font-size: 12px;
        }
        .lcp-idle-bars {
          display: inline-flex;
          gap: 3px;
          height: 14px;
          align-items: flex-end;
        }
        .lcp-idle-bars span {
          width: 3px;
          background: var(--color-text-muted);
          border-radius: 2px;
          animation: lcpBars 1.2s ease-in-out infinite;
          opacity: 0.5;
        }
        .lcp-idle-bars span:nth-child(1) { animation-delay: 0s;    height: 40%; }
        .lcp-idle-bars span:nth-child(2) { animation-delay: 0.15s; height: 80%; }
        .lcp-idle-bars span:nth-child(3) { animation-delay: 0.30s; height: 60%; }
        .lcp-idle-bars span:nth-child(4) { animation-delay: 0.45s; height: 40%; }

        .lcp-ask {
          display: flex;
          gap: 6px;
          margin-top: 4px;
          padding-top: 12px;
          border-top: 1px solid var(--color-border);
        }
        .lcp-ask-input {
          flex: 1;
          min-width: 0;
          padding: 9px 12px;
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          color: var(--color-text);
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .lcp-ask-input:focus { border-color: var(--color-accent); }
        .lcp-ask-input::placeholder { color: var(--color-text-muted); }
        .lcp-ask-btn {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--color-accent);
          border: none;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }
        .lcp-ask-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .lcp-spin { animation: lcpSpin 1s linear infinite; }

        .lcp-answer {
          padding: 10px 12px;
          background: rgba(129, 140, 248, 0.06);
          border: 1px solid rgba(129, 140, 248, 0.18);
          border-radius: 10px;
        }
        .lcp-answer-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-accent-light);
          display: block;
          margin-bottom: 4px;
        }
        .lcp-answer p {
          margin: 0;
          font-size: 13px;
          line-height: 1.55;
          color: var(--color-text);
        }

        @keyframes lcpPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
        @keyframes lcpBars {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        @keyframes lcpSpin { to { transform: rotate(360deg); } }
      `}</style>
    </aside>
  );
}
