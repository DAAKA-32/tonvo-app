"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { easeOutExpo, VIEWPORT } from "./transitions";
import { usePerformance } from "@/lib/performance";

interface RevealLineProps {
  className?: string;
  style?: CSSProperties;
}

export default function RevealLine({ className, style }: RevealLineProps) {
  const { shouldAnimate, motionScale } = usePerformance();

  return (
    <motion.div
      className={className}
      style={{ transformOrigin: "center", ...style }}
      initial={!shouldAnimate ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
      whileInView={!shouldAnimate ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9 * motionScale, ease: easeOutExpo }}
    />
  );
}
