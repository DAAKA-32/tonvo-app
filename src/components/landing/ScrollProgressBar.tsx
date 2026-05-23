"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Premium scroll progress indicator — a 2px GPU-accelerated bar that fills
 * left-to-right as the user scrolls the landing page. Sits above the navbar
 * (z-index 60 over the navbar's z-50) on the very top edge of the viewport.
 *
 * Implementation notes:
 * - `useScroll` registers a single passive scroll listener and exposes
 *   `scrollYProgress` (a MotionValue clamped 0→1) without forcing React
 *   re-renders on every frame.
 * - `useSpring` smooths the raw value so fast flicks feel buttery rather than
 *   janky. Tuned for a premium "snap-to-rest" feel (high stiffness, moderate
 *   damping). `restDelta` lets it settle without burning CPU.
 * - We animate `scaleX` (compositor-only, GPU) with `transform-origin: 0% 50%`
 *   instead of `width`, avoiding layout/paint on every frame.
 * - `prefers-reduced-motion` bypasses the spring and binds the raw scroll
 *   value directly — still smooth, no easing overshoot.
 */
export default function ScrollProgressBar() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0"
      style={{
        top: 0,
        height: 2,
        zIndex: 60,
        // sits flush with viewport top — above the navbar, under the system
        // chrome on notched devices (browser handles status-bar area).
      }}
    >
      <motion.div
        style={{
          scaleX: reduce ? scrollYProgress : smoothed,
          transformOrigin: "0% 50%",
          height: "100%",
          willChange: "transform",
          background:
            "linear-gradient(90deg, rgba(52, 211, 153, 0.9) 0%, rgba(200, 200, 216, 0.95) 55%, rgba(52, 211, 153, 0.9) 100%)",
          boxShadow:
            "0 0 8px rgba(52, 211, 153, 0.55), 0 0 14px rgba(52, 211, 153, 0.22)",
        }}
      />
    </div>
  );
}
