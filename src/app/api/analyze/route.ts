import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";
import { getPlanFeatures } from "@/lib/plan-features";
import { verifyAuth } from "@/lib/auth-server";
import { getUserSubscription } from "@/lib/subscription";

// Domain-specific focus areas
const MODE_PROMPTS: Record<string, string> = {
  general: `Focus on: communication clarity, emotional tone, engagement, conversation flow.`,
  sales: `Focus on: objection handling, buying signals, value delivery, urgency, rapport, closing. Flag price objections, competitor mentions, stall tactics.`,
  recruitment: `Focus on: candidate enthusiasm, cultural fit, skill validation, red flags, salary cues, mutual interest.`,
  support: `Focus on: frustration level, resolution progress, empathy, escalation risk, satisfaction signals.`,
  networking: `Focus on: mutual interest, follow-up potential, rapport, conversation balance, connection depth.`,
};

const FALLBACK_ANALYSIS = {
  tone: "neutral" as const,
  confidence: 0.5,
  suggestion: "Analysis temporarily unavailable.",
  emotions: [],
  signal: "none" as const,
  signalLabel: "",
  qualityScore: 50,
  classification: "neutral" as const,
  coachingTip: "",
  liveInsight: "",
  engagementScore: 50,
  responseDelay: "normal" as const,
  suggestedResponses: [],
  detectedQuestion: null,
};

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`analyze:${ip}`, RATE_LIMITS.analyze);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded", retryAfterMs: rl.retryAfterMs }, { status: 429 });
  }

  const body = await req.json();
  const {
    text, conversationSummary, recentSegments, speakerSegments,
    mode, screenContext, screenContentType, language,
    lastDetectedQuestion, lastSuggestions,
  } = body;

  // Resolve plan server-side from authenticated user (never trust client-provided plan)
  const sub = await getUserSubscription(authUser.uid);
  const planFeatures = getPlanFeatures(sub.plan);

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text field" }, { status: 400 });
  }

  const conversationMode = mode && MODE_PROMPTS[mode] ? mode : "general";
  const modeInstruction = MODE_PROMPTS[conversationMode];

  // Build structured context blocks
  const blocks: string[] = [];

  if (conversationSummary) {
    blocks.push(`CONVERSATION SO FAR:\n${conversationSummary}`);
  }

  if (recentSegments?.length) {
    const formatted = recentSegments.map((s: { text: string; tone: string; speaker?: string }) =>
      `[${s.speaker || "?"}] ${s.text}`
    ).join("\n");
    blocks.push(`RECENT EXCHANGES:\n${formatted}`);
  }

  if (speakerSegments?.length) {
    const formatted = speakerSegments.map((s: { speaker: string; text: string }) =>
      `[${s.speaker}]: ${s.text}`
    ).join("\n");
    blocks.push(`THIS SEGMENT (speaker-separated):\n${formatted}`);
  }

  // Feed back the unanswered question so Claude keeps it in mind
  if (lastDetectedQuestion) {
    blocks.push(`UNANSWERED QUESTION from ${lastDetectedQuestion.speaker}: "${lastDetectedQuestion.text}"`);
  }

  // Feed back previous suggestions so Claude doesn't repeat itself
  if (lastSuggestions?.length) {
    blocks.push(`YOUR PREVIOUS SUGGESTIONS (do NOT repeat these):\n${lastSuggestions.map((s: string) => `- ${s}`).join("\n")}`);
  }

  if (screenContext) {
    blocks.push(`SCREEN: [${screenContentType || "unknown"}] ${screenContext}`);
  }

  const contextBlock = blocks.length > 0 ? "\n\n" + blocks.join("\n\n") : "";

  try {
    const message = await anthropicClient.messages.create({
      model: CLAUDE_FAST,
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
      system: `You are Tonvo, a real-time conversation copilot. Analyze this speech segment and return JSON.

YOUR #1 JOB: Generate 3 suggested responses the user can say RIGHT NOW. These must:
- Directly address whatever was just said (especially any question asked)
- Reference specific words/topics from the conversation (not generic phrases)
- Sound like a real person speaking naturally — casual, confident, conversational
- Be 1-2 sentences each, ready to say verbatim
- Each use a different strategy

BAD (never generate): "I appreciate your perspective", "That's a great point", "I understand your concern"
GOOD: "The $2k difference covers onboarding — want me to break that down?", "I had the same worry initially, but after 3 months...", "What specifically about the timeline concerns you?"

JSON fields:
- "tone": "positive"|"neutral"|"negative"|"hesitant"
- "confidence": 0-1
- "suggestion": 1 short actionable tip referencing something specific from the conversation
- "emotions": 1-3 detected emotions
- "signal": "objection"|"question"|"opportunity"|"hesitation"|"agreement"|"key_point"|"none"
- "signalLabel": 2-5 word label if signal != "none", else ""
- "qualityScore": 0-100
- "classification": "very_positive"|"positive"|"neutral"|"awkward"|"negative"
- "coachingTip": 1 specific coaching sentence (what to do RIGHT NOW, not general advice)
- "liveInsight": 1 sentence about what's happening in the conversation right now
- "engagementScore": 0-100 (other party's engagement)
- "responseDelay": "fast"|"normal"|"slow"|"silence"
- "suggestedResponses": exactly 3 objects with:
  - "text": response to say (1-2 sentences, natural, specific to this conversation)
  - "intent": "empathize"|"redirect"|"close"|"probe"|"agree"|"challenge"|"clarify"|"deflect"
  - "label": 2-3 word label
- "detectedQuestion": if the OTHER person asked something needing a response:
  {"text": their exact question, "speaker": who, "urgency": "low"|"medium"|"high"}
  null if no question. Keep detecting the same question until it's been answered.
- "speakerDynamics": {"dominantSpeaker": string, "balanceRatio": 0-1, "interactionStyle": string}

Mode: ${conversationMode}. ${modeInstruction}

All text content in ${language || "en"}. Keys/enums in English. Valid JSON only, no markdown.${contextBlock}`,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    let analysis;
    try {
      const cleaned = content.text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content.text);
      return NextResponse.json(FALLBACK_ANALYSIS);
    }

    // Validate critical fields with fallbacks
    analysis.tone = ["positive", "neutral", "negative", "hesitant"].includes(analysis.tone) ? analysis.tone : "neutral";
    analysis.confidence = typeof analysis.confidence === "number" ? Math.max(0, Math.min(1, analysis.confidence)) : 0.5;
    analysis.signal = ["objection", "question", "opportunity", "hesitation", "agreement", "key_point", "none"].includes(analysis.signal) ? analysis.signal : "none";
    analysis.qualityScore = typeof analysis.qualityScore === "number" ? Math.max(0, Math.min(100, analysis.qualityScore)) : 50;
    analysis.engagementScore = typeof analysis.engagementScore === "number" ? Math.max(0, Math.min(100, analysis.engagementScore)) : 50;
    analysis.classification = ["very_positive", "positive", "neutral", "awkward", "negative"].includes(analysis.classification) ? analysis.classification : "neutral";
    analysis.responseDelay = ["fast", "normal", "slow", "silence"].includes(analysis.responseDelay) ? analysis.responseDelay : "normal";
    analysis.emotions = Array.isArray(analysis.emotions) ? analysis.emotions.slice(0, 3) : [];
    analysis.suggestion = typeof analysis.suggestion === "string" ? analysis.suggestion : "";
    analysis.coachingTip = typeof analysis.coachingTip === "string" ? analysis.coachingTip : "";
    analysis.liveInsight = typeof analysis.liveInsight === "string" ? analysis.liveInsight : "";
    analysis.signalLabel = typeof analysis.signalLabel === "string" ? analysis.signalLabel : "";

    // Validate suggestedResponses
    if (Array.isArray(analysis.suggestedResponses)) {
      analysis.suggestedResponses = analysis.suggestedResponses
        .filter((r: unknown) => r && typeof r === "object" && typeof (r as Record<string, unknown>).text === "string")
        .slice(0, 3)
        .map((r: Record<string, unknown>) => ({
          text: String(r.text),
          intent: typeof r.intent === "string" ? r.intent : "clarify",
          label: typeof r.label === "string" ? r.label : "Suggestion",
        }));
    } else {
      analysis.suggestedResponses = [];
    }

    // Validate detectedQuestion
    if (analysis.detectedQuestion && typeof analysis.detectedQuestion === "object") {
      analysis.detectedQuestion = {
        text: typeof analysis.detectedQuestion.text === "string" ? analysis.detectedQuestion.text : "",
        speaker: typeof analysis.detectedQuestion.speaker === "string" ? analysis.detectedQuestion.speaker : "Speaker 2",
        urgency: ["low", "medium", "high"].includes(analysis.detectedQuestion.urgency) ? analysis.detectedQuestion.urgency : "medium",
      };
      if (!analysis.detectedQuestion.text) analysis.detectedQuestion = null;
    } else {
      analysis.detectedQuestion = null;
    }

    // Strip Pro-only features for free users
    if (!planFeatures.coachingTips) analysis.coachingTip = "";
    if (!planFeatures.liveInsight) analysis.liveInsight = "";
    if (!planFeatures.signalDetection) { analysis.signal = "none"; analysis.signalLabel = ""; }
    if (!planFeatures.speakerBalance) delete analysis.speakerDynamics;
    if (!planFeatures.coachingTips) analysis.suggestedResponses = [];

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
