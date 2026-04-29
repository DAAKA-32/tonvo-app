"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { easeOutExpo, VIEWPORT } from "./transitions";
import { usePerformance } from "@/lib/performance";

interface WordsRevealProps {
  text: string;
  baseDelay?: number;
  accentLastWord?: boolean;
  accentColor?: string;
  wordClassName?: string;
  stagger?: number;
  y?: number;
  blur?: number;
  duration?: number;
  style?: CSSProperties;
}

export default function WordsReveal({
  text,
  baseDelay = 0,
  accentLastWord = false,
  accentColor = "#f87171",
  wordClassName = "",
  stagger = 0.07,
  y = 18,
  blur = 8,
  duration = 0.6,
  style,
}: WordsRevealProps) {
  const { shouldAnimate, shouldUseBlur, motionScale, tier } = usePerformance();
  const words = text.split(" ");

  if (!shouldAnimate) {
    return wordClassName ? (
      <span className={wordClassName} style={style}>{text}</span>
    ) : (
      <span style={style}>{text}</span>
    );
  }

  const useBlur = shouldUseBlur && tier === "high" && blur > 0;
  const dY = tier === "low" ? Math.min(y, 8) : tier === "medium" ? Math.min(y, 12) : y;
  const dStagger = tier === "low" ? Math.min(stagger, 0.03) : stagger * motionScale;
  const dDur = duration * motionScale;

  return (
    <>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        const accent = accentLastWord && isLast;
        return (
          <Fragment key={`${word}-${i}`}>
            <motion.span
              className={`inline-block ${accent ? "" : wordClassName}`.trim()}
              style={
                accent
                  ? {
                      color: accentColor,
                      WebkitTextFillColor: accentColor,
                      textShadow: `0 0 18px ${accentColor}88`,
                      ...style,
                    }
                  : style
              }
              initial={{ opacity: 0, y: dY, filter: useBlur ? `blur(${blur}px)` : "none" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={VIEWPORT}
              transition={{
                duration: dDur,
                delay: baseDelay + i * dStagger,
                ease: easeOutExpo,
              }}
            >
              {word}
            </motion.span>
            {!isLast ? " " : null}
          </Fragment>
        );
      })}
    </>
  );
}
