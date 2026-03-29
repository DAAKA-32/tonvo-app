"use client";

import { useCallback } from "react";
import type { SuggestedResponse, DetectedQuestion } from "@/types/analysis";
import type { Participant } from "@/hooks/useParticipants";

const AVATAR_COLORS = ["#818cf8", "#34d399", "#fb923c", "#f87171", "#38bdf8", "#c084fc"];

const INTENT_ICONS: Record<string, string> = {
  empathize: "💬", redirect: "↩", close: "🎯", probe: "🔍",
  agree: "✓", challenge: "⚡", clarify: "💡", deflect: "🛡",
};

export interface CopilotInlineLabels {
  title: string;
  sayThis: string;
  listening: string;
  stopSession: string;
  respondNow: string;
  participantCount: string;
  participantCountPlural: string;
}

interface CopilotInlineProps {
  suggestion: string;
  suggestedResponses: SuggestedResponse[];
  detectedQuestion?: DetectedQuestion | null;
  elapsed: number;
  onStop: () => void;
  participants?: Participant[];
  labels?: CopilotInlineLabels;
  interimText?: string;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function CopilotInline({
  suggestion = "",
  suggestedResponses = [],
  detectedQuestion = null,
  elapsed = 0,
  onStop,
  participants = [],
  labels,
  interimText = "",
}: CopilotInlineProps) {
  const l = {
    title: labels?.title || "AI Copilot",
    sayThis: labels?.sayThis || "Say This",
    listening: labels?.listening || "Listening... suggestions will appear here",
    stopSession: labels?.stopSession || "Stop Session",
    respondNow: labels?.respondNow || "Respond now",
    participantCount: labels?.participantCount || "{{count}} participant",
    participantCountPlural: labels?.participantCountPlural || "{{count}} participants",
  };

  const pCount = participants.length > 1
    ? l.participantCountPlural.replace("{{count}}", String(participants.length))
    : l.participantCount.replace("{{count}}", String(participants.length));

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard?.writeText(text);
  }, []);

  return (
    <div className="copilot-inline">
      {/* Header */}
      <div className="copilot-inline__header">
        <div className="copilot-inline__header-left">
          <div className="copilot-inline__pulse" />
          <span className="copilot-inline__title">{l.title}</span>
          <span className="copilot-inline__timer">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Detected Question */}
      {detectedQuestion?.text && (
        <div
          className="copilot-inline__question"
          style={{
            background: detectedQuestion.urgency === "high"
              ? "rgba(248,113,113,0.08)"
              : "rgba(251,191,36,0.06)",
            borderColor: detectedQuestion.urgency === "high"
              ? "rgba(248,113,113,0.25)"
              : "rgba(251,191,36,0.2)",
          }}
        >
          <div className="copilot-inline__question-header">
            <span
              className="copilot-inline__question-speaker"
              style={{ color: detectedQuestion.urgency === "high" ? "#f87171" : "#fbbf24" }}
            >
              {detectedQuestion.speaker}
            </span>
            {detectedQuestion.urgency === "high" && (
              <span className="copilot-inline__urgent-badge">{l.respondNow}</span>
            )}
          </div>
          <p className="copilot-inline__question-text">
            &ldquo;{detectedQuestion.text}&rdquo;
          </p>
        </div>
      )}

      {/* Participants */}
      {participants.length > 0 && (
        <div className="copilot-inline__participants">
          <div className="copilot-inline__participants-header">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {pCount}
          </div>
          <div className="copilot-inline__participants-items">
            {participants.map((p, i) => {
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <div
                  key={i}
                  className="copilot-inline__participant-chip"
                  style={{ background: `${color}15`, color }}
                >
                  <span className="copilot-inline__participant-dot" style={{ background: color }} />
                  {p.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggested Responses */}
      {suggestedResponses.length > 0 ? (
        <div className="copilot-inline__responses">
          <div className="copilot-inline__responses-header">
            <span className="copilot-inline__dot" style={{ background: "#34d399" }} />
            {l.sayThis}
          </div>
          {suggestedResponses.map((r, i) => (
            <button
              key={i}
              className={`copilot-inline__response-card${i === 0 ? " copilot-inline__response-card--primary" : ""}`}
              onClick={() => handleCopy(r.text)}
              type="button"
            >
              <div className="copilot-inline__response-meta">
                <span className="copilot-inline__response-icon">
                  {INTENT_ICONS[r.intent] || "💬"}
                </span>
                <span className="copilot-inline__response-label">{r.label}</span>
              </div>
              <p className="copilot-inline__response-text">{r.text}</p>
            </button>
          ))}
        </div>
      ) : interimText ? (
        <div className="copilot-inline__empty">
          <div className="copilot-inline__interim-dot" />
          <span className="copilot-inline__interim-text">{interimText}</span>
        </div>
      ) : (
        <div className="copilot-inline__empty">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4, color: "var(--color-text-muted)" }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{l.listening}</span>
        </div>
      )}

      {/* Quick Tip */}
      {suggestion && (
        <div className="copilot-inline__tip">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>{suggestion}</span>
        </div>
      )}

      {/* Stop Button */}
      <button className="copilot-inline__stop" onClick={onStop} type="button">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
        {l.stopSession}
      </button>
    </div>
  );
}
