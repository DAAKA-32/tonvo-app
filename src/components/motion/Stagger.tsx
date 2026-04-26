"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, CSSProperties, ElementType } from "react";
import { staggerItem, VIEWPORT } from "./transitions";

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
  const reduce = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

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
          transition: reduce
            ? { staggerChildren: 0 }
            : { staggerChildren: stagger, delayChildren },
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
  const reduce = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Component
      className={className}
      style={style}
      variants={
        reduce
          ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
          : staggerItem
      }
    >
      {children}
    </Component>
  );
}
