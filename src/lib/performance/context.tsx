"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { detectDeviceProfile, type DeviceProfile, type PerformanceTier } from "./detect";
import { FpsMonitor } from "./fps-monitor";

export interface PerformanceState {
  tier: PerformanceTier;
  baseTier: PerformanceTier;
  prefersReducedMotion: boolean;
  isMobile: boolean;
  isCoarse: boolean;
  isFine: boolean;
  fps: number;
  ready: boolean;

  shouldAnimate: boolean;
  shouldUseBlur: boolean;
  shouldUseParallax: boolean;
  shouldUseSpotlight: boolean;
  shouldUseHeavyShadow: boolean;
  shouldUseFloating: boolean;
  motionScale: number;
}

const SSR_DEFAULT: PerformanceState = {
  tier: "high",
  baseTier: "high",
  prefersReducedMotion: false,
  isMobile: false,
  isCoarse: false,
  isFine: true,
  fps: 60,
  ready: false,
  shouldAnimate: true,
  shouldUseBlur: true,
  shouldUseParallax: true,
  shouldUseSpotlight: true,
  shouldUseHeavyShadow: true,
  shouldUseFloating: true,
  motionScale: 1,
};

const PerformanceContext = createContext<PerformanceState>(SSR_DEFAULT);

function deriveFlags(
  tier: PerformanceTier,
  reduced: boolean,
  isCoarse: boolean
): Pick<
  PerformanceState,
  | "shouldAnimate"
  | "shouldUseBlur"
  | "shouldUseParallax"
  | "shouldUseSpotlight"
  | "shouldUseHeavyShadow"
  | "shouldUseFloating"
  | "motionScale"
> {
  if (reduced) {
    return {
      shouldAnimate: false,
      shouldUseBlur: false,
      shouldUseParallax: false,
      shouldUseSpotlight: false,
      shouldUseHeavyShadow: false,
      shouldUseFloating: false,
      motionScale: 0,
    };
  }
  if (tier === "low") {
    return {
      shouldAnimate: true,
      shouldUseBlur: false,
      shouldUseParallax: false,
      shouldUseSpotlight: false,
      shouldUseHeavyShadow: false,
      shouldUseFloating: false,
      motionScale: 0.5,
    };
  }
  if (tier === "medium") {
    return {
      shouldAnimate: true,
      shouldUseBlur: true,
      shouldUseParallax: false,
      shouldUseSpotlight: !isCoarse,
      shouldUseHeavyShadow: false,
      shouldUseFloating: !isCoarse,
      motionScale: 0.85,
    };
  }
  return {
    shouldAnimate: true,
    shouldUseBlur: true,
    shouldUseParallax: !isCoarse,
    shouldUseSpotlight: !isCoarse,
    shouldUseHeavyShadow: true,
    shouldUseFloating: !isCoarse,
    motionScale: 1,
  };
}

const TIER_RANK: Record<PerformanceTier, number> = { low: 0, medium: 1, high: 2 };

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<DeviceProfile | null>(null);
  const [tier, setTier] = useState<PerformanceTier>(SSR_DEFAULT.tier);
  const [fps, setFps] = useState(60);
  const monitorRef = useRef<FpsMonitor | null>(null);
  const lowFpsSinceRef = useRef<number | null>(null);
  const downgradedRef = useRef(false);

  useEffect(() => {
    const p = detectDeviceProfile();
    setProfile(p);
    setTier(p.tier);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-perf", p.tier);
    }

    const monitor = new FpsMonitor();
    monitorRef.current = monitor;
    monitor.start();

    const unsubscribe = monitor.subscribe(({ rolling }) => {
      setFps(rolling);
      if (downgradedRef.current) return;

      if (rolling < 40) {
        if (lowFpsSinceRef.current == null) lowFpsSinceRef.current = performance.now();
        else if (performance.now() - lowFpsSinceRef.current > 2500) {
          downgradedRef.current = true;
          setTier((current) => {
            if (current === "low") return current;
            const next: PerformanceTier = current === "high" ? "medium" : "low";
            if (typeof document !== "undefined") {
              document.documentElement.setAttribute("data-perf", next);
            }
            return next;
          });
        }
      } else if (rolling >= 50) {
        lowFpsSinceRef.current = null;
      }
    });

    const onVis = () => {
      if (document.visibilityState === "visible") monitor.start();
      else monitor.stop();
    };
    document.addEventListener("visibilitychange", onVis);

    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReducedChange = () => setProfile((prev) => (prev ? { ...prev, prefersReducedMotion: reducedMq.matches } : prev));
    reducedMq.addEventListener?.("change", onReducedChange);

    return () => {
      unsubscribe();
      monitor.stop();
      document.removeEventListener("visibilitychange", onVis);
      reducedMq.removeEventListener?.("change", onReducedChange);
    };
  }, []);

  const value = useMemo<PerformanceState>(() => {
    const baseTier = profile?.tier ?? SSR_DEFAULT.baseTier;
    const reduced = profile?.prefersReducedMotion ?? false;
    const isCoarse = profile?.isCoarse ?? false;
    const flags = deriveFlags(tier, reduced, isCoarse);
    return {
      tier,
      baseTier,
      prefersReducedMotion: reduced,
      isMobile: profile?.isMobile ?? false,
      isCoarse,
      isFine: profile?.isFine ?? true,
      fps,
      ready: profile != null,
      ...flags,
    };
  }, [profile, tier, fps]);

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}

export function usePerformance(): PerformanceState {
  return useContext(PerformanceContext);
}

export function useTier(): PerformanceTier {
  return useContext(PerformanceContext).tier;
}

export function useShouldAnimate(): boolean {
  return useContext(PerformanceContext).shouldAnimate;
}

export function useTierRank(): number {
  return TIER_RANK[useContext(PerformanceContext).tier];
}

export function useMotionScale(): number {
  return useContext(PerformanceContext).motionScale;
}

export function useAdaptiveDuration(base: number): number {
  const scale = useMotionScale();
  return base * scale;
}
