import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";
import { getPlanFeatures } from "@/lib/plan-features";
import { verifyAuth } from "@/lib/auth-server";

// Domain-specific prompt templates
const MODE_PROMPTS: Record<string, string> = {
  general: `Focus on: communication clarity, emotional tone, engagement level, and conversation flow.`,
  sales: `Focus on: objection handling, buying signals, value proposition delivery, urgency creation, rapport building, and closing opportunities. Flag any price objection, competitor mention, or stall tactic.`,
  recruitment: `Focus on: candidate enthusiasm, cultural fit signals, skill validation, red flags, salary negotiation cues, and mutual interest indicators.`,
  support: `Focus on: customer frustration level, issue resolution progress, empathy display, escalation risk, and satisfaction signals.`,
  networking: `Focus on: mutual interest, follow-up potential, rapport quality, conversation balance, and connection depth.`,
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
  const { text, conversationSummary, recentSegments, speakerSegments, mode, screenContext, screenContentType, language, userPlan } = body;

  // Plan-aware feature gating (userPlan passed from client)
  const planFeatures = getPlanFeatures(userPlan);

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text field" }, { status: 400 });
  }

  const conversationMode = mode && MODE_PROMPTS[mode] ? mode : "general";
  const modeInstruction = MODE_PROMPTS[conversationMode];

  const summaryBlock = conversationSummary
    ? `\n\nFull conversation summary so far:\n"${conversationSummary}"`
    : "";

  const recentBlock = recentSegments?.length
    ? `\n\nLast ${recentSegments.length} raw segments:\n${recentSegments.map((s: { text: string; tone: string; speaker?: string }) => `[${s.speaker || "Unknown"}][${s.tone}] ${s.text}`).join("\n")}`
    : "";

  const speakerBlock = speakerSegments?.length
    ? `\n\nSpeaker-segmented transcript for this chunk:\n${speakerSegments.map((s: { speaker: string; text: string }) => `[${s.speaker}]: ${s.text}`).join("\n")}`
    : "";

  const screenBlock = screenContext
    ? `\n\nScreen context: [${screenContentType || "unknown"}] ${screenContext}`
    : "";

  const contextBlock = summaryBlock + recentBlock + speakerBlock + screenBlock;

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
      system: `You are Tonvo, an elite real-time conversation intelligence coach. Analyze the speech transcript segment in the context of the conversation and return a JSON object with ALL of these fields:

- "tone": one of "positive", "neutral", "negative", "hesitant"
- "confidence": number 0-1
- "suggestion": short actionable suggestion (1 sentence) for how to respond or continue
- "emotions": array of 1-3 detected emotions (e.g. "curious", "frustrated", "excited", "confused", "confident", "anxious", "assertive", "defensive", "enthusiastic")
- "signal": exactly one of: "objection", "question", "opportunity", "hesitation", "agreement", "key_point", "none"
- "signalLabel": 2-5 word contextual label (e.g. "Price objection", "Budget question"), or "" if signal is "none"
- "qualityScore": 0-100 conversation quality for this segment (clarity, engagement, professionalism)
- "classification": overall conversation vibe right now, one of: "very_positive", "positive", "neutral", "awkward", "negative"
- "coachingTip": a brief real-time coaching tip (1 sentence) to improve the speaker's delivery, tone, or approach. Be specific and actionable.
- "liveInsight": a brief readable insight about what is happening in the conversation right now (1 sentence). If multiple speakers are detected, comment on the interaction dynamics.
- "engagementScore": 0-100 how engaged/interested the OTHER party seems (based on their responses, questions, and participation). If only one speaker is detected, estimate based on available cues.
- "responseDelay": estimate based on speech patterns: "fast" (quick back-and-forth), "normal", "slow" (long pauses, filler words), "silence" (very sparse speech)
- "suggestedResponses": array of exactly 3 objects, each with:
  - "text": a ready-to-say response phrase (1-2 sentences) the user can speak verbatim right now. Must be natural, contextual, and adapted to the conversation tone and domain.
  - "intent": one of "empathize", "redirect", "close", "probe", "agree", "challenge", "clarify", "deflect"
  - "label": a 2-3 word label describing the approach (e.g. "Show empathy", "Ask deeper", "Redirect topic", "Close the deal")
  Each response must be distinct in strategy. Prioritize the most impactful response first. These are the KEY deliverable — they must sound human, not robotic.
- "speakerDynamics": object with:
  - "dominantSpeaker": which speaker is talking more ("Speaker 1", "Speaker 2", or "balanced")
  - "balanceRatio": 0 to 1 (0.5 = perfectly balanced, 0 = Speaker 1 only, 1 = Speaker 2 only)
  - "interactionStyle": brief label like "one-sided monologue", "active dialogue", "interview-style", "collaborative discussion"

Context mode: ${conversationMode}
${modeInstruction}

IMPORTANT: All text content in "suggestion", "coachingTip", "liveInsight", "signalLabel", and "emotions" MUST be written in ${language || "en"} (the user's language). JSON keys stay in English.

Only return valid JSON. No markdown, no explanation.${contextBlock}`,
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
