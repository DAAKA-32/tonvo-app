"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { authFetch, authFetchFormData } from "@/lib/api-client";
import { AudioCaptureService, type CaptureOptions } from "@/services/audio-capture";
import { LiveSpeechService } from "@/services/live-speech";
import { supabase } from "@/lib/supabase";
import AppShell from "@/components/AppShell";
import { useToast } from "@/components/Toast";
import ToneIndicator from "@/components/ToneIndicator";
import AudioWave from "@/components/AudioWave";
import SuggestionCard from "@/components/SuggestionCard";
import SmartCopilotOverlay, { type PrepData } from "@/components/SmartCopilotOverlay";
import CopilotPiP, { type CopilotPiPHandle, type CopilotPiPLabels } from "@/components/CopilotPiP";
import CopilotInline from "@/components/CopilotInline";
import UpgradePrompt from "@/components/UpgradePrompt";
import { usePlan } from "@/hooks/usePlan";
import { useParticipants } from "@/hooks/useParticipants";
import type {
  Tone,
  TranscriptSegment,
  ToneResult,
  ConversationSignal,
  ConversationClassification,
  ConversationMode,
  KeyMoment,
  SpeakerSegment,
  TimelineEvent,
  DetectedQuestion,
} from "@/types/analysis";

interface ScreenAnalysis {
  context: string;
  mood: string;
  insight: string;
  contentType: string;
  analysisComplete?: boolean;
  chatMetrics?: {
    visibleMessageCount: number;
    lastMessageSender: "user" | "other" | "unknown";
    averageMessageLength: "short" | "medium" | "long";
    responseGapDetected: boolean;
    emojiReactionPresent: boolean;
    messageLengthAsymmetry: "balanced" | "user_longer" | "other_longer";
  };
}

interface ScreenSummaryResult {
  attractionScore: number;
  conversationTone: string;
  summary: string;
  keyInsights: string[];
  strengths: string[];
  improvements: string[];
  recommendation: string;
}

// Static color/bg configs — labels are translated inside the component via signalLabel()/classLabel()/delayLabel()
const SIGNAL_CONFIG: Record<ConversationSignal, { label: string; color: string; bg: string }> = {
  objection:   { label: "Objection",   color: "var(--color-negative)",     bg: "rgba(248, 113, 113, 0.1)" },
  question:    { label: "Question",    color: "var(--color-neutral)",      bg: "rgba(251, 191, 36, 0.1)" },
  opportunity: { label: "Opportunity", color: "var(--color-positive)",     bg: "rgba(52, 211, 153, 0.1)" },
  hesitation:  { label: "Hesitation",  color: "var(--color-neutral)",      bg: "rgba(251, 191, 36, 0.1)" },
  agreement:   { label: "Agreement",   color: "var(--color-positive)",     bg: "rgba(52, 211, 153, 0.1)" },
  key_point:   { label: "Key Point",   color: "var(--color-accent-light)", bg: "rgba(200, 200, 216, 0.1)" },
  none:        { label: "",            color: "",                          bg: "" },
};

const CLASSIFICATION_CONFIG: Record<ConversationClassification, { label: string; color: string; bg: string }> = {
  very_positive: { label: "Excellent",  color: "#34d399", bg: "rgba(52, 211, 153, 0.12)" },
  positive:      { label: "Positive",   color: "#6ee7b7", bg: "rgba(110, 231, 183, 0.1)" },
  neutral:       { label: "Neutral",    color: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)" },
  awkward:       { label: "Awkward",    color: "#fb923c", bg: "rgba(251, 146, 60, 0.1)" },
  negative:      { label: "Negative",   color: "#f87171", bg: "rgba(248, 113, 113, 0.1)" },
};

const DELAY_CONFIG: Record<string, { label: string; color: string }> = {
  fast:    { label: "Fast",    color: "var(--color-positive)" },
  normal:  { label: "Normal",  color: "var(--color-accent-light)" },
  slow:    { label: "Slow",    color: "var(--color-neutral)" },
  silence: { label: "Silence", color: "var(--color-negative)" },
};

// i18n key maps for labels (used inside component where t() is available)
const SIGNAL_I18N: Record<ConversationSignal, string> = {
  objection: "session.signalObjection", question: "session.signalQuestion",
  opportunity: "session.signalOpportunity", hesitation: "session.signalHesitation",
  agreement: "session.signalAgreement", key_point: "session.signalKeyPoint", none: "",
};
const CLASS_I18N: Record<ConversationClassification, string> = {
  very_positive: "session.classExcellent", positive: "session.classPositive",
  neutral: "session.classNeutral", awkward: "session.classAwkward", negative: "session.classNegative",
};
const DELAY_I18N: Record<string, string> = {
  fast: "session.delayFast", normal: "session.delayNormal",
  slow: "session.delaySlow", silence: "session.delaySilence",
};

export default function SessionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { plan, can, features, sessionsRemaining } = usePlan();
  const audioService = useRef<AudioCaptureService | null>(null);
  const liveSpeech = useRef<LiveSpeechService | null>(null);
  const processingToastId = useRef<string | null>(null);
  const screenAnalysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Session time limit for free plan users
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const warningShownRef = useRef(false);
  const hasSessionTimeLimit = features.maxSessionDurationSec > 0;

  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [screenEnabled, setScreenEnabled] = useState(features.screenAnalysis);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Sync screenEnabled with plan — disable if plan doesn't allow it
  useEffect(() => {
    if (!features.screenAnalysis) setScreenEnabled(false);
  }, [features.screenAnalysis]);

  // Detect platform capabilities
  useEffect(() => {
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/i.test(ua);
    const android = /Android/i.test(ua);
    const mobile = ios || android || (navigator.maxTouchPoints > 0 && window.innerWidth < 768);

    if (ios) {
      // iOS: no getDisplayMedia at all → audio-only
      setIsMobile(true);
      setIsIOS(true);
      setScreenEnabled(false);
      setAudioEnabled(true);
    } else if (android) {
      // Android: getDisplayMedia works on Chrome → keep screen enabled
      setIsMobile(true);
      setIsIOS(false);
      setAudioEnabled(true);
      // Screen stays enabled by default on Android
    } else if (mobile) {
      setIsMobile(true);
      setScreenEnabled(false);
      setAudioEnabled(true);
    }
  }, []);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStarting, setSessionStarting] = useState(false);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [currentTone, setCurrentTone] = useState<Tone>("neutral");
  const [currentSuggestion, setCurrentSuggestion] = useState("");
  const [currentEmotions, setCurrentEmotions] = useState<string[]>([]);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [qualityScore, setQualityScore] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  const [signals, setSignals] = useState<Array<{ signal: ConversationSignal; label: string; time: number }>>([]);
  const [screenAnalysis, setScreenAnalysis] = useState<ScreenAnalysis | null>(null);
  const [analyzingScreen, setAnalyzingScreen] = useState(false);
  const [screenAnalysisCompleted, setScreenAnalysisCompleted] = useState(false);
  const [screenSummary, setScreenSummary] = useState<ScreenSummaryResult | null>(null);
  const [generatingScreenSummary, setGeneratingScreenSummary] = useState(false);
  const screenAnalysisHistory = useRef<ScreenAnalysis[]>([]);
  const screenSummaryRef = useRef<ScreenSummaryResult | null>(null);

  // New conversation intelligence state
  const [classification, setClassification] = useState<ConversationClassification>("neutral");
  const [coachingTip, setCoachingTip] = useState("");
  const [liveInsight, setLiveInsight] = useState("");
  const [suggestedResponses, setSuggestedResponses] = useState<Array<{ text: string; intent: string; label: string }>>([]);
  const [responseDelay, setResponseDelay] = useState<string>("normal");
  const [keyMoments, setKeyMoments] = useState<KeyMoment[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"insights" | "transcript" | "timeline">("insights");
  const [speakerBalance, setSpeakerBalance] = useState<number | undefined>(undefined);

  // Conversation mode (domain-specific analysis)
  const [conversationMode, setConversationMode] = useState<ConversationMode>("general");
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  // Proactive copilot prep mode
  const [prepData, setPrepData] = useState<PrepData | null>(null);
  const [prepLoading, setPrepLoading] = useState(false);
  const prevModeRef = useRef<string>("");

  // Detected question from other speaker
  const [detectedQuestion, setDetectedQuestion] = useState<DetectedQuestion | null>(null);

  // Copilot pause/resume + user question input
  const [copilotPaused, setCopilotPaused] = useState(false);
  const copilotPausedRef = useRef(false);
  copilotPausedRef.current = copilotPaused;
  const [copilotAnswer, setCopilotAnswer] = useState("");
  const [copilotAsking, setCopilotAsking] = useState(false);

  const handleAskCopilot = useCallback(async (question: string) => {
    if (!question.trim() || copilotAsking) return;
    setCopilotAsking(true);
    setCopilotAnswer("");
    try {
      const res = await authFetch("/api/copilot-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          conversationSummary: conversationSummary.current || undefined,
          mode: conversationMode,
          language: i18n.language,
        }),
      });
      const data = await res.json();
      setCopilotAnswer(data.answer || "No response.");
    } catch {
      setCopilotAnswer("Connection error. Try again.");
    } finally {
      setCopilotAsking(false);
    }
  }, [copilotAsking, conversationMode, i18n.language]);

  // Track whether PiP window is open — NO in-page overlay during live sessions (screen-share invisible)
  const [pipOpen, setPipOpen] = useState(false);
  const [copilotMode, setCopilotMode] = useState<"none" | "documentPiP" | "popup" | "failed">("none");
  const copilotPiPRef = useRef<CopilotPiPHandle>(null);

  // Deduplication: track last segment text to detect overlapping transcriptions
  const lastSegmentText = useRef<string>("");

  // Participant tracking from speaker diarization
  const { participants, updateFromSegments: updateParticipants, reset: resetParticipants } = useParticipants(t("copilot.you"), t("copilot.participant", { n: "{{n}}" }));

  // Rolling conversation summary -- gives AI full context without sending all segments
  const conversationSummary = useRef<string>("");
  const unsummarizedSegments = useRef<Array<{ text: string; tone: string; speaker?: string; signal?: string; signalLabel?: string }>>([]);
  const summaryUpdatePending = useRef(false);

  // Fetch proactive prep when mode changes and not recording
  useEffect(() => {
    if (isRecording || !user || !can("copilotOverlay")) return;
    if (conversationMode === prevModeRef.current) return;
    prevModeRef.current = conversationMode;

    setPrepLoading(true);
    setPrepData(null);
    authFetch("/api/copilot-prep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: conversationMode, language: i18n.language }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.greeting) setPrepData(data);
      })
      .catch(() => {})
      .finally(() => setPrepLoading(false));
  }, [conversationMode, isRecording, user, can, i18n.language]);

  // Analysis lifecycle
  const [analysisStatus, setAnalysisStatus] = useState<"idle" | "running" | "completed">("idle");
  const screenAnalysisStartTime = useRef<number>(0);
  const consecutiveSilenceCount = useRef(0);
  const stopSessionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!sessionStart) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStart.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  // Session time limit countdown for free plan users
  useEffect(() => {
    if (!isRecording || !hasSessionTimeLimit || !sessionStart) {
      // Clean up timer when session stops
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
      setTimeRemaining(null);
      warningShownRef.current = false;
      return;
    }

    const maxDuration = features.maxSessionDurationSec;
    const startTime = sessionStart.getTime();

    // Initialize remaining time
    const calcRemaining = () => Math.max(0, maxDuration - Math.floor((Date.now() - startTime) / 1000));
    setTimeRemaining(calcRemaining());

    sessionTimerRef.current = setInterval(() => {
      const remaining = calcRemaining();
      setTimeRemaining(remaining);

      // Warning at 60 seconds remaining
      if (remaining <= 60 && remaining > 0 && !warningShownRef.current) {
        warningShownRef.current = true;
        toast.show(t("session.timeWarning"), { type: "info", duration: 5000 });
      }

      // Time's up — auto-stop
      if (remaining <= 0) {
        if (sessionTimerRef.current) {
          clearInterval(sessionTimerRef.current);
          sessionTimerRef.current = null;
        }
        toast.show(t("session.timeLimitReached"), { type: "error", duration: 8000 });
        // Use ref to call stopSession to avoid stale closure
        if (stopSessionRef.current) stopSessionRef.current();
      }
    }, 1000);

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
    };
  }, [isRecording, hasSessionTimeLimit, sessionStart, features.maxSessionDurationSec, toast]);

  // No auto-stop: the user controls when to end the session (copilot mode).
  // The analysisStatus may reach "completed" but the session keeps running.

  // Cleanup intervals, services and refs on unmount
  useEffect(() => {
    return () => {
      if (screenAnalysisTimer.current) {
        clearTimeout(screenAnalysisTimer.current);
        screenAnalysisTimer.current = null;
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
      if (audioService.current) {
        audioService.current.stop();
        audioService.current = null;
      }
      if (liveSpeech.current) {
        liveSpeech.current.stop();
        liveSpeech.current = null;
      }
      conversationSummary.current = "";
      unsummarizedSegments.current = [];
      summaryUpdatePending.current = false;
      screenAnalysisHistory.current = [];
    };
  }, []);

  const stopScreenAnalysis = useCallback(() => {
    if (screenAnalysisTimer.current) {
      clearTimeout(screenAnalysisTimer.current);
      screenAnalysisTimer.current = null;
    }
    if (audioService.current?.stopScreenCapture) audioService.current.stopScreenCapture();
    setScreenAnalysisCompleted(true);
    setAnalyzingScreen(false);
  }, []);

  // Pause screen analysis temporarily (e.g. after summary), but keep capture alive
  const pauseScreenAnalysis = useCallback(() => {
    if (screenAnalysisTimer.current) {
      clearTimeout(screenAnalysisTimer.current);
      screenAnalysisTimer.current = null;
    }
    setAnalyzingScreen(false);
  }, []);

  const generateScreenSummary = useCallback(async (latestAnalysis: ScreenAnalysis) => {
    if (generatingScreenSummary) return;
    setGeneratingScreenSummary(true);
    try {
      const res = await authFetch("/api/summarize-screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenContext: latestAnalysis.context,
          contentType: latestAnalysis.contentType,
          mood: latestAnalysis.mood,
          insight: latestAnalysis.insight,
          analysisHistory: screenAnalysisHistory.current,
          language: i18n.language,
        }),
      });
      if (!res.ok) throw new Error("Screen summary request failed");
      const data: ScreenSummaryResult = await res.json();
      screenSummaryRef.current = data;
      setScreenSummary(data);
      // Screen summary generated — auto-stop in screen-only mode
      if (!audioService.current?.audioEnabled) {
        stopScreenAnalysis();
        toast.show(t("session.screenAnalysisComplete", "Screen analysis complete — generating report..."), { type: "success", duration: 3000 });
        // Auto-stop session after a short delay so the summary state settles
        setTimeout(() => { stopSessionRef.current?.(); }, 1500);
      } else {
        toast.show(t("session.screenSummaryUpdated"), { type: "success", duration: 3000 });
      }
    } catch (err) {
      console.error("Screen summary generation error:", err);
      if (!audioService.current?.audioEnabled) {
        // Screen-only: stop session on error — no point keeping a dead session
        stopScreenAnalysis();
        toast.show(t("session.screenSummaryFailed", "Analysis failed — please try again."), { type: "error", duration: 4000 });
        setTimeout(() => { stopSessionRef.current?.(); }, 1000);
      } else {
        toast.show(t("session.screenSummaryFailed"), { type: "error", duration: 4000 });
      }
    } finally {
      setGeneratingScreenSummary(false);
    }
  }, [generatingScreenSummary, toast]);

  // Track whether screen content is stable (no changes detected)
  const screenStableCount = useRef(0);
  // Track consecutive non-conversational frames (screen-only: warn user if no chat visible)
  const nonConversationalCount = useRef(0);
  const nonConversationalWarned = useRef(false);
  // Screen-only static mode: count captures to trigger summary after 2 successful analyses
  const screenOnlyCaptureCount = useRef(0);

  // Build structured visual context from recent screen captures for multi-frame memory
  function buildVisualContextSummary(): string {
    const history = screenAnalysisHistory.current;
    if (history.length === 0) return "";
    const recent = history.slice(-5);
    return recent
      .map((h, i) => `[${i + 1}] (${h.contentType}, ${h.mood}) ${h.context}${h.insight ? " -- " + h.insight : ""}`)
      .join("\n");
  }

  // Adaptive capture interval based on content type and stability
  function getNextCaptureInterval(contentType?: string): number {
    const isStable = screenStableCount.current > 0;
    if (contentType === "chat" && !isStable) return 6000;
    if (contentType === "video") return 8000;
    if (isStable) return 25000;
    if (contentType === "presentation" || contentType === "document") return 20000;
    return 15000;
  }

  // Schedule the next screen capture with adaptive timing
  function scheduleNextCapture(contentType?: string) {
    if (screenAnalysisTimer.current) clearTimeout(screenAnalysisTimer.current);
    const interval = getNextCaptureInterval(contentType);
    screenAnalysisTimer.current = setTimeout(() => analyzeScreen(), interval);
  }

  const analyzeScreen = useCallback(async () => {
    if (!audioService.current || screenAnalysisCompleted) return;
    // Detect screen share ended mid-session
    if (!audioService.current.hasVideo) {
      stopScreenAnalysis();
      toast.show(t("session.screenShareEnded", "Screen share ended — continuing with audio only."), { type: "info", duration: 5000 });
      return;
    }

    const isScreenOnly = !audioService.current.audioEnabled;
    const frame = await audioService.current.captureFrame();
    if (!frame) return;
    setAnalyzingScreen(true);
    try {
      const formData = new FormData();
      formData.append("image", frame, "screen.jpg");
      // Multi-frame context: send structured history instead of just previous context
      const visualCtx = buildVisualContextSummary();
      if (visualCtx) {
        formData.append("visualHistory", visualCtx);
      } else if (screenAnalysis?.context) {
        formData.append("previousContext", screenAnalysis.context);
      }
      // Cross-modal fusion: send audio transcript context to screen analysis
      if (conversationSummary.current) formData.append("transcriptContext", conversationSummary.current);
      const lastSeg = segments[segments.length - 1];
      if (lastSeg?.text) formData.append("lastTranscript", lastSeg.text);
      formData.append("language", i18n.language);
      formData.append("userPlan", plan);
      const res = await authFetchFormData("/api/analyze-screen", formData, { method: "POST" });
      const data: ScreenAnalysis = await res.json();
      if (data.context) {
        setScreenAnalysis(data);
        screenAnalysisHistory.current.push(data);
        // Cap screen history to last 10 captures to prevent memory bloat
        if (screenAnalysisHistory.current.length > 10) screenAnalysisHistory.current = screenAnalysisHistory.current.slice(-10);
        // Add screen capture event to unified timeline
        setTimeline((prev) => [...prev, {
          timestamp: Date.now(),
          type: "screen_capture" as const,
          screenContext: data.context,
          contentType: data.contentType,
          screenMood: data.mood,
        }]);

        // ──── Screen-only STATIC mode: 2 captures then generate report ────
        if (isScreenOnly) {
          const isConversational = ["chat", "email", "video"].includes(data.contentType);
          if (isConversational) {
            nonConversationalCount.current = 0;
            screenOnlyCaptureCount.current += 1;
            if (screenOnlyCaptureCount.current >= 2) {
              // Enough context — generate summary and stop
              pauseScreenAnalysis();
              setScreenAnalysisCompleted(true);
              generateScreenSummary(data);
              return;
            }
            // Take one more capture after a short delay for extra context
            scheduleNextCapture("chat");
          } else {
            nonConversationalCount.current += 1;
            if (nonConversationalCount.current >= 3 && !nonConversationalWarned.current) {
              nonConversationalWarned.current = true;
              toast.show(
                t("session.noConversationDetected", "No conversation detected on screen. Please display a chat, email, or messaging app to analyze."),
                { type: "info", duration: 8000 }
              );
            }
            // Keep trying — user might switch to a conversation
            scheduleNextCapture(data.contentType);
          }
          return;
        }

        // ──── Mixed mode (screen + audio): existing adaptive polling ────
        if (data.analysisComplete) {
          screenStableCount.current += 1;
          if (screenStableCount.current >= 2) {
            pauseScreenAnalysis();
            setScreenAnalysisCompleted(true);
            generateScreenSummary(data);
            return;
          }
        } else {
          screenStableCount.current = 0;
        }
        scheduleNextCapture(data.contentType);
      } else {
        // No data -- keep polling at default interval
        scheduleNextCapture();
      }
    } catch (err) {
      console.error("Screen analysis error:", err);
      // On error, keep polling at default interval
      scheduleNextCapture();
    }
    finally { setAnalyzingScreen(false); }
  }, [screenAnalysisCompleted, pauseScreenAnalysis, screenAnalysis, generateScreenSummary]);

  // Flush queued segments to rolling summary — re-triggers if more segments arrived during update
  function flushSummaryQueue() {
    if (summaryUpdatePending.current || unsummarizedSegments.current.length < 2) return;
    summaryUpdatePending.current = true;
    const segsToSummarize = [...unsummarizedSegments.current];
    unsummarizedSegments.current = [];
    authFetch("/api/conversation-context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        previousSummary: conversationSummary.current || null,
        newSegments: segsToSummarize,
        language: i18n.language,
      }),
    })
      .then((r) => { if (!r.ok) throw new Error(`Context API: ${r.status}`); return r.json(); })
      .then((data) => {
        if (data.summary) conversationSummary.current = data.summary;
      })
      .catch((err) => {
        console.error("Rolling summary error:", err);
        unsummarizedSegments.current.unshift(...segsToSummarize);
      })
      .finally(() => {
        summaryUpdatePending.current = false;
        // If more segments queued during this update, flush again
        if (unsummarizedSegments.current.length >= 2) {
          flushSummaryQueue();
        }
      });
  }

  const processAudioChunk = useCallback(async (blob: Blob) => {
    if (!audioService.current?.audioEnabled) return;
    setProcessing(true);
    if (processingToastId.current) {
      toast.update(processingToastId.current, t("session.transcribing"), { type: "processing" });
    } else {
      processingToastId.current = toast.show(t("session.transcribing"), { type: "processing" });
    }
    try {
      const formData = new FormData();
      // Use correct extension based on actual blob MIME type
      const blobExt = blob.type.includes("ogg") ? "ogg" : blob.type.includes("mp4") ? "mp4" : "webm";
      formData.append("audio", blob, `audio.${blobExt}`);
      // Pass detected language if we already know it, otherwise let Whisper auto-detect
      if (detectedLanguage) formData.append("language", detectedLanguage);
      const transcribeRes = await authFetchFormData("/api/transcribe", formData, { method: "POST" });
      if (!transcribeRes.ok) throw new Error(`Transcribe API error: ${transcribeRes.status}`);
      const transcribeData = await transcribeRes.json();
      let text: string = transcribeData.text;
      const speakerSegs: SpeakerSegment[] = transcribeData.speakerSegments || [];
      // Update participant tracking from detected speakers
      if (speakerSegs.length > 0) updateParticipants(speakerSegs);
      // Store detected language for subsequent chunks
      if (transcribeData.language && !detectedLanguage) {
        setDetectedLanguage(transcribeData.language);
        // Update live speech language for better accuracy
        liveSpeech.current?.setLanguage(transcribeData.language);
      }
      const WHISPER_HALLUCINATIONS = ["sous-titres","amara.org","sous-titrage","merci d'avoir regard","merci de votre visionnage","thank you for watching","thanks for watching","subtitles by","transcrit par","please subscribe","like and subscribe","music","video/content end","end of video","fin de la vidéo","ご視聴","ごちそうさま","お疲れ様","よろしくお願い","ありがとうございま","チャンネル登録","最後まで","見てくれて"];
      const lower = (text || "").trim().toLowerCase();
      // Detect non-Latin script hallucinations (Japanese, Chinese, Korean, Arabic, etc.)
      // when no language has been detected yet or detected language uses Latin script
      const hasNonLatinScript = /[\u3000-\u9FFF\uAC00-\uD7AF\u0600-\u06FF]/.test(text || "");
      const expectsLatinScript = !detectedLanguage || /^(fr|en|es|pt|de|it|nl|pl|ro|cs|sv|da|no|fi|hu|tr|vi|id|ms)$/.test(detectedLanguage);
      const isHallucination = !text || lower.length < 3 || WHISPER_HALLUCINATIONS.some((h) => lower.includes(h)) || (hasNonLatinScript && expectsLatinScript);
      if (isHallucination) {
        setProcessing(false);
        if (processingToastId.current) { toast.dismiss(processingToastId.current); processingToastId.current = null; }

        // Track consecutive silence (informational only -- no auto-stop in copilot mode)
        consecutiveSilenceCount.current += 1;
        return;
      }

      // --- Deduplication: skip duplicate or near-duplicate transcriptions ---
      // Whisper can hallucinate the same text on silent chunks with minor whitespace differences.
      const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
      const prevText = lastSegmentText.current;
      if (prevText && normalize(text) === normalize(prevText)) {
        setProcessing(false);
        if (processingToastId.current) { toast.dismiss(processingToastId.current); processingToastId.current = null; }
        return;
      }
      lastSegmentText.current = text;
      setInterimText(""); // Clear interim — Whisper result is authoritative

      // Reset silence counter on valid speech
      consecutiveSilenceCount.current = 0;

      // Skip AI analysis when copilot is paused — transcription still recorded
      if (copilotPausedRef.current) {
        const pausedTone: ToneResult = {
          tone: "neutral", confidence: 0.5, suggestion: "", emotions: [],
          signal: "none", signalLabel: "", qualityScore: 0, classification: "neutral",
          coachingTip: "", liveInsight: "", engagementScore: 0, responseDelay: "normal",
        };
        const dominantSpeaker = speakerSegs.length > 0 ? speakerSegs[speakerSegs.length - 1].speaker : undefined;
        setSegments((prev) => [...prev, { text, timestamp: Date.now(), tone: pausedTone, speaker: dominantSpeaker, speakerSegments: speakerSegs.length > 0 ? speakerSegs : undefined }]);
        setProcessing(false);
        if (processingToastId.current) { toast.update(processingToastId.current, t("session.copilotPausedStatus", "Copilot paused"), { type: "info", duration: 2000 }); processingToastId.current = null; }
        return;
      }

      toast.update(processingToastId.current!, t("session.analyzing"), { type: "processing" });

      // Send rolling summary + last 5 raw segments + copilot memory for richer context
      const recentSegs = segments.slice(-5).map((s) => ({ text: s.text, tone: s.tone.tone, speaker: s.speaker }));
      const analyzeRes = await authFetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          conversationSummary: conversationSummary.current || undefined,
          recentSegments: recentSegs,
          speakerSegments: speakerSegs.length > 0 ? speakerSegs : undefined,
          mode: conversationMode,
          screenContext: screenAnalysis?.context || undefined,
          screenContentType: screenAnalysis?.contentType || undefined,
          language: i18n.language,
          lastDetectedQuestion: detectedQuestion || undefined,
          lastSuggestions: suggestedResponses.length > 0 ? suggestedResponses.map((r) => r.text) : undefined,
        }),
      });
      if (!analyzeRes.ok) throw new Error(`Analyze API error: ${analyzeRes.status}`);
      const analysis: ToneResult = await analyzeRes.json();
      const dominantSpeaker = speakerSegs.length > 0 ? speakerSegs[speakerSegs.length - 1].speaker : undefined;
      const segment: TranscriptSegment = { text, timestamp: Date.now(), tone: analysis, speaker: dominantSpeaker, speakerSegments: speakerSegs.length > 0 ? speakerSegs : undefined, detectedLanguage: transcribeData.language || undefined };
      // Windowed state: keep full segments for save, but cap timeline/signals to prevent memory bloat
      setSegments((prev) => [...prev, segment]);

      // Add transcript event to unified timeline (cap at 200 events for long sessions)
      setTimeline((prev) => {
        const events: TimelineEvent[] = [...prev, {
          timestamp: Date.now(),
          type: "transcript" as const,
          text,
          speaker: dominantSpeaker,
          tone: analysis.tone,
        }];
        if (analysis.signal && analysis.signal !== "none") {
          events.push({
            timestamp: Date.now(),
            type: "signal" as const,
            signal: analysis.signal,
            signalLabel: analysis.signalLabel,
          });
        }
        return events.length > 200 ? events.slice(-200) : events;
      });

      // Queue segment for rolling summary update
      unsummarizedSegments.current.push({
        text,
        tone: analysis.tone,
        speaker: dominantSpeaker,
        signal: analysis.signal,
        signalLabel: analysis.signalLabel,
      });

      // Update rolling summary every 2 new segments (async, non-blocking)
      if (unsummarizedSegments.current.length >= 2 && !summaryUpdatePending.current) {
        flushSummaryQueue();
      }
      setCurrentTone(analysis.tone);
      setCurrentSuggestion(analysis.suggestion);
      setCurrentEmotions(analysis.emotions || []);
      if (Array.isArray(analysis.suggestedResponses) && analysis.suggestedResponses.length > 0) {
        setSuggestedResponses(analysis.suggestedResponses);
      }
      // Track detected question from other speaker
      // Only update if a new question is detected; only clear if the AI explicitly returned null
      // (meaning the question has been answered or is no longer relevant)
      if (analysis.detectedQuestion && analysis.detectedQuestion.text) {
        setDetectedQuestion(analysis.detectedQuestion);
      } else if (analysis.detectedQuestion === null) {
        setDetectedQuestion(null);
      }

      // Update classification and coaching
      if (analysis.classification) setClassification(analysis.classification);
      if (analysis.coachingTip) setCoachingTip(analysis.coachingTip);
      if (analysis.liveInsight) setLiveInsight(analysis.liveInsight);
      if (analysis.responseDelay) setResponseDelay(analysis.responseDelay);
      if (analysis.engagementScore != null) {
        setEngagementScore((prev) => prev === 0 ? analysis.engagementScore : Math.round((prev + analysis.engagementScore) / 2));
      }

      if (analysis.qualityScore != null) {
        setQualityScore((prev) => prev === 0 ? analysis.qualityScore : Math.round((prev + analysis.qualityScore) / 2));
      }
      if (analysis.speakerDynamics?.balanceRatio != null) {
        setSpeakerBalance(analysis.speakerDynamics.balanceRatio);
      }

      // Track key moments
      const cfg = analysis.signal && analysis.signal !== "none" ? SIGNAL_CONFIG[analysis.signal] : undefined;
      if (analysis.signal && analysis.signal !== "none" && cfg) {
        const signalLabel = analysis.signalLabel || cfg.label;
        setSignals((prev) => { const next = [...prev, { signal: analysis.signal, label: signalLabel, time: Date.now() }]; return next.length > 50 ? next.slice(-50) : next; });
        setKeyMoments((prev) => { const next = [...prev, { timestamp: Date.now(), type: analysis.signal, label: signalLabel, text }]; return next.length > 30 ? next.slice(-30) : next; });
        const tt = analysis.signal === "objection" ? "error" as const : (analysis.signal === "opportunity" || analysis.signal === "agreement") ? "success" as const : "info" as const;
        toast.update(processingToastId.current!, cfg.label + (analysis.signalLabel ? `: ${analysis.signalLabel}` : ""), { type: tt, duration: 3000 });
        processingToastId.current = null;
      } else {
        toast.update(processingToastId.current!, t("session.segmentAnalyzed"), { type: "success", duration: 2000 });
        processingToastId.current = null;
      }
    } catch (err) {
      console.error("Processing error:", err);
      if (processingToastId.current) { toast.update(processingToastId.current, t("session.analysisFailed"), { type: "error", duration: 4000 }); processingToastId.current = null; }
    } finally { setProcessing(false); }
  }, [toast, segments, detectedLanguage, conversationMode]);

  // Stable ref wrapper: always calls the latest processAudioChunk closure
  // (AudioCaptureService stores onChunkReady once at start — without this ref,
  //  subsequent chunks would call the stale initial closure with segments=[])
  const processAudioChunkRef = useRef(processAudioChunk);
  processAudioChunkRef.current = processAudioChunk;
  const stableProcessAudioChunk = useCallback((blob: Blob) => {
    return processAudioChunkRef.current(blob);
  }, []);

  async function startSession() {
    if (sessionStarting || isRecording) return;
    setSessionStarting(true);

    try {
    // Block screen-only on free plan — screen analysis requires Pro
    const effectiveScreen = screenEnabled && features.screenAnalysis;
    if (!effectiveScreen && !audioEnabled) {
      if (screenEnabled && !features.screenAnalysis) {
        toast.show(t("session.screenProOnly", "Screen analysis is available on the Pro plan. Upgrade to unlock this feature!"), { type: "info", duration: 5000 });
      } else {
        toast.show(t("session.enableAtLeast"), { type: "error", duration: 4000 });
      }
      return;
    }

    // Check subscription limit
    if (user) {
      try {
        const subRes = await authFetch("/api/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, action: "check-session" }),
        });
        const subCheck = await subRes.json();
        if (!subCheck.allowed) {
          toast.show(subCheck.reason || t("session.sessionLimitReached"), { type: "error", duration: 6000 });
          return;
        }
      } catch { /* Allow session if check fails */ }
    }

    audioService.current = new AudioCaptureService();
    const options: CaptureOptions = { screenEnabled: effectiveScreen, audioEnabled };
    try {
      await audioService.current.start(stableProcessAudioChunk, options);
      setIsRecording(true); setSessionStart(new Date()); setSegments([]); setSignals([]); setKeyMoments([]); setTimeline([]); setDetectedLanguage(null);
      setQualityScore(0); setEngagementScore(0); setScreenAnalysis(null); setScreenAnalysisCompleted(false);
      setScreenSummary(null); screenSummaryRef.current = null; screenAnalysisHistory.current = [];
      setClassification("neutral"); setCoachingTip(""); setLiveInsight(""); setResponseDelay("normal"); setSpeakerBalance(undefined);
      setCopilotPaused(false); setCopilotAnswer(""); setCopilotAsking(false);
      setSuggestedResponses([]); setDetectedQuestion(null);
      resetParticipants();
      setActiveTab("insights");
      conversationSummary.current = "";
      unsummarizedSegments.current = [];
      summaryUpdatePending.current = false;
      consecutiveSilenceCount.current = 0;
      lastSegmentText.current = "";
      screenStableCount.current = 0;
      nonConversationalCount.current = 0;
      nonConversationalWarned.current = false;
      screenOnlyCaptureCount.current = 0;
      screenAnalysisStartTime.current = Date.now();
      setAnalysisStatus("running");
      // Open Document PiP from user gesture context (click) — desktop only (mobile uses inline copilot)
      if (can("copilotPiP") && audioEnabled && !isMobile) {
        copilotPiPRef.current?.requestOpen();
      }
      // Start live interim transcription (Web Speech API) for instant feedback
      if (audioEnabled) {
        const ls = new LiveSpeechService();
        if (ls.supported) {
          ls.setLanguage(i18n.language || "en");
          ls.start((text, isFinal) => {
            if (!isFinal) {
              setInterimText(text);
            } else {
              setInterimText(""); // Clear — Whisper will provide the final version
            }
          });
          liveSpeech.current = ls;
        }
      }
      const hasAudio = audioService.current.hasAudio;
      const hasVideo = audioService.current.hasVideo;
      const hasSystemAudio = audioService.current.hasSystemAudio;
      if (hasVideo && hasAudio && hasSystemAudio) toast.show(t("session.fullCapture"), { type: "success", duration: 5000 });
      else if (hasVideo && hasAudio && !hasSystemAudio) toast.show(t("session.screenMicCapture"), { type: "info", duration: 6000 });
      else if (hasVideo && !audioEnabled) toast.show(t("session.screenOnlyStarted"), { type: "info", duration: 5000 });
      else if (hasVideo && audioEnabled && !hasAudio) toast.show(t("session.screenNoAudio"), { type: "error", duration: 6000 });
      else if (hasAudio) toast.show(t("session.audioStarted"), { type: "success", duration: 3000 });
      if (effectiveScreen && hasVideo) { screenAnalysisTimer.current = setTimeout(() => analyzeScreen(), 3000); }
      if (user) {
        const { data } = await supabase.from("conversations").insert({ user_id: user.uid, title: `Session ${new Date().toLocaleString()}` }).select("id").single();
        if (data) setConversationId(data.id);
        // Increment session count for free plan users
        authFetch("/api/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, action: "increment" }),
        }).catch(() => {});
      }
    } catch (err) {
      // Clean up partially initialized audio service
      if (audioService.current) { try { audioService.current.stop(); } catch {} audioService.current = null; }
      if (liveSpeech.current) { try { liveSpeech.current.stop(); } catch {} liveSpeech.current = null; }
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("PERMISSION_DENIED:screen")) {
        toast.show(t("session.screenShareCancelled"), { type: "error", duration: 5000 });
      } else if (msg.includes("PERMISSION_DENIED:microphone")) {
        toast.show(t("session.micDenied"), { type: "error", duration: 5000 });
      } else {
        toast.show(effectiveScreen ? t("session.screenRequired") : t("session.micRequired"), { type: "error", duration: 6000 });
      }
    }
    } finally {
      setSessionStarting(false);
    }
  }

  // Handle PiP state changes with mode-specific toasts
  const handlePiPStateChange = useCallback((isOpen: boolean, mode?: "documentPiP" | "popup" | "failed") => {
    setPipOpen(isOpen);
    setCopilotMode(isOpen ? (mode || "documentPiP") : (mode === "failed" ? "failed" : "none"));

    if (isOpen && mode === "documentPiP") {
      toast.show(t("session.copilotRunning"), { type: "success", duration: 4000 });
    } else if (isOpen && mode === "popup") {
      toast.show(t("session.copilotPopup"), { type: "info", duration: 8000 });
    } else if (!isOpen && mode === "failed") {
      toast.show(t("session.copilotBlocked"), { type: "error", duration: 10000 });
    } else if (!isOpen && isRecording) {
      toast.show(t("session.copilotClosed"), { type: "info", duration: 5000 });
    }
  }, [toast, isRecording]);

  async function stopSession() {
    if (!isRecording && !sessionStarting) return;
    if (screenAnalysisTimer.current) { clearTimeout(screenAnalysisTimer.current); screenAnalysisTimer.current = null; }
    // Process final audio chunk before stopping (up to 3s of speech would be lost otherwise)
    let finalBlob: Blob | null = null;
    if (audioService.current) finalBlob = audioService.current.stop();
    if (liveSpeech.current) { liveSpeech.current.stop(); liveSpeech.current = null; }
    setInterimText("");
    if (finalBlob && finalBlob.size > 1000) {
      try { await stableProcessAudioChunk(finalBlob); } catch { /* best-effort */ }
    }
    setIsRecording(false); setSessionStart(null); setAnalysisStatus("idle");
    consecutiveSilenceCount.current = 0;
    screenAnalysisStartTime.current = 0;
    if (processingToastId.current) { toast.dismiss(processingToastId.current); processingToastId.current = null; }
    const hasAudioData = segments.length > 0;
    // Use ref for screenSummary to avoid stale closure (auto-stop fires before re-render)
    const currentScreenSummary = screenSummaryRef.current;
    const hasScreenData = currentScreenSummary || screenAnalysis;
    if (conversationId && (hasAudioData || hasScreenData)) {
      const saveToastId = toast.show(t("session.saving"), { type: "processing" });

      // Phase 1: Save essential fields immediately (always works even if new columns are missing)
      const toneMap: Record<string, string> = { very_positive: "positive", positive: "positive", neutral: "neutral", awkward: "hesitant", negative: "negative" };
      const dominantTone = hasAudioData
        ? (() => {
            const counts: Record<string, number> = {};
            segments.forEach((s) => { counts[s.tone.tone] = (counts[s.tone.tone] || 0) + 1; });
            return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
          })()
        : currentScreenSummary
          ? toneMap[currentScreenSummary.conversationTone] || "neutral"
          : screenAnalysis?.mood || "neutral";

      // Save core fields that definitely exist in the DB
      const coreUpdate: Record<string, unknown> = {
        ended_at: new Date().toISOString(),
        overall_tone: dominantTone,
      };
      // Include summary text in phase 1 if we already have it from screen analysis
      if (currentScreenSummary) {
        coreUpdate.summary = currentScreenSummary.recommendation;
        coreUpdate.insights = currentScreenSummary.keyInsights;
      }
      await supabase.from("conversations").update(coreUpdate).eq("id", conversationId);

      if (hasAudioData) {
        const rows = segments.map((s) => ({ conversation_id: conversationId, timestamp: s.timestamp, transcript: s.text, tone: s.tone.tone, confidence: s.tone.confidence, suggestion: s.tone.suggestion }));
        await supabase.from("analysis_segments").insert(rows);
      }

      // Phase 2: Generate and save full summary (uses new columns that may need migration)
      toast.update(saveToastId, t("session.generatingSummary"), { type: "processing" });
      try {
        if (hasAudioData) {
          const res = await authFetch("/api/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              segments: segments.map((s) => ({ text: s.text, tone: s.tone.tone, speaker: s.speaker, signal: s.tone.signal, signalLabel: s.tone.signalLabel })),
              signals,
              mode: conversationMode,
              qualityScore,
              language: i18n.language,
            }),
          });
          const summary = await res.json();
          if (!summary.error) {
            await supabase.from("conversations").update({
              summary: summary.recommendation,
              overall_tone: summary.overallTone || dominantTone,
              insights: summary.insights,
              classification: summary.classification,
              score: summary.score,
              diagnosis: summary.diagnosis,
              follow_up_actions: summary.followUpActions,
              strengths: summary.strengths,
              improvements: summary.improvements,
            }).eq("id", conversationId);
          }
        } else if (currentScreenSummary) {
          // Screen-only: save enriched data to new columns
          await supabase.from("conversations").update({
            classification: currentScreenSummary.conversationTone,
            score: { overall: currentScreenSummary.attractionScore, engagement: currentScreenSummary.attractionScore, tone: currentScreenSummary.attractionScore, fluidity: 0, interest: currentScreenSummary.attractionScore },
            diagnosis: currentScreenSummary.summary,
            follow_up_actions: currentScreenSummary.improvements,
            social_score: currentScreenSummary.attractionScore,
            strengths: currentScreenSummary.strengths,
            improvements: currentScreenSummary.improvements,
          }).eq("id", conversationId);
        }
        toast.update(saveToastId, t("session.sessionSaved"), { type: "success", duration: 2000 });
      } catch (err) {
        console.error("Summary enrichment error:", err);
        toast.update(saveToastId, t("session.sessionSaved"), { type: "success", duration: 2000 });
      }
      router.push(`/summary/${conversationId}`);
    } else { toast.show(t("session.sessionEnded"), { type: "info", duration: 3000 }); }
  }
  stopSessionRef.current = stopSession;

  function formatTime(secs: number) { const m = Math.floor(secs / 60).toString().padStart(2, "0"); const s = (secs % 60).toString().padStart(2, "0"); return `${m}:${s}`; }
  function getScoreColor(score: number) { if (score >= 70) return "var(--color-positive)"; if (score >= 40) return "var(--color-neutral)"; return "var(--color-negative)"; }
  function getTimeSince(ts: number) {
    if (!sessionStart) return "";
    const diff = Math.floor((ts - sessionStart.getTime()) / 1000);
    const m = Math.floor(diff / 60).toString().padStart(2, "0");
    const s = (diff % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const contentTypeLabels: Record<string, string> = { presentation: "Presentation", code: "Code", document: "Document", chat: "Chat", video: "Video", website: "Website", email: "Email", spreadsheet: "Spreadsheet", other: "Screen" };
  const classConfig = CLASSIFICATION_CONFIG[classification];
  const delayConfig = DELAY_CONFIG[responseDelay] || DELAY_CONFIG.normal;

  return (
    <AppShell>
      <div style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="section-heading text-glow mb-1">{t("session.title")}</h1>
            {isRecording && (
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{formatTime(elapsed)}</span>
                {analysisStatus === "completed" ? (
                  <span className="text-xs px-2 py-1 rounded-md font-semibold" style={{ backgroundColor: "rgba(52, 211, 153, 0.12)", color: "var(--color-positive)" }}>
                    Analysis Ready
                  </span>
                ) : (
                  <div className="recording-pulse" />
                )}
                {audioEnabled && segments.length > 0 && (
                  <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ backgroundColor: classConfig.bg, color: classConfig.color }}>
                    {classConfig.label}
                  </span>
                )}
                {/* Free plan session countdown timer */}
                {hasSessionTimeLimit && timeRemaining !== null && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-md font-semibold"
                    style={{
                      backgroundColor: timeRemaining <= 60
                        ? "rgba(248, 113, 113, 0.15)"
                        : "rgba(251, 191, 36, 0.1)",
                      color: timeRemaining <= 60
                        ? "var(--color-negative)"
                        : "var(--color-neutral)",
                      transition: "background-color 0.3s ease, color 0.3s ease",
                    }}
                  >
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")} remaining
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {!isRecording && (
              <select
                value={conversationMode}
                onChange={(e) => setConversationMode(e.target.value as ConversationMode)}
                className="px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer"
                style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                <option value="general">General</option>
                <option value="sales">Sales</option>
                <option value="recruitment">Recruitment</option>
                <option value="support">Support</option>
                <option value="networking">Networking</option>
              </select>
            )}
            {!isRecording && !isIOS && (
              <button
                onClick={() => {
                  if (!features.screenAnalysis) {
                    toast.show(t("session.screenProOnly", "Screen analysis is available on the Pro plan. Upgrade to unlock this feature!"), { type: "info", duration: 5000 });
                    return;
                  }
                  setScreenEnabled((p) => !p);
                }}
                className="mic-toggle"
                data-active={screenEnabled && features.screenAnalysis}
                style={!features.screenAnalysis ? { opacity: 0.5 } : undefined}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                <span className="mic-toggle-label">{screenEnabled && features.screenAnalysis ? t("session.screenOn") : !features.screenAnalysis ? t("session.screenOffPro") : t("session.screenOff")}</span>
              </button>
            )}
            {!isRecording && (
              <button onClick={() => setAudioEnabled((p) => !p)} className="mic-toggle" data-active={audioEnabled}>
                {audioEnabled ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="1" width="6" height="12" rx="3" /><path d="M19 10v1a7 7 0 0 1-14 0v-1" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.12 1.5-.35 2.18" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                )}
                <span className="mic-toggle-label">{audioEnabled ? t("session.audioOn") : t("session.audioOff")}</span>
              </button>
            )}
            {isRecording && (
              <div className="flex items-center gap-2">
                {audioService.current?.hasVideo && (
                  <div className="mic-status-badge" data-active={!screenAnalysisCompleted}>
                    <span className="mic-status-dot" />
                    <span className="text-xs font-medium">{screenAnalysisCompleted ? "Screen Done" : "Screen"}</span>
                  </div>
                )}
                <div className="mic-status-badge" data-active={audioService.current?.hasAudio ?? false}>
                  <span className="mic-status-dot" />
                  <span className="text-xs font-medium">{audioService.current?.audioEnabled ? audioService.current?.hasAudio ? "Mic" : "No Signal" : "Audio Off"}</span>
                </div>
                {audioService.current?.hasSystemAudio && (
                  <div className="mic-status-badge" data-active={true}>
                    <span className="mic-status-dot" />
                    <span className="text-xs font-medium">System Audio</span>
                  </div>
                )}
              </div>
            )}
            <button onClick={isRecording ? stopSession : startSession} disabled={sessionStarting || (!isRecording && !screenEnabled && !audioEnabled)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: isRecording ? "var(--color-negative)" : "var(--color-accent)", minHeight: 48 }}>
              {sessionStarting ? t("session.starting", "Starting...") : isRecording ? t("session.stopSession") : t("session.startRecording")}
            </button>
          </div>
        </div>

        {/* Free plan time limit banner */}
        {isRecording && hasSessionTimeLimit && timeRemaining !== null && (
          <div
            className="rounded-xl p-3 mb-4 border text-xs flex items-center justify-between"
            style={{
              backgroundColor: timeRemaining <= 60 ? "rgba(248, 113, 113, 0.06)" : "rgba(251, 191, 36, 0.04)",
              borderColor: timeRemaining <= 60 ? "rgba(248, 113, 113, 0.25)" : "rgba(251, 191, 36, 0.15)",
              color: timeRemaining <= 60 ? "var(--color-negative)" : "var(--color-text-muted)",
              transition: "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
            }}
          >
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>
                Free plan: <strong>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}</strong> remaining
                {timeRemaining <= 60 ? " — session ending soon" : ` of ${Math.floor(features.maxSessionDurationSec / 60)} min limit`}
              </span>
            </div>
            <a
              href="/pricing"
              className="text-xs font-semibold px-3 py-1 rounded-md"
              style={{
                backgroundColor: "rgba(200, 200, 216, 0.1)",
                color: "var(--color-accent-light)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Upgrade
            </a>
          </div>
        )}

        {/* Mode info banner */}
        {!isRecording && (
          <div className="rounded-xl p-4 mb-6 border text-sm" style={{ backgroundColor: "rgba(200, 200, 216, 0.06)", borderColor: !screenEnabled && !audioEnabled ? "var(--color-negative)" : "var(--color-accent)", color: !screenEnabled && !audioEnabled ? "var(--color-negative)" : "var(--color-accent-light)" }}>
            {isIOS && !screenEnabled && audioEnabled
              ? "Audio mode: put your call on speaker — Tonvo will capture both sides via microphone for real-time analysis."
              : isMobile && screenEnabled && audioEnabled
              ? t("session.modeFullCapture")
              : isMobile && !screenEnabled && audioEnabled
              ? t("session.modeMobileAudio")
              : screenEnabled && audioEnabled ? t("session.modeFullAnalysis") : screenEnabled && !audioEnabled ? t("session.modeScreenOnly") : !screenEnabled && audioEnabled ? t("session.modeAudioOnly") : t("session.modeNone")}
          </div>
        )}

        {/* Mobile speaker tip */}
        {!isRecording && isMobile && audioEnabled && !screenEnabled && (
          <div className="rounded-xl p-4 mb-3 border text-xs flex items-start gap-3" style={{ backgroundColor: "rgba(52, 211, 153, 0.04)", borderColor: "rgba(52, 211, 153, 0.15)", color: "var(--color-text-muted)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)", flexShrink: 0, marginTop: 1 }}>
              <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <div>
              <span className="font-semibold block mb-1" style={{ color: "var(--color-positive)" }}>Speaker mode recommended</span>
              <p className="m-0 leading-relaxed">Put your phone call on speaker or use speakerphone so Tonvo can hear both sides of the conversation through the microphone. This gives the best analysis results.</p>
            </div>
          </div>
        )}

        {/* iOS: suggest Analyze Text for screenshots */}
        {!isRecording && isIOS && (
          <div className="rounded-xl p-4 mb-3 border text-xs flex items-start gap-3" style={{ backgroundColor: "rgba(200, 200, 216, 0.03)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            <div>
              Want to analyze a text conversation (Instagram, Snap, WhatsApp)? Use <a href="/analyze-text" style={{ color: "var(--color-accent-light)", textDecoration: "underline", textUnderlineOffset: 2 }}>Analyze Conversation</a> to import screenshots or paste text.
            </div>
          </div>
        )}

        {!isRecording && !isIOS && screenEnabled && audioEnabled && (
          <div className="rounded-xl p-4 mb-3 border text-xs" style={{ backgroundColor: "rgba(52, 211, 153, 0.04)", borderColor: "rgba(52, 211, 153, 0.15)", color: "var(--color-text-muted)" }}>
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)", flexShrink: 0 }}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
              <span className="font-semibold" style={{ color: "var(--color-positive)" }}>Capture audio from Discord, Zoom, Meet, etc.</span>
            </div>
            <p className="m-0 leading-relaxed">When the sharing dialog appears, make sure to check <strong style={{ color: "var(--color-text)" }}>&quot;Share system audio&quot;</strong> or <strong style={{ color: "var(--color-text)" }}>&quot;Also share tab audio&quot;</strong>. This lets Tonvo hear both you and the other person for a complete conversation analysis.</p>
          </div>
        )}

        {!isRecording && screenEnabled && !isIOS && (
          <div className="rounded-xl p-4 mb-3 border text-xs flex items-center gap-3" style={{ backgroundColor: "rgba(200, 200, 216, 0.03)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
            Ensure you have the right to analyze the content visible on your screen. By starting a session, you confirm compliance with our <a href="/terms" target="_blank" style={{ color: "var(--color-accent-light)", textDecoration: "underline", textUnderlineOffset: 2 }}>Terms of Service</a>.
          </div>
        )}

        {!isRecording && !audioEnabled && screenEnabled && (
          <div className="rounded-xl p-4 mb-6 border text-sm flex items-center gap-3" style={{ backgroundColor: "rgba(251, 191, 36, 0.06)", borderColor: "rgba(251, 191, 36, 0.3)", color: "var(--color-neutral)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            Audio disabled: no transcription, no conversation analysis. Only screen content will be analyzed visually.
          </div>
        )}

        {/* KPI Grid - 6 columns when recording with audio */}
        <div className={`grid gap-3 sm:gap-4 mb-8 ${isRecording && audioEnabled && segments.length > 0 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"}`}>
          <div className="kpi-card flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Tone</span>
            <ToneIndicator tone={currentTone} size="lg" />
          </div>
          <div className="kpi-card flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-wider mb-3" style={{ color: analysisStatus === "completed" ? "var(--color-positive)" : "var(--color-text-muted)" }}>
              {analysisStatus === "completed" ? "Completed" : processing ? "Analyzing..." : isRecording ? (audioService.current?.hasAudio ? "Listening" : "Screen Only") : "Idle"}
            </span>
            {analysisStatus === "completed" ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)" }}><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <AudioWave active={isRecording && (audioService.current?.hasAudio ?? false)} />
            )}
          </div>
          <div className="kpi-card flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Quality</span>
            <span className="text-3xl font-bold" style={{ color: qualityScore > 0 ? getScoreColor(qualityScore) : "var(--color-text-muted)" }}>{qualityScore > 0 ? qualityScore : "--"}</span>
          </div>
          <div className="kpi-card flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Segments</span>
            <span className="text-3xl font-bold" style={{ color: "var(--color-accent-light)" }}>{segments.length}</span>
          </div>
          {isRecording && audioEnabled && segments.length > 0 && (
            <>
              <div className="kpi-card flex flex-col items-center justify-center">
                <span className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Engagement</span>
                <span className="text-3xl font-bold" style={{ color: engagementScore > 0 ? getScoreColor(engagementScore) : "var(--color-text-muted)" }}>{engagementScore > 0 ? engagementScore : "--"}</span>
              </div>
              <div className="kpi-card flex flex-col items-center justify-center">
                <span className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Response</span>
                <span className="text-lg font-bold" style={{ color: delayConfig.color }}>{delayConfig.label}</span>
              </div>
            </>
          )}
        </div>

        {/* Analysis Ready Banner */}
        {isRecording && analysisStatus === "completed" && (
          <div className="analysis-complete-banner rounded-xl border p-5 mb-6 segment-enter" style={{ backgroundColor: "rgba(52, 211, 153, 0.06)", borderColor: "rgba(52, 211, 153, 0.25)" }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <div>
                  <p className="text-sm font-semibold m-0" style={{ color: "var(--color-positive)" }}>Analysis ready</p>
                  <p className="text-xs m-0 mt-1" style={{ color: "var(--color-text-muted)" }}>
                    {segments.length > 0 ? `${segments.length} segments analyzed.` : "Screen analyzed."} Session still active -- stop when you're ready.
                  </p>
                </div>
              </div>
              <button onClick={stopSession} className="px-4 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all hover:opacity-90" style={{ backgroundColor: "var(--color-positive)", color: "#000" }}>
                Stop & View Report
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  COPILOT PANEL — inline real-time assistant (Pro+ only)        */}
        {/* ============================================================ */}
        {isRecording && audioEnabled && !can("coachingTips") && (
          <div className="mb-6">
            <UpgradePrompt feature="AI Copilot — Live coaching, insights & signals" plan="Pro" />
          </div>
        )}
        {isRecording && audioEnabled && can("coachingTips") && (
          <div className="copilot-inline rounded-2xl border mb-6 segment-enter" style={{ backgroundColor: "rgba(14, 14, 17, 0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderColor: "rgba(255, 255, 255, 0.08)", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)" }}>
            {/* Copilot Header */}
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div className="flex items-center gap-2">
                <div className="copilot-pulse-dot" />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>{t("copilot.title")}</span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{formatTime(elapsed)}</span>
              </div>
              <div className="flex items-center gap-3">
                {qualityScore > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Quality</span>
                    <span className="text-sm font-bold" style={{ color: getScoreColor(qualityScore) }}>{qualityScore}</span>
                  </div>
                )}
                {engagementScore > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Engagement</span>
                    <span className="text-sm font-bold" style={{ color: getScoreColor(engagementScore) }}>{engagementScore}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Copilot Body — 2-column on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ minHeight: 80 }}>
              {/* Left: Coaching + Insight */}
              <div className="p-5 flex flex-col gap-4" style={{ borderRight: "1px solid rgba(255, 255, 255, 0.04)" }}>
                {/* Coaching */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#818cf8" }}>{t("copilot.coaching")}</span>
                  </div>
                  <p className="text-sm m-0 leading-relaxed" style={{ color: coachingTip ? "var(--color-text)" : "var(--color-text-muted)" }}>
                    {coachingTip || t("copilot.noCoaching")}
                  </p>
                </div>

                {/* Insight */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#38bdf8" }}>{t("copilot.insight")}</span>
                  </div>
                  <p className="text-sm m-0 leading-relaxed" style={{ color: liveInsight ? "var(--color-text)" : "var(--color-text-muted)" }}>
                    {liveInsight || t("copilot.noInsight")}
                  </p>
                </div>
              </div>

              {/* Right: Suggestion + Signals + Speaker Balance */}
              <div className="p-5 flex flex-col gap-4">
                {/* Suggestion */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-positive)" }}>{t("copilot.suggestion")}</span>
                  </div>
                  <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                    {currentSuggestion}
                  </p>
                </div>

                {/* Speaker Balance */}
                {speakerBalance != null && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-accent-light)" }}>{t("copilot.speakerBalance")}</span>
                    </div>
                    <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--color-text-muted)" }}>
                      <span>{t("copilot.you")} {Math.round(speakerBalance * 100)}%</span>
                      <span>{t("copilot.them")} {100 - Math.round(speakerBalance * 100)}%</span>
                    </div>
                    <div className="copilot-balance-bar">
                      <div className="copilot-balance-fill copilot-balance-you" style={{ width: `${Math.round(speakerBalance * 100)}%` }} />
                      <div className="copilot-balance-fill copilot-balance-them" style={{ width: `${100 - Math.round(speakerBalance * 100)}%` }} />
                    </div>
                  </div>
                )}

                {/* Signals */}
                {signals.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-neutral)" }}>{t("copilot.signals")}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {signals.slice(-6).map((s, i) => {
                        const cfg = SIGNAL_CONFIG[s.signal];
                        return (
                          <div key={i} className="copilot-signal-badge" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                            <span className="copilot-signal-dot" style={{ backgroundColor: cfg.color }} />
                            <span>{s.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Screen Analysis Card */}
        {isRecording && screenEnabled && audioService.current?.hasVideo && (
          <div className="screen-analysis-card rounded-xl border p-5 mb-6" style={{ backgroundColor: "var(--color-surface)", borderColor: screenAnalysisCompleted ? "rgba(52, 211, 153, 0.3)" : analyzingScreen ? "rgba(200, 200, 216, 0.2)" : "var(--color-border)", transition: "border-color 0.3s ease" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: screenAnalysisCompleted ? "var(--color-positive)" : "var(--color-accent-light)" }}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: screenAnalysisCompleted ? "var(--color-positive)" : "var(--color-accent-light)" }}>Screen Analysis</span>
              </div>
              {screenAnalysisCompleted ? (
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)" }}><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="text-xs font-medium" style={{ color: "var(--color-positive)" }}>Analyzed -- monitoring for changes</span>
                </div>
              ) : analyzingScreen ? (
                <div className="flex items-center gap-2">
                  <div className="screen-scan-indicator" />
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Analyzing...</span>
                </div>
              ) : null}
            </div>
            {screenAnalysis ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ backgroundColor: "rgba(200, 200, 216, 0.1)", color: "var(--color-accent-light)" }}>{contentTypeLabels[screenAnalysis.contentType] || "Screen"}</span>
                  <span className="text-xs px-2 py-1 rounded-md font-medium capitalize" style={{ backgroundColor: screenAnalysis.mood === "positive" ? "rgba(52, 211, 153, 0.1)" : screenAnalysis.mood === "negative" ? "rgba(248, 113, 113, 0.1)" : "rgba(251, 191, 36, 0.1)", color: screenAnalysis.mood === "positive" ? "var(--color-positive)" : screenAnalysis.mood === "negative" ? "var(--color-negative)" : "var(--color-neutral)" }}>{screenAnalysis.mood}</span>
                </div>
                <p className="text-sm m-0" style={{ color: "var(--color-text)" }}>{screenAnalysis.context}</p>
                <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>{screenAnalysis.insight}</p>
              </div>
            ) : (
              <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>{analyzingScreen ? t("session.analyzing") : t("session.waitingFirstAnalysis")}</p>
            )}
          </div>
        )}

        {/* Screen Analysis Summary Panel */}
        {screenSummary && (
          <div className="rounded-xl border p-6 mb-6 segment-enter" style={{ backgroundColor: "rgba(99, 102, 241, 0.04)", borderColor: "rgba(99, 102, 241, 0.2)" }}>
            <div className="flex items-center gap-2 mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#818cf8" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#818cf8" }}>Analysis Summary</span>
            </div>

            {/* Attraction Score + Tone row */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(200, 200, 216, 0.06)" }}>
                <span className="text-xs block mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Attraction Score</span>
                <span className="text-4xl font-bold" style={{ color: screenSummary.attractionScore >= 70 ? "var(--color-positive)" : screenSummary.attractionScore >= 40 ? "var(--color-neutral)" : "var(--color-negative)" }}>
                  {screenSummary.attractionScore}
                </span>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>%</span>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(200, 200, 216, 0.06)" }}>
                <span className="text-xs block mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Conversation Tone</span>
                <span className="text-sm font-bold px-3 py-1.5 rounded-md inline-block" style={{
                  backgroundColor: screenSummary.conversationTone === "very_positive" || screenSummary.conversationTone === "positive" ? "rgba(52, 211, 153, 0.12)" : screenSummary.conversationTone === "negative" ? "rgba(248, 113, 113, 0.12)" : screenSummary.conversationTone === "awkward" ? "rgba(251, 146, 60, 0.12)" : "rgba(251, 191, 36, 0.1)",
                  color: screenSummary.conversationTone === "very_positive" || screenSummary.conversationTone === "positive" ? "var(--color-positive)" : screenSummary.conversationTone === "negative" ? "var(--color-negative)" : "var(--color-neutral)",
                }}>
                  {screenSummary.conversationTone.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </div>
            </div>

            {/* Global Summary */}
            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "rgba(200, 200, 216, 0.06)" }}>
              <span className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: "var(--color-accent-light)" }}>Summary</span>
              <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>{screenSummary.summary}</p>
            </div>

            {/* Key Insights */}
            {screenSummary.keyInsights.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-wider block mb-3" style={{ color: "var(--color-text-muted)" }}>Key Insights</span>
                <div className="space-y-2">
                  {screenSummary.keyInsights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "#818cf8" }} />
                      <span className="text-sm" style={{ color: "var(--color-text)" }}>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths + Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {screenSummary.strengths.length > 0 && (
                <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(52, 211, 153, 0.04)", borderLeft: "3px solid var(--color-positive)" }}>
                  <span className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: "var(--color-positive)" }}>Strengths</span>
                  <div className="space-y-1.5">
                    {screenSummary.strengths.map((s, i) => (
                      <p key={i} className="text-sm m-0" style={{ color: "var(--color-text)" }}>{s}</p>
                    ))}
                  </div>
                </div>
              )}
              {screenSummary.improvements.length > 0 && (
                <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(251, 191, 36, 0.04)", borderLeft: "3px solid var(--color-neutral)" }}>
                  <span className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: "var(--color-neutral)" }}>To Improve</span>
                  <div className="space-y-1.5">
                    {screenSummary.improvements.map((imp, i) => (
                      <p key={i} className="text-sm m-0" style={{ color: "var(--color-text)" }}>{imp}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recommendation */}
            {screenSummary.recommendation && (
              <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(52, 211, 153, 0.06)", borderLeft: "3px solid var(--color-positive)" }}>
                <span className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: "var(--color-positive)" }}>Recommendation</span>
                <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>{screenSummary.recommendation}</p>
              </div>
            )}
          </div>
        )}

        {/* Generating Screen Summary Indicator */}
        {generatingScreenSummary && (
          <div className="rounded-xl border p-5 mb-6 flex items-center gap-3" style={{ backgroundColor: "rgba(99, 102, 241, 0.04)", borderColor: "rgba(99, 102, 241, 0.15)" }}>
            <div className="screen-scan-indicator" />
            <span className="text-sm" style={{ color: "#818cf8" }}>Generating analysis summary...</span>
          </div>
        )}

        {/* Suggestion Card — shown only when NOT recording (idle state) */}
        {audioEnabled && !isRecording && (<div className="mb-8"><SuggestionCard suggestion={currentSuggestion} emotions={currentEmotions} /></div>)}

        {/* Tab navigation for main content area */}
        {audioEnabled && (
          <div className="mb-6">
            <div className="filter-bar">
              <button className={`filter-chip ${activeTab === "insights" ? "active" : ""}`} onClick={() => setActiveTab("insights")}>
                Insights
              </button>
              <button className={`filter-chip ${activeTab === "transcript" ? "active" : ""}`} onClick={() => setActiveTab("transcript")}>
                Transcript
              </button>
              <button className={`filter-chip ${activeTab === "timeline" ? "active" : ""}`} onClick={() => setActiveTab("timeline")}>
                Timeline {keyMoments.length > 0 ? `(${keyMoments.length})` : ""}
              </button>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {audioEnabled && activeTab === "insights" && (
          <div className="space-y-4">
            {/* Conversation Overview */}
            {segments.length > 0 && (
              <div className="glass-card-static rounded-xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-muted)" }}>Conversation Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Classification</span>
                    <span className="text-sm font-semibold px-3 py-1 rounded-full inline-block" style={{ backgroundColor: classConfig.bg, color: classConfig.color }}>{classConfig.label}</span>
                  </div>
                  <div>
                    <span className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Quality Score</span>
                    <span className="text-2xl font-bold" style={{ color: getScoreColor(qualityScore) }}>{qualityScore}</span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>/100</span>
                  </div>
                  <div>
                    <span className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Engagement</span>
                    <span className="text-2xl font-bold" style={{ color: getScoreColor(engagementScore) }}>{engagementScore}</span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>/100</span>
                  </div>
                  <div>
                    <span className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Response Speed</span>
                    <span className="text-sm font-semibold" style={{ color: delayConfig.color }}>{delayConfig.label}</span>
                  </div>
                </div>

                {/* Score bars */}
                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Quality</span>
                      <span className="text-xs font-medium" style={{ color: getScoreColor(qualityScore) }}>{qualityScore}%</span>
                    </div>
                    <div className="score-bar-track"><div className="score-bar-fill" style={{ width: `${qualityScore}%`, backgroundColor: getScoreColor(qualityScore) }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Engagement</span>
                      <span className="text-xs font-medium" style={{ color: getScoreColor(engagementScore) }}>{engagementScore}%</span>
                    </div>
                    <div className="score-bar-track"><div className="score-bar-fill" style={{ width: `${engagementScore}%`, backgroundColor: getScoreColor(engagementScore) }} /></div>
                  </div>
                </div>
              </div>
            )}

            {/* Latest coaching + insight combined */}
            {segments.length === 0 && (
              <div className="glass-card-static rounded-xl p-8 text-center">
                {isRecording && interimText ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-accent-light)", opacity: 0.7 }}>Live</p>
                    <p className="text-sm m-0" style={{ color: "var(--color-text)", opacity: 0.8 }}>{interimText}</p>
                  </div>
                ) : (
                  <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>
                    {isRecording ? audioService.current?.hasAudio ? t("session.listeningInsights") : t("session.noAudioDetected") : t("session.pressStart")}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Transcript Tab */}
        {audioEnabled && activeTab === "transcript" && (
          <div>
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              {segments.length === 0 && !interimText ? (
                <div className="p-8 text-center">
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {isRecording ? audioService.current?.hasAudio ? t("session.listeningTranscript") : t("session.noAudioDetected") : t("session.pressStart")}
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                  {/* Live interim transcription — instant feedback while Whisper processes */}
                  {interimText && isRecording && (
                    <div className="p-4 flex items-start gap-4" style={{ opacity: 0.7 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "var(--color-accent-light)", animation: "pulse 1.5s ease-in-out infinite", flexShrink: 0, marginTop: 4 }} />
                      <div className="flex-1">
                        <p className="text-sm m-0 italic" style={{ color: "var(--color-text)" }}>
                          {interimText}
                        </p>
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Live</span>
                      </div>
                    </div>
                  )}
                  {/* Merge consecutive segments from the same speaker for cleaner display */}
                  {segments.reduce<{ speaker?: string; texts: string[]; tone: TranscriptSegment["tone"]; timestamp: number; signals: Array<{ signal: ConversationSignal; label: string }> }[]>((merged, seg) => {
                    const last = merged[merged.length - 1];
                    if (last && last.speaker === seg.speaker && seg.timestamp - last.timestamp < 30000) {
                      // Same speaker within 30s — merge texts
                      last.texts.push(seg.text);
                      last.tone = seg.tone; // Keep latest tone
                      if (seg.tone.signal && seg.tone.signal !== "none") {
                        last.signals.push({ signal: seg.tone.signal, label: seg.tone.signalLabel || SIGNAL_CONFIG[seg.tone.signal].label });
                      }
                    } else {
                      merged.push({
                        speaker: seg.speaker,
                        texts: [seg.text],
                        tone: seg.tone,
                        timestamp: seg.timestamp,
                        signals: seg.tone.signal && seg.tone.signal !== "none" ? [{ signal: seg.tone.signal, label: seg.tone.signalLabel || SIGNAL_CONFIG[seg.tone.signal].label }] : [],
                      });
                    }
                    return merged;
                  }, []).map((group, i) => (
                    <div key={i} className="p-4 flex items-start gap-4 segment-enter">
                      <ToneIndicator tone={group.tone.tone} size="sm" showLabel={false} />
                      <div className="flex-1">
                        {group.signals.length > 0 && (
                          <div className="mb-1 flex flex-wrap gap-1">
                            {group.signals.map((s, si) => (
                              <span key={si} className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: SIGNAL_CONFIG[s.signal].bg, color: SIGNAL_CONFIG[s.signal].color }}>
                                {s.label}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-sm m-0" style={{ color: "var(--color-text)" }}>
                          {group.speaker && <span className="text-xs font-semibold mr-2" style={{ color: group.speaker === "Speaker 1" ? "#818cf8" : "var(--color-accent-light)" }}>{group.speaker === "Speaker 1" ? t("copilot.you") : group.speaker === "Speaker 2" ? t("copilot.them") : group.speaker}:</span>}
                          {group.texts.join(" ")}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{new Date(group.timestamp).toLocaleTimeString()}</span>
                          {group.tone.classification && (
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: CLASSIFICATION_CONFIG[group.tone.classification].bg, color: CLASSIFICATION_CONFIG[group.tone.classification].color }}>
                              {CLASSIFICATION_CONFIG[group.tone.classification].label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {audioEnabled && activeTab === "timeline" && (
          <div>
            {keyMoments.length === 0 ? (
              <div className="glass-card-static rounded-xl p-8 text-center">
                <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>
                  {isRecording ? "Key moments will appear here as they are detected..." : "No key moments recorded in this session."}
                </p>
              </div>
            ) : (
              <div className="timeline-container">
                {keyMoments.map((moment, i) => {
                  const cfg = SIGNAL_CONFIG[moment.type];
                  return (
                    <div key={i} className="timeline-item segment-enter">
                      <div className="timeline-marker" style={{ backgroundColor: cfg.color }} />
                      <div className="timeline-content rounded-xl border p-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{moment.label}</span>
                          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{getTimeSince(moment.timestamp)}</span>
                        </div>
                        <p className="text-sm m-0" style={{ color: "var(--color-text)" }}>{moment.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Audio disabled message */}
        {!audioEnabled && isRecording && (
          <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>Audio is disabled. No transcription or conversation analysis.{screenEnabled ? " Screen visual analysis is running." : ""}</p>
          </div>
        )}
      </div>

      {/* Copilot PiP — desktop only (Pro+ only) */}
      {!isMobile && (
        <CopilotPiP
          ref={copilotPiPRef}
          active={isRecording && can("copilotPiP")}
          suggestion={currentSuggestion}
          suggestedResponses={suggestedResponses}
          detectedQuestion={detectedQuestion}
          elapsed={elapsed}
          participants={participants}
          interimText={interimText}
          paused={copilotPaused}
          onTogglePause={() => setCopilotPaused((p) => !p)}
          onAsk={handleAskCopilot}
          asking={copilotAsking}
          answer={copilotAnswer}
          onStop={stopSession}
          onPiPStateChange={handlePiPStateChange}
          labels={{
            title: t("copilot.title"),
            sayThis: t("copilot.sayThis"),
            listening: t("copilot.listening"),
            stopSession: t("copilot.stopSession"),
            respondNow: t("copilot.respondNow"),
            invisibleBadge: t("copilot.invisibleInScreenShare"),
            participantCount: t("copilot.participantCount", { count: 1 }),
            participantCountPlural: t("copilot.participantCount", { count: 2 }),
            paused: t("copilot.paused", "Paused"),
            askPlaceholder: t("copilot.askPlaceholder", "Ask the copilot..."),
          }}
        />
      )}

      {/* Copilot Inline — mobile only, embedded directly in the page */}
      {isMobile && isRecording && can("copilotPiP") && audioEnabled && (
        <CopilotInline
          suggestion={currentSuggestion}
          suggestedResponses={suggestedResponses}
          detectedQuestion={detectedQuestion}
          elapsed={elapsed}
          participants={participants}
          interimText={interimText}
          paused={copilotPaused}
          onTogglePause={() => setCopilotPaused((p) => !p)}
          onAsk={handleAskCopilot}
          asking={copilotAsking}
          answer={copilotAnswer}
          onStop={stopSession}
          labels={{
            title: t("copilot.title"),
            sayThis: t("copilot.sayThis"),
            listening: t("copilot.listening"),
            stopSession: t("copilot.stopSession"),
            respondNow: t("copilot.respondNow"),
            participantCount: t("copilot.participantCount", { count: 1 }),
            participantCountPlural: t("copilot.participantCount", { count: 2 }),
            paused: t("copilot.paused", "Paused"),
            askPlaceholder: t("copilot.askPlaceholder", "Ask the copilot..."),
          }}
        />
      )}

      {/* Copilot status — desktop only, NO in-page coaching during live session (invisible to screen share) */}
      {!isMobile && isRecording && can("copilotPiP") && pipOpen && (
        <div className="copilot-status-pill">
          <div className="copilot-status-pill__pulse" />
          <span>{t("session.copilotActive")}</span>
          <span className="copilot-status-pill__mode">
            {copilotMode === "documentPiP" ? t("session.copilotInvisible") : t("session.copilotSeparateWindow")}
          </span>
        </div>
      )}

      {/* Reopen button — desktop only, shown when PiP was closed mid-session */}
      {!isMobile && isRecording && can("copilotPiP") && !pipOpen && audioEnabled && (
        <button className="copilot-reopen-btn" onClick={() => copilotPiPRef.current?.requestOpen()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" />
          </svg>
          {t("session.reopenCopilot")}
        </button>
      )}
    </AppShell>
  );
}
