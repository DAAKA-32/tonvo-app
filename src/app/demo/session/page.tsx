/* eslint-disable @next/next/no-page-custom-font */
"use client";

/*
 * /demo/session — public, no-auth, designed for 360x779 viewport
 *
 * This page replicates the Tonvo live-session UI with mock data so we can
 * Playwright-capture it for our HyperFrames ad mockups (the captured MP4
 * embeds inside an iPhone 17 frame).
 *
 * All animations use pure CSS keyframes for deterministic playback —
 * the capture is a 15s window starting at page load.
 *
 * Colors taken verbatim from src/app/dashboard/page.tsx TONE_PALETTE
 * and src/components/LiveCopilotPanel.tsx.
 */

const TIMINGS = {
  HEADER_IN: 0.4,        // s — header fade-in
  TONE_FILL: 1.5,        // s — tone bar starts filling
  SAY_THIS_IN: 3.0,      // s — coaching card appears
  SIGNAL_1_IN: 5.5,      // s — 1st detected signal
  SIGNAL_2_IN: 7.5,      // s
  SIGNAL_3_IN: 9.5,      // s
  KPI_IN: 11.5,          // s — KPI strip appears
  PULSE_LIVE_PERIOD: 1.6, // s — pulse on LIVE dot
};

export default function DemoSessionPage() {
  const css = `
    :root {
      --t-bg: #09090b;
      --t-text: #fafafa;
      --t-muted: #71717a;
      --t-soft: #a1a1aa;
      --t-hairline: rgba(255, 255, 255, 0.08);
      --t-glass: rgba(17, 17, 20, 0.72);
      --t-positive: #34d399;
      --t-positive-soft: #6ee7b7;
      --t-neutral: #fbbf24;
      --t-negative: #f87171;
      --t-coaching: #818cf8;
    }
    html, body { background: #09090b !important; color: #fafafa; margin: 0; padding: 0; overflow: hidden; }
    body { font-family: "Inter", system-ui, -apple-system, sans-serif; }
    @keyframes pulse-dot { 0%,100% { opacity:0.45; transform:scale(0.92); } 50% { opacity:1; transform:scale(1.05); } }
    @keyframes tone-fill { 0% { width:0%; } 100% { width:84%; } }
    @keyframes appear-up { 0% { opacity:0; transform:translateY(10px) scale(0.96); } 100% { opacity:1; transform:translateY(0) scale(1); } }
    @keyframes appear-glow { 0% { opacity:0; transform:translateY(8px) scale(0.92); filter:blur(4px); } 100% { opacity:1; transform:translateY(0) scale(1); filter:blur(0); } }
    @keyframes wave-bar { 0%,100% { transform:scaleY(0.4); } 50% { transform:scaleY(1); } }
  `;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <main
        style={{
          position: "fixed",
          inset: 0,
          width: 360,
          height: 779,
          background: "var(--t-bg)",
          overflow: "hidden",
          padding: "60px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          backgroundImage: [
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            "radial-gradient(ellipse at 50% 30%, rgba(52,211,153,0.06) 0%, transparent 50%)",
          ].join(","),
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      >
        {/* Status bar */}
        <div style={{ position: "absolute", top: 18, left: 16, fontSize: 12, fontWeight: 700 }}>9:41</div>
        <div style={{ position: "absolute", top: 18, right: 16, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", color: "var(--t-text)" }}>●●●● 5G</div>

        {/* Header — Tonvo brand + LIVE indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 2px",
            opacity: 0,
            animation: `appear-up 0.4s ease-out ${TIMINGS.HEADER_IN}s forwards`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-tonvo-remove.png"
              alt="Tonvo"
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                objectFit: "contain",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            />
            <span style={{ fontSize: 16, fontWeight: 700 }}>Tonvo</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, color: "var(--t-soft)", letterSpacing: "0.1em" }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--t-positive)",
                boxShadow: "0 0 10px rgba(52,211,153,0.7)",
                animation: `pulse-dot ${TIMINGS.PULSE_LIVE_PERIOD}s ease-in-out infinite`,
              }}
            />
            LIVE
          </div>
        </div>

        {/* Tone bar */}
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            background: "var(--t-glass)",
            border: "1px solid var(--t-hairline)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            opacity: 0,
            animation: `appear-up 0.4s ease-out ${TIMINGS.HEADER_IN + 0.2}s forwards`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 9,
              fontWeight: 700,
              color: "var(--t-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 6,
            }}
          >
            <span>Tone — positive</span>
            <span style={{ color: "var(--t-text)" }}>84%</span>
          </div>
          <div
            style={{
              height: 9,
              borderRadius: 5,
              background: "rgba(255,255,255,0.04)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                width: 0,
                background: "linear-gradient(90deg, var(--t-positive) 0%, var(--t-positive-soft) 100%)",
                borderRadius: 5,
                boxShadow: "0 0 12px rgba(52,211,153,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
                animation: `tone-fill 1.4s cubic-bezier(0.22, 1, 0.36, 1) ${TIMINGS.TONE_FILL}s forwards`,
              }}
            />
          </div>

          {/* Live waveform indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 8, height: 14 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: "var(--t-positive)",
                  borderRadius: 2,
                  height: "100%",
                  opacity: 0.7,
                  transformOrigin: "center",
                  animation: `wave-bar ${0.6 + i * 0.08}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Coaching SAY THIS */}
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: "linear-gradient(135deg, rgba(129,140,248,0.14) 0%, rgba(129,140,248,0.04) 100%)",
            border: "1px solid rgba(129,140,248,0.32)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            boxShadow: "0 0 24px rgba(129,140,248,0.12)",
            opacity: 0,
            animation: `appear-glow 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${TIMINGS.SAY_THIS_IN}s forwards`,
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              fontSize: 9,
              fontWeight: 800,
              color: "var(--t-coaching)",
              letterSpacing: "0.12em",
              padding: "3px 7px",
              borderRadius: 5,
              background: "rgba(129,140,248,0.18)",
              border: "1px solid rgba(129,140,248,0.30)",
            }}
          >
            SAY THIS
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--t-text)",
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
            }}
          >
            "Help me understand what's blocking you from saying yes today."
          </div>
        </div>

        {/* Detected signals (3 cards animating in sequence) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            {
              quote: "“Let me think about it.”",
              label: "objection · detected",
              t: TIMINGS.SIGNAL_1_IN,
              color: "#f87171",
            },
            {
              quote: "“[silence]”",
              label: "hesitation · detected",
              t: TIMINGS.SIGNAL_2_IN,
              color: "#fbbf24",
            },
            {
              quote: "“How flexible is the price?”",
              label: "buying signal · detected",
              t: TIMINGS.SIGNAL_3_IN,
              color: "#34d399",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                padding: "9px 10px",
                borderRadius: 10,
                background: "rgba(20,20,24,0.7)",
                border: "1px solid var(--t-hairline)",
                display: "flex",
                alignItems: "center",
                gap: 9,
                opacity: 0,
                animation: `appear-glow 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${s.t}s forwards`,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}cc 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 900,
                  color: "#000",
                  flexShrink: 0,
                  boxShadow: `0 0 12px ${s.color}88, inset 0 1px 0 rgba(255,255,255,0.3)`,
                }}
              >
                ✓
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontStyle: "italic",
                    fontSize: 11,
                    color: "var(--t-text)",
                    lineHeight: 1.25,
                  }}
                >
                  {s.quote}
                </div>
                <div
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: "var(--t-soft)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* KPI strip — bottom */}
        <div
          style={{
            display: "flex",
            gap: 6,
            opacity: 0,
            animation: `appear-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${TIMINGS.KPI_IN}s forwards`,
            marginTop: "auto",
          }}
        >
          {[
            { label: "Quality", value: 84, color: "var(--t-positive)", glow: "rgba(52,211,153,0.40)" },
            { label: "Engage", value: 91, color: "var(--t-positive)", glow: "rgba(52,211,153,0.40)" },
            { label: "Balance", value: 67, color: "var(--t-neutral)", glow: "rgba(251,191,36,0.40)" },
          ].map((k, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "8px 9px",
                borderRadius: 10,
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "var(--t-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {k.label}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: k.color,
                  letterSpacing: "-0.02em",
                  marginTop: 2,
                  textShadow: `0 0 12px ${k.glow}`,
                }}
              >
                {k.value}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
