export {
  PerformanceProvider,
  usePerformance,
  useTier,
  useShouldAnimate,
  useTierRank,
  useMotionScale,
  useAdaptiveDuration,
  type PerformanceState,
} from "./context";
export { detectDeviceProfile, inlineDetectScript, type PerformanceTier, type DeviceProfile } from "./detect";
export { FpsMonitor, type FpsSample } from "./fps-monitor";
