"use client";

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties, ElementType } from "react";
import { easeOutSoft, VIEWPORT } from "./transitions";
import { usePerformance } from "@/lib/performance";

interface FadeInProps {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
}

export default function FadeIn({
  children,
  as = "div",
  delay = 0,
  y = 24,
  duration = 0.55,
  className,
  style,
  once = true,
}: FadeInProps) {
  const { shouldAnimate, motionScale, tier } = usePerformance();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  if (!shouldAnimate) {
    return (
      <Component
        className={className}
        style={style}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ ...VIEWPORT, once }}
        transition={{ duration: 0.3, delay: delay * 0.5 }}
      >
        {children}
      </Component>
    );
  }

  const dY = tier === "low" ? Math.min(y, 8) : tier === "medium" ? Math.min(y, 16) : y;
  const dDur = duration * motionScale;

  return (
    <Component
      className={className}
      style={style}
      initial={{ opacity: 0, y: dY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ ...VIEWPORT, once }}
      transition={{ duration: dDur, delay, ease: easeOutSoft }}
    >
      {children}
    </Component>
  );
}
