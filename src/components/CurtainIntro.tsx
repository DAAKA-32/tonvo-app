"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TonvoLogoMark } from "@/components/Logo";

/**
 * Premium loading screen with progress bar.
 *
 * Progress strategy:
 *  - 0 → 70%  : fast ramp (simulated, ~800ms)
 *  - 70 → 90% : slower crawl (simulated, ~600ms)
 *  - 90 → 100%: triggered when the page is fully hydrated / ready
 *  - Exit after reaching 100% with a short dwell + fade-out
 */
export default function CurtainIntro() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "finishing" | "done">("loading");

  /* ── Simulated progress ── */
  useEffect(() => {
    let raf: number;
    let start: number | null = null;

    const PHASE_1_DURATION = 800; // 0 → 70%
    const PHASE_2_DURATION = 600; // 70 → 90%
    const TOTAL_SIM = PHASE_1_DURATION + PHASE_2_DURATION;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;

      let value: number;
      if (elapsed < PHASE_1_DURATION) {
        // Ease-out quad: fast start, decelerating
        const t = elapsed / PHASE_1_DURATION;
        value = 70 * (1 - (1 - t) * (1 - t));
      } else if (elapsed < TOTAL_SIM) {
        const t = (elapsed - PHASE_1_DURATION) / PHASE_2_DURATION;
        value = 70 + 20 * (1 - (1 - t) * (1 - t));
      } else {
        value = 90;
      }

      setProgress(Math.min(value, 90));

      if (elapsed < TOTAL_SIM) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Detect page ready → finish to 100% ── */
  const finish = useCallback(() => {
    if (phase !== "loading") return;
    setPhase("finishing");
    setProgress(100);

    // Short dwell at 100% before exit
    setTimeout(() => {
      setPhase("done");
      setShow(false);
    }, 350);
  }, [phase]);

  useEffect(() => {
    // If the document is already loaded (SSR hydration complete)
    if (document.readyState === "complete") {
      const t = setTimeout(finish, 200);
      return () => clearTimeout(t);
    }

    const onLoad = () => {
      // Small delay to ensure React hydration is truly done
      setTimeout(finish, 200);
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [finish]);

  /* ── Fallback: never block longer than 3s ── */
  useEffect(() => {
    const fallback = setTimeout(() => finish(), 3000);
    return () => clearTimeout(fallback);
  }, [finish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="curtain-overlay"
        >
          {/* Subtle ambient glow behind logo */}
          <div className="curtain-glow" />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="curtain-logo"
          >
            <TonvoLogoMark size="xl" />
          </motion.div>

          {/* Progress section */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
            className="curtain-progress-wrap"
          >
            {/* Progress bar track */}
            <div className="curtain-bar-track">
              <motion.div
                className="curtain-bar-fill"
                style={{ width: `${progress}%` }}
                transition={{
                  duration: phase === "finishing" ? 0.3 : 0.1,
                  ease: [0.23, 1, 0.32, 1],
                }}
              />
            </div>

            {/* Label */}
            <span className="curtain-label">
              Preparing your workspace
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
