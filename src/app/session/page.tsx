"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { authFetch, authFetchFormData } from "@/lib/api-client";
import { AudioCaptureService, type CaptureOptions } from "@/services/audio-capture";
import { LiveSpeechService } from "@/services/live-speech";
import {
  AssemblyAIStreamingService,
  type FinalTurnEvent,
  type StreamLabel,
  type StreamStatus,
} from "@/services/assemblyai-stream";
import { CopilotAnalysisQueue, type AnalyzeOutcome, type CopilotTurn } from "@/lib/copilot-queue";
import { EchoFilter } from "@/lib/echo-filter";
import {
  createConversation,
  saveSegments,
  toDbTone,
  toScore,
  toStringList,
  updateConversation,
} from "@/lib/conversations-client";
import AppShell from "@/components/AppShell";
import { useToast } from "@/components/Toast";
import ToneIndicator from "@/components/ToneIndicator";
import AudioWave from "@/components/AudioWave";
import SuggestionCard from "@/components/SuggestionCard";
import CopilotPiP, { type CopilotPiPHandle, type CopilotPiPLabels } from "@/components/CopilotPiP";
import CopilotInline from "@/components/CopilotInline";
import LiveTranslationStream from "@/components/LiveTranslationStream";
import LiveCopilotPanel from "@/components/LiveCopilotPanel";
import { motion, AnimatePresence } from "framer-motion";
// motion: live-grid + KPI strip entrance; AnimatePresence: tab transitions
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
  key_point:   { label: "Key Point",   color: "var(--color-accent-light)", bg: "var(--color-surface-2)" },
  none:        { label: "",            color: "",                          bg: "" },
};

const CLASSIFICATION_CONFIG: Record<ConversationClassification, { label: string; color: string; bg: string }> = {
  very_positive: { label: "Excellent",  color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.12)" },
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

// Mode-aware keyterms for AssemblyAI streaming — biases the model toward the
// vocabulary the user is most likely to use, improving recognition of jargon.
function buildKeyterms(mode: ConversationMode): string[] {
  const base = ["Tonvo"];
  switch (mode) {
    case "sales":
      return [
        ...base, "close rate", "closing", "objection", "deal", "prospect",
        "pipeline", "lead", "qualification", "BANT", "follow-up", "demo",
        "discovery call", "ROI", "devis", "contrat", "signature",
      ];
    case "recruitment":
      return [
        ...base, "candidate", "interview", "offer", "salary", "package",
        "notice period", "soft skills", "cultural fit", "stack", "seniority",
      ];
    case "support":
      return [
        ...base, "ticket", "incident", "resolution", "escalation", "SLA",
        "workaround", "bug", "feature request", "rollback",
      ];
    case "networking":
      return [
        ...base, "introduction", "follow up", "warm intro", "referral",
        "ecosystem", "partnership", "synergy",
      ];
    default:
      return base;
  }
}

/** Languages offered in the Audio Language selector. Order = display order. */
const AUDIO_LANGS: { code: string; flag: string; label: string }[] = [
  { code: "auto", flag: "🌐", label: "Auto-detect" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "pt", flag: "🇵🇹", label: "Português" },
  { code: "nl", flag: "🇳🇱", label: "Nederlands" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
  { code: "ko", flag: "🇰🇷", label: "한국어" },
];

/** Live transcription state shown in the session header. */
type TranscriptionStatus = "idle" | "connecting" | "live" | "reconnecting" | "fallback";

/** Render state read by long-lived callbacks (streams, analysis queue). */
interface LiveContext {
  conversationMode: ConversationMode;
  screenAnalysis: ScreenAnalysis | null;
  detectedQuestion: DetectedQuestion | null;
  suggestedResponses: Array<{ text: string; intent: string; label: string }>;
  detectedLanguage: string | null;
  audioLang: string;
  uiLanguage: string;
}

// Placeholder tone for a turn whose analysis hasn't arrived (or was skipped).
const NEUTRAL_TONE: ToneResult = {
  tone: "neutral", confidence: 0.5, suggestion: "", emotions: [],
  signal: "none", signalLabel: "", qualityScore: 0, classification: "neutral",
  coachingTip: "", liveInsight: "", engagementScore: 0, responseDelay: "normal",
};

const ANALYZE_TIMEOUT_MS = 12_000;
// How long a mic ("me") turn waits for a matching shared-tab turn before it counts as real speech.
const ECHO_HOLD_MS = 1_500;

function newTurnId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Phrases batch transcription invents on silence / background music.
const SILENCE_HALLUCINATIONS = ["sous-titres","amara.org","sous-titrage","merci d'avoir regard","merci de votre visionnage","thank you for watching","thanks for watching","subtitles by","transcrit par","please subscribe","like and subscribe","video/content end","end of video","fin de la vidéo","ご視聴","チャンネル登録"];

/** Empty, too short, or a known silence hallucination (incl. wrong-script output). */
function isLikelyNoise(text: string, detectedLanguage: string | null): boolean {
  const lower = text.trim().toLowerCase();
  if (lower.length < 3) return true;
  if (SILENCE_HALLUCINATIONS.some((h) => lower.includes(h))) return true;
  const hasNonLatinScript = /[　-鿿가-힯؀-ۿ]/.test(text);
  const expectsLatinScript = !detectedLanguage || /^(fr|en|es|pt|de|it|nl|pl|ro|cs|sv|da|no|fi|hu|tr|vi|id|ms)/.test(detectedLanguage);
  return hasNonLatinScript && expectsLatinScript;
}

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

  // Scripted demo mode (?demo=1): replays a fake call into the REAL session UI
  // without touching mic, network, auth or the DB. Used to film the landing
  // demo video on the genuine product. See the demo-driver effect below.
  // Resolved after mount (not during render) so SSR/client first paint match —
  // avoids a hydration mismatch on the AppShell auth gate.
  const [isDemo, setIsDemo] = useState(false);
  useEffect(() => {
    setIsDemo(new URLSearchParams(window.location.search).has("demo"));
  }, []);
  const demoTranscriptRef = useRef<HTMLDivElement>(null);
  const audioService = useRef<AudioCaptureService | null>(null);
  const liveSpeech = useRef<LiveSpeechService | null>(null);
  // Live AssemblyAI streams: one mixed stream, or "me" (mic) + "them" (shared tab) in meetings.
  const aaiStreams = useRef<AssemblyAIStreamingService[]>([]);
  const streamStatuses = useRef(new Map<AssemblyAIStreamingService, StreamStatus>());
  const streamLabels = useRef(new Map<AssemblyAIStreamingService, StreamLabel>());
  const dualStreamRef = useRef(false);
  const echoFilter = useRef(new EchoFilter());
  // True when AssemblyAI is providing transcription — short-circuits the batch
  // fallback pipeline so we don't double-pay or duplicate segments.
  const useAssemblyAIForAnalysis = useRef(false);
  const analysisQueue = useRef<CopilotAnalysisQueue<ToneResult> | null>(null);
  const [transcriptionStatus, setTranscriptionStatus] = useState<TranscriptionStatus>("idle");
  const [copilotFailures, setCopilotFailures] = useState(0);
  const [transcribeDown, setTranscribeDown] = useState(false);
  const transcribeFailures = useRef(0);
  const summaryBackoffMs = useRef(0);
  const summaryRetryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processingToastId = useRef<string | null>(null);
  const screenAnalysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio language for AssemblyAI streaming. "auto" enables language_detection.
  // Persisted across sessions in localStorage; defaults to UI language on first run.
  const [audioLang, setAudioLang] = useState<string>(() => {
    if (typeof window === "undefined") return "auto";
    return localStorage.getItem("tonvo-audio-lang") || (i18n.language?.slice(0, 2) ?? "auto");
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tonvo-audio-lang", audioLang);
    }
  }, [audioLang]);

  // Session time limit for free plan users
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const warningShownRef = useRef(false);
  const hasSessionTimeLimit = features.maxSessionDurationSec > 0;

  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  // Sharing the meeting tab is how Tonvo hears the other side of a call.
  // On by default on desktop; the choice is remembered per browser.
  const [screenEnabled, setScreenEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tonvo-share-meeting");
      if (saved !== null) setScreenEnabled(saved === "1");
    } catch { /* storage unavailable */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem("tonvo-share-meeting", screenEnabled ? "1" : "0"); } catch { /* storage unavailable */ }
  }, [screenEnabled]);

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

  // ── Scripted demo driver (?demo=1) ──────────────────────────────────────
  // Plays a deterministic fake closing-call straight into the real session
  // state (segments, copilot suggestion/coaching/insight, signals, scores).
  // No mic, no AssemblyAI, no /api, no DB — startSession is never called.
  useEffect(() => {
    if (!isDemo) return;

    // Activate the live UI without any hardware/network.
    setAudioEnabled(true);
    setCopilotPaused(false);
    setIsRecording(true);
    setSessionStart(new Date());
    setAnalysisStatus("running");
    setActiveTab("transcript");
    setDetectedLanguage("en");
    setCurrentTone("neutral");

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const at = (ms: number, fn: () => void) => timeouts.push(setTimeout(fn, ms));

    // Smooth count-up for the KPI numbers.
    let qCur = 0, eCur = 0;
    const ramp = (
      get: () => number, set: (v: number) => void, setter: (v: number) => void, to: number, ms = 700,
    ) => {
      const from = get();
      const start = Date.now();
      const id = setInterval(() => {
        const p = Math.min(1, (Date.now() - start) / ms);
        const v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        set(v); setter(v);
        if (p >= 1) clearInterval(id);
      }, 33);
      intervals.push(id);
    };
    const rampQ = (to: number) => ramp(() => qCur, (v) => { qCur = v; }, setQualityScore, to);
    const rampE = (to: number) => ramp(() => eCur, (v) => { eCur = v; }, setEngagementScore, to);

    const seg = (
      speaker: "Speaker 1" | "Speaker 2",
      text: string,
      tone: Tone,
      classification: ConversationClassification,
      signal: ConversationSignal,
      signalLabel: string,
    ) => {
      const toneResult: ToneResult = {
        tone, confidence: 0.92, suggestion: "", emotions: [],
        signal, signalLabel, qualityScore: qCur, classification,
        coachingTip: "", liveInsight: "", engagementScore: eCur, responseDelay: "normal",
      };
      setSegments((prev) => [
        ...prev,
        { text, timestamp: Date.now(), tone: toneResult, speaker, detectedLanguage: "en" },
      ]);
      if (signal !== "none") {
        setSignals((prev) => [...prev, { signal, label: signalLabel, time: Date.now() }]);
        setKeyMoments((prev) => [...prev, { timestamp: Date.now(), type: signal, label: signalLabel, text, speaker }]);
      }
    };

    // "Speaker 1" → You (the rep), "Speaker 2" → Them (the prospect)
    at(1200, () => {
      seg("Speaker 2", "Honestly, we've already trialed a couple of tools like this.", "neutral", "neutral", "key_point", "context");
      setLiveInsight("They've evaluated competitors. Educated buyer, likely price-aware.");
      setSpeakerBalance(0.34); rampQ(71); rampE(67);
    });
    at(3600, () => {
      seg("Speaker 1", "Makes sense. What made those fall short for your team?", "neutral", "neutral", "none", "");
      setCoachingTip("Strong discovery question. Let them name the gap themselves.");
      setSpeakerBalance(0.62);
    });
    at(6000, () => {
      seg("Speaker 2", "They were powerful, but my reps just… never actually used them.", "negative", "awkward", "objection", "adoption risk");
      setCurrentTone("negative");
      setLiveInsight("Real blocker is adoption, not features. Sell the behaviour change.");
      setSpeakerBalance(0.30); rampE(73);
    });
    at(8000, () => {
      setCurrentSuggestion("So the win isn't more features. It's your team actually using it on every call?");
      rampQ(79);
    });
    at(10000, () => {
      seg("Speaker 1", "So the real win is the team using it on every call, not more features?", "neutral", "neutral", "none", "");
      setCoachingTip("Mirror and confirm. You're framing the problem in their own words.");
      setSpeakerBalance(0.60);
    });
    at(12200, () => {
      seg("Speaker 2", "Exactly. Though I'll be honest, the price is higher than I budgeted.", "negative", "negative", "objection", "price");
      setCurrentTone("negative");
      setCurrentSuggestion("");
      setCoachingTip("Don't discount. Quantify the ROI before you talk numbers.");
      setSpeakerBalance(0.32);
    });
    at(14000, () => {
      setCurrentSuggestion("Before price: how many deals slipped last quarter from a call going sideways?");
      setLiveInsight("Shift the frame from cost to cost-of-inaction.");
      rampQ(83);
    });
    at(15800, () => {
      seg("Speaker 1", "Before we get to price, how many deals slipped last quarter from a call going sideways?", "neutral", "neutral", "none", "");
      setSpeakerBalance(0.57);
    });
    at(18000, () => {
      seg("Speaker 2", "Probably three or four we should have won.", "positive", "positive", "opportunity", "pain quantified");
      setCurrentTone("positive");
      setLiveInsight("Prospect quantified the pain (3 to 4 lost deals). Anchor the ROI right here.");
      setSpeakerBalance(0.34); rampE(85);
    });
    at(20000, () => {
      setCurrentSuggestion("At your ACV, winning back one of those covers Tonvo for a year. Worth a shot?");
      setCoachingTip("Tie the price to a number they just gave you.");
      rampQ(88);
    });
    at(22000, () => {
      seg("Speaker 2", "How flexible is the pricing if we commit annually?", "positive", "very_positive", "opportunity", "buying signal");
      setCurrentTone("positive");
      setLiveInsight("Pricing + annual commitment = buying signal. Move to the close.");
      setDetectedQuestion({ text: "How flexible is the pricing if we commit annually?", speaker: "them", urgency: "high" });
      setSpeakerBalance(0.30); rampE(91);
    });
    at(24000, () => {
      setCurrentSuggestion("Buying signal. Offer annual = 2 months free, then ask for the verbal yes now.");
      setSuggestedResponses([
        { label: "Close", intent: "close", text: "Annual gets you two months free. Want me to send it over today?" },
        { label: "Probe", intent: "probe", text: "Happy to flex. Is annual the only thing between us and a yes?" },
        { label: "Value", intent: "redirect", text: "One saved deal covers the year. Shall we lock annual in?" },
      ]);
      rampQ(91);
    });
    at(26000, () => {
      seg("Speaker 1", "Annual gets you two months free. Want me to send it over today?", "positive", "positive", "none", "");
      setCoachingTip("Clean ask. Now stay silent and let them answer.");
      setSuggestedResponses([]);
      setDetectedQuestion(null);
      setSpeakerBalance(0.60);
    });
    at(28300, () => {
      seg("Speaker 2", "Yeah, send it through.", "positive", "very_positive", "agreement", "verbal yes");
      setCurrentTone("positive");
      setSpeakerBalance(0.44); rampQ(93); rampE(94);
    });
    at(29600, () => {
      setCurrentSuggestion("Sending now. I'll add a 14-day onboarding so your reps adopt fast.");
      setLiveInsight("Verbal yes secured. Send the agreement while momentum is high.");
      setCoachingTip("Lock the next step before you hang up.");
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  // Keep the live transcript scrolled to the newest line.
  useEffect(() => {
    const el = demoTranscriptRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [segments, interimText]);

  // Session time limit countdown for free plan users
  useEffect(() => {
    if (isDemo || !isRecording || !hasSessionTimeLimit || !sessionStart) {
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
      for (const s of aaiStreams.current) {
        try { s.stop(); } catch { /* ignored */ }
      }
      aaiStreams.current = [];
      useAssemblyAIForAnalysis.current = false;
      analysisQueue.current?.stop();
      analysisQueue.current = null;
      if (summaryRetryTimer.current) {
        clearTimeout(summaryRetryTimer.current);
        summaryRetryTimer.current = null;
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

  // Flush queued segments to the rolling summary. Backs off on errors so a
  // failing endpoint isn't hammered; re-triggers if more segments arrived.
  function flushSummaryQueue() {
    if (summaryUpdatePending.current || summaryRetryTimer.current || unsummarizedSegments.current.length < 2) return;
    summaryUpdatePending.current = true;
    const segsToSummarize = unsummarizedSegments.current.splice(0, 12);
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
        summaryBackoffMs.current = 0;
      })
      .catch((err) => {
        console.error("Rolling summary error:", err);
        unsummarizedSegments.current.unshift(...segsToSummarize);
        // Keep the queue bounded: the oldest lines matter least to a rolling summary.
        const overflow = unsummarizedSegments.current.length - 40;
        if (overflow > 0) unsummarizedSegments.current.splice(0, overflow);
        summaryBackoffMs.current = Math.min(60_000, Math.max(5_000, summaryBackoffMs.current * 2));
      })
      .finally(() => {
        summaryUpdatePending.current = false;
        if (unsummarizedSegments.current.length < 2) return;
        if (summaryBackoffMs.current > 0) {
          summaryRetryTimer.current = setTimeout(() => {
            summaryRetryTimer.current = null;
            flushSummaryQueue();
          }, summaryBackoffMs.current);
        } else {
          flushSummaryQueue();
        }
      });
  }

  /* ----------------------------------------------------------------- */
  /*  Live copilot pipeline                                             */
  /*  Transcription (AssemblyAI streams, or the batch fallback) yields  */
  /*  final turns. Each turn is committed to the transcript at once,    */
  /*  then CopilotAnalysisQueue sends turns to /api/analyze (one request */
  /*  in flight, later turns merged) and applyAnalysis updates the UI.  */
  /*  A failed analysis never loses the transcript.                     */
  /* ----------------------------------------------------------------- */

  // Latest render state for callbacks owned by long-lived services.
  const liveContext: LiveContext = {
    conversationMode,
    screenAnalysis,
    detectedQuestion,
    suggestedResponses,
    detectedLanguage,
    audioLang,
    uiLanguage: i18n.language,
  };
  const liveContextRef = useRef(liveContext);
  liveContextRef.current = liveContext;
  const segmentsRef = useRef<TranscriptSegment[]>(segments);
  segmentsRef.current = segments;

  async function analyzeBatch(batch: CopilotTurn[]): Promise<AnalyzeOutcome<ToneResult>> {
    const ctx = liveContextRef.current;
    const batchIds = new Set(batch.map((turn) => turn.id));
    const recentSegs = segmentsRef.current
      .filter((s) => !s.id || !batchIds.has(s.id))
      .slice(-5)
      .map((s) => ({ text: s.text, tone: s.tone.tone, speaker: s.speaker }));
    const last = batch[batch.length - 1];
    const language = (ctx.audioLang !== "auto" ? ctx.audioLang : (last?.language || ctx.detectedLanguage || ctx.uiLanguage) || "en")
      .slice(0, 2)
      .toLowerCase();
    try {
      const res = await authFetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(ANALYZE_TIMEOUT_MS),
        body: JSON.stringify({
          text: batch.map((turn) => turn.text).join(" "),
          conversationSummary: conversationSummary.current || undefined,
          recentSegments: recentSegs,
          speakerSegments: batch.some((turn) => turn.speaker)
            ? batch.map((turn) => ({ speaker: turn.speaker ?? "?", text: turn.text, start: 0, end: 0 }))
            : undefined,
          mode: ctx.conversationMode,
          screenContext: ctx.screenAnalysis?.context || undefined,
          screenContentType: ctx.screenAnalysis?.contentType || undefined,
          language,
          lastDetectedQuestion: ctx.detectedQuestion || undefined,
          lastSuggestions: ctx.suggestedResponses.length > 0 ? ctx.suggestedResponses.map((r) => r.text) : undefined,
        }),
      });
      if (!res.ok) return { ok: false, status: res.status };
      return { ok: true, analysis: (await res.json()) as ToneResult };
    } catch (err) {
      const timedOut = err instanceof DOMException && (err.name === "TimeoutError" || err.name === "AbortError");
      return { ok: false, status: timedOut ? "timeout" : "network" };
    }
  }

  function applyAnalysis(batch: CopilotTurn[], analysis: ToneResult) {
    const ids = new Set(batch.map((turn) => turn.id));
    const last = batch[batch.length - 1];
    setSegments((prev) => prev.map((s) => (s.id && ids.has(s.id) ? { ...s, tone: analysis } : s)));
    for (const turn of batch) {
      unsummarizedSegments.current.push({
        text: turn.text,
        tone: analysis.tone,
        speaker: turn.speaker,
        signal: analysis.signal,
        signalLabel: analysis.signalLabel,
      });
    }
    if (unsummarizedSegments.current.length >= 2) flushSummaryQueue();
    // Unparseable model reply: keep the current copilot state as is.
    if (analysis.degraded) return;

    setCurrentTone(analysis.tone);
    if (analysis.suggestion) setCurrentSuggestion(analysis.suggestion);
    setCurrentEmotions(analysis.emotions || []);
    if (Array.isArray(analysis.suggestedResponses) && analysis.suggestedResponses.length > 0) {
      setSuggestedResponses(analysis.suggestedResponses);
    }
    // Only clear the question when the AI explicitly returned null (answered / no longer relevant)
    if (analysis.detectedQuestion && analysis.detectedQuestion.text) {
      setDetectedQuestion(analysis.detectedQuestion);
    } else if (analysis.detectedQuestion === null) {
      setDetectedQuestion(null);
    }
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

    const cfg = analysis.signal && analysis.signal !== "none" ? SIGNAL_CONFIG[analysis.signal] : undefined;
    if (analysis.signal && analysis.signal !== "none" && cfg && last) {
      const signalLabel = analysis.signalLabel || cfg.label;
      setSignals((prev) => { const next = [...prev, { signal: analysis.signal, label: signalLabel, time: last.timestamp }]; return next.length > 50 ? next.slice(-50) : next; });
      setKeyMoments((prev) => { const next = [...prev, { timestamp: last.timestamp, type: analysis.signal, label: signalLabel, text: last.text }]; return next.length > 30 ? next.slice(-30) : next; });
      setTimeline((prev) => {
        const next: TimelineEvent[] = [...prev, { timestamp: last.timestamp, type: "signal" as const, signal: analysis.signal, signalLabel: analysis.signalLabel }];
        return next.length > 200 ? next.slice(-200) : next;
      });
    }
  }

  /** Append a finalized turn to the transcript right away (tone filled in later). */
  function commitTurn(turn: CopilotTurn) {
    const speakerSegs: SpeakerSegment[] = turn.speaker ? [{ speaker: turn.speaker, text: turn.text, start: 0, end: 0 }] : [];
    if (speakerSegs.length > 0) updateParticipants(speakerSegs);
    consecutiveSilenceCount.current = 0;
    lastSegmentText.current = turn.text;
    setSegments((prev) => [...prev, {
      id: turn.id,
      text: turn.text,
      timestamp: turn.timestamp,
      tone: NEUTRAL_TONE,
      speaker: turn.speaker,
      speakerSegments: speakerSegs.length > 0 ? speakerSegs : undefined,
      detectedLanguage: turn.language,
    }]);
    setTimeline((prev) => {
      const next: TimelineEvent[] = [...prev, { timestamp: turn.timestamp, type: "transcript" as const, text: turn.text, speaker: turn.speaker, tone: "neutral" as Tone }];
      return next.length > 200 ? next.slice(-200) : next;
    });
  }

  function acceptTurns(turns: CopilotTurn[]) {
    if (turns.length === 0 || !audioService.current) return;
    setInterimText("");
    turns.forEach(commitTurn);
    // Copilot paused → transcript still recorded, no AI call
    if (copilotPausedRef.current) return;
    analysisQueue.current?.push(...turns);
  }

  /** Final turn from an AssemblyAI stream. */
  function handleFinalTurn(event: FinalTurnEvent) {
    if (!audioService.current?.audioEnabled) return;
    const text = event.text?.trim();
    if (!text || text.length < 2) return;
    if (event.language && !liveContextRef.current.detectedLanguage) setDetectedLanguage(event.language);
    const turn: CopilotTurn = { id: newTurnId(), text, speaker: event.speaker, language: event.language, timestamp: event.timestamp };

    if (dualStreamRef.current && event.speaker === "them") {
      echoFilter.current.addThem(text, event.timestamp);
    } else if (dualStreamRef.current && event.speaker === "me") {
      // On speakers (no headset) the mic also hears the prospect. Hold the
      // user's turn briefly and drop it if the shared tab produced the same words.
      setTimeout(() => {
        if (echoFilter.current.isEcho(text, event.timestamp)) return;
        acceptTurnsRef.current([turn]);
      }, ECHO_HOLD_MS);
      return;
    }
    acceptTurns([turn]);
  }

  /** Batch fallback: one recorded ~5 s chunk → /api/transcribe → turns. */
  async function processAudioChunk(blob: Blob) {
    if (!audioService.current?.audioEnabled) return;
    // Live streaming active → the batch recorder's chunks are not needed.
    if (useAssemblyAIForAnalysis.current) return;
    setProcessing(true);
    try {
      const formData = new FormData();
      const blobExt = blob.type.includes("ogg") ? "ogg" : blob.type.includes("mp4") ? "mp4" : "webm";
      formData.append("audio", blob, `audio.${blobExt}`);
      const ctx = liveContextRef.current;
      const langHint = ctx.audioLang !== "auto" ? ctx.audioLang : ctx.detectedLanguage;
      if (langHint) formData.append("language", langHint);
      const res = await authFetchFormData("/api/transcribe", formData, { method: "POST" });
      if (!res.ok) throw new Error(`Transcribe API error: ${res.status}`);
      const data = (await res.json()) as { text?: string; language?: string | null; speakerSegments?: SpeakerSegment[] };
      transcribeFailures.current = 0;
      setTranscribeDown(false);

      const text = (data.text || "").trim();
      if (data.language && !ctx.detectedLanguage) {
        setDetectedLanguage(data.language);
        liveSpeech.current?.setLanguage(data.language);
      }
      if (isLikelyNoise(text, ctx.detectedLanguage)) {
        consecutiveSilenceCount.current += 1;
        return;
      }
      // Skip a chunk that repeats the previous one verbatim
      const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
      if (lastSegmentText.current && normalize(text) === normalize(lastSegmentText.current)) return;

      const parts = data.speakerSegments && data.speakerSegments.length > 0
        ? data.speakerSegments
        : [{ speaker: "", text, start: 0, end: 0 }];
      const now = Date.now();
      const turns: CopilotTurn[] = parts
        .filter((p) => p.text && p.text.trim())
        .map((p, i) => ({
          id: newTurnId(),
          text: p.text.trim(),
          speaker: p.speaker || undefined,
          language: data.language || undefined,
          timestamp: now + i,
        }));
      acceptTurns(turns);
    } catch (err) {
      console.error("[session] fallback transcription error:", err);
      transcribeFailures.current += 1;
      if (transcribeFailures.current >= 3) setTranscribeDown(true);
    } finally {
      setProcessing(false);
    }
  }

  // Long-lived services (audio capture, streams, queue) keep the callback they
  // were given at start: route them through refs to the latest closures.
  const analyzeBatchRef = useRef(analyzeBatch);
  analyzeBatchRef.current = analyzeBatch;
  const applyAnalysisRef = useRef(applyAnalysis);
  applyAnalysisRef.current = applyAnalysis;
  const acceptTurnsRef = useRef(acceptTurns);
  acceptTurnsRef.current = acceptTurns;
  const handleFinalTurnRef = useRef(handleFinalTurn);
  handleFinalTurnRef.current = handleFinalTurn;
  const processAudioChunkRef = useRef(processAudioChunk);
  processAudioChunkRef.current = processAudioChunk;
  const stableProcessAudioChunk = useCallback((blob: Blob) => {
    return processAudioChunkRef.current(blob);
  }, []);

  /** Stop every live transcription stream. */
  function stopStreams() {
    for (const s of aaiStreams.current) {
      try { s.stop(); } catch { /* ignored */ }
    }
    aaiStreams.current = [];
    streamStatuses.current.clear();
    streamLabels.current.clear();
    useAssemblyAIForAnalysis.current = false;
    dualStreamRef.current = false;
  }

  /** Live streaming is gone for good: switch to the batch fallback recorder. */
  function switchToFallback() {
    if (!useAssemblyAIForAnalysis.current) return;
    stopStreams();
    setTranscriptionStatus("fallback");
    toast.show(t("session.fallbackMode", "Live transcription interrupted. Backup mode on, slight delay."), { type: "info", duration: 5000 });
  }

  function handleStreamStatus(stream: AssemblyAIStreamingService, status: StreamStatus) {
    if (status === "stopped") return;
    streamStatuses.current.set(stream, status);
    // Initial start is handled by startSession; only react once streams are live.
    if (!useAssemblyAIForAnalysis.current) return;
    const all = Array.from(streamStatuses.current.values());
    if (all.includes("failed")) switchToFallback();
    else if (all.includes("reconnecting") || all.includes("connecting")) setTranscriptionStatus("reconnecting");
    else setTranscriptionStatus("live");
  }
  const handleStreamStatusRef = useRef(handleStreamStatus);
  handleStreamStatusRef.current = handleStreamStatus;

  /** Open one AssemblyAI stream; resolves once it is live. */
  async function openStream(audioStream: MediaStream | undefined, label: StreamLabel | undefined): Promise<AssemblyAIStreamingService> {
    const stream = new AssemblyAIStreamingService();
    if (!stream.supported) throw new Error("Live streaming not supported in this browser");
    if (label) streamLabels.current.set(stream, label);
    await stream.start(
      (text, isFinal) => setInterimText(isFinal ? "" : text),
      {
        language: audioLang,
        keyterms: buildKeyterms(conversationMode),
        label,
        audioStream,
        onFinalTurn: (turn) => handleFinalTurnRef.current(turn),
        onStatus: (status) => handleStreamStatusRef.current(stream, status),
      },
    );
    return stream;
  }

  /** The user stopped sharing the meeting tab from Chrome's bar. */
  function handleShareEnded({ micStillLive }: { micStillLive: boolean }) {
    if (!micStillLive) {
      stopSessionRef.current?.();
      return;
    }
    const them = aaiStreams.current.find((s) => streamLabels.current.get(s) === "them");
    if (them) {
      them.stop();
      aaiStreams.current = aaiStreams.current.filter((s) => s !== them);
      streamStatuses.current.delete(them);
    }
    dualStreamRef.current = false;
    toast.show(t("session.screenShareEnded", "Sharing stopped: Tonvo now only hears your microphone."), { type: "info", duration: 6000 });
  }
  const handleShareEndedRef = useRef(handleShareEnded);
  handleShareEndedRef.current = handleShareEnded;

  async function startSession() {
    if (sessionStarting || isRecording) return;

    // Sharing a tab/screen captures the meeting's audio for every plan. AI vision
    // on the frames is a Team feature: screen-only sessions need it.
    const effectiveScreen = screenEnabled && !isIOS;
    if (!audioEnabled && (!effectiveScreen || !features.screenAnalysis)) {
      if (effectiveScreen && !features.screenAnalysis) {
        toast.show(t("session.screenProOnly", "Screen analysis is available on the Team plan. Upgrade to unlock this feature!"), { type: "info", duration: 5000 });
      } else {
        toast.show(t("session.enableAtLeast"), { type: "error", duration: 4000 });
      }
      return;
    }

    // Open the copilot PiP first, while the click still counts as a user
    // gesture: the permission prompts and requests below would expire it.
    const wantsPiP = can("copilotPiP") && audioEnabled && !isMobile;
    if (wantsPiP) void copilotPiPRef.current?.requestOpen();

    setSessionStarting(true);
    let started = false;
    try {
    // Check subscription limit (only an explicit "not allowed" blocks the session)
    if (user) {
      try {
        const subRes = await authFetch("/api/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, action: "check-session" }),
        });
        const subCheck = await subRes.json();
        if (subRes.ok && subCheck.allowed === false) {
          toast.show(subCheck.reason || t("session.sessionLimitReached"), { type: "error", duration: 6000 });
          return;
        }
      } catch { /* Allow session if check fails */ }
    }

    audioService.current = new AudioCaptureService();
    const options: CaptureOptions = {
      screenEnabled: effectiveScreen,
      audioEnabled,
      onShareEnded: (info) => handleShareEndedRef.current(info),
    };
    try {
      await audioService.current.start(stableProcessAudioChunk, options);
      setIsRecording(true); setSessionStart(new Date()); setSegments([]); setSignals([]); setKeyMoments([]); setTimeline([]); setDetectedLanguage(null);
      setQualityScore(0); setEngagementScore(0); setScreenAnalysis(null); setScreenAnalysisCompleted(false);
      setScreenSummary(null); screenSummaryRef.current = null; screenAnalysisHistory.current = [];
      setClassification("neutral"); setCoachingTip(""); setLiveInsight(""); setResponseDelay("normal"); setSpeakerBalance(undefined);
      setCopilotPaused(false); setCopilotAnswer(""); setCopilotAsking(false);
      setSuggestedResponses([]); setDetectedQuestion(null); setCurrentSuggestion("");
      setCopilotFailures(0); setTranscribeDown(false); transcribeFailures.current = 0;
      resetParticipants();
      setActiveTab("insights");
      conversationSummary.current = "";
      unsummarizedSegments.current = [];
      summaryUpdatePending.current = false;
      summaryBackoffMs.current = 0;
      if (summaryRetryTimer.current) { clearTimeout(summaryRetryTimer.current); summaryRetryTimer.current = null; }
      consecutiveSilenceCount.current = 0;
      lastSegmentText.current = "";
      echoFilter.current.reset();
      screenStableCount.current = 0;
      nonConversationalCount.current = 0;
      nonConversationalWarned.current = false;
      screenOnlyCaptureCount.current = 0;
      screenAnalysisStartTime.current = Date.now();
      setAnalysisStatus("running");

      // Copilot analysis queue for this session
      analysisQueue.current?.stop();
      analysisQueue.current = new CopilotAnalysisQueue<ToneResult>({
        analyze: (batch) => analyzeBatchRef.current(batch),
        onAnalysis: (batch, analysis) => applyAnalysisRef.current(batch, analysis),
        onFailure: (n) => setCopilotFailures(n),
        onRecovered: () => setCopilotFailures(0),
        onBusyChange: (busy) => setProcessing(busy),
      });

      // Live transcription via AssemblyAI streaming. In a meeting (shared tab
      // audio + mic) we open two streams so every turn is tagged "me" or
      // "them"; otherwise one stream on the mixed audio with diarization.
      // If streaming can't start, the 5 s batch recorder (/api/transcribe)
      // takes over, with Web Speech for interim captions.
      if (audioEnabled) {
        const capture = audioService.current;
        const mic = capture.micStream;
        const tab = capture.systemAudioStream;
        const plan: Array<{ stream: MediaStream | undefined; label: StreamLabel | undefined }> =
          mic && tab
            ? [{ stream: mic, label: "me" }, { stream: tab, label: "them" }]
            : [{ stream: capture.audioStream ?? undefined, label: undefined }];
        setTranscriptionStatus("connecting");
        const results = await Promise.allSettled(plan.map((p) => openStream(p.stream, p.label)));
        const opened = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
        const failure = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
        if (!failure) {
          aaiStreams.current = opened;
          dualStreamRef.current = opened.length === 2;
          useAssemblyAIForAnalysis.current = true;
          setTranscriptionStatus("live");
        } else {
          console.warn("[session] live streaming unavailable, using batch fallback:", failure.reason);
          opened.forEach((s) => s.stop());
          stopStreams();
          setTranscriptionStatus("fallback");
          const ls = new LiveSpeechService();
          if (ls.supported) {
            ls.setLanguage(audioLang !== "auto" ? audioLang : (i18n.language || "en"));
            ls.start((text, isFinal) => setInterimText(isFinal ? "" : text));
            liveSpeech.current = ls;
          }
        }
      }
      started = true;
      const hasAudio = audioService.current.hasAudio;
      const hasVideo = audioService.current.hasVideo;
      const hasSystemAudio = audioService.current.hasSystemAudio;
      if (hasVideo && hasAudio && hasSystemAudio) toast.show(t("session.fullCapture"), { type: "success", duration: 5000 });
      else if (hasVideo && hasAudio && !hasSystemAudio) toast.show(t("session.screenMicCapture"), { type: "info", duration: 6000 });
      else if (hasVideo && !audioEnabled) toast.show(t("session.screenOnlyStarted"), { type: "info", duration: 5000 });
      else if (hasVideo && audioEnabled && !hasAudio) toast.show(t("session.screenNoAudio"), { type: "error", duration: 6000 });
      else if (hasAudio) toast.show(t("session.audioStarted"), { type: "success", duration: 3000 });
      if (features.screenAnalysis && hasVideo) { screenAnalysisTimer.current = setTimeout(() => analyzeScreen(), 3000); }
      if (user) {
        // Server-side record (non-blocking): the session runs even if saving is down.
        setConversationId(null);
        void createConversation(`Session ${new Date().toLocaleString()}`).then((id) => { if (id) setConversationId(id); });
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
      stopStreams();
      analysisQueue.current?.stop();
      analysisQueue.current = null;
      setTranscriptionStatus("idle");
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
      // The PiP was opened optimistically before any await: close it if the session didn't start.
      if (wantsPiP && !started) copilotPiPRef.current?.close();
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
    // Only the batch fallback needs the recorder's last chunk; streams already have it.
    const usedBatchFallback = !useAssemblyAIForAnalysis.current;
    stopStreams();
    setInterimText("");
    if (usedBatchFallback && finalBlob && finalBlob.size > 1000) {
      try { await stableProcessAudioChunk(finalBlob); } catch { /* best-effort */ }
    }
    // Let in-flight analyses land so the saved transcript carries their tone.
    await analysisQueue.current?.waitIdle(3_000);
    analysisQueue.current?.stop();
    analysisQueue.current = null;
    if (summaryRetryTimer.current) { clearTimeout(summaryRetryTimer.current); summaryRetryTimer.current = null; }
    setTranscriptionStatus("idle");
    setIsRecording(false); setSessionStart(null); setAnalysisStatus("idle");
    consecutiveSilenceCount.current = 0;
    screenAnalysisStartTime.current = 0;
    if (processingToastId.current) { toast.dismiss(processingToastId.current); processingToastId.current = null; }
    // Read through the ref: analyses that just landed aren't in this render's closure.
    const segments = segmentsRef.current;
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
        overall_tone: toDbTone(dominantTone),
      };
      // Include summary text in phase 1 if we already have it from screen analysis
      if (currentScreenSummary) {
        coreUpdate.summary = currentScreenSummary.recommendation;
        coreUpdate.insights = toStringList(currentScreenSummary.keyInsights);
      }
      await updateConversation(conversationId, coreUpdate);

      if (hasAudioData) {
        await saveSegments(conversationId, segments.map((s) => ({ timestamp: s.timestamp, transcript: s.text, tone: s.tone.tone, confidence: s.tone.confidence, suggestion: s.tone.suggestion })));
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
            await updateConversation(conversationId, {
              summary: typeof summary.recommendation === "string" ? summary.recommendation : undefined,
              overall_tone: toDbTone(summary.overallTone || dominantTone),
              insights: toStringList(summary.insights),
              classification: typeof summary.classification === "string" ? summary.classification : undefined,
              score: toScore(summary.score),
              diagnosis: typeof summary.diagnosis === "string" ? summary.diagnosis : undefined,
              follow_up_actions: toStringList(summary.followUpActions),
              strengths: toStringList(summary.strengths),
              improvements: toStringList(summary.improvements),
            });
          }
        } else if (currentScreenSummary) {
          // Screen-only: save enriched data to new columns
          await updateConversation(conversationId, {
            classification: currentScreenSummary.conversationTone,
            score: toScore({ overall: currentScreenSummary.attractionScore, engagement: currentScreenSummary.attractionScore, tone: currentScreenSummary.attractionScore, fluidity: 0, interest: currentScreenSummary.attractionScore }),
            diagnosis: currentScreenSummary.summary,
            follow_up_actions: toStringList(currentScreenSummary.improvements),
            social_score: Math.max(0, Math.min(100, Math.round(Number(currentScreenSummary.attractionScore) || 0))),
            strengths: toStringList(currentScreenSummary.strengths),
            improvements: toStringList(currentScreenSummary.improvements),
          });
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

  // Merged transcript stream (consecutive same-speaker segments combined). Shared
  // by the Transcript tab and, in demo mode, the live-grid main column.
  const isUserSpeaker = (speaker: string) => speaker === "me" || speaker === "Speaker 1";
  const speakerDisplay = (speaker: string) =>
    isUserSpeaker(speaker) ? t("copilot.you") : speaker === "them" || speaker === "Speaker 2" ? t("copilot.them") : speaker;

  const transcriptStream = (
    <>
      {segments.reduce<{ speaker?: string; texts: string[]; tone: TranscriptSegment["tone"]; timestamp: number; signals: Array<{ signal: ConversationSignal; label: string }> }[]>((merged, seg) => {
        const last = merged[merged.length - 1];
        if (last && last.speaker === seg.speaker && seg.timestamp - last.timestamp < 30000) {
          last.texts.push(seg.text);
          last.tone = seg.tone;
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
              {group.speaker && <span className="text-xs font-semibold mr-2" style={{ color: isUserSpeaker(group.speaker) ? "#818cf8" : "var(--color-accent-light)" }}>{speakerDisplay(group.speaker)}:</span>}
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
    </>
  );

  return (
    <AppShell allowAnonymous={isDemo}>
      <div style={{ maxWidth: 1340, margin: "0 auto", position: "relative" }}>
        {/* Ambient orb — state-tinted */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: -130,
            right: -130,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: isRecording
              ? "radial-gradient(circle, rgba(239, 68, 68, 0.12), transparent 65%)"
              : "radial-gradient(circle, color-mix(in srgb, var(--color-text) 5%, transparent), transparent 65%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
            transition: "background 0.7s ease",
          }}
          animate={{ x: [-15, 15, -15], y: [-12, 12, -12] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ========== HEADER ========== */}
        <div className="relative mb-7 sm:mb-9" style={{ zIndex: 1 }}>
          {/* Status eyebrow */}
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="relative inline-flex w-1.5 h-1.5">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: isRecording ? "var(--color-negative)" : "color-mix(in srgb, var(--color-text) 85%, transparent)",
                  opacity: 0.5,
                  animation: "pulseRing 1.8s ease-in-out infinite",
                }}
              />
              <span
                className="relative w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isRecording ? "var(--color-negative)" : "color-mix(in srgb, var(--color-text) 90%, transparent)" }}
              />
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: isRecording ? "var(--color-negative)" : "var(--color-text-muted)" }}
            >
              {isRecording ? t("session.liveInProgress", "Live") : t("session.title")}
            </span>

            {/* Transcription / copilot health */}
            {isRecording && audioEnabled && !isDemo && (() => {
              const copilotDown = copilotFailures >= 3 || transcribeDown;
              const pill = copilotDown
                ? { text: t("session.statusCopilotDown", "Copilot unavailable"), color: "var(--color-negative)", bg: "rgba(248, 113, 113, 0.12)" }
                : transcriptionStatus === "live"
                  ? { text: t("session.statusLive", "Live transcription"), color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.12)" }
                  : transcriptionStatus === "fallback"
                    ? { text: t("session.statusFallback", "Backup mode"), color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" }
                    : transcriptionStatus === "reconnecting"
                      ? { text: t("session.statusReconnecting", "Reconnecting..."), color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" }
                      : { text: t("session.statusConnecting", "Connecting..."), color: "var(--color-text-muted)", bg: "color-mix(in srgb, var(--color-text) 6%, transparent)" };
              return (
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full" style={{ backgroundColor: pill.bg, color: pill.color }} role="status">
                  {pill.text}
                  {copilotDown && (
                    <button
                      type="button"
                      className="underline cursor-pointer normal-case tracking-normal text-[10px]"
                      style={{ color: pill.color }}
                      onClick={() => {
                        setCopilotFailures(0);
                        setTranscribeDown(false);
                        transcribeFailures.current = 0;
                        analysisQueue.current?.retryNow();
                      }}
                    >
                      {t("session.retry", "Retry")}
                    </button>
                  )}
                </span>
              );
            })()}

            {/* Recording-state extra chips */}
            {isRecording && analysisStatus === "completed" && (
              <span
                className="text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "rgba(52, 211, 153, 0.12)",
                  color: "var(--color-positive)",
                  border: "1px solid rgba(52, 211, 153, 0.25)",
                }}
              >
                Analysis Ready
              </span>
            )}
            {isRecording && audioEnabled && segments.length > 0 && (
              <span
                className="text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: classConfig.bg, color: classConfig.color }}
              >
                {classConfig.label}
              </span>
            )}
            {isRecording && hasSessionTimeLimit && timeRemaining !== null && (
              <span
                className="text-[10px] tabular-nums px-2.5 py-0.5 rounded-full font-semibold"
                style={{
                  backgroundColor: timeRemaining <= 60
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(251, 146, 60, 0.10)",
                  color: timeRemaining <= 60 ? "var(--color-negative)" : "#fb923c",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
              </span>
            )}
          </div>

          {/* Title block + broadcast launch button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-8 sm:justify-between">
            <div className="min-w-0 flex-1">
              {isRecording ? (
                <motion.h1
                  className="m-0 tabular-nums"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    fontSize: "clamp(48px, 9vw, 88px)",
                    fontWeight: 200,
                    letterSpacing: "-0.05em",
                    lineHeight: 0.95,
                    color: "var(--color-text)",
                    textShadow: "0 0 40px rgba(239, 68, 68, 0.22)",
                  }}
                >
                  {formatTime(elapsed)}
                </motion.h1>
              ) : (
                <motion.h1
                  className="m-0"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  style={{
                    fontSize: "clamp(36px, 5.4vw, 60px)",
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
                  {t("session.title")}
                </motion.h1>
              )}
              <p
                className="text-sm mt-2 m-0"
                style={{ color: "var(--color-text-muted)", maxWidth: 460 }}
              >
                {isRecording
                  ? t("session.recordingHint", "Tonvo is listening. Stay focused on the conversation — the analysis arrives in real time.")
                  : t("session.idleHint", "Configure capture and press to go live.")}
              </p>
            </div>

            {/* Broadcast launch button */}
            <motion.button
              onClick={isRecording ? stopSession : startSession}
              disabled={sessionStarting || (!isRecording && !screenEnabled && !audioEnabled)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative flex items-center gap-3 sm:gap-4 px-5 py-4 sm:pl-5 sm:pr-7 sm:py-5 rounded-[28px] overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
              style={{
                background: isRecording
                  ? "linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(239, 68, 68, 0.04) 100%)"
                  : "linear-gradient(135deg, rgba(52, 211, 153, 0.20) 0%, color-mix(in srgb, var(--color-text) 4%, transparent) 100%)",
                border: isRecording
                  ? "1px solid rgba(239, 68, 68, 0.4)"
                  : "1px solid rgba(52, 211, 153, 0.4)",
                boxShadow: isRecording
                  ? "0 30px 70px -25px rgba(239, 68, 68, 0.55), inset 0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent)"
                  : "0 30px 70px -25px rgba(52, 211, 153, 0.55), inset 0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent)",
                color: "var(--color-text)",
                minWidth: 240,
                minHeight: 80,
              }}
            >
              {/* concentric rings */}
              <span
                className="relative shrink-0 inline-flex items-center justify-center"
                style={{ width: 56, height: 56 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="absolute rounded-full"
                    style={{
                      width: 56,
                      height: 56,
                      border: isRecording
                        ? "1px solid rgba(239, 68, 68, 0.6)"
                        : "1px solid rgba(52, 211, 153, 0.6)",
                    }}
                    animate={{ scale: [0.35, 1.15], opacity: [0.6, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.7 }}
                  />
                ))}
                <span
                  aria-hidden
                  className="absolute rounded-full"
                  style={{
                    width: 28,
                    height: 28,
                    background: isRecording
                      ? "radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, rgba(239, 68, 68, 0.1) 60%, transparent 100%)"
                      : "radial-gradient(circle, rgba(52, 211, 153, 0.5) 0%, rgba(52, 211, 153, 0.1) 60%, transparent 100%)",
                    filter: "blur(2px)",
                  }}
                />
                <span
                  aria-hidden
                  className="relative rounded-full"
                  style={{
                    width: 14,
                    height: 14,
                    background: isRecording
                      ? "linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)"
                      : "linear-gradient(180deg, #34d399 0%, #059669 100%)",
                    boxShadow: isRecording
                      ? "0 0 16px rgba(239, 68, 68, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.2)"
                      : "0 0 16px rgba(52, 211, 153, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </span>

              <span className="flex flex-col items-start gap-0.5 min-w-0">
                <span
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: isRecording ? "var(--color-negative)" : "rgba(110, 231, 183, 0.85)" }}
                >
                  {isRecording ? t("session.statusRecording") : t("session.statusReady")}
                </span>
                <span className="text-base sm:text-lg font-medium leading-tight">
                  {sessionStarting
                    ? t("session.starting", "Starting...")
                    : isRecording
                      ? t("session.stopSession")
                      : t("session.startRecording")}
                </span>
              </span>
            </motion.button>
          </div>

          {/* Setup row — pre-recording: segmented mode picker + capture toggles */}
          {!isRecording && (
            <div className="flex items-center gap-3 mt-7 flex-wrap">
              {/* Segmented mode picker — sliding magnetic indicator */}
              <div
                className="relative inline-flex items-center p-1 rounded-full overflow-x-auto"
                style={{
                  background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                  scrollbarWidth: "none",
                }}
              >
                {[
                  { value: "general", label: "General" },
                  { value: "sales", label: "Sales" },
                  { value: "recruitment", label: "Recruitment" },
                  { value: "support", label: "Support" },
                  { value: "networking", label: "Networking" },
                ].map((m) => {
                  const active = conversationMode === m.value;
                  return (
                    <button
                      key={m.value}
                      onClick={() => setConversationMode(m.value as ConversationMode)}
                      className="relative text-[11px] font-medium px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap"
                      style={{
                        color: active ? "var(--color-text)" : "var(--color-text-muted)",
                        transition: "color 0.2s ease",
                        zIndex: 1,
                      }}
                    >
                      {active && (
                        <motion.span
                          layoutId="session-mode-active"
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
                      <span className="relative">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Capture toggles — proper switches */}
              {!isIOS && (
                <button
                  onClick={() => setScreenEnabled((p) => !p)}
                  title={t("session.shareMeetingHint", "Share the meeting tab (tick \"Also share tab audio\") so Tonvo hears the other side.")}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium cursor-pointer"
                  style={{
                    background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                    color:
                      screenEnabled ? "var(--color-text)" : "var(--color-text-muted)",
                    minHeight: 32,
                    transition: "all 0.2s ease",
                  }}
                  aria-pressed={screenEnabled}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={screenEnabled ? "var(--color-positive)" : "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>{features.screenAnalysis ? t("session.shareScreenToggle", "Screen") : t("session.shareMeetingToggle", "Meeting audio")}</span>
                  <span
                    className="relative inline-flex shrink-0 items-center rounded-full"
                    style={{
                      width: 26,
                      height: 14,
                      padding: 1,
                      background:
                        screenEnabled
                          ? "linear-gradient(135deg, #34d399, #6ee7b7)"
                          : "color-mix(in srgb, var(--color-text) 8%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--color-text) 4%, transparent)",
                      boxShadow:
                        screenEnabled
                          ? "0 4px 12px -4px rgba(52, 211, 153, 0.5)"
                          : "none",
                      transition: "background 0.25s ease, box-shadow 0.25s ease",
                    }}
                  >
                    <motion.span
                      aria-hidden
                      className="rounded-full block"
                      animate={{
                        x: screenEnabled ? 12 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                      style={{
                        width: 10,
                        height: 10,
                        background: screenEnabled ? "var(--color-bg)" : "var(--color-text-muted)",
                      }}
                    />
                  </span>
                </button>
              )}

              <button
                onClick={() => setAudioEnabled((p) => !p)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium cursor-pointer"
                style={{
                  background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                  color: audioEnabled ? "var(--color-text)" : "var(--color-text-muted)",
                  minHeight: 32,
                  transition: "all 0.2s ease",
                }}
                aria-pressed={audioEnabled}
              >
                {audioEnabled ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="1" width="6" height="12" rx="3" />
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.12 1.5-.35 2.18" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
                <span>Audio</span>
                <span
                  className="relative inline-flex shrink-0 items-center rounded-full"
                  style={{
                    width: 26,
                    height: 14,
                    padding: 1,
                    background: audioEnabled
                      ? "linear-gradient(135deg, #34d399, #6ee7b7)"
                      : "color-mix(in srgb, var(--color-text) 8%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--color-text) 4%, transparent)",
                    boxShadow: audioEnabled ? "0 4px 12px -4px rgba(52, 211, 153, 0.5)" : "none",
                    transition: "background 0.25s ease, box-shadow 0.25s ease",
                  }}
                >
                  <motion.span
                    aria-hidden
                    className="rounded-full block"
                    animate={{ x: audioEnabled ? 12 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    style={{
                      width: 10,
                      height: 10,
                      background: audioEnabled ? "var(--color-bg)" : "var(--color-text-muted)",
                    }}
                  />
                </span>
              </button>

              {/* Audio language selector — picks transcription language for AssemblyAI */}
              {audioEnabled && (
                <div className="relative inline-flex items-center">
                  <select
                    value={audioLang}
                    onChange={(e) => setAudioLang(e.target.value)}
                    className="appearance-none text-[11px] font-medium pl-3 pr-8 py-1.5 rounded-full cursor-pointer"
                    style={{
                      background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                      color: "var(--color-text)",
                      transition: "all 0.2s ease",
                    }}
                    aria-label="Audio transcription language"
                  >
                    {AUDIO_LANGS.map((l) => (
                      <option key={l.code} value={l.code} style={{ background: "var(--color-surface-2)", color: "var(--color-text)" }}>
                        {l.flag} {l.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="absolute right-3 pointer-events-none"
                    style={{ color: "var(--color-text-muted)", opacity: 0.7 }}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Recording-state status badges */}
          {isRecording && (
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              {audioService.current?.hasVideo && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
                  style={{
                    background: !screenAnalysisCompleted ? "rgba(52, 211, 153, 0.10)" : "color-mix(in srgb, var(--color-text) 4%, transparent)",
                    border: !screenAnalysisCompleted
                      ? "1px solid rgba(52, 211, 153, 0.25)"
                      : "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                    color: !screenAnalysisCompleted ? "var(--color-positive)" : "var(--color-text-muted)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: !screenAnalysisCompleted ? "var(--color-positive)" : "var(--color-text-muted)" }}
                  />
                  <span>{screenAnalysisCompleted ? "Screen Done" : "Screen"}</span>
                </div>
              )}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
                style={{
                  background: (audioService.current?.hasAudio ?? false)
                    ? "rgba(52, 211, 153, 0.10)"
                    : "color-mix(in srgb, var(--color-text) 4%, transparent)",
                  border: (audioService.current?.hasAudio ?? false)
                    ? "1px solid rgba(52, 211, 153, 0.25)"
                    : "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                  color: (audioService.current?.hasAudio ?? false) ? "var(--color-positive)" : "var(--color-text-muted)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: (audioService.current?.hasAudio ?? false) ? "var(--color-positive)" : "var(--color-text-muted)" }}
                />
                <span>
                  {audioService.current?.audioEnabled
                    ? audioService.current?.hasAudio
                      ? "Mic"
                      : "No Signal"
                    : "Audio Off"}
                </span>
              </div>
              {audioService.current?.hasSystemAudio && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
                  style={{
                    background: "rgba(52, 211, 153, 0.10)",
                    border: "1px solid rgba(52, 211, 153, 0.25)",
                    color: "var(--color-positive)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-positive)" }} />
                  <span>System Audio</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Free plan time limit banner */}
        {isRecording && hasSessionTimeLimit && timeRemaining !== null && (
          <div
            className="relative overflow-hidden rounded-2xl p-3 mb-4 text-xs flex items-center justify-between gap-3"
            style={{
              background: timeRemaining <= 60
                ? "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)"
                : "linear-gradient(135deg, rgba(251, 146, 60, 0.06) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
              border: timeRemaining <= 60
                ? "1px solid rgba(239, 68, 68, 0.3)"
                : "1px solid rgba(251, 146, 60, 0.22)",
              color: timeRemaining <= 60 ? "var(--color-negative)" : "var(--color-text-silver)",
              transition: "background 0.4s ease, border-color 0.4s ease, color 0.4s ease",
            }}
          >
            <div className="flex items-center gap-2.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={timeRemaining <= 60 ? "var(--color-negative)" : "#fb923c"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold mr-2" style={{ color: timeRemaining <= 60 ? "var(--color-negative)" : "#fb923c" }}>
                  {t("session.freePlanBanner")}
                </span>
                <strong className="tabular-nums" style={{ color: timeRemaining <= 60 ? "var(--color-negative)" : "#fb923c" }}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                </strong>
                <span style={{ color: "var(--color-text-muted)" }}>
                  {" "}{t("session.timeLeft")}
                  {timeRemaining <= 60 ? `, ${t("session.endingSoon")}` : ` / ${Math.floor(features.maxSessionDurationSec / 60)} min`}
                </span>
              </span>
            </div>
            <a
              href="/pricing"
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full no-underline whitespace-nowrap"
              style={{
                background: "color-mix(in srgb, var(--color-text) 6%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-text) 12%, transparent)",
                color: "var(--color-text)",
                transition: "all 0.2s ease",
              }}
            >
              {t("session.upgradeShort")}
            </a>
          </div>
        )}

        {/* Mode info — subtle inline hint */}
        {!isRecording && (
          <div
            className="flex items-start gap-2.5 mb-6 px-1 text-xs"
            style={{
              color: !screenEnabled && !audioEnabled ? "var(--color-negative)" : "var(--color-text-muted)",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginTop: 2, flexShrink: 0, opacity: 0.7 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ lineHeight: 1.5 }}>
              {isIOS && !screenEnabled && audioEnabled
                ? "Audio mode: put your call on speaker — Tonvo will capture both sides via microphone for real-time analysis."
                : isMobile && screenEnabled && audioEnabled
                  ? t("session.modeFullCapture")
                  : isMobile && !screenEnabled && audioEnabled
                    ? t("session.modeMobileAudio")
                    : screenEnabled && audioEnabled
                      ? t("session.modeFullAnalysis")
                      : screenEnabled && !audioEnabled
                        ? t("session.modeScreenOnly")
                        : !screenEnabled && audioEnabled
                          ? t("session.modeAudioOnly")
                          : t("session.modeNone")}
            </span>
          </div>
        )}

        {/* Mobile speaker tip */}
        {!isRecording && isMobile && audioEnabled && !screenEnabled && (
          <div
            className="relative overflow-hidden rounded-2xl p-4 mb-3 flex items-start gap-3 text-xs"
            style={{
              background: "linear-gradient(135deg, rgba(52, 211, 153, 0.05) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
              border: "1px solid rgba(52, 211, 153, 0.18)",
              color: "var(--color-text-silver)",
            }}
          >
            <span aria-hidden className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(52, 211, 153, 0.22), transparent 70%)", filter: "blur(24px)", opacity: 0.6 }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)", flexShrink: 0, marginTop: 2 }}>
              <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <div className="relative">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] block mb-1.5" style={{ color: "var(--color-positive)" }}>Speaker mode recommended</span>
              <p className="m-0 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>Put your phone call on speaker so Tonvo can hear both sides through the microphone. Best results that way.</p>
            </div>
          </div>
        )}

        {/* iOS: suggest Analyze Text for screenshots */}
        {!isRecording && isIOS && (
          <div
            className="rounded-2xl p-4 mb-3 flex items-start gap-3 text-xs"
            style={{
              background: "color-mix(in srgb, var(--color-text) 2%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-text) 5%, transparent)",
              color: "var(--color-text-muted)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, opacity: 0.7 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ lineHeight: 1.6 }}>
              {t("session.analyzeTextTip")} <a href="/analyze-text" style={{ color: "var(--shimmer-accent-1)", textDecoration: "underline", textUnderlineOffset: 2 }}>{t("session.analyzeTextLink")}</a>.
            </span>
          </div>
        )}

        {!isRecording && !isIOS && screenEnabled && audioEnabled && (
          <div
            className="relative overflow-hidden rounded-2xl p-4 mb-3 text-xs"
            style={{
              background: "linear-gradient(135deg, rgba(52, 211, 153, 0.05) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
              border: "1px solid rgba(52, 211, 153, 0.18)",
              color: "var(--color-text-silver)",
            }}
          >
            <span aria-hidden className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(52, 211, 153, 0.22), transparent 70%)", filter: "blur(24px)", opacity: 0.6 }} />
            <div className="relative flex items-center gap-2 mb-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)", flexShrink: 0 }}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-positive)" }}>{t("session.meetingAudioTitle", "Hear both sides of your Meet, Zoom or Teams call")}</span>
            </div>
            <p className="relative m-0 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              {t("session.meetingAudioHint", "When the share window opens, pick your meeting tab and tick \"Also share tab audio\" (or \"Share system audio\" for a desktop app). Tonvo then hears the other side, even on a headset.")}
            </p>
          </div>
        )}

        {!isRecording && screenEnabled && !isIOS && (
          <div
            className="rounded-2xl p-4 mb-3 flex items-center gap-3 text-xs"
            style={{
              background: "color-mix(in srgb, var(--color-text) 2%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-text) 5%, transparent)",
              color: "var(--color-text-muted)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
            <span style={{ lineHeight: 1.6 }}>
              {t("session.screenConsent")} <a href="/terms" target="_blank" style={{ color: "var(--color-text-silver)", textDecoration: "underline", textUnderlineOffset: 2 }}>{t("session.termsLink")}</a>.
            </span>
          </div>
        )}

        {!isRecording && !audioEnabled && screenEnabled && (
          <div
            className="relative overflow-hidden rounded-2xl p-4 mb-6 flex items-center gap-3 text-sm"
            style={{
              background: "linear-gradient(135deg, rgba(251, 146, 60, 0.06) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
              border: "1px solid rgba(251, 146, 60, 0.28)",
              color: "#fb923c",
            }}
          >
            <span aria-hidden className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(251, 146, 60, 0.25), transparent 70%)", filter: "blur(24px)", opacity: 0.5 }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="relative" style={{ color: "var(--color-text-silver)" }}>
              <span style={{ color: "#fb923c", fontWeight: 600 }}>{t("session.audioDisabledLabel")}</span>. {t("session.audioDisabledDesc")}
            </span>
          </div>
        )}

        {/* KPI Grid — full when idle, slim strip during live session */}
        {!isRecording ? (
          <motion.div
            className="grid gap-3 sm:gap-4 mb-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
            }}
          >
            {/* TONE */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="group relative p-4 sm:p-5 rounded-2xl overflow-hidden flex flex-col items-center justify-center min-h-35"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 3%, transparent) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <span aria-hidden className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-700"
                style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-text) 16%, transparent), transparent 70%)", filter: "blur(28px)" }} />
              <div className="relative flex flex-col items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--color-text-muted)" }}>Tone</span>
                <div className="flex items-center gap-3">
                  <span
                    className="relative inline-flex items-center justify-center rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      background: "color-mix(in srgb, var(--color-text) 1.5%, transparent)",
                      border: "1px dashed color-mix(in srgb, var(--color-text) 12%, transparent)",
                    }}
                  >
                    <span
                      className="text-xl font-extralight leading-none"
                      style={{ color: "color-mix(in srgb, var(--color-text) 35%, transparent)" }}
                    >
                      —
                    </span>
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Standby
                  </span>
                </div>
              </div>
            </motion.div>

            {/* IDLE / STATUS */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="group relative p-4 sm:p-5 rounded-2xl overflow-hidden flex flex-col items-center justify-center min-h-35"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 3%, transparent) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <span aria-hidden className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-700"
                style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-text) 14%, transparent), transparent 70%)", filter: "blur(28px)" }} />
              <div className="relative flex flex-col items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--color-text-muted)" }}>Idle</span>
                <AudioWave active={false} />
              </div>
            </motion.div>

            {/* QUALITY */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="group relative p-4 sm:p-5 rounded-2xl overflow-hidden flex flex-col items-center justify-center min-h-35"
              style={{
                background: "linear-gradient(135deg, rgba(96, 165, 250, 0.05) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                border: "1px solid rgba(96, 165, 250, 0.12)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <span aria-hidden className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-40 group-hover:opacity-90 transition-opacity duration-700"
                style={{ background: "radial-gradient(circle, rgba(96, 165, 250, 0.28), transparent 70%)", filter: "blur(28px)" }} />
              <div className="relative flex flex-col items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--color-text-muted)" }}>Quality</span>
                <motion.span
                  className="m-0 tabular-nums leading-none"
                  animate={qualityScore > 0 ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } : undefined}
                  transition={qualityScore > 0 ? { duration: 9, repeat: Infinity, ease: "easeInOut" } : undefined}
                  style={{
                    fontSize: "clamp(34px, 4.5vw, 52px)",
                    fontWeight: 200,
                    letterSpacing: "-0.04em",
                    background: qualityScore > 0
                      ? "linear-gradient(115deg, var(--info-accent) 0%, color-mix(in srgb, var(--info-accent) 55%, transparent) 30%, var(--info-accent) 50%, color-mix(in srgb, var(--info-accent) 55%, transparent) 70%, var(--info-accent) 100%)"
                      : "linear-gradient(180deg, var(--color-text-muted) 0%, rgba(113, 113, 122, 0.5) 100%)",
                    backgroundSize: qualityScore > 0 ? "200% 100%" : undefined,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {qualityScore > 0 ? qualityScore : "—"}
                </motion.span>
              </div>
            </motion.div>

            {/* SEGMENTS */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="group relative p-4 sm:p-5 rounded-2xl overflow-hidden flex flex-col items-center justify-center min-h-35"
              style={{
                background: "linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                border: "1px solid rgba(167, 139, 250, 0.12)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <span aria-hidden className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-40 group-hover:opacity-90 transition-opacity duration-700"
                style={{ background: "radial-gradient(circle, rgba(167, 139, 250, 0.28), transparent 70%)", filter: "blur(28px)" }} />
              <div className="relative flex flex-col items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--color-text-muted)" }}>Segments</span>
                <motion.span
                  className="m-0 tabular-nums leading-none"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    fontSize: "clamp(34px, 4.5vw, 52px)",
                    fontWeight: 200,
                    letterSpacing: "-0.04em",
                    background: "linear-gradient(115deg, var(--color-text) 0%, var(--color-text) 30%, var(--color-text-silver) 50%, var(--color-text) 70%, var(--color-text) 100%)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {segments.length}
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="live-kpi-strip mb-5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="live-kpi-item">
              <span className="live-kpi-label">Tone</span>
              <ToneIndicator tone={currentTone} size="sm" showLabel={false} />
            </div>
            <div className="live-kpi-item">
              <span className="live-kpi-label">{analysisStatus === "completed" ? "Done" : processing ? "Analyzing" : audioService.current?.hasAudio ? "Listening" : "Screen"}</span>
              {analysisStatus === "completed" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)" }}><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <AudioWave active={isRecording && (audioService.current?.hasAudio ?? false)} />
              )}
            </div>
            <div className="live-kpi-item">
              <span className="live-kpi-label">Segments</span>
              <span className="live-kpi-value" style={{ color: "var(--color-accent-light)" }}>{segments.length}</span>
            </div>
            {audioEnabled && segments.length > 0 && (
              <div className="live-kpi-item">
                <span className="live-kpi-label">Response</span>
                <span className="live-kpi-value" style={{ color: delayConfig.color, fontSize: 13 }}>{delayConfig.label}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Analysis Ready Banner */}
        {isRecording && analysisStatus === "completed" && (
          <motion.div
            className="relative overflow-hidden rounded-2xl p-5 mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(135deg, rgba(52, 211, 153, 0.08) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
              border: "1px solid rgba(52, 211, 153, 0.32)",
              boxShadow: "0 18px 40px -20px rgba(52, 211, 153, 0.4)",
            }}
          >
            <span aria-hidden className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(52, 211, 153, 0.32), transparent 70%)", filter: "blur(28px)", opacity: 0.7 }} />
            <div className="relative flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="relative inline-flex w-8 h-8 items-center justify-center rounded-full"
                  style={{ background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold m-0" style={{ color: "var(--color-positive)" }}>{t("session.analysisReady")}</p>
                  <p className="text-xs m-0 mt-1" style={{ color: "var(--color-text-muted)" }}>
                    {segments.length > 0 ? t("session.segmentsAnalyzed", { count: segments.length }) : t("session.screenAnalyzed")} {t("session.stillActive")}
                  </p>
                </div>
              </div>
              <button
                onClick={stopSession}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg, #34d399, #6ee7b7)",
                  color: "#0a0a0a",
                  boxShadow: "0 12px 30px -10px rgba(52, 211, 153, 0.55)",
                }}
              >
                Stop & View Report
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/*  LIVE COMMAND CENTER — translation stream + copilot sidebar    */}
        {/* ============================================================ */}
        {/* Idle state: show Live Translation alone so the user can pick a language / mode before starting */}
        {!isRecording && can("copilotOverlay") && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <LiveTranslationStream segments={segments} isRecording={isRecording} />
          </motion.div>
        )}
        {isRecording && audioEnabled && (
          <motion.div
            className="live-grid mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="live-grid__main">
              <div ref={demoTranscriptRef} className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", maxHeight: 560, overflowY: "auto" }}>
                  <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--color-border)", position: "sticky", top: 0, backgroundColor: "var(--color-surface)", zIndex: 1 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)", letterSpacing: "0.12em" }}>{t("session.transcriptTab", "Live transcript")}</span>
                  </div>
                  {segments.length === 0 && !interimText ? (
                    <div className="p-8 text-center"><p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>{t("session.listeningTranscript")}</p></div>
                  ) : (
                    <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>{transcriptStream}</div>
                  )}
                  {interimText && (
                    <p className="px-4 pb-4 pt-2 m-0 text-sm italic" style={{ color: "var(--color-text-muted)" }}>{interimText}</p>
                  )}
                </div>
              {!isDemo && can("copilotOverlay") && (
                <div className="mt-4">
                  <LiveTranslationStream segments={segments} isRecording={isRecording} />
                </div>
              )}
            </div>
            <div className="live-grid__aside">
              <LiveCopilotPanel
                coachingTip={coachingTip}
                liveInsight={liveInsight}
                suggestion={currentSuggestion}
                suggestedResponses={suggestedResponses}
                signals={signals}
                speakerBalance={speakerBalance}
                qualityScore={qualityScore}
                engagementScore={engagementScore}
                paused={copilotPaused}
                onTogglePause={() => setCopilotPaused((p) => !p)}
                onAsk={handleAskCopilot}
                asking={copilotAsking}
                answer={copilotAnswer}
                detectedQuestion={detectedQuestion}
                proLocked={!can("coachingTips") && !isDemo}
                labels={{
                  coaching: t("copilot.coaching"),
                  insight: t("copilot.insight"),
                  suggestion: t("copilot.suggestion"),
                  signals: t("copilot.signals"),
                  speakerBalance: t("copilot.speakerBalance"),
                  you: t("copilot.you"),
                  them: t("copilot.them"),
                  askPlaceholder: t("copilot.askPlaceholder", "Ask the copilot..."),
                  paused: t("copilot.paused", "Paused"),
                  pause: t("session.copilotPause", "Pause"),
                  resume: t("session.copilotResume", "Resume"),
                  quality: t("session.kpiQuality", "Quality"),
                  engagement: t("session.kpiEngagement", "Engagement"),
                  listening: t("session.listeningInsights"),
                  suggestedResponses: t("copilot.suggestedResponses", "Suggested replies"),
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Screen Analysis Card */}
        {isRecording && screenEnabled && features.screenAnalysis && audioService.current?.hasVideo && (
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
                  <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ backgroundColor: "var(--color-surface-2)", color: "var(--color-accent-light)" }}>{contentTypeLabels[screenAnalysis.contentType] || "Screen"}</span>
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
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--color-surface-2)" }}>
                <span className="text-xs block mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Attraction Score</span>
                <span className="text-4xl font-bold" style={{ color: screenSummary.attractionScore >= 70 ? "var(--color-positive)" : screenSummary.attractionScore >= 40 ? "var(--color-neutral)" : "var(--color-negative)" }}>
                  {screenSummary.attractionScore}
                </span>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>%</span>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--color-surface-2)" }}>
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
            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "var(--color-surface-2)" }}>
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

        {/* Tab content with smooth crossfade */}
        {audioEnabled && (
        <AnimatePresence mode="wait">
        {activeTab === "insights" && (
          <motion.div key="tab-insights" className="space-y-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
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
          </motion.div>
        )}

        {/* Transcript Tab */}
        {activeTab === "transcript" && (
          <motion.div key="tab-transcript"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
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
                  {transcriptStream}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <motion.div key="tab-timeline"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
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
          </motion.div>
        )}
        </AnimatePresence>
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
            them: t("copilot.them"),
            you: t("copilot.you"),
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
