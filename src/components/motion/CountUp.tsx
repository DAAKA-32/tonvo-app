"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { usePerformance } from "@/lib/performance";

interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (n: number) => string;
}

/**
 * Spring-driven count-up. Locks at final value under reduced motion.
 * Reads viewport via useInView so it only fires on entry.
 */
export default function CountUp({
  value,
  duration = 1.6,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  formatter,
}: CountUpProps) {
  const { shouldAnimate, motionScale } = usePerformance();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [display, setDisplay] = useState(shouldAnimate ? 0 : value);

  useEffect(() => {
    if (!inView) return;
    if (!shouldAnimate) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: duration * motionScale,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setDisplay(n),
    });
    return () => controls.stop();
  }, [inView, value, duration, shouldAnimate, motionScale]);

  const formatted = formatter
    ? formatter(display)
    : decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
