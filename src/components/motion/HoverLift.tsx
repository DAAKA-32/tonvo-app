"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";
import { springGentle } from "./transitions";

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  lift?: number;
  scale?: number;
}

/**
 * Subtle hover lift for interactive cards.
 * Disabled on touch / reduced-motion. CSS hover rules in globals.css remain authoritative
 * for color/border — this only adds a smooth motion layer where pointer hover is available.
 */
export default function HoverLift({
  children,
  className,
  style,
  lift = -3,
  scale = 1.005,
}: HoverLiftProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      whileHover={{ y: lift, scale }}
      transition={springGentle}
    >
      {children}
    </motion.div>
  );
}
