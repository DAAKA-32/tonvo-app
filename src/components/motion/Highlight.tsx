"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOutExpo, VIEWPORT } from "./transitions";
import { usePerformance } from "@/lib/performance";

interface HighlightProps {
  children: ReactNode;
  color?: string;
  /** Stroke under the highlighted span. Default: gradient stroke. */
  delay?: number;
  /** Bold weight for emphasis. Default: true. */
  bold?: boolean;
}

/**
 * Inline keyword emphasis with an animated underline that scales in from center.
 * Use sparingly — applied to ONE or TWO keywords per heading max.
 */
export default function Highlight({
  children,
  color = "rgba(200, 200, 216, 0.85)",
  delay = 0,
  bold = true,
}: HighlightProps) {
  const { shouldAnimate, motionScale, tier } = usePerformance();

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span style={{ fontWeight: bold ? 600 : "inherit", color: "inherit" }}>
        {children}
      </span>
      {shouldAnimate && (
        <motion.span
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: 0,
            right: 0,
            bottom: -2,
            height: 2,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            transformOrigin: "center",
            boxShadow: tier === "high" ? `0 0 6px ${color}` : "none",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{
            duration: 0.7 * motionScale,
            delay: delay + 0.25,
            ease: easeOutExpo,
          }}
        />
      )}
    </span>
  );
}
