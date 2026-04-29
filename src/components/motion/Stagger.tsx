"use client";

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties, ElementType } from "react";
import { staggerItem, VIEWPORT } from "./transitions";
import { usePerformance } from "@/lib/performance";

interface StaggerProps {
  children: ReactNode;
  as?: ElementType;
  stagger?: number;
  delayChildren?: number;
  className?: string;
  style?: CSSProperties;
  amount?: number;
}

export function Stagger({
  children,
  as = "div",
  stagger = 0.08,
  delayChildren = 0,
  className,
  style,
  amount = 0.15,
}: StaggerProps) {
  const { shouldAnimate, motionScale, tier } = usePerformance();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  const tStagger = !shouldAnimate ? 0 : tier === "low" ? Math.min(stagger, 0.04) : stagger * motionScale;

  return (
    <Component
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ ...VIEWPORT, amount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: tStagger, delayChildren: delayChildren * motionScale },
        },
      }}
    >
      {children}
    </Component>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export function StaggerItem({
  children,
  as = "div",
  className,
  style,
}: StaggerItemProps) {
  const { shouldAnimate, tier } = usePerformance();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  const variants = !shouldAnimate
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : tier === "low"
      ? { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }
      : staggerItem;

  return (
    <Component className={className} style={style} variants={variants}>
      {children}
    </Component>
  );
}
