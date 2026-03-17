// All widget CSS as a string -- injected into shadow DOM for complete isolation
export const WIDGET_CSS = `
/* ===== Reset inside shadow DOM ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:host {
  all: initial;
  position: fixed;
  z-index: 2147483647;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  font-size: 13px;
  color: #fafafa;
  line-height: 1.4;
}

/* ===== Container ===== */
.cue-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 340px;
  max-height: 520px;
  background: rgba(9, 9, 11, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, opacity 0.3s ease;
  user-select: none;
}

.cue-widget.minimized {
  width: 48px;
  height: 48px;
  max-height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cue-widget.hidden {
  display: none;
}

/* ===== Header ===== */
.cue-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: grab;
  flex-shrink: 0;
}
.cue-header:active { cursor: grabbing; }

.cue-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cue-logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c8c8d8;
  flex-shrink: 0;
}

.cue-logo-text {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fafafa;
}

.cue-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cue-header-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #8b8b96;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.cue-header-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fafafa;
}

/* ===== Body ===== */
.cue-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cue-body::-webkit-scrollbar { width: 4px; }
.cue-body::-webkit-scrollbar-track { background: transparent; }
.cue-body::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }

/* ===== Tone Section ===== */
.cue-tone-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cue-tone-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 0.3s, box-shadow 0.3s;
}
.cue-tone-dot.positive {
  background: #34d399;
  box-shadow: 0 0 16px rgba(52, 211, 153, 0.3);
}
.cue-tone-dot.neutral, .cue-tone-dot.hesitant {
  background: #fbbf24;
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.3);
}
.cue-tone-dot.negative {
  background: #f87171;
  box-shadow: 0 0 16px rgba(248, 113, 113, 0.3);
}

.cue-tone-info {
  flex: 1;
  min-width: 0;
}
.cue-tone-label {
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
  color: #fafafa;
}
.cue-tone-classification {
  font-size: 11px;
  color: #8b8b96;
  margin-top: 2px;
}

.cue-scores {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.cue-score-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(200, 200, 216, 0.08);
}

/* ===== Suggestion ===== */
.cue-suggestion {
  background: rgba(17, 17, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 12px;
}
.cue-suggestion-text {
  font-size: 12px;
  line-height: 1.5;
  color: #c8c8d8;
}

/* ===== Coaching Card ===== */
.cue-coaching {
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  position: relative;
  overflow: hidden;
}
.cue-coaching::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #818cf8, transparent);
  opacity: 0.5;
}
.cue-coaching-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #818cf8;
  margin-bottom: 6px;
}
.cue-coaching-text {
  font-size: 12px;
  line-height: 1.5;
  color: #e0e0ec;
}

/* ===== Insight Card ===== */
.cue-insight {
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  position: relative;
  overflow: hidden;
}
.cue-insight::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #38bdf8, transparent);
  opacity: 0.5;
}
.cue-insight-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #38bdf8;
  margin-bottom: 6px;
}
.cue-insight-text {
  font-size: 12px;
  line-height: 1.5;
  color: #e0e0ec;
}

/* ===== Signals ===== */
.cue-signals {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cue-signal-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid;
}
.cue-signal-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ===== Emotions ===== */
.cue-emotions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.cue-emotion-tag {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(200, 200, 216, 0.08);
  color: #b8b8c8;
  text-transform: capitalize;
}

/* ===== Minimized pill ===== */
.cue-mini-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: background 0.3s, box-shadow 0.3s;
}
.cue-mini-dot.positive { background: #34d399; box-shadow: 0 0 12px rgba(52, 211, 153, 0.4); }
.cue-mini-dot.neutral, .cue-mini-dot.hesitant { background: #fbbf24; box-shadow: 0 0 12px rgba(251, 191, 36, 0.4); }
.cue-mini-dot.negative { background: #f87171; box-shadow: 0 0 12px rgba(248, 113, 113, 0.4); }
.cue-mini-dot.idle { background: #3a3a42; }

/* ===== Platform prompt ===== */
.cue-platform-prompt {
  position: fixed;
  top: 12px;
  right: 24px;
  background: rgba(9, 9, 11, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 2147483647;
  animation: cue-slide-down 0.3s ease;
}
@keyframes cue-slide-down {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}
.cue-platform-text {
  font-size: 12px;
  color: #c8c8d8;
}
.cue-platform-text strong {
  color: #fafafa;
  font-weight: 600;
}
.cue-platform-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: #5c5c6e;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.cue-platform-btn:hover { background: #6e6e82; }
.cue-platform-dismiss {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #8b8b96;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.cue-platform-dismiss:hover { color: #fafafa; }

/* ===== Processing indicator ===== */
.cue-processing {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(200, 200, 216, 0.06);
  border-radius: 8px;
  font-size: 11px;
  color: #8b8b96;
}
.cue-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid #3a3a42;
  border-top-color: #c8c8d8;
  border-radius: 50%;
  animation: cue-spin 0.8s linear infinite;
}
@keyframes cue-spin {
  to { transform: rotate(360deg); }
}

/* ===== Idle state ===== */
.cue-idle {
  text-align: center;
  padding: 20px 12px;
  color: #8b8b96;
  font-size: 12px;
}

/* ===== Slide-in animation ===== */
@keyframes cue-widget-enter {
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.cue-widget { animation: cue-widget-enter 0.3s ease; }

/* ===== Segment enter ===== */
@keyframes cue-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.cue-enter { animation: cue-fade-in 0.2s ease; }
`;
