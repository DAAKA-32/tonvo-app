import type { Transition, Variants } from "framer-motion";

export const easeOutSoft = [0.25, 0.1, 0.25, 1] as const;
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
export const springSnappy = { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.6 };
export const springGentle = { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.8 };

export const VIEWPORT = { once: true, margin: "-60px" } as const;
export const VIEWPORT_TIGHT = { once: true, margin: "-30px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutSoft } as Transition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOutSoft } as Transition },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: easeOutSoft } as Transition },
};

export const staggerParent = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutSoft } as Transition },
};
