"use client";

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";
import { springGentle } from "./transitions";
import { usePerformance } from "@/lib/performance";

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  lift?: number;
  scale?: number;
}

export default function HoverLift({
  children,
  className,
  style,
  lift = -3,
  scale = 1.005,
}: HoverLiftProps) {
  const { shouldAnimate, isFine, tier } = usePerformance();

  if (!shouldAnimate || !isFine || tier === "low") {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const dLift = tier === "medium" ? Math.max(lift, -2) : lift;

  return (
    <motion.div
      className={className}
      style={style}
      whileHover={{ y: dLift, scale }}
      transition={springGentle}
    >
      {children}
    </motion.div>
  );
}
