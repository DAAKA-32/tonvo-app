"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { easeOutExpo, VIEWPORT } from "./transitions";

interface WordsRevealProps {
  text: string;
  baseDelay?: number;
  /** Apply red glow accent to the last word — used for emphasis. */
  accentLastWord?: boolean;
  accentColor?: string;
  /**
   * Class applied to each word span. Use this when the parent uses
   * `background-clip: text` — the gradient must live on each child span,
   * not be inherited, otherwise children render with transparent fill.
   */
  wordClassName?: string;
  /** Per-word stagger interval in seconds. */
  stagger?: number;
  /** Initial Y offset (px) for each word. */
  y?: number;
  /** Initial blur (px) for each word. Set to 0 to disable the blur effect. */
  blur?: number;
  duration?: number;
  style?: CSSProperties;
}

/**
 * Cinematic word-by-word reveal. Each word fades + rises + unblurs in stagger.
 * Falls back to a plain text span under reduced-motion.
 *
 * Note: words render in inline-block spans, with regular text-node spaces
 * between them. Trailing whitespace inside an inline-block element collapses,
 * so the space MUST sit between siblings — not inside the span.
 */
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
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return wordClassName ? (
      <span className={wordClassName} style={style}>{text}</span>
    ) : (
      <span style={style}>{text}</span>
    );
  }

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
              initial={{ opacity: 0, y, filter: blur ? `blur(${blur}px)` : "none" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={VIEWPORT}
              transition={{
                duration,
                delay: baseDelay + i * stagger,
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
