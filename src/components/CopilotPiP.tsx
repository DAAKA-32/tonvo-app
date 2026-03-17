"use client";

import { useEffect, useRef, useCallback } from "react";
import type { ConversationSignal } from "@/types/analysis";

interface CopilotSignal {
  signal: ConversationSignal;
  label: string;
  time: number;
}

interface CopilotPiPProps {
  active: boolean;
  coachingTip: string;
  liveInsight: string;
  suggestion: string;
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
  objection:   { color: "#f87171", bg: "rgba(248,113,113,0.15)" },
  question:    { color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  opportunity: { color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  hesitation:  { color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  agreement:   { color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  key_point:   { color: "#c8c8d8", bg: "rgba(200,200,216,0.15)" },
};

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function scoreColor(score: number) {
  if (score >= 70) return "#34d399";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHTML(props: CopilotPiPProps): string {
  const {
    coachingTip, liveInsight, suggestion, signals,
    qualityScore, engagementScore, speakerBalance,
    elapsed, currentTone, classification,
  } = props;

  const recentSignals = signals.slice(-4);
  const youPct = speakerBalance != null ? Math.round(speakerBalance * 100) : null;

  const toneColors: Record<string, string> = {
    positive: "#34d399", neutral: "#fbbf24", negative: "#f87171", hesitant: "#fb923c",
  };
  const classColors: Record<string, string> = {
    very_positive: "#34d399", positive: "#6ee7b7", neutral: "#fbbf24", awkward: "#fb923c", negative: "#f87171",
  };

  return `<!DOCTYPE html>
<html>
<head>
<title>Tonvo Copilot</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0e0e11;
    color: #fafafa;
    padding: 14px;
    overflow-y: auto;
    user-select: none;
  }
  body::-webkit-scrollbar { width: 4px; }
  body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 12px;
  }
  .header-left { display: flex; align-items: center; gap: 8px; }
  .pulse {
    width: 8px; height: 8px; border-radius: 50%; background: #34d399;
    animation: pulse 1.2s ease-in-out infinite; flex-shrink: 0;
  }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  .title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
  .timer { font-size: 11px; color: #8b8b96; font-variant-numeric: tabular-nums; }
  .badges { display: flex; gap: 6px; align-items: center; }
  .badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 6px; text-transform: capitalize; }
  .scores {
    display: flex; align-items: center; justify-content: center; gap: 20px;
    padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 12px;
  }
  .score-item { text-align: center; }
  .score-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: #8b8b96; display: block; margin-bottom: 2px; }
  .score-value { font-size: 22px; font-weight: 700; line-height: 1; }
  .divider { width: 1px; height: 28px; background: rgba(255,255,255,0.06); }
  .section { margin-bottom: 12px; }
  .section-header {
    display: flex; align-items: center; gap: 5px; margin-bottom: 5px;
    font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .section-text { font-size: 12.5px; line-height: 1.55; color: #e4e4e7; }
  .muted { color: #8b8b96; font-style: italic; }
  .balance-bar {
    display: flex; height: 6px; border-radius: 3px; overflow: hidden; gap: 1px;
    background: rgba(255,255,255,0.04); margin-top: 4px;
  }
  .balance-you { background: #818cf8; border-radius: 3px; transition: width 0.5s; }
  .balance-them { background: #c8c8d8; border-radius: 3px; transition: width 0.5s; }
  .balance-labels { display: flex; justify-content: space-between; font-size: 9px; color: #8b8b96; }
  .signals { display: flex; flex-wrap: wrap; gap: 4px; }
  .signal-badge {
    display: flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 500;
  }
  .signal-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .stop-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    width: 100%; padding: 9px; border: none; border-radius: 8px;
    background: rgba(248,113,113,0.15); color: #f87171;
    font-size: 11px; font-weight: 600; cursor: pointer; margin-top: 6px;
    transition: background 0.15s;
  }
  .stop-btn:hover { background: rgba(248,113,113,0.3); }
  .tip {
    margin-top: 10px; padding: 8px 10px; border-radius: 8px;
    background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15);
    font-size: 10px; color: #a5b4fc; line-height: 1.5; text-align: center;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="pulse"></div>
      <span class="title">AI Copilot</span>
      <span class="timer">${formatTime(elapsed)}</span>
    </div>
    <div class="badges">
      <span class="badge" style="background:${(toneColors[currentTone] || "#fbbf24") + "22"};color:${toneColors[currentTone] || "#fbbf24"}">${currentTone}</span>
      ${classification && classification !== "neutral" ? `<span class="badge" style="background:${(classColors[classification] || "#fbbf24") + "22"};color:${classColors[classification] || "#fbbf24"}">${classification.replace("_", " ")}</span>` : ""}
    </div>
  </div>

  <div class="scores">
    <div class="score-item">
      <span class="score-label">Quality</span>
      <span class="score-value" style="color:${qualityScore > 0 ? scoreColor(qualityScore) : "#8b8b96"}">${qualityScore > 0 ? qualityScore : "--"}</span>
    </div>
    <div class="divider"></div>
    <div class="score-item">
      <span class="score-label">Engagement</span>
      <span class="score-value" style="color:${engagementScore > 0 ? scoreColor(engagementScore) : "#8b8b96"}">${engagementScore > 0 ? engagementScore : "--"}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-header" style="color:#818cf8"><div class="dot" style="background:#818cf8"></div> Coaching</div>
    <p class="section-text ${coachingTip ? "" : "muted"}">${coachingTip ? escapeHTML(coachingTip) : "En attente d'analyse..."}</p>
  </div>

  <div class="section">
    <div class="section-header" style="color:#38bdf8"><div class="dot" style="background:#38bdf8"></div> Insight</div>
    <p class="section-text ${liveInsight ? "" : "muted"}">${liveInsight ? escapeHTML(liveInsight) : "Les insights apparaitront ici..."}</p>
  </div>

  ${suggestion ? `
  <div class="section">
    <div class="section-header" style="color:#34d399"><div class="dot" style="background:#34d399"></div> Suggestion</div>
    <p class="section-text">${escapeHTML(suggestion)}</p>
  </div>` : ""}

  ${youPct != null ? `
  <div class="section">
    <div class="section-header" style="color:#c8c8d8"><div class="dot" style="background:#c8c8d8"></div> Speaker Balance</div>
    <div class="balance-labels"><span>You ${youPct}%</span><span>Them ${100 - youPct}%</span></div>
    <div class="balance-bar">
      <div class="balance-you" style="width:${youPct}%"></div>
      <div class="balance-them" style="width:${100 - youPct}%"></div>
    </div>
  </div>` : ""}

  ${recentSignals.length > 0 ? `
  <div class="section">
    <div class="section-header" style="color:#fbbf24"><div class="dot" style="background:#fbbf24"></div> Signals</div>
    <div class="signals">
      ${recentSignals.map(s => {
        const cfg = SIGNAL_COLORS[s.signal] || SIGNAL_COLORS.key_point;
        return `<div class="signal-badge" style="background:${cfg.bg};color:${cfg.color}"><span class="signal-dot" style="background:${cfg.color}"></span><span>${escapeHTML(s.label)}</span></div>`;
      }).join("")}
    </div>
  </div>` : ""}

  <button class="stop-btn" id="stopBtn">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
    Stop Session
  </button>

  <div class="tip">
    Pour que cette fenetre soit invisible en partage d'ecran, partagez uniquement la fenetre Discord/Zoom (pas l'ecran entier).
  </div>
</body>
</html>`;
}

/**
 * CopilotPiP — Opens the copilot in a separate browser window (window.open).
 *
 * This separate window is NOT captured when sharing a specific application
 * window (Discord, Zoom, etc.) — only full-screen sharing would show it.
 *
 * The user should share the Discord/Zoom window specifically (not full screen)
 * to keep this copilot invisible to other participants.
 */
export default function CopilotPiP(props: CopilotPiPProps) {
  const popupRef = useRef<Window | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const updateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const openPopup = useCallback(() => {
    // Calculate position: right side of the screen
    const width = 340;
    const height = 560;
    const left = window.screen.availWidth - width - 20;
    const top = 60;

    const popup = window.open(
      "",
      "tonvo-copilot",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      console.warn("Popup blocked — copilot will only appear in-page");
      return;
    }

    popupRef.current = popup;

    // Initial render
    popup.document.open();
    popup.document.write(buildHTML(propsRef.current));
    popup.document.close();

    // Wire stop button via message
    popup.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.id === "stopBtn" || target.closest("#stopBtn")) {
        propsRef.current.onStop();
      }
    });

    // Clean up reference when popup is closed manually
    const checkClosed = setInterval(() => {
      if (!popupRef.current || popupRef.current.closed) {
        clearInterval(checkClosed);
        popupRef.current = null;
      }
    }, 1000);

    return popup;
  }, []);

  // Open popup when active becomes true
  useEffect(() => {
    if (props.active) {
      if (!popupRef.current || popupRef.current.closed) {
        openPopup();
      }
    }
    if (!props.active && popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
      popupRef.current = null;
    }
  }, [props.active, openPopup]);

  // Update popup content every second (for timer) + when key data changes
  useEffect(() => {
    if (!props.active) return;

    // Update on every meaningful change
    const popup = popupRef.current;
    if (!popup || popup.closed) return;

    try {
      popup.document.open();
      popup.document.write(buildHTML(props));
      popup.document.close();

      // Re-wire stop button
      popup.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target.id === "stopBtn" || target.closest("#stopBtn")) {
          propsRef.current.onStop();
        }
      });
    } catch {
      popupRef.current = null;
    }
  }, [
    props.active, props.coachingTip, props.liveInsight, props.suggestion,
    props.qualityScore, props.engagementScore, props.elapsed,
    props.signals.length, props.speakerBalance, props.currentTone,
    props.classification,
  ]);

  // Close popup on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) clearInterval(updateTimerRef.current);
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
        popupRef.current = null;
      }
    };
  }, []);

  // Renders nothing — manages the external window only
  return null;
}
