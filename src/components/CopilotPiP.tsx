"use client";

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import type { SuggestedResponse, DetectedQuestion } from "@/types/analysis";
import type { Participant } from "@/hooks/useParticipants";

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
  .participants { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 10px; }
  .participants-header { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #8b8b96; }
  .participants-items { display: flex; flex-wrap: wrap; gap: 6px; }
  .participant-chip { display: flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 8px; font-size: 10px; font-weight: 500; }
  .participant-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
`;

const AVATAR_COLORS_PIP = ["#818cf8", "#34d399", "#fb923c", "#f87171", "#38bdf8", "#c084fc"];

const INTENT_ICONS: Record<string, string> = {
  empathize: "💬", redirect: "↩", close: "🎯", probe: "🔍",
  agree: "✓", challenge: "⚡", clarify: "💡", deflect: "🛡",
};

function buildBodyContent(props: CopilotPiPProps): string {
  const { suggestion = "", suggestedResponses = [], detectedQuestion = null, elapsed = 0, participants = [] } = props;

  return `
  <div class="header">
    <div class="header-left">
      <div class="pulse"></div>
      <span class="title">AI Copilot</span>
      <span class="timer">${formatTime(elapsed)}</span>
    </div>
  </div>

  ${detectedQuestion && detectedQuestion.text ? `
  <div class="detected-question" style="background:${detectedQuestion.urgency === "high" ? "rgba(248,113,113,0.08)" : "rgba(251,191,36,0.06)"};border:1px solid ${detectedQuestion.urgency === "high" ? "rgba(248,113,113,0.25)" : "rgba(251,191,36,0.2)"}">
    <div class="dq-header">
      <span class="dq-speaker" style="color:${detectedQuestion.urgency === "high" ? "#f87171" : "#fbbf24"}">${escapeHTML(detectedQuestion.speaker)}</span>
      ${detectedQuestion.urgency === "high" ? '<span class="dq-urgent">Respond now</span>' : ""}
    </div>
    <p class="dq-text">&ldquo;${escapeHTML(detectedQuestion.text)}&rdquo;</p>
  </div>` : ""}

  ${participants.length > 0 ? `
  <div class="participants">
    <div class="participants-header">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ${participants.length} participant${participants.length > 1 ? "s" : ""}
    </div>
    <div class="participants-items">
      ${participants.map((p: {label: string}, i: number) => {
        const color = AVATAR_COLORS_PIP[i % AVATAR_COLORS_PIP.length];
        return '<div class="participant-chip" style="background:' + color + '15;color:' + color + '"><span class="participant-dot" style="background:' + color + '"></span>' + escapeHTML(p.label) + '</div>';
      }).join("")}
    </div>
  </div>` : ""}

  ${suggestedResponses && suggestedResponses.length > 0 ? `
  <div class="responses-section">
    <div class="responses-header"><div class="dot" style="background:#34d399"></div> Say This</div>
    ${suggestedResponses.map((r: {intent: string; label: string; text: string}) => `
    <div class="response-card">
      <div class="response-meta">
        <span class="response-icon">${INTENT_ICONS[r.intent] || "\u{1F4AC}"}</span>
        <span class="response-label">${escapeHTML(r.label)}</span>
      </div>
      <p class="response-text">${escapeHTML(r.text)}</p>
    </div>`).join("")}
  </div>` : `
  <div class="empty">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b8b96" stroke-width="1.5" style="opacity:0.4">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <span>Listening... suggestions will appear here</span>
  </div>`}

  ${suggestion ? `
  <div class="quick-tip">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    <span>${escapeHTML(suggestion)}</span>
  </div>` : ""}

  <button class="stop-btn" id="stopBtn">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
    Stop Session
  </button>

  <div class="pip-badge">Invisible en partage d'ecran</div>`;
}

// Build full HTML page (for window.open fallback)
function buildFullHTML(props: CopilotPiPProps): string {
  return `<!DOCTYPE html>
<html>
<head>
<title>Tonvo Copilot</title>
<style>${PIP_CSS}</style>
</head>
<body>
  ${buildBodyContent(props)}
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
