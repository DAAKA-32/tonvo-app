"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "up" | "left" | "right" | "soft" | "lift";

interface AnimatedTitleProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  variant?: Variant;
}

const MotionH1 = motion.h1;
const MotionH2 = motion.h2;
const MotionH3 = motion.h3;

const components = { h1: MotionH1, h2: MotionH2, h3: MotionH3 };

const variants: Record<Variant, { initial: Record<string, number>; animate: Record<string, number>; duration: number }> = {
  up: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    duration: 0.7,
  },
  left: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    duration: 0.65, 
  },
  right: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    duration: 0.65,
  },
  soft: {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    duration: 0.8,
  },
  lift: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    duration: 0.9,
  },
};

export default function AnimatedTitle({
  children,
  as = "h2",
  className = "",
  style,
  delay = 0,
  variant = "up",
}: AnimatedTitleProps) {
  const Component = components[as];
  const v = variants[variant];

  return (
    <Component
      className={className}
      style={style}
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: v.duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </Component>
  );
}

