"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { authFetchFormData } from "@/lib/api-client";
import AppShell from "@/components/AppShell";
import { useToast } from "@/components/Toast";
import CountUp from "@/components/motion/CountUp";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type InputMode = "images" | "text";
type AnalysisMode = "general" | "sales" | "recruitment" | "support" | "networking" | "dating";

interface AnalysisScore {
  overall: number;
  engagement: number;
  tone: number;
  fluidity: number;
  interest: number;
}

interface Signal {
  type: string;
  label: string;
}

interface ToneTimelineEntry {
  speaker: string;
  tone: string;
  excerpt: string;
}

interface SpeakerInfo {
  name: string;
  talkRatio: number;
  dominantTone: string;
  style: string;
}

interface AnalysisResult {
  overallTone: string;
  classification: string;
  score: AnalysisScore;
  keyPoints: string[];
  insights: string[];
  recommendation: string;
  diagnosis: string;
  strengths: string[];
  improvements: string[];
  signals: Signal[];
  socialScore: number;
  toneTimeline: ToneTimelineEntry[];
  speakerBreakdown?: { speakers: SpeakerInfo[] };
}

/* ------------------------------------------------------------------ */
/*  Inline Icons                                                       */
/* ------------------------------------------------------------------ */
function IconImage({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconText({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
    </svg>
  );
}


function IconPlus() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrowUp({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Score helpers — vibrant green / orange / red                       */
/* ------------------------------------------------------------------ */
function getScoreColor(score: number) {
  if (score >= 70) return "var(--color-positive)";
  if (score >= 40) return "#fb923c";
  return "var(--color-negative)";
}

function getScoreRgba(score: number) {
  if (score >= 70) return "52, 211, 153";
  if (score >= 40) return "251, 146, 60";
  return "239, 68, 68";
}

function getToneColor(tone: string) {
  if (tone === "positive" || tone === "very_positive") return "var(--color-positive)";
  if (tone === "negative") return "var(--color-negative)";
  if (tone === "hesitant" || tone === "awkward") return "#fb923c";
  return "var(--color-text-muted)";
}

const CLASSIFICATION_STYLES: Record<string, { key: string; color: string; bg: string; border: string }> = {
  very_positive: { key: "analyzePage.veryPositive", color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.14)", border: "rgba(52, 211, 153, 0.3)" },
  positive:      { key: "analyzePage.positive",      color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.10)", border: "rgba(52, 211, 153, 0.24)" },
  neutral:       { key: "analyzePage.neutral",       color: "#fb923c", bg: "rgba(251, 146, 60, 0.10)", border: "rgba(251, 146, 60, 0.24)" },
  awkward:       { key: "analyzePage.awkward",       color: "#fb923c", bg: "rgba(251, 146, 60, 0.14)", border: "rgba(251, 146, 60, 0.30)" },
  negative:      { key: "analyzePage.negative",      color: "var(--color-negative)", bg: "rgba(239, 68, 68, 0.12)",  border: "rgba(239, 68, 68, 0.28)" },
};

const MODE_KEYS: { value: AnalysisMode; key: string }[] = [
  { value: "general", key: "analyzePage.modeGeneral" },
  { value: "sales", key: "analyzePage.modeSales" },
  { value: "dating", key: "analyzePage.modeDating" },
  { value: "recruitment", key: "analyzePage.modeRecruitment" },
  { value: "support", key: "analyzePage.modeSupport" },
  { value: "networking", key: "analyzePage.modeNetworking" },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function AnalyzePage() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const reduce = useReducedMotion();

  // State
  const [inputMode, setInputMode] = useState<InputMode>("images");
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("general");
  const [context, setContext] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Image mode
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text mode
  const [text, setText] = useState("");


  // Handle shared content from PWA Share Target
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("shared");
    if (shared !== "true") return;

    const sharedText = params.get("text");
    const sharedKey = params.get("key");

    if (sharedText) {
      setText(decodeURIComponent(sharedText));
      setInputMode("text");
      toast.show(t("analyzePage.contentReceived"), { type: "success", duration: 3000 });
    } else if (sharedKey) {
      // Fetch shared images from cache
      fetch(`/api/share-target?key=${sharedKey}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.images && data.images.length > 0) {
            const files: File[] = [];
            const previews: string[] = [];
            data.images.forEach((img: { data: string; mimeType: string }, i: number) => {
              const byteString = atob(img.data);
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let j = 0; j < byteString.length; j++) ia[j] = byteString.charCodeAt(j);
              const file = new File([ab], `shared-${i + 1}.jpg`, { type: img.mimeType });
              files.push(file);
              previews.push(`data:${img.mimeType};base64,${img.data}`);
            });
            setImages(files);
            setImagePreviews(previews);
            setInputMode("images");
            toast.show(t("analyzePage.screenshotsReceived", { count: files.length }), { type: "success", duration: 3000 });
          }
        })
        .catch(() => {});
    }

    // Clean URL params without reload
    window.history.replaceState({}, "", "/analyze-text");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* ── Image handlers ── */
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = [...images, ...files].slice(0, 10);
    setImages(newImages);

    // Generate previews
    const newPreviews = [...imagePreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPreviews.push(ev.target?.result as string);
        setImagePreviews([...newPreviews].slice(0, 10));
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [images, imagePreviews]);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /* ── Analyze ── */
  const canAnalyze =
    (inputMode === "images" && images.length > 0) ||
    (inputMode === "text" && text.trim().length > 0);

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setResult(null);

    const toastId = toast.show(t("common.analyzing"), { type: "processing" });

    try {
      const formData = new FormData();
      formData.append("type", inputMode);
      formData.append("language", i18n.language);
      formData.append("mode", analysisMode);
      if (context.trim()) formData.append("context", context.trim());

      if (inputMode === "images") {
        images.forEach((img) => formData.append("images", img));
      } else if (inputMode === "text") {
        formData.append("text", text);
      }

      const res = await authFetchFormData("/api/analyze-conversation", formData, { method: "POST" });
      const data = await res.json();

      if (data.error) {
        toast.update(toastId, data.error, { type: "error", duration: 5000 });
      } else {
        setResult(data);
        toast.update(toastId, t("analyzePage.analysisComplete"), { type: "success", duration: 3000 });
      }
    } catch {
      toast.update(toastId, t("analyzePage.analysisFailed"), { type: "error", duration: 5000 });
    } finally {
      setAnalyzing(false);
    }
  }, [canAnalyze, inputMode, images, text, context, analysisMode, i18n.language, t, toast]);

  const resetAll = useCallback(() => {
    setResult(null);
    setImages([]);
    setImagePreviews([]);
    setText("");
    setContext("");
  }, []);

  /* ── Render ── */
  return (
    <AppShell>
      <div style={{ position: "relative", maxWidth: 880, margin: "0 auto", paddingBottom: 80 }}>
        {/* Ambient orb */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: -130,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: result
              ? `radial-gradient(circle, rgba(${getScoreRgba(result.score.overall)}, 0.10), transparent 65%)`
              : "radial-gradient(circle, color-mix(in srgb, var(--color-text) 5%, transparent), transparent 65%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
            transition: "background 0.7s ease",
          }}
          animate={reduce ? undefined : { x: [-15, 15, -15], y: [-12, 12, -12] }}
          transition={reduce ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* ========== HERO ========== */}
          {!result && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="mb-7"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="relative inline-flex w-1.5 h-1.5">
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--color-text) 85%, transparent)",
                      opacity: 0.5,
                      animation: "pulseRing 2.4s ease-in-out infinite",
                    }}
                  />
                  <span
                    className="relative w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "color-mix(in srgb, var(--color-text) 90%, transparent)" }}
                  />
                </span>
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Conversation analysis
                </span>
              </div>

              <motion.h1
                className="m-0"
                animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }
                style={{
                  fontSize: "clamp(32px, 5.4vw, 56px)",
                  fontWeight: 200,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.05,
                  background:
                    "linear-gradient(115deg, var(--color-text) 0%, var(--color-text) 30%, var(--color-text-silver) 50%, var(--color-text) 70%, var(--color-text) 100%)",
                  backgroundSize: "240% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("analyzePage.title")}
              </motion.h1>
              <p
                className="text-sm mt-2 m-0"
                style={{ color: "var(--color-text-muted)", maxWidth: 480 }}
              >
                {t("analyzePage.subtitle")}
              </p>
            </motion.div>
          )}

          {result ? (
            <>
              {/* Back button */}
              <motion.button
                onClick={resetAll}
                whileHover={{ x: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="inline-flex items-center gap-1.5 mb-6 text-[11px] uppercase tracking-[0.18em] no-underline cursor-pointer"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-text-muted)",
                  padding: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t("analyzePage.newAnalysis")}
              </motion.button>

              <ResultsView result={result} t={t} reduce={reduce} />
            </>
          ) : (
            <>
              {/* ── Segmented input mode tabs ── */}
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
                className="relative inline-flex items-center p-1 rounded-full mb-5"
                style={{
                  background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                }}
              >
                {([
                  { key: "images" as InputMode, icon: <IconImage size={14} />, label: t("analyzePage.screenshots") },
                  { key: "text" as InputMode, icon: <IconText size={14} />, label: t("analyzePage.text") },
                ]).map((tab) => {
                  const active = inputMode === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setInputMode(tab.key)}
                      className="relative inline-flex items-center gap-2 text-[11px] font-medium px-4 py-2 rounded-full cursor-pointer whitespace-nowrap"
                      style={{
                        color: active ? "var(--color-text)" : "var(--color-text-muted)",
                        transition: "color 0.2s ease",
                        zIndex: 1,
                      }}
                    >
                      {active && (
                        <motion.span
                          layoutId="analyze-input-mode-pill"
                          aria-hidden
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 10%, transparent), color-mix(in srgb, var(--color-text) 4%, transparent))",
                            border: "1px solid color-mix(in srgb, var(--color-text) 14%, transparent)",
                            boxShadow: "0 6px 20px -8px rgba(0, 0, 0, 0.5)",
                            zIndex: -1,
                          }}
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative inline-flex items-center gap-2">
                        {tab.icon}
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </motion.div>

              {/* ── Image Input ── */}
              {inputMode === "images" && (
                <motion.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="mb-5"
                >
                  {images.length === 0 ? (
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ y: -2, scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      className="relative w-full overflow-hidden rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer text-center"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 4%, transparent) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                        border: "1px dashed color-mix(in srgb, var(--color-text) 15%, transparent)",
                        padding: "44px 24px",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                      }}
                    >
                      <span
                        aria-hidden
                        className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none"
                        style={{
                          background: "radial-gradient(circle, color-mix(in srgb, var(--color-text) 10%, transparent), transparent 70%)",
                          filter: "blur(28px)",
                          opacity: 0.5,
                        }}
                      />
                      <span
                        className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl"
                        style={{
                          background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                          color: "var(--color-text-silver)",
                        }}
                      >
                        <IconImage size={26} />
                      </span>
                      <span className="relative text-sm font-medium" style={{ color: "var(--color-text)" }}>
                        {t("analyzePage.tapScreenshots")}
                      </span>
                      <span
                        className="relative text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {t("analyzePage.selectUpTo10")}
                      </span>
                    </motion.button>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                        {imagePreviews.map((src, i) => (
                          <div
                            key={i}
                            className="relative aspect-square overflow-hidden rounded-2xl group"
                            style={{ border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)" }}
                          >
                            <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              style={{
                                background: "rgba(0, 0, 0, 0.7)",
                                border: "1px solid color-mix(in srgb, var(--color-text) 15%, transparent)",
                                color: "#fafafa",
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              <IconX size={11} />
                            </button>
                          </div>
                        ))}
                        {images.length < 10 && (
                          <motion.button
                            onClick={() => fileInputRef.current?.click()}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            className="aspect-square rounded-2xl flex items-center justify-center cursor-pointer"
                            style={{
                              background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                              border: "1px dashed color-mix(in srgb, var(--color-text) 12%, transparent)",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            <IconPlus />
                          </motion.button>
                        )}
                      </div>
                      <p
                        className="text-[10px] uppercase tracking-[0.18em] mt-3 m-0"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {t("analyzePage.screenshotCount", { count: images.length })}
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                  />
                </motion.div>
              )}

              {/* ── Text Input ── */}
              {inputMode === "text" && (
                <motion.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="mb-5 relative overflow-hidden rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 4%, transparent) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                    border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t("analyzePage.textPlaceholder")}
                    rows={9}
                    className="w-full block resize-none text-sm leading-relaxed"
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "var(--color-text)",
                      padding: "16px 18px",
                      fontFamily: "inherit",
                    }}
                  />
                </motion.div>
              )}

              {/* ── Context (optional) ── */}
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 }}
                className="mb-5"
              >
                <label
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2 block"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {t("analyzePage.contextLabel")}
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={t("analyzePage.contextPlaceholder")}
                  className="w-full text-sm rounded-full"
                  style={{
                    paddingLeft: 16,
                    paddingRight: 16,
                    height: 44,
                    background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                    color: "var(--color-text)",
                    outline: "none",
                    transition: "border-color 0.2s ease, background 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-text) 18%, transparent)";
                    e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 4%, transparent)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-text) 6%, transparent)";
                    e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 2.5%, transparent)";
                  }}
                />
              </motion.div>

              {/* ── Mode selector ── */}
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
                className="mb-7"
              >
                <label
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3 block"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {t("analyzePage.conversationType")}
                </label>
                <div
                  className="relative inline-flex items-center p-1 rounded-full overflow-x-auto"
                  style={{
                    background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                    scrollbarWidth: "none",
                    maxWidth: "100%",
                  }}
                >
                  {MODE_KEYS.map((m) => {
                    const active = analysisMode === m.value;
                    return (
                      <button
                        key={m.value}
                        onClick={() => setAnalysisMode(m.value)}
                        className="relative text-[11px] font-medium px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap"
                        style={{
                          color: active ? "var(--color-text)" : "var(--color-text-muted)",
                          transition: "color 0.2s ease",
                          zIndex: 1,
                        }}
                      >
                        {active && (
                          <motion.span
                            layoutId="analyze-mode-pill"
                            aria-hidden
                            className="absolute inset-0 rounded-full"
                            style={{
                              background:
                                "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 10%, transparent), color-mix(in srgb, var(--color-text) 4%, transparent))",
                              border: "1px solid color-mix(in srgb, var(--color-text) 14%, transparent)",
                              boxShadow: "0 6px 20px -8px rgba(0, 0, 0, 0.5)",
                              zIndex: -1,
                            }}
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative">{t(m.key)}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── Broadcast CTA ── */}
              <motion.button
                onClick={handleAnalyze}
                disabled={!canAnalyze || analyzing}
                whileHover={canAnalyze && !analyzing ? { y: -3 } : undefined}
                whileTap={canAnalyze && !analyzing ? { scale: 0.97 } : undefined}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex items-center gap-3 sm:gap-4 px-5 py-4 sm:pl-5 sm:pr-7 sm:py-5 rounded-[28px] overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                style={{
                  background:
                    canAnalyze && !analyzing
                      ? "linear-gradient(135deg, rgba(52, 211, 153, 0.20) 0%, color-mix(in srgb, var(--color-text) 4%, transparent) 100%)"
                      : "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                  border:
                    canAnalyze && !analyzing
                      ? "1px solid rgba(52, 211, 153, 0.4)"
                      : "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                  boxShadow:
                    canAnalyze && !analyzing
                      ? "0 30px 70px -25px rgba(52, 211, 153, 0.55), inset 0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent)"
                      : "none",
                  color: "var(--color-text)",
                  minWidth: 240,
                  minHeight: 80,
                }}
              >
                <span
                  className="relative shrink-0 inline-flex items-center justify-center"
                  style={{ width: 56, height: 56 }}
                >
                  {canAnalyze && !analyzing
                    ? [0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          aria-hidden
                          className="absolute rounded-full"
                          style={{
                            width: 56,
                            height: 56,
                            border: "1px solid rgba(52, 211, 153, 0.6)",
                          }}
                          animate={{ scale: [0.35, 1.15], opacity: [0.6, 0] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.7 }}
                        />
                      ))
                    : null}
                  <span
                    aria-hidden
                    className="absolute rounded-full"
                    style={{
                      width: 28,
                      height: 28,
                      background:
                        canAnalyze && !analyzing
                          ? "radial-gradient(circle, rgba(52, 211, 153, 0.5) 0%, rgba(52, 211, 153, 0.1) 60%, transparent 100%)"
                          : "color-mix(in srgb, var(--color-text) 4%, transparent)",
                      filter: canAnalyze && !analyzing ? "blur(2px)" : undefined,
                    }}
                  />
                  {analyzing ? (
                    <motion.span
                      aria-hidden
                      className="relative inline-flex items-center justify-center rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: 14,
                        height: 14,
                        border: "1.5px solid color-mix(in srgb, var(--color-text) 15%, transparent)",
                        borderTopColor: "color-mix(in srgb, var(--color-text) 85%, transparent)",
                      }}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="relative rounded-full inline-flex items-center justify-center"
                      style={{
                        width: 14,
                        height: 14,
                        background:
                          canAnalyze
                            ? "linear-gradient(180deg, #34d399 0%, #059669 100%)"
                            : "color-mix(in srgb, var(--color-text) 20%, transparent)",
                        boxShadow: canAnalyze
                          ? "0 0 16px rgba(52, 211, 153, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.2)"
                          : "none",
                        color: "#0a0a0a",
                      }}
                    >
                      <IconArrowUp size={9} />
                    </span>
                  )}
                </span>
                <span className="flex flex-col items-start gap-0.5 min-w-0">
                  <span
                    className="text-[10px] uppercase tracking-[0.22em]"
                    style={{
                      color:
                        canAnalyze && !analyzing
                          ? "rgba(110, 231, 183, 0.85)"
                          : "var(--color-text-muted)",
                    }}
                  >
                    {analyzing ? "Working" : "Ready"}
                  </span>
                  <span className="text-base sm:text-lg font-medium leading-tight">
                    {analyzing ? t("analyzePage.analyzingBtn") : t("analyzePage.analyzeBtn")}
                  </span>
                </span>
              </motion.button>

              {/* ── Privacy note ── */}
              <p
                className="text-[10px] uppercase tracking-[0.18em] text-center mt-5 m-0"
                style={{ color: "var(--color-text-muted)", opacity: 0.55 }}
              >
                {t("analyzePage.privacyNote")}
              </p>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Score Ring — vibrant glow                                          */
/* ------------------------------------------------------------------ */
function ScoreRing({ value, reduce, size = 144 }: { value: number; reduce: boolean | null; size?: number }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashLen = (Math.min(Math.max(value, 0), 100) / 100) * circumference;
  const color = getScoreColor(value);
  const rgba = getScoreRgba(value);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", overflow: "visible" }}
      >
        <defs>
          <filter id={`analyze-glow-${value}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="color-mix(in srgb, var(--color-text) 5%, transparent)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={reduce ? undefined : { strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${dashLen} ${circumference}` }}
          transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.3 }}
          style={{ filter: `url(#analyze-glow-${value})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-extralight tabular-nums leading-none"
          animate={reduce ? undefined : { opacity: [0.92, 1, 0.92] }}
          transition={
            reduce ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.6 }
          }
          style={{
            fontSize: "clamp(40px, 5vw, 56px)",
            color,
            letterSpacing: "-0.04em",
            textShadow: `0 0 24px rgba(${rgba}, 0.35), 0 0 4px rgba(${rgba}, 0.4)`,
          }}
        >
          <CountUp value={value} duration={1.4} />
        </motion.span>
        <span
          className="text-[10px] uppercase tracking-[0.18em] mt-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          / 100
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact Score Bar                                                  */
/* ------------------------------------------------------------------ */
function ScoreBar({ label, value, delay = 0, reduce }: { label: string; value: number; delay?: number; reduce: boolean | null }) {
  const color = getScoreColor(value);
  const rgba = getScoreRgba(value);
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span
        className="text-[10px] uppercase tracking-[0.16em] shrink-0 truncate"
        style={{ color: "var(--color-text-muted)", width: 90 }}
      >
        {label}
      </span>
      <div className="flex-1 relative rounded-full overflow-hidden" style={{ height: 4, background: "color-mix(in srgb, var(--color-text) 4%, transparent)" }}>
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          initial={reduce ? { width: `${value}%` } : { width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: EASE_OUT, delay: delay + 0.4 }}
          style={{
            background: `linear-gradient(90deg, ${color}, rgba(${rgba}, 0.7))`,
            boxShadow: `0 0 12px rgba(${rgba}, 0.45)`,
          }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums shrink-0 text-right" style={{ color, width: 28 }}>
        <CountUp value={value} duration={1} />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Glass card with halo                                                */
/* ------------------------------------------------------------------ */
function GlassPanel({
  children,
  rgba = "255, 255, 255",
  opacity = 0.05,
  haloOpacity = 0.16,
  delay = 0,
  reduce,
  className = "",
}: {
  children: React.ReactNode;
  rgba?: string;
  opacity?: number;
  haloOpacity?: number;
  delay?: number;
  reduce: boolean | null;
  className?: string;
}) {
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(${rgba}, ${opacity}) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)`,
        border: `1px solid rgba(${rgba}, ${rgba === "255, 255, 255" ? 0.06 : 0.18})`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <span
        aria-hidden
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${rgba}, ${haloOpacity}), transparent 70%)`,
          filter: "blur(28px)",
          opacity: 0.55,
        }}
      />
      <div className="relative p-5">{children}</div>
    </motion.div>
  );
}

function PanelLabel({ children, color = "var(--color-text-muted)", dotColor }: { children: React.ReactNode; color?: string; dotColor?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {dotColor && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />}
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color }}>
        {children}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Results View                                                       */
/* ------------------------------------------------------------------ */
function ResultsView({ result, t, reduce }: { result: AnalysisResult; t: (key: string, opts?: Record<string, unknown>) => string; reduce: boolean | null }) {
  const style = CLASSIFICATION_STYLES[result.classification] || CLASSIFICATION_STYLES.neutral;
  const rgba = getScoreRgba(result.score.overall);

  return (
    <div className="space-y-4">
      {/* ─── HERO: classification + score ring + sub-scores ─── */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-2xl p-5 sm:p-6"
        style={{
          background: "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 4%, transparent) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
          border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <span
          aria-hidden
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(${rgba}, 0.22), transparent 70%)`,
            filter: "blur(32px)",
            opacity: 0.7,
          }}
        />

        <div className="relative">
          {/* classification eyebrow */}
          <div className="flex items-center gap-2.5 mb-5 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-[0.22em] font-semibold px-3 py-1 rounded-full"
              style={{
                backgroundColor: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`,
              }}
            >
              {t(style.key)}
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.22em] font-semibold"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("analyzePage.overall")} score
            </span>
          </div>

          {/* ring + bars */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            <div className="shrink-0">
              <ScoreRing value={result.score.overall} reduce={reduce} />
            </div>
            <div className="flex-1 min-w-0 w-full grid gap-3 self-center">
              <ScoreBar label={t("analyzePage.engagement")} value={result.score.engagement} delay={0.0} reduce={reduce} />
              <ScoreBar label={t("analyzePage.tone")} value={result.score.tone} delay={0.05} reduce={reduce} />
              <ScoreBar label={t("analyzePage.fluidity")} value={result.score.fluidity} delay={0.1} reduce={reduce} />
              <ScoreBar label={t("analyzePage.interest")} value={result.score.interest} delay={0.15} reduce={reduce} />
              <ScoreBar label={t("analyzePage.social")} value={result.socialScore} delay={0.2} reduce={reduce} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── DIAGNOSIS (violet AI accent) ─── */}
      {result.diagnosis && (
        <GlassPanel rgba="167, 139, 250" opacity={0.05} haloOpacity={0.22} delay={0.1} reduce={reduce}>
          <PanelLabel color="var(--color-text-muted)" dotColor="var(--shimmer-accent-1)">
            {t("analyzePage.diagnosis")}
          </PanelLabel>
          <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
            {result.diagnosis}
          </p>
        </GlassPanel>
      )}

      {/* ─── TONE TIMELINE ─── */}
      {result.toneTimeline && result.toneTimeline.length > 0 && (
        <GlassPanel delay={0.15} reduce={reduce}>
          <PanelLabel dotColor="color-mix(in srgb, var(--color-text) 70%, transparent)">{t("analyzePage.toneFlow")}</PanelLabel>
          <div className="space-y-3 relative">
            <span
              aria-hidden
              className="absolute left-1 top-2 bottom-2 w-px"
              style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-text) 6%, transparent), transparent)" }}
            />
            {result.toneTimeline.map((entry, i) => {
              const c = getToneColor(entry.tone);
              return (
                <motion.div
                  key={i}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.25 + i * 0.04 }}
                  className="relative flex items-start gap-3 pl-4"
                >
                  <span
                    className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: c,
                      boxShadow: `0 0 12px ${c}90`,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.16em] mr-2"
                      style={{ color: c }}
                    >
                      {entry.speaker}
                    </span>
                    <p
                      className="text-xs m-0 mt-0.5 leading-relaxed italic"
                      style={{ color: "var(--color-text-silver)" }}
                    >
                      &ldquo;{entry.excerpt}&rdquo;
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassPanel>
      )}

      {/* ─── SPEAKER BREAKDOWN ─── */}
      {result.speakerBreakdown?.speakers && result.speakerBreakdown.speakers.length > 0 && (
        <GlassPanel delay={0.2} reduce={reduce}>
          <PanelLabel dotColor="color-mix(in srgb, var(--color-text) 70%, transparent)">{t("analyzePage.speakers")}</PanelLabel>
          <div className="space-y-4">
            {result.speakerBreakdown.speakers.map((s, i) => {
              const c = getToneColor(s.dominantTone);
              const ratio = Math.round(s.talkRatio * 100);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-semibold shrink-0"
                    style={{
                      background: `${c}1c`,
                      color: c,
                      border: `1px solid ${c}40`,
                    }}
                  >
                    {s.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                        {s.name}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
                        style={{
                          background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {s.style}
                      </span>
                    </div>
                    <div
                      className="relative rounded-full overflow-hidden"
                      style={{ height: 4, background: "color-mix(in srgb, var(--color-text) 4%, transparent)" }}
                    >
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-full"
                        initial={reduce ? { width: `${ratio}%` } : { width: 0 }}
                        animate={{ width: `${ratio}%` }}
                        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.3 + i * 0.06 }}
                        style={{
                          background: c,
                          boxShadow: `0 0 12px ${c}80`,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="text-xs font-medium tabular-nums shrink-0"
                    style={{ color: "var(--color-text)" }}
                  >
                    {ratio}%
                  </span>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      )}

      {/* ─── KEY POINTS ─── */}
      {result.keyPoints?.length > 0 && (
        <GlassPanel delay={0.25} reduce={reduce}>
          <PanelLabel dotColor="color-mix(in srgb, var(--color-text) 70%, transparent)">{t("analyzePage.keyPoints")}</PanelLabel>
          <ul className="space-y-3 m-0 pl-0" style={{ listStyle: "none" }}>
            {result.keyPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5"
                  style={{
                    background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                    color: "color-mix(in srgb, var(--color-text) 85%, transparent)",
                  }}
                >
                  <IconCheck size={11} />
                </span>
                <span className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </GlassPanel>
      )}

      {/* ─── INSIGHTS (numbered, violet gradient) ─── */}
      {result.insights?.length > 0 && (
        <GlassPanel rgba="167, 139, 250" opacity={0.05} haloOpacity={0.22} delay={0.3} reduce={reduce}>
          <PanelLabel color="var(--color-text-muted)" dotColor="var(--shimmer-accent-1)">
            {t("analyzePage.insights")}
          </PanelLabel>
          <div className="grid gap-3">
            {result.insights.map((ins, i) => (
              <motion.div
                key={i}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.4 + i * 0.06 }}
                className="flex items-start gap-4"
              >
                <span
                  className="text-2xl font-extralight tabular-nums shrink-0 leading-none -mt-0.5"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--shimmer-accent-1) 0%, rgba(167, 139, 250, 0.5) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed m-0" style={{ color: "var(--color-text-silver)" }}>
                  {ins}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* ─── SIGNALS ─── */}
      {result.signals?.length > 0 && (
        <GlassPanel delay={0.35} reduce={reduce}>
          <PanelLabel dotColor="color-mix(in srgb, var(--color-text) 70%, transparent)">{t("analyzePage.signalsDetected")}</PanelLabel>
          <div className="flex flex-wrap gap-2">
            {result.signals.map((s, i) => {
              const isPositive = s.type === "opportunity" || s.type === "agreement";
              const isNegative = s.type === "objection" || s.type === "hesitation";
              const sigColor = isPositive ? "var(--color-positive)" : isNegative ? "var(--color-negative)" : "#fb923c";
              const sigRgba = isPositive ? "52, 211, 153" : isNegative ? "239, 68, 68" : "251, 146, 60";
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full"
                  style={{
                    background: `rgba(${sigRgba}, 0.10)`,
                    color: sigColor,
                    border: `1px solid rgba(${sigRgba}, 0.28)`,
                  }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: sigColor }} />
                  {s.label}
                </span>
              );
            })}
          </div>
        </GlassPanel>
      )}

      {/* ─── STRENGTHS / IMPROVEMENTS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.strengths?.length > 0 && (
          <GlassPanel rgba="52, 211, 153" opacity={0.06} haloOpacity={0.22} delay={0.4} reduce={reduce}>
            <PanelLabel color="var(--color-positive)" dotColor="var(--color-positive)">
              {t("analyzePage.strengths")}
            </PanelLabel>
            <ul className="space-y-2.5 m-0 pl-0" style={{ listStyle: "none" }}>
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5"
                    style={{
                      background: "rgba(52, 211, 153, 0.12)",
                      border: "1px solid rgba(52, 211, 153, 0.25)",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        )}
        {result.improvements?.length > 0 && (
          <GlassPanel rgba="251, 146, 60" opacity={0.06} haloOpacity={0.22} delay={0.45} reduce={reduce}>
            <PanelLabel color="#fb923c" dotColor="#fb923c">
              {t("analyzePage.improvements")}
            </PanelLabel>
            <ul className="space-y-2.5 m-0 pl-0" style={{ listStyle: "none" }}>
              {result.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5"
                    style={{
                      background: "rgba(251, 146, 60, 0.12)",
                      border: "1px solid rgba(251, 146, 60, 0.28)",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </span>
                  <span className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        )}
      </div>

      {/* ─── RECOMMENDATION ─── */}
      {result.recommendation && (
        <GlassPanel rgba="52, 211, 153" opacity={0.08} haloOpacity={0.25} delay={0.5} reduce={reduce}>
          <div className="flex items-start gap-3">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0"
              style={{
                background: "rgba(52, 211, 153, 0.15)",
                border: "1px solid rgba(52, 211, 153, 0.3)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em] block mb-2"
                style={{ color: "var(--color-positive)" }}
              >
                {t("analyzePage.recommendation")}
              </span>
              <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                {result.recommendation}
              </p>
            </div>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
