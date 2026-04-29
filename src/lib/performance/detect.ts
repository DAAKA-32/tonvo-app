export type PerformanceTier = "low" | "medium" | "high";

export interface DeviceProfile {
  tier: PerformanceTier;
  prefersReducedMotion: boolean;
  isMobile: boolean;
  isCoarse: boolean;
  isFine: boolean;
  saveData: boolean;
  cores: number;
  memoryGb: number;
  effectiveType: string | null;
  gpuHint: "low" | "mid" | "high" | "unknown";
}

const FALLBACK: DeviceProfile = {
  tier: "high",
  prefersReducedMotion: false,
  isMobile: false,
  isCoarse: false,
  isFine: true,
  saveData: false,
  cores: 8,
  memoryGb: 8,
  effectiveType: null,
  gpuHint: "unknown",
};

function detectGpu(): "low" | "mid" | "high" | "unknown" {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return "low";
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer: string = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "")
      : String(gl.getParameter(gl.RENDERER) || "");
    const r = renderer.toLowerCase();
    if (!r) return "unknown";
    if (
      r.includes("apple m") ||
      r.includes("rtx") ||
      r.includes("radeon pro") ||
      r.includes("rx 6") ||
      r.includes("rx 7") ||
      r.includes("a17") ||
      r.includes("a18")
    )
      return "high";
    if (r.includes("intel") && (r.includes("hd graphics") || r.includes("uhd graphics"))) return "low";
    if (r.includes("mali") || r.includes("adreno 3") || r.includes("adreno 4") || r.includes("powervr"))
      return "low";
    if (r.includes("adreno 7") || r.includes("apple a")) return "high";
    return "mid";
  } catch {
    return "unknown";
  }
}

export function detectDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined" || typeof navigator === "undefined") return FALLBACK;

  const ua = navigator.userAgent || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|IEMobile|BlackBerry/i.test(ua);
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cores = Math.max(1, Number(navigator.hardwareConcurrency) || (isMobile ? 4 : 8));
  const memoryGb = Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) || (isMobile ? 4 : 8);

  const conn = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }
  ).connection;
  const effectiveType = conn?.effectiveType ?? null;
  const saveData = Boolean(conn?.saveData);

  const gpuHint = detectGpu();

  let score = 0;
  if (isMobile) score -= 2;
  if (cores >= 8) score += 2;
  else if (cores >= 6) score += 1;
  else if (cores <= 3) score -= 2;
  if (memoryGb >= 8) score += 2;
  else if (memoryGb >= 4) score += 1;
  else if (memoryGb <= 2) score -= 2;
  if (gpuHint === "high") score += 2;
  else if (gpuHint === "low") score -= 2;
  if (saveData) score -= 3;
  if (effectiveType === "2g" || effectiveType === "slow-2g") score -= 3;
  else if (effectiveType === "3g") score -= 1;

  let tier: PerformanceTier = "high";
  if (score <= -2) tier = "low";
  else if (score <= 2) tier = "medium";

  if (prefersReducedMotion) tier = "low";

  return {
    tier,
    prefersReducedMotion,
    isMobile,
    isCoarse,
    isFine,
    saveData,
    cores,
    memoryGb,
    effectiveType,
    gpuHint,
  };
}

export function inlineDetectScript(): string {
  return `(function(){try{
    var ua=navigator.userAgent||'';
    var m=/Mobi|Android|iPhone|iPad|iPod|IEMobile|BlackBerry/i.test(ua);
    var c=Math.max(1,Number(navigator.hardwareConcurrency)||(m?4:8));
    var mem=Number(navigator.deviceMemory)||(m?4:8);
    var conn=navigator.connection||{};
    var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var s=0;
    if(m)s-=2;
    if(c>=8)s+=2;else if(c>=6)s+=1;else if(c<=3)s-=2;
    if(mem>=8)s+=2;else if(mem>=4)s+=1;else if(mem<=2)s-=2;
    if(conn.saveData)s-=3;
    if(conn.effectiveType==='2g'||conn.effectiveType==='slow-2g')s-=3;
    else if(conn.effectiveType==='3g')s-=1;
    var t='high';
    if(s<=-2)t='low';else if(s<=2)t='medium';
    if(rm)t='low';
    document.documentElement.setAttribute('data-perf',t);
  }catch(e){document.documentElement.setAttribute('data-perf','medium');}})();`;
}
