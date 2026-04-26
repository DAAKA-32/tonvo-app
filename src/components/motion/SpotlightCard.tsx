"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";
import { useMouseSpotlight } from "./useMouseSpotlight";
import { easeOutSoft, VIEWPORT } from "./transitions";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  index?: number;
  delay?: number;
  spotlightColor?: string;
  borderGlow?: string;
}

/**
 * Card with cursor-tracked radial spotlight, gradient border on hover, and entrance reveal.
 * Animation is opacity + transform + filter only — GPU friendly.
 */
export default function SpotlightCard({
  children,
  className = "",
  style,
  index = 0,
  delay = 0,
  spotlightColor = "rgba(200, 200, 216, 0.08)",
  borderGlow = "rgba(200, 200, 216, 0.22)",
}: SpotlightCardProps) {
  const reduce = useReducedMotion();
  const ref = useMouseSpotlight<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={`spotlight-card ${className}`}
      style={
        {
          "--spot-color": spotlightColor,
          "--border-glow": borderGlow,
          "--spot-opacity": "0",
          "--mx": "50%",
          "--my": "50%",
          ...style,
        } as CSSProperties
      }
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={
        reduce
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={VIEWPORT}
      transition={{
        duration: 0.7,
        delay: delay + index * 0.09,
        ease: easeOutSoft,
      }}
    >
      {children}
    </motion.div>
  );
}
