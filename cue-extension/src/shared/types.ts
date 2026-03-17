export type Tone = "positive" | "neutral" | "negative" | "hesitant";

export type ConversationClassification =
  | "very_positive"
  | "positive"
  | "neutral"
  | "awkward"
  | "negative";

export type ConversationSignal =
  | "objection"
  | "question"
  | "opportunity"
  | "hesitation"
  | "agreement"
  | "key_point"
  | "none";

export interface ToneResult {
  tone: Tone;
  confidence: number;
  suggestion: string;
  emotions: string[];
  signal: ConversationSignal;
  signalLabel: string;
  qualityScore: number;
  classification: ConversationClassification;
  coachingTip: string;
  liveInsight: string;
  engagementScore: number;
  responseDelay: "fast" | "normal" | "slow" | "silence";
}

export interface TranscriptSegment {
  text: string;
  timestamp: number;
  tone: ToneResult;
}

export interface SessionState {
  isRecording: boolean;
  tabId: number | null;
  segments: TranscriptSegment[];
  currentTone: Tone;
  currentSuggestion: string;
  currentEmotions: string[];
  coachingTip: string;
  liveInsight: string;
  qualityScore: number;
  engagementScore: number;
  classification: ConversationClassification;
  signals: Array<{ signal: ConversationSignal; label: string; time: number }>;
  conversationSummary: string;
  startTime: number | null;
}

export const DEFAULT_SESSION: SessionState = {
  isRecording: false,
  tabId: null,
  segments: [],
  currentTone: "neutral",
  currentSuggestion: "",
  currentEmotions: [],
  coachingTip: "",
  liveInsight: "",
  qualityScore: 0,
  engagementScore: 0,
  classification: "neutral",
  signals: [],
  conversationSummary: "",
  startTime: null,
};
