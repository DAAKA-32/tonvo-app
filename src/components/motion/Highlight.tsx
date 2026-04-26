"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOutExpo, VIEWPORT } from "./transitions";

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
  const reduce = useReducedMotion();

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span style={{ fontWeight: bold ? 600 : "inherit", color: "inherit" }}>
        {children}
      </span>
      {!reduce && (
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
            boxShadow: `0 0 6px ${color}`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{
            duration: 0.7,
            delay: delay + 0.25,
            ease: easeOutExpo,
          }}
        />
      )}
    </span>
  );
}
