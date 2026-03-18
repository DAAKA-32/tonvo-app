"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { useToast } from "@/components/Toast";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type InputMode = "images" | "text" | "audio";
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

function IconAudio({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
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
/*  Score helpers                                                      */
/* ------------------------------------------------------------------ */
function getScoreColor(score: number) {
  if (score >= 70) return "var(--color-positive)";
  if (score >= 40) return "var(--color-neutral)";
  return "var(--color-negative)";
}

function getToneColor(tone: string) {
  if (tone === "positive" || tone === "very_positive") return "var(--color-positive)";
  if (tone === "negative") return "var(--color-negative)";
  if (tone === "hesitant" || tone === "awkward") return "var(--color-neutral)";
  return "var(--color-text-muted)";
}

const CLASSIFICATION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  very_positive: { label: "Very Positive", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  positive: { label: "Positive", color: "#6ee7b7", bg: "rgba(110,231,183,0.12)" },
  neutral: { label: "Neutral", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  awkward: { label: "Awkward", color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  negative: { label: "Negative", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

const MODE_OPTIONS: { value: AnalysisMode; label: string }[] = [
  { value: "general", label: "General" },
  { value: "sales", label: "Sales" },
  { value: "dating", label: "Dating / Social" },
  { value: "recruitment", label: "Recruitment" },
  { value: "support", label: "Support" },
  { value: "networking", label: "Networking" },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function AnalyzePage() {
  const { t, i18n } = useTranslation();
  const toast = useToast();

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

  // Audio mode
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");

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
      toast.show("Content received — ready to analyze", { type: "success", duration: 3000 });
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
            toast.show(`${files.length} screenshot(s) received — ready to analyze`, { type: "success", duration: 3000 });
          }
        })
        .catch(() => {});
    }

    // Clean URL params without reload
    window.history.replaceState({}, "", "/analyze-text");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const audioInputRef = useRef<HTMLInputElement>(null);

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

  /* ── Audio handlers ── */
  const handleAudioSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    setTranscript("");
  }, []);

  const transcribeAudio = useCallback(async () => {
    if (!audioFile) return;
    setTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioFile);
      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json();
      if (data.text) {
        setTranscript(data.text);
        toast.show("Transcription complete", { type: "success", duration: 3000 });
      } else {
        toast.show("Transcription failed", { type: "error", duration: 4000 });
      }
    } catch {
      toast.show("Transcription failed", { type: "error", duration: 4000 });
    } finally {
      setTranscribing(false);
    }
  }, [audioFile, toast]);

  /* ── Analyze ── */
  const canAnalyze =
    (inputMode === "images" && images.length > 0) ||
    (inputMode === "text" && text.trim().length > 0) ||
    (inputMode === "audio" && transcript.trim().length > 0);

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
      } else if (inputMode === "audio") {
        formData.append("transcript", transcript);
      }

      const res = await fetch("/api/analyze-conversation", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) {
        toast.update(toastId, data.error, { type: "error", duration: 5000 });
      } else {
        setResult(data);
        toast.update(toastId, "Analysis complete", { type: "success", duration: 3000 });
      }
    } catch {
      toast.update(toastId, "Analysis failed", { type: "error", duration: 5000 });
    } finally {
      setAnalyzing(false);
    }
  }, [canAnalyze, inputMode, images, text, transcript, context, analysisMode, i18n.language, t, toast]);

  const resetAll = useCallback(() => {
    setResult(null);
    setImages([]);
    setImagePreviews([]);
    setText("");
    setAudioFile(null);
    setTranscript("");
    setContext("");
  }, []);

  /* ── Render ── */
  return (
    <AppShell>
      <div className="analyze-page">
        {/* Header */}
        <div className="mb-6">
          <h1 className="section-heading text-glow mb-1">Analyze Conversation</h1>
          <p className="body-muted text-sm m-0">
            Import screenshots, paste text, or upload audio to analyze any conversation.
          </p>
        </div>

        {/* ── Results ── */}
        {result ? (
          <div className="analyze-results">
            {/* Back button */}
            <button onClick={resetAll} className="analyze-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              New analysis
            </button>

            <ResultsView result={result} />
          </div>
        ) : (
          <>
            {/* ── Input Mode Tabs ── */}
            <div className="analyze-tabs">
              {([
                { key: "images" as InputMode, icon: <IconImage size={16} />, label: "Screenshots" },
                { key: "text" as InputMode, icon: <IconText size={16} />, label: "Text" },
                { key: "audio" as InputMode, icon: <IconAudio size={16} />, label: "Audio" },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setInputMode(tab.key)}
                  className={`analyze-tab ${inputMode === tab.key ? "active" : ""}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Image Input ── */}
            {inputMode === "images" && (
              <div className="analyze-section">
                {images.length === 0 ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="analyze-upload-zone"
                  >
                    <IconImage size={32} />
                    <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                      Tap to select screenshots
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      Select up to 10 images from your gallery
                    </span>
                  </button>
                ) : (
                  <div>
                    <div className="analyze-image-grid">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="analyze-image-thumb">
                          <img src={src} alt={`Screenshot ${i + 1}`} />
                          <button
                            onClick={() => removeImage(i)}
                            className="analyze-image-remove"
                          >
                            <IconX size={12} />
                          </button>
                        </div>
                      ))}
                      {images.length < 10 && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="analyze-image-add"
                        >
                          <IconPlus />
                        </button>
                      )}
                    </div>
                    <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                      {images.length}/10 screenshots
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
              </div>
            )}

            {/* ── Text Input ── */}
            {inputMode === "text" && (
              <div className="analyze-section">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your conversation here...&#10;&#10;Example:&#10;Me: Hey, how's it going?&#10;Them: Good! What's up?&#10;Me: Just wanted to check in about tomorrow..."
                  rows={8}
                  className="analyze-textarea"
                />
              </div>
            )}

            {/* ── Audio Input ── */}
            {inputMode === "audio" && (
              <div className="analyze-section">
                {!audioFile ? (
                  <button
                    onClick={() => audioInputRef.current?.click()}
                    className="analyze-upload-zone"
                  >
                    <IconAudio size={32} />
                    <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                      Tap to select an audio file
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      Voice notes, recordings — MP3, WAV, M4A, OGG
                    </span>
                  </button>
                ) : (
                  <div>
                    <div className="glass-card p-4 flex items-center gap-3">
                      <IconAudio size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium m-0 truncate" style={{ color: "var(--color-text)" }}>
                          {audioFile.name}
                        </p>
                        <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
                          {(audioFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => { setAudioFile(null); setTranscript(""); }}
                        className="analyze-icon-btn"
                      >
                        <IconX size={16} />
                      </button>
                    </div>

                    {!transcript && (
                      <button
                        onClick={transcribeAudio}
                        disabled={transcribing}
                        className="analyze-cta-secondary mt-3"
                      >
                        {transcribing ? "Transcribing..." : "Transcribe audio"}
                      </button>
                    )}

                    {transcript && (
                      <div className="mt-3">
                        <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-text-muted)" }}>
                          Transcript (editable)
                        </label>
                        <textarea
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          rows={6}
                          className="analyze-textarea"
                        />
                      </div>
                    )}
                  </div>
                )}
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.flac"
                  onChange={handleAudioSelect}
                  style={{ display: "none" }}
                />
              </div>
            )}

            {/* ── Context (optional) ── */}
            <div className="analyze-section">
              <label className="text-xs font-medium mb-2 block" style={{ color: "var(--color-text-muted)" }}>
                Context (optional)
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. First date conversation, Job interview follow-up..."
                className="analyze-input"
              />
            </div>

            {/* ── Mode selector ── */}
            <div className="analyze-section">
              <label className="text-xs font-medium mb-2 block" style={{ color: "var(--color-text-muted)" }}>
                Conversation type
              </label>
              <div className="analyze-mode-grid">
                {MODE_OPTIONS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setAnalysisMode(m.value)}
                    className={`analyze-mode-chip ${analysisMode === m.value ? "active" : ""}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── CTA ── */}
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || analyzing}
              className="analyze-cta"
            >
              {analyzing ? (
                <>
                  <span className="analyze-spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <IconArrowUp size={18} />
                  Analyze conversation
                </>
              )}
            </button>

            {/* ── Privacy note ── */}
            <p className="text-xs text-center mt-4" style={{ color: "var(--color-text-muted)", opacity: 0.5 }}>
              Your content is analyzed securely and not stored permanently.
            </p>
          </>
        )}
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Results View                                                       */
/* ------------------------------------------------------------------ */
function ResultsView({ result }: { result: AnalysisResult }) {
  const cls = CLASSIFICATION_CONFIG[result.classification] || CLASSIFICATION_CONFIG.neutral;

  return (
    <div className="analyze-results-inner">
      {/* Score hero */}
      <div className="analyze-score-hero">
        <div className="analyze-score-ring" style={{ borderColor: getScoreColor(result.score.overall) }}>
          <span className="analyze-score-value" style={{ color: getScoreColor(result.score.overall) }}>
            {result.score.overall}
          </span>
          <span className="analyze-score-label">overall</span>
        </div>
        <span
          className="analyze-classification-badge"
          style={{ backgroundColor: cls.bg, color: cls.color }}
        >
          {cls.label}
        </span>
      </div>

      {/* Sub-scores */}
      <div className="analyze-scores-grid">
        {[
          { label: "Engagement", value: result.score.engagement },
          { label: "Tone", value: result.score.tone },
          { label: "Fluidity", value: result.score.fluidity },
          { label: "Interest", value: result.score.interest },
          { label: "Social", value: result.socialScore },
        ].map((s) => (
          <div key={s.label} className="analyze-score-item">
            <div className="analyze-score-bar-track">
              <div
                className="analyze-score-bar-fill"
                style={{ width: `${s.value}%`, backgroundColor: getScoreColor(s.value) }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.label}</span>
              <span className="text-xs font-bold" style={{ color: getScoreColor(s.value) }}>{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnosis */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-accent-light)" }}>
          Diagnosis
        </h3>
        <p className="text-sm m-0" style={{ color: "var(--color-text)", lineHeight: 1.6 }}>
          {result.diagnosis}
        </p>
      </div>

      {/* Tone Timeline */}
      {result.toneTimeline && result.toneTimeline.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-accent-light)" }}>
            Tone Flow
          </h3>
          <div className="space-y-2">
            {result.toneTimeline.map((entry, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: getToneColor(entry.tone) }}
                />
                <div className="min-w-0">
                  <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                    {entry.speaker}
                  </span>
                  <p className="text-xs m-0 mt-0.5" style={{ color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                    &ldquo;{entry.excerpt}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speaker Breakdown */}
      {result.speakerBreakdown?.speakers && result.speakerBreakdown.speakers.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-accent-light)" }}>
            Speakers
          </h3>
          <div className="space-y-3">
            {result.speakerBreakdown.speakers.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    backgroundColor: getToneColor(s.dominantTone) + "18",
                    color: getToneColor(s.dominantTone),
                  }}
                >
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{s.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      backgroundColor: "rgba(200,200,216,0.08)",
                      color: "var(--color-text-muted)",
                    }}>{s.style}</span>
                  </div>
                  <div className="analyze-score-bar-track mt-1">
                    <div
                      className="analyze-score-bar-fill"
                      style={{ width: `${Math.round(s.talkRatio * 100)}%`, backgroundColor: getToneColor(s.dominantTone) }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--color-text-muted)" }}>
                  {Math.round(s.talkRatio * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Points */}
      {result.keyPoints?.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-accent-light)" }}>
            Key Points
          </h3>
          <ul className="space-y-2 m-0 pl-0" style={{ listStyle: "none" }}>
            {result.keyPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0" style={{ color: "var(--color-accent-light)" }}>
                  <IconCheck size={14} />
                </span>
                <span className="text-sm" style={{ color: "var(--color-text)", lineHeight: 1.5 }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Insights */}
      {result.insights?.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-accent-light)" }}>
            Insights
          </h3>
          <div className="space-y-2">
            {result.insights.map((ins, i) => (
              <p key={i} className="text-sm m-0" style={{ color: "var(--color-text)", lineHeight: 1.6 }}>
                {ins}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Signals */}
      {result.signals?.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-accent-light)" }}>
            Signals Detected
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.signals.map((s, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{
                  backgroundColor: s.type === "opportunity" || s.type === "agreement"
                    ? "rgba(52,211,153,0.12)" : s.type === "objection" || s.type === "hesitation"
                    ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.12)",
                  color: s.type === "opportunity" || s.type === "agreement"
                    ? "var(--color-positive)" : s.type === "objection" || s.type === "hesitation"
                    ? "var(--color-negative)" : "var(--color-neutral)",
                }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {result.strengths?.length > 0 && (
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-positive)" }}>
              Strengths
            </h3>
            <ul className="space-y-1.5 m-0 pl-0" style={{ listStyle: "none" }}>
              {result.strengths.map((s, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--color-text)", lineHeight: 1.5 }}>
                  <span className="mt-0.5 shrink-0" style={{ color: "var(--color-positive)" }}>+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {result.improvements?.length > 0 && (
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-neutral)" }}>
              Improvements
            </h3>
            <ul className="space-y-1.5 m-0 pl-0" style={{ listStyle: "none" }}>
              {result.improvements.map((s, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--color-text)", lineHeight: 1.5 }}>
                  <span className="mt-0.5 shrink-0" style={{ color: "var(--color-neutral)" }}>~</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendation */}
      {result.recommendation && (
        <div className="glass-card p-4" style={{ borderLeft: "2px solid var(--color-accent-light)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-accent-light)" }}>
            Recommendation
          </h3>
          <p className="text-sm m-0" style={{ color: "var(--color-text)", lineHeight: 1.6 }}>
            {result.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
