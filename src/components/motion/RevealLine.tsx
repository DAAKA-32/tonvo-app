"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { easeOutExpo, VIEWPORT } from "./transitions";

interface RevealLineProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Wraps a divider element so it reveals via scaleX from center as it enters viewport.
 * Pair with the existing `.glow-line` class — this is the motion shell only.
 */
export default function RevealLine({ className, style }: RevealLineProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{ transformOrigin: "center", ...style }}
      initial={reduce ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
      whileInView={reduce ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: easeOutExpo }}
    />
  );
}
