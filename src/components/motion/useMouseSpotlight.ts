"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks pointer position over a container as CSS custom properties (--mx, --my).
 * No React re-renders during mousemove — direct DOM updates only.
 * Falls back to no-op when pointer is coarse (touch).
 */
export function useMouseSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const onEnter = () => el.style.setProperty("--spot-opacity", "1");
    const onLeave = () => el.style.setProperty("--spot-opacity", "0");

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}
