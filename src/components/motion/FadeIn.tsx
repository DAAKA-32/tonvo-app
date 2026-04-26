"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, CSSProperties, ElementType } from "react";
import { easeOutSoft, VIEWPORT } from "./transitions";

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
  const reduce = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Component
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ ...VIEWPORT, once }}
      transition={{ duration, delay, ease: easeOutSoft }}
    >
      {children}
    </Component>
  );
}
