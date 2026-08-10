"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { authFetch } from "@/lib/api-client";
import { useLiveTranslation, type CopilotMode, type IncomingSegment } from "@/hooks/useLiveTranslation";

interface LiveTranslationStreamProps {
  segments: Array<{
    text: string;
    timestamp: number;
    speaker?: string;
    detectedLanguage?: string | null;
  }>;
  isRecording: boolean;
  compact?: boolean;
}

const LANGS: Array<{ code: string; labelKey: string; flag: string }> = [
  { code: "fr", labelKey: "liveTranslation.lang.fr", flag: "🇫🇷" },
  { code: "en", labelKey: "liveTranslation.lang.en", flag: "🇬🇧" },
  { code: "es", labelKey: "liveTranslation.lang.es", flag: "🇪🇸" },
  { code: "de", labelKey: "liveTranslation.lang.de", flag: "🇩🇪" },
  { code: "it", labelKey: "liveTranslation.lang.it", flag: "🇮🇹" },
  { code: "pt", labelKey: "liveTranslation.lang.pt", flag: "🇵🇹" },
  { code: "nl", labelKey: "liveTranslation.lang.nl", flag: "🇳🇱" },
  { code: "ja", labelKey: "liveTranslation.lang.ja", flag: "🇯🇵" },
  { code: "ko", labelKey: "liveTranslation.lang.ko", flag: "🇰🇷" },
  { code: "zh", labelKey: "liveTranslation.lang.zh", flag: "🇨🇳" },
];

const MODES: CopilotMode[] = ["translate_only", "translate_summary", "summary_only"];

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function LiveTranslationStream({ segments, isRecording, compact = false }: LiveTranslationStreamProps) {
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [targetLang, setTargetLang] = useState<string>(i18n.language?.slice(0, 2) || "fr");
  const [mode, setMode] = useState<CopilotMode>("translate_only");
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch("/api/user-preferences");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data.copilotTargetLang) setTargetLang(data.copilotTargetLang);
        if (data.copilotMode) setMode(data.copilotMode);
      } catch {
        // fall back to defaults
      } finally {
        if (!cancelled) setPrefsLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!prefsLoaded) return;
    authFetch("/api/user-preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ copilotTargetLang: targetLang, copilotMode: mode }),
    }).catch(() => {});
  }, [targetLang, mode, prefsLoaded]);

  const incoming: IncomingSegment[] = useMemo(
    () => segments.map((s) => ({
      id: `${s.timestamp}`,
      text: s.text,
      speaker: s.speaker,
      sourceLang: s.detectedLanguage ?? null,
    })),
    [segments],
  );

  const { items, summary, summaryStreaming, error, clear } = useLiveTranslation({
    segments: incoming,
    targetLang,
    mode,
    enabled: enabled && isRecording,
  });

  // Smart auto-scroll: stick to bottom unless user scrolled up
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (userScrolledRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [items, reduce]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    userScrolledRef.current = !atBottom;
  };

  useEffect(() => {
    if (!isRecording) clear();
  }, [isRecording, clear]);

  const showTranslation = mode !== "summary_only";
  const showSummary = mode !== "translate_only";

  return (
    <div className="lts-root">
      {/* Header */}
      <header className="lts-header">
        <div className="lts-header-left">
          <div className="lts-icon" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <h3 className="lts-title">{t("liveTranslation.title", "Live Translation")}</h3>
          <AnimatePresence>
            {enabled && isRecording && (
              <motion.span
                key="live-pill"
                className="lts-live-pill"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25, ease: easeOut }}
              >
                <span className="lts-live-dot" />
                {t("liveTranslation.live", "Live")}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="lts-header-right">
          {/* Native language selector — robust positioning across platforms */}
          <select
            className="lts-lang-select"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            aria-label={t("liveTranslation.targetLang", "Output language")}
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {t(l.labelKey)}
              </option>
            ))}
          </select>

          {/* Enable toggle */}
          <button
            type="button"
            className={`lts-toggle ${enabled ? "is-on" : ""}`}
            onClick={() => setEnabled((v) => !v)}
            role="switch"
            aria-checked={enabled}
            aria-label={t("liveTranslation.enable", "Enable")}
          >
            <span className="lts-toggle-dot" />
          </button>
        </div>
      </header>

      {/* Mode chips */}
      {enabled && (
        <div className="lts-mode-row">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`lts-mode-chip ${mode === m ? "is-active" : ""}`}
            >
              {t(`liveTranslation.modes.${m}`)}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="lts-error">{t("liveTranslation.error", "Error")}: {error}</div>
      )}

      {/* Body */}
      {!enabled ? (
        <div className="lts-empty">
          <div className="lts-empty-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8h14M9 4l-4 4 4 4M19 16h-14M15 12l4 4-4 4" />
            </svg>
          </div>
          <p className="lts-empty-title">{t("liveTranslation.disabledHint", "Enable to translate the conversation live.")}</p>
          <p className="lts-empty-sub">{t("liveTranslation.tagline", "Real-time bilingual transcription")}</p>
        </div>
      ) : (
        <>
          {showTranslation && (
            <div
              ref={scrollRef}
              onScroll={onScroll}
              className="lts-stream"
              style={{ maxHeight: compact ? 240 : 360 }}
            >
              {items.length === 0 ? (
                <div className="lts-listening">
                  <div className="lts-listening-bars" aria-hidden>
                    <span /><span /><span /><span /><span />
                  </div>
                  <p>
                    {isRecording
                      ? t("liveTranslation.listening", "Listening for speech...")
                      : t("liveTranslation.startHint", "Start a session to see live translation.")}
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((it, idx) => {
                    const isLatest = idx === items.length - 1;
                    return (
                      <motion.div
                        key={it.id}
                        className={`lts-bubble ${isLatest ? "is-latest" : ""}`}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: easeOut }}
                        layout
                      >
                        <div className="lts-bubble-meta">
                          {it.speaker && (
                            <span className="lts-speaker">{it.speaker}</span>
                          )}
                          <span className="lts-langflow">
                            {(it.sourceLang || "?").toUpperCase()}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                            {targetLang.toUpperCase()}
                          </span>
                        </div>
                        <p className="lts-original">{it.original}</p>
                        <p className="lts-translated">
                          {it.translated}
                          {it.streaming && <span className="lts-caret" aria-hidden />}
                        </p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          )}

          {showSummary && (
            <div className="lts-summary">
              <div className="lts-summary-head">
                <span>{t("liveTranslation.summary", "Summary")}</span>
                {summaryStreaming && <span className="lts-summary-pulse" aria-hidden />}
              </div>
              <p className="lts-summary-body">
                {summary || (
                  <span className="lts-summary-empty">
                    {t("liveTranslation.summaryEmpty", "Summary will appear as the conversation builds up.")}
                  </span>
                )}
              </p>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .lts-root {
          position: relative;
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.04) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%);
          border: 1px solid rgba(167, 139, 250, 0.12);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: hidden;
        }
        .lts-root::before {
          content: "";
          position: absolute;
          top: -48px;
          right: -48px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.18), transparent 70%);
          filter: blur(28px);
          pointer-events: none;
          opacity: 0.55;
        }

        .lts-header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
        }
        .lts-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .lts-icon {
          width: 28px;
          height: 28px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--shimmer-accent-1);
          background: rgba(167, 139, 250, 0.12);
          border: 1px solid rgba(167, 139, 250, 0.2);
        }
        .lts-title {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: var(--color-text);
        }
        .lts-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-negative) 12%, transparent);
          color: var(--color-negative);
          border: 1px solid color-mix(in srgb, var(--color-negative) 25%, transparent);
        }
        .lts-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-negative);
          animation: ltsPulse 1.4s ease-in-out infinite;
        }

        .lts-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .lts-lang-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding: 7px 28px 7px 12px;
          border: 1px solid color-mix(in srgb, var(--color-text) 6%, transparent);
          background-color: color-mix(in srgb, var(--color-text) 3%, transparent);
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9' /></svg>");
          background-repeat: no-repeat;
          background-position: right 10px center;
          color: var(--color-text);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.02em;
          border-radius: 999px;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
          max-width: 160px;
        }
        .lts-lang-select:hover {
          border-color: rgba(167, 139, 250, 0.3);
          background-color: rgba(167, 139, 250, 0.05);
        }
        .lts-lang-select:focus {
          outline: none;
          border-color: rgba(167, 139, 250, 0.4);
        }
        .lts-lang-select option {
          background: var(--color-surface-2);
          color: var(--color-text);
        }

        .lts-toggle {
          width: 38px;
          height: 22px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-text) 4%, transparent);
          border: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
          padding: 2px;
          cursor: pointer;
          position: relative;
          transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .lts-toggle.is-on {
          background: linear-gradient(135deg, #34d399, #6ee7b7);
          border-color: rgba(52, 211, 153, 0.5);
          box-shadow: 0 8px 20px -8px rgba(52, 211, 153, 0.5);
        }
        .lts-toggle-dot {
          display: block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-text-muted);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .lts-toggle.is-on .lts-toggle-dot {
          transform: translateX(16px);
          background: var(--color-bg);
        }

        .lts-mode-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .lts-mode-chip {
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 500;
          background: color-mix(in srgb, var(--color-text) 2%, transparent);
          color: var(--color-text-muted);
          border: 1px solid color-mix(in srgb, var(--color-text) 4%, transparent);
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lts-mode-chip:hover {
          color: var(--color-text);
          border-color: color-mix(in srgb, var(--color-text) 10%, transparent);
        }
        .lts-mode-chip.is-active {
          color: var(--color-text);
          border-color: color-mix(in srgb, var(--color-text) 16%, transparent);
          background: color-mix(in srgb, var(--color-text) 8%, transparent);
        }

        .lts-error {
          font-size: 12px;
          color: var(--color-negative);
          padding: 8px 10px;
          margin-bottom: 8px;
          background: rgba(248, 113, 113, 0.06);
          border-radius: 8px;
        }

        .lts-empty {
          padding: 36px 18px;
          text-align: center;
          position: relative;
        }
        .lts-empty-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          color: var(--shimmer-accent-1);
          background: rgba(167, 139, 250, 0.10);
          border: 1px solid rgba(167, 139, 250, 0.18);
        }
        .lts-empty-title {
          margin: 0 0 6px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text);
        }
        .lts-empty-sub {
          margin: 0;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .lts-stream {
          overflow-y: auto;
          padding: 4px 2px 4px;
          scroll-behavior: smooth;
          mask-image: linear-gradient(to bottom, transparent 0, #000 16px, #000 calc(100% - 8px), transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 16px, #000 calc(100% - 8px), transparent 100%);
        }

        .lts-listening {
          padding: 28px 16px;
          text-align: center;
          color: var(--color-text-muted);
        }
        .lts-listening p { margin: 10px 0 0; font-size: 12.5px; }
        .lts-listening-bars {
          display: inline-flex;
          align-items: flex-end;
          gap: 3px;
          height: 18px;
        }
        .lts-listening-bars span {
          display: block;
          width: 3px;
          background: var(--color-accent-light);
          border-radius: 2px;
          opacity: 0.55;
          animation: ltsBars 1.1s ease-in-out infinite;
        }
        .lts-listening-bars span:nth-child(1) { animation-delay: 0s;    height: 30%; }
        .lts-listening-bars span:nth-child(2) { animation-delay: 0.12s; height: 60%; }
        .lts-listening-bars span:nth-child(3) { animation-delay: 0.24s; height: 100%; }
        .lts-listening-bars span:nth-child(4) { animation-delay: 0.36s; height: 60%; }
        .lts-listening-bars span:nth-child(5) { animation-delay: 0.48s; height: 30%; }

        .lts-bubble {
          padding: 10px 12px;
          border-radius: 12px;
          margin-bottom: 8px;
          background: var(--color-surface-2);
          border: 1px solid transparent;
          transition: border-color 0.3s ease;
        }
        .lts-bubble.is-latest {
          border-color: rgba(129, 140, 248, 0.25);
          background: linear-gradient(180deg, rgba(129, 140, 248, 0.06), var(--color-surface-2));
        }
        .lts-bubble-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 10px;
          letter-spacing: 0.06em;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }
        .lts-speaker {
          font-weight: 700;
          color: var(--color-accent-light);
        }
        .lts-langflow {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }
        .lts-original {
          margin: 0 0 4px;
          font-size: 12px;
          color: var(--color-text-muted);
          line-height: 1.45;
        }
        .lts-translated {
          margin: 0;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--color-text);
          line-height: 1.5;
        }
        .lts-caret {
          display: inline-block;
          width: 2px;
          height: 1em;
          margin-left: 2px;
          vertical-align: -2px;
          background: var(--color-accent-light);
          animation: ltsCaret 1s steps(1) infinite;
        }

        .lts-summary {
          margin-top: 10px;
          padding: 12px 14px;
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }
        .lts-summary-head {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent-light);
          margin-bottom: 6px;
        }
        .lts-summary-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent-light);
          animation: ltsPulse 1.2s ease-in-out infinite;
        }
        .lts-summary-body {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--color-text);
        }
        .lts-summary-empty {
          color: var(--color-text-muted);
          font-style: italic;
        }

        @keyframes ltsPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes ltsCaret {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes ltsBars {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .lts-live-dot, .lts-summary-pulse, .lts-listening-bars span, .lts-caret {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
