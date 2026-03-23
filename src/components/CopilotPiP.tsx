"use client";

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import type { SuggestedResponse, DetectedQuestion } from "@/types/analysis";
import type { Participant } from "@/hooks/useParticipants";

interface CopilotSignal {
  signal: string;
  label: string;
  time: number;
}

interface CopilotPiPProps {
  active: boolean;
  suggestion: string;
  suggestedResponses: SuggestedResponse[];
  detectedQuestion?: DetectedQuestion | null;
  elapsed: number;
  onStop: () => void;
  onPiPStateChange?: (isOpen: boolean, mode?: "documentPiP" | "popup" | "failed") => void;
  participants?: Participant[];
}

// TypeScript declarations for Document Picture-in-Picture API (Chrome 116+)
interface DocumentPictureInPictureOptions {
  width?: number;
  height?: number;
  disallowReturnToOpener?: boolean;
}

interface DocumentPictureInPicture {
  requestWindow(options?: DocumentPictureInPictureOptions): Promise<Window>;
  window: Window | null;
}

declare global {
  interface Window {
    documentPictureInPicture?: DocumentPictureInPicture;
  }
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PIP_CSS = `
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
  .detected-question { border-radius: 10px; padding: 8px 10px; margin-bottom: 10px; }
  .dq-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
  .dq-speaker { font-size: 10px; font-weight: 700; }
  .dq-urgent { font-size: 8px; background: rgba(248,113,113,0.15); color: #f87171; padding: 1px 6px; border-radius: 4px; font-weight: 600; }
  .dq-text { font-size: 12px; color: #e4e4e7; line-height: 1.4; font-style: italic; }
  .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .quick-tip {
    display: flex; align-items: flex-start; gap: 6px; padding: 8px 10px; border-radius: 8px; margin-top: 8px;
    background: rgba(52,211,153,0.06); border: 1px solid rgba(52,211,153,0.1); font-size: 11px; line-height: 1.5; color: #34d399;
  }
  .empty {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 24px 16px; color: #8b8b96; font-size: 12px; text-align: center;
  }
  .stop-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    width: 100%; padding: 9px; border: none; border-radius: 8px;
    background: rgba(248,113,113,0.15); color: #f87171;
    font-size: 11px; font-weight: 600; cursor: pointer; margin-top: 6px;
    transition: background 0.15s;
  }
  .stop-btn:hover { background: rgba(248,113,113,0.3); }
  .pip-badge {
    margin-top: 10px; padding: 4px 8px; border-radius: 6px;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.15);
    font-size: 9px; color: #34d399; text-align: center;
  }
  .responses-section { margin-bottom: 12px; }
  .responses-header {
    display: flex; align-items: center; gap: 5px; margin-bottom: 8px;
    font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #34d399;
  }
  .response-card {
    padding: 10px 12px; border-radius: 12px; margin-bottom: 6px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  }
  .response-card:first-child {
    background: rgba(52,211,153,0.06); border-color: rgba(52,211,153,0.15);
  }
  .response-meta {
    display: flex; align-items: center; gap: 5px; margin-bottom: 4px;
  }
  .response-icon { font-size: 12px; }
  .response-label {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: #8b8b96;
  }
  .response-text { font-size: 13px; line-height: 1.5; color: #fafafa; }
  .badges { display: flex; gap: 4px; }
  .badge {
    font-size: 9px; font-weight: 600; padding: 2px 8px; border-radius: 6px;
    text-transform: capitalize;
  }
  .scores {
    display: flex; align-items: center; justify-content: center; gap: 16px;
    padding: 8px 0; margin-bottom: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .score-item { text-align: center; }
  .score-label { display: block; font-size: 8px; text-transform: uppercase; letter-spacing: 0.06em; color: #8b8b96; margin-bottom: 2px; }
  .score-value { font-size: 18px; font-weight: 700; }
  .divider { width: 1px; height: 24px; background: rgba(255,255,255,0.06); }
  .section { margin-bottom: 10px; }
  .section-header {
    display: flex; align-items: center; gap: 5px; margin-bottom: 4px;
    font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  }
  .section-text { font-size: 12px; line-height: 1.5; color: #e4e4e7; }
  .section-text.muted { color: #5a5a64; font-style: italic; }
  .balance-labels { display: flex; justify-content: space-between; font-size: 9px; color: #8b8b96; margin-bottom: 4px; }
  .balance-bar { display: flex; gap: 1px; height: 4px; border-radius: 2px; overflow: hidden; }
  .balance-you { background: #818cf8; border-radius: 2px; }
  .balance-them { background: #c8c8d8; border-radius: 2px; }
  .signals { display: flex; flex-wrap: wrap; gap: 4px; }
  .signal-badge {
    display: flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px;
    font-size: 9px; font-weight: 500;
  }
  .signal-dot { width: 4px; height: 4px; border-radius: 50%; }
`;

const SIGNAL_COLORS: Record<string, { color: string; bg: string }> = {
  objection:   { color: "#f87171", bg: "rgba(248,113,113,0.15)" },
  question:    { color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  opportunity: { color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  hesitation:  { color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  agreement:   { color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  key_point:   { color: "#c8c8d8", bg: "rgba(200,200,216,0.15)" },
};

function scoreColor(score: number) {
  if (score >= 70) return "#34d399";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

const INTENT_ICONS: Record<string, string> = {
  empathize: "💬", redirect: "↩", close: "🎯", probe: "🔍",
  agree: "✓", challenge: "⚡", clarify: "💡", deflect: "🛡",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildBodyContent(props: Record<string, any>, windowMode: "documentPiP" | "windowOpen" = "documentPiP"): string {
  const {
    coachingTip = "", liveInsight = "", suggestion = "", suggestedResponses = [], detectedQuestion = null, signals = [],
    qualityScore = 0, engagementScore = 0, speakerBalance,
    elapsed = 0, currentTone = "neutral", classification = "neutral",
  } = props;

  const recentSignals = signals.slice(-4);
  const youPct = speakerBalance != null ? Math.round(speakerBalance * 100) : null;

  const toneColors: Record<string, string> = {
    positive: "#34d399", neutral: "#fbbf24", negative: "#f87171", hesitant: "#fb923c",
  };
  const classColors: Record<string, string> = {
    very_positive: "#34d399", positive: "#6ee7b7", neutral: "#fbbf24", awkward: "#fb923c", negative: "#f87171",
  };

  return `
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

  ${detectedQuestion && detectedQuestion.text ? `
  <div class="detected-question" style="background:${detectedQuestion.urgency === "high" ? "rgba(248,113,113,0.08)" : "rgba(251,191,36,0.06)"};border:1px solid ${detectedQuestion.urgency === "high" ? "rgba(248,113,113,0.25)" : "rgba(251,191,36,0.2)"};border-radius:10px;padding:8px 10px;margin-bottom:8px">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
      <span style="font-size:10px;color:${detectedQuestion.urgency === "high" ? "#f87171" : "#fbbf24"};font-weight:700">${escapeHTML(detectedQuestion.speaker)}</span>
      ${detectedQuestion.urgency === "high" ? '<span style="font-size:8px;background:rgba(248,113,113,0.15);color:#f87171;padding:1px 6px;border-radius:4px;font-weight:600">Respond now</span>' : ""}
    </div>
    <p style="font-size:12px;color:#e4e4e7;margin:0;line-height:1.4;font-style:italic">&ldquo;${escapeHTML(detectedQuestion.text)}&rdquo;</p>
  </div>` : ""}

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

  ${suggestedResponses && suggestedResponses.length > 0 ? `
  <div class="responses-section">
    <div class="responses-header"><div class="dot" style="background:#34d399"></div> Say This</div>
    ${suggestedResponses.map((r: {intent: string; label: string; text: string}) => `
    <div class="response-card">
      <div class="response-meta">
        <span class="response-icon">${INTENT_ICONS[r.intent] || "💬"}</span>
        <span class="response-label">${escapeHTML(r.label)}</span>
      </div>
      <p class="response-text">${escapeHTML(r.text)}</p>
    </div>`).join("")}
  </div>` : ""}

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
      ${recentSignals.map((s: {signal: string; label: string}) => {
        const cfg = SIGNAL_COLORS[s.signal] || SIGNAL_COLORS.key_point;
        return `<div class="signal-badge" style="background:${cfg.bg};color:${cfg.color}"><span class="signal-dot" style="background:${cfg.color}"></span><span>${escapeHTML(s.label)}</span></div>`;
      }).join("")}
    </div>
  </div>` : ""}

  <button class="stop-btn" id="stopBtn">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
    Stop Session
  </button>

  <div class="pip-badge">${windowMode === "documentPiP" ? "Invisible en partage d'ecran" : "Partagez une fenetre specifique pour rester invisible"}</div>`;
}

// Build full HTML page (for window.open fallback)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildFullHTML(props: Record<string, any>): string {
  return `<!DOCTYPE html>
<html>
<head>
<title>Tonvo Copilot</title>
<style>${PIP_CSS}
  .tip {
    margin-top: 10px; padding: 8px 10px; border-radius: 8px;
    background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15);
    font-size: 10px; color: #a5b4fc; line-height: 1.5; text-align: center;
  }
</style>
</head>
<body>
  ${buildBodyContent(props, "windowOpen")}
</body>
</html>`;
}

export interface CopilotPiPHandle {
  /** Must be called from a user gesture (click handler) to enable Document PiP */
  requestOpen: () => Promise<void>;
}

/**
 * CopilotPiP — Opens the copilot in a Document Picture-in-Picture window.
 *
 * Document PiP windows (Chrome 116+) are EXCLUDED from screen capture by the OS,
 * making the copilot invisible during both full-screen and window-specific sharing.
 *
 * IMPORTANT: Call ref.requestOpen() from a click handler (user gesture required).
 * Falls back to window.open() on browsers that don't support Document PiP.
 */
const CopilotPiP = forwardRef<CopilotPiPHandle, CopilotPiPProps>(function CopilotPiP(props, ref) {
  const pipWindowRef = useRef<Window | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const updateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeRef = useRef<"documentPiP" | "windowOpen" | null>(null);

  const wireStopButton = useCallback((win: Window) => {
    win.document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.id === "stopBtn" || target.closest("#stopBtn")) {
        propsRef.current.onStop();
      }
    });
  }, []);

  // Try Document PiP first, fallback to window.open
  const openPiP = useCallback(async () => {
    // === Strategy 1: Document Picture-in-Picture API (Chrome 116+) ===
    if (window.documentPictureInPicture) {
      try {
        const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: 400,
          height: 640,
        });

        // Inject styles
        const style = pipWindow.document.createElement("style");
        style.textContent = PIP_CSS;
        pipWindow.document.head.appendChild(style);

        // Set background color on body
        pipWindow.document.body.style.background = "#0e0e11";
        pipWindow.document.body.style.margin = "0";

        // Render content
        pipWindow.document.body.innerHTML = buildBodyContent(propsRef.current);

        wireStopButton(pipWindow);

        // Listen for PiP window close
        pipWindow.addEventListener("pagehide", () => {
          pipWindowRef.current = null;
          modeRef.current = null;
          propsRef.current.onPiPStateChange?.(false);
        });

        pipWindowRef.current = pipWindow;
        modeRef.current = "documentPiP";
        propsRef.current.onPiPStateChange?.(true, "documentPiP");
        return;
      } catch (err) {
        console.warn("Document PiP failed, falling back to window.open:", err);
      }
    }

    // === Strategy 2: Fallback window.open() ===
    const width = 400;
    const height = 640;
    const left = window.screen.availWidth - width - 20;
    const top = 60;

    const popup = window.open(
      "",
      "tonvo-copilot",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      console.warn("Popup blocked — no copilot window available");
      propsRef.current.onPiPStateChange?.(false, "failed");
      return;
    }

    popup.document.open();
    popup.document.write(buildFullHTML(propsRef.current));
    popup.document.close();

    wireStopButton(popup);

    // Clean up reference when popup is closed manually
    const checkClosed = setInterval(() => {
      if (!pipWindowRef.current || (pipWindowRef.current as Window & { closed?: boolean }).closed) {
        clearInterval(checkClosed);
        pipWindowRef.current = null;
        modeRef.current = null;
        propsRef.current.onPiPStateChange?.(false);
      }
    }, 1000);

    pipWindowRef.current = popup;
    modeRef.current = "windowOpen";
    propsRef.current.onPiPStateChange?.(true, "popup");
  }, [wireStopButton]);

  // Expose requestOpen to parent — MUST be called from a user gesture (click)
  useImperativeHandle(ref, () => ({
    requestOpen: openPiP,
  }), [openPiP]);

  // Close PiP when active becomes false (opening is handled by parent via ref.requestOpen)
  useEffect(() => {
    if (!props.active && pipWindowRef.current) {
      const win = pipWindowRef.current;
      try { win.close(); } catch {}
      pipWindowRef.current = null;
      modeRef.current = null;
      props.onPiPStateChange?.(false);
    }
  }, [props.active]);

  // Update content when props change
  useEffect(() => {
    if (!props.active) return;
    const win = pipWindowRef.current;
    if (!win) return;

    try {
      if (modeRef.current === "documentPiP") {
        // Document PiP: update body innerHTML directly (styles persist)
        win.document.body.innerHTML = buildBodyContent(props);
        wireStopButton(win);
      } else if (modeRef.current === "windowOpen") {
        // window.open: rewrite entire document
        win.document.open();
        win.document.write(buildFullHTML(props));
        win.document.close();
        wireStopButton(win);
      }
    } catch {
      pipWindowRef.current = null;
      modeRef.current = null;
    }
  }, [
    props.active, props.suggestion, props.suggestedResponses,
    props.elapsed, props.participants, wireStopButton,
  ]);

  // Close on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) clearInterval(updateTimerRef.current);
      if (pipWindowRef.current) {
        try { pipWindowRef.current.close(); } catch {}
        pipWindowRef.current = null;
        modeRef.current = null;
      }
    };
  }, []);

  return null;
});

export default CopilotPiP;
