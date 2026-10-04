"use client";

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import type { SuggestedResponse, DetectedQuestion } from "@/types/analysis";
import type { Participant } from "@/hooks/useParticipants";

/** Pre-translated labels passed from the parent (PiP window has no i18n context) */
export interface CopilotPiPLabels {
  title: string;
  sayThis: string;
  listening: string;
  stopSession: string;
  respondNow: string;
  invisibleBadge: string;
  participantCount: string;
  participantCountPlural: string;
  paused?: string;
  askPlaceholder?: string;
  /** Label for the other side of the call (speaker tag "them"). */
  them?: string;
  /** Label for the user (speaker tag "me"). */
  you?: string;
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
  labels?: CopilotPiPLabels;
  /** Live interim transcription text (Web Speech API). */
  interimText?: string;
  paused?: boolean;
  onTogglePause?: () => void;
  onAsk?: (question: string) => void;
  asking?: boolean;
  answer?: string;
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
  .pause-btn {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
    background: rgba(255,255,255,0.04); color: #fafafa; cursor: pointer; transition: background 0.15s;
  }
  .pause-btn:hover { background: rgba(255,255,255,0.1); }
  .pause-btn--paused { background: rgba(52,211,153,0.15); border-color: rgba(52,211,153,0.3); color: #34d399; }
  .paused-badge {
    font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px;
    background: rgba(251,191,36,0.15); color: #fbbf24;
  }
  .pulse--paused { background: #fbbf24; animation: none; }
  .answer {
    display: flex; align-items: flex-start; gap: 6px; padding: 8px 10px; border-radius: 8px; margin-bottom: 8px;
    background: rgba(129,140,248,0.06); border: 1px solid rgba(129,140,248,0.15);
    font-size: 12px; line-height: 1.5; color: #c8c8d8;
  }
  .ask-bar {
    display: flex; gap: 6px; margin-bottom: 6px;
  }
  .ask-input {
    flex: 1; padding: 7px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); color: #fafafa; font-size: 11px; outline: none; cursor: text;
  }
  .ask-input:focus { border-color: rgba(129,140,248,0.4); }
  .ask-input::placeholder { color: #8b8b96; }
  .ask-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border: none; border-radius: 8px;
    background: rgba(129,140,248,0.15); color: #818cf8; cursor: pointer; transition: background 0.15s; flex-shrink: 0;
  }
  .ask-btn:hover { background: rgba(129,140,248,0.3); }
  .ask-btn:disabled { opacity: 0.4; cursor: default; }
  .ask-spinner {
    width: 12px; height: 12px; border: 2px solid rgba(129,140,248,0.3); border-top-color: #818cf8;
    border-radius: 50%; animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const AVATAR_COLORS_PIP = ["#818cf8", "#34d399", "#fb923c", "#f87171", "#38bdf8", "#c084fc"];

const INTENT_ICONS: Record<string, string> = {
  empathize: "💬", redirect: "↩", close: "🎯", probe: "🔍",
  agree: "✓", challenge: "⚡", clarify: "💡", deflect: "🛡",
};

function buildBodyContent(props: CopilotPiPProps): string {
  const { suggestion = "", suggestedResponses = [], detectedQuestion = null, elapsed = 0, participants = [], labels, interimText = "", paused = false, asking = false, answer = "" } = props;

  const l = {
    title: labels?.title || "AI Copilot",
    sayThis: labels?.sayThis || "Say This",
    listening: labels?.listening || "Listening... suggestions will appear here",
    stopSession: labels?.stopSession || "Stop Session",
    respondNow: labels?.respondNow || "Respond now",
    invisibleBadge: labels?.invisibleBadge || "Invisible during screen share",
    participantCount: labels?.participantCount || "{{count}} participant",
    participantCountPlural: labels?.participantCountPlural || "{{count}} participants",
    paused: labels?.paused || "Paused",
    askPlaceholder: labels?.askPlaceholder || "Ask the copilot...",
    them: labels?.them || "Prospect",
    you: labels?.you || "You",
  };
  const speakerName = (raw: string) => (raw === "them" ? l.them : raw === "me" ? l.you : raw);

  const pCount = participants.length > 1
    ? l.participantCountPlural.replace("{{count}}", String(participants.length))
    : l.participantCount.replace("{{count}}", String(participants.length));

  return `
  <div class="header">
    <div class="header-left">
      <div class="pulse ${paused ? "pulse--paused" : ""}"></div>
      <span class="title">${escapeHTML(l.title)}</span>
      <span class="timer" id="pipTimer">${formatTime(elapsed)}</span>
      ${paused ? `<span class="paused-badge">${escapeHTML(l.paused)}</span>` : ""}
    </div>
    <button class="pause-btn ${paused ? "pause-btn--paused" : ""}" id="pauseBtn">
      ${paused
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      }
    </button>
  </div>

  ${detectedQuestion && detectedQuestion.text ? `
  <div class="detected-question" style="background:${detectedQuestion.urgency === "high" ? "rgba(248,113,113,0.08)" : "rgba(251,191,36,0.06)"};border:1px solid ${detectedQuestion.urgency === "high" ? "rgba(248,113,113,0.25)" : "rgba(251,191,36,0.2)"}">
    <div class="dq-header">
      <span class="dq-speaker" style="color:${detectedQuestion.urgency === "high" ? "#f87171" : "#fbbf24"}">${escapeHTML(speakerName(detectedQuestion.speaker))}</span>
      ${detectedQuestion.urgency === "high" ? `<span class="dq-urgent">${escapeHTML(l.respondNow)}</span>` : ""}
    </div>
    <p class="dq-text">&ldquo;${escapeHTML(detectedQuestion.text)}&rdquo;</p>
  </div>` : ""}

  ${participants.length > 0 ? `
  <div class="participants">
    <div class="participants-header">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ${escapeHTML(pCount)}
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
    <div class="responses-header"><div class="dot" style="background:#34d399"></div> ${escapeHTML(l.sayThis)}</div>
    ${suggestedResponses.map((r: {intent: string; label: string; text: string}) => `
    <div class="response-card">
      <div class="response-meta">
        <span class="response-icon">${INTENT_ICONS[r.intent] || "\u{1F4AC}"}</span>
        <span class="response-label">${escapeHTML(r.label)}</span>
      </div>
      <p class="response-text">${escapeHTML(r.text)}</p>
    </div>`).join("")}
  </div>` : interimText ? `
  <div class="empty" style="gap:6px">
    <div style="width:8px;height:8px;border-radius:50%;background:#818cf8;animation:pulse 1.5s ease-in-out infinite"></div>
    <span style="font-style:italic;color:#c8c8d8;font-size:11px">${escapeHTML(interimText)}</span>
  </div>` : `
  <div class="empty">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b8b96" stroke-width="1.5" style="opacity:0.4">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <span>${escapeHTML(l.listening)}</span>
  </div>`}

  ${suggestion ? `
  <div class="quick-tip">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    <span>${escapeHTML(suggestion)}</span>
  </div>` : ""}

  ${answer ? `
  <div class="answer">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span>${escapeHTML(answer)}</span>
  </div>` : ""}

  <div class="ask-bar">
    <input class="ask-input" id="askInput" type="text" placeholder="${escapeHTML(l.askPlaceholder)}" ${asking ? "disabled" : ""} />
    <button class="ask-btn" id="askBtn" ${asking ? "disabled" : ""}>
      ${asking
        ? '<div class="ask-spinner"></div>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
      }
    </button>
  </div>

  <button class="stop-btn" id="stopBtn">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
    ${escapeHTML(l.stopSession)}
  </button>

  <div class="pip-badge">${escapeHTML(l.invisibleBadge)}</div>`;
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
  /** Close the window if it is open (e.g. the session failed to start). */
  close: () => void;
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

  const stopWiredRef = useRef<WeakSet<Window>>(new WeakSet());
  const wireButtons = useCallback((win: Window) => {
    // Only wire once per window — prevents duplicate listeners on every PiP content update
    if (stopWiredRef.current.has(win)) return;
    stopWiredRef.current.add(win);
    win.document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.id === "stopBtn" || target.closest("#stopBtn")) {
        propsRef.current.onStop();
      } else if (target.id === "pauseBtn" || target.closest("#pauseBtn")) {
        propsRef.current.onTogglePause?.();
      } else if (target.id === "askBtn" || target.closest("#askBtn")) {
        const input = win.document.getElementById("askInput") as HTMLInputElement | null;
        if (input?.value.trim()) {
          propsRef.current.onAsk?.(input.value.trim());
          input.value = "";
        }
      }
    });
    win.document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const input = win.document.getElementById("askInput") as HTMLInputElement | null;
        if (win.document.activeElement === input && input?.value.trim()) {
          propsRef.current.onAsk?.(input.value.trim());
          input.value = "";
        }
      }
    });
  }, []);

  // Re-render the window body, keeping the user's half-typed question and focus.
  const renderBody = useCallback((win: Window) => {
    const doc = win.document;
    const input = doc.getElementById("askInput") as HTMLInputElement | null;
    const draft = input?.value ?? "";
    const hadFocus = !!input && doc.activeElement === input;
    doc.body.innerHTML = buildBodyContent(propsRef.current);
    const next = doc.getElementById("askInput") as HTMLInputElement | null;
    if (next && draft) next.value = draft;
    if (next && hadFocus) {
      next.focus();
      next.setSelectionRange(draft.length, draft.length);
    }
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

        wireButtons(pipWindow);

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

    wireButtons(popup);

    // Clean up reference when popup is closed manually — store interval for cleanup on unmount
    if (updateTimerRef.current) clearInterval(updateTimerRef.current);
    updateTimerRef.current = setInterval(() => {
      if (!pipWindowRef.current || (pipWindowRef.current as Window & { closed?: boolean }).closed) {
        if (updateTimerRef.current) { clearInterval(updateTimerRef.current); updateTimerRef.current = null; }
        pipWindowRef.current = null;
        modeRef.current = null;
        propsRef.current.onPiPStateChange?.(false);
      }
    }, 1000);

    pipWindowRef.current = popup;
    modeRef.current = "windowOpen";
    propsRef.current.onPiPStateChange?.(true, "popup");
  }, [wireButtons]);

  const closePiP = useCallback(() => {
    const win = pipWindowRef.current;
    if (updateTimerRef.current) { clearInterval(updateTimerRef.current); updateTimerRef.current = null; }
    if (!win) return;
    try { win.close(); } catch {}
    pipWindowRef.current = null;
    modeRef.current = null;
    propsRef.current.onPiPStateChange?.(false);
  }, []);

  // Expose requestOpen to parent — MUST be called from a user gesture (click)
  useImperativeHandle(ref, () => ({
    requestOpen: openPiP,
    close: closePiP,
  }), [openPiP, closePiP]);

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
      // Both modes: swap the body only. Styles in <head> persist, and the
      // document-level listeners from wireButtons stay attached (rewriting the
      // whole popup document used to drop them).
      renderBody(win);
    } catch {
      pipWindowRef.current = null;
      modeRef.current = null;
    }
  }, [
    props.active, props.suggestion, props.suggestedResponses, props.detectedQuestion,
    props.participants, props.paused, props.asking, props.answer, renderBody,
  ]);

  // The timer ticks every second: update its text only, so the window isn't
  // rebuilt (which used to wipe the question being typed).
  useEffect(() => {
    const el = pipWindowRef.current?.document.getElementById("pipTimer");
    if (el) el.textContent = formatTime(props.elapsed);
  }, [props.elapsed]);

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
