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

export type ConversationMode = "general" | "sales" | "recruitment" | "support" | "networking";

export interface SpeakerSegment {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

export interface SuggestedResponse {
  text: string;
  intent: string;
  label: string;
}

export interface DetectedQuestion {
  text: string;
  speaker: string;
  urgency: "low" | "medium" | "high";
}

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
  suggestedResponses?: SuggestedResponse[];
  detectedQuestion?: DetectedQuestion;
  speakerDynamics?: {
    dominantSpeaker: string;
    balanceRatio: number; // 0-1, 0.5 = perfectly balanced
    interactionStyle: string;
  };
}

export interface TranscriptSegment {
  text: string;
  timestamp: number;
  tone: ToneResult;
  speaker?: string;
  speakerSegments?: SpeakerSegment[];
  detectedLanguage?: string;
}

export interface KeyMoment {
  timestamp: number;
  type: ConversationSignal;
  label: string;
  text: string;
  speaker?: string;
}

export interface ConversationScore {
  overall: number;
  engagement: number;
  tone: number;
  fluidity: number;
  interest: number;
}

export interface ObjectionDetail {
  text: string;
  label: string;
  timestamp: number;
  resolved: boolean;
  speaker?: string;
}

export interface ConversationSummary {
  overallTone: Tone;
  classification: ConversationClassification;
  score: ConversationScore;
  keyPoints: string[];
  insights: string[];
  recommendation: string;
  diagnosis: string;
  objections: ObjectionDetail[];
  followUpActions: string[];
  socialAttractivenessScore: number;
  strengths: string[];
  improvements: string[];
  speakerBreakdown?: {
    speaker1TalkRatio: number;
    speaker2TalkRatio: number;
    speaker1Tone: Tone;
    speaker2Tone: Tone;
  };
  screenInsights?: string[];
  visualNarrative?: string;
}

// Unified timeline merging screen captures and audio segments
export type TimelineEventType = "transcript" | "screen_capture" | "signal" | "mood_shift";

export interface TimelineEvent {
  timestamp: number;
  type: TimelineEventType;
  text?: string;
  speaker?: string;
  tone?: Tone;
  screenContext?: string;
  contentType?: string;
  screenMood?: string;
  signal?: ConversationSignal;
  signalLabel?: string;
}

// Chat-specific metrics extracted from screen analysis
export interface ChatMetrics {
  visibleMessageCount: number;
  lastMessageSender: "user" | "other" | "unknown";
  averageMessageLength: "short" | "medium" | "long";
  responseGapDetected: boolean;
  emojiReactionPresent: boolean;
  messageLengthAsymmetry: "balanced" | "user_longer" | "other_longer";
}
