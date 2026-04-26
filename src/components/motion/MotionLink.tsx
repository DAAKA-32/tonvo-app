"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";
import { springSnappy } from "./transitions";

const MotionAnchor = motion.create(Link);

interface MotionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

/**
 * Premium CTA link with hover/tap micro-interaction.
 * Falls back to a static Link under reduced-motion.
 */
export default function MotionLink({
  href,
  children,
  className,
  style,
  ariaLabel,
}: MotionLinkProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Link href={href} className={className} style={style} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <MotionAnchor
      href={href}
      className={className}
      style={style}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
    >
      {children}
    </MotionAnchor>
  );
}
