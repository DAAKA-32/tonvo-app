"use client";

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";
import { useMouseSpotlight } from "./useMouseSpotlight";
import { easeOutSoft, VIEWPORT } from "./transitions";
import { usePerformance } from "@/lib/performance";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  index?: number;
  delay?: number;
  spotlightColor?: string;
  borderGlow?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  style,
  index = 0,
  delay = 0,
  spotlightColor = "rgba(200, 200, 216, 0.08)",
  borderGlow = "rgba(200, 200, 216, 0.22)",
}: SpotlightCardProps) {
  const { shouldAnimate, shouldUseBlur, shouldUseSpotlight, motionScale, tier } = usePerformance();
  const ref = useMouseSpotlight<HTMLDivElement>();

  const useSpotlight = shouldUseSpotlight;
  const useBlur = shouldUseBlur && tier === "high";

  const initial = !shouldAnimate
    ? { opacity: 0 }
    : useBlur
      ? { opacity: 0, y: 28, filter: "blur(8px)" }
      : { opacity: 0, y: tier === "low" ? 8 : 18 };

  const whileInView = !shouldAnimate
    ? { opacity: 1 }
    : useBlur
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 1, y: 0 };

  return (
    <motion.div
      ref={useSpotlight ? ref : undefined}
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
      initial={initial}
      whileInView={whileInView}
      viewport={VIEWPORT}
      transition={{
        duration: 0.7 * motionScale,
        delay: delay + index * 0.09 * motionScale,
        ease: easeOutSoft,
      }}
    >
      {children}
    </motion.div>
  );
}
