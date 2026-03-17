import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { anthropicClient, CLAUDE_DEEP } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`summarize:${ip}`, RATE_LIMITS.summarize);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded", retryAfterMs: rl.retryAfterMs }, { status: 429 });
  }

  const body = await req.json();
  const { segments, signals, qualityScore, screenContext, mode, screenAnalysisHistory, language } = body;

  if (!segments || !Array.isArray(segments)) {
    return NextResponse.json({ error: "Missing segments array" }, { status: 400 });
  }

  const transcript = segments
    .map((s: { text: string; tone: string; speaker?: string; signal?: string; signalLabel?: string }) =>
      `[${s.speaker || "Unknown"}][${s.tone}${s.signal && s.signal !== "none" ? ` | ${s.signal}: ${s.signalLabel}` : ""}] ${s.text}`
    )
    .join("\n");

  const signalSummary = signals?.length
    ? `\n\nDetected signals during session: ${signals.map((s: { signal: string; label: string }) => `${s.signal} ("${s.label}")`).join(", ")}`
    : "";

  const screenInfo = screenAnalysisHistory?.length
    ? `\n\nScreen analysis timeline (${screenAnalysisHistory.length} captures):\n${screenAnalysisHistory.map((h: { context: string; contentType: string; mood: string; insight: string }, i: number) => `[Capture ${i + 1}] (${h.contentType}, ${h.mood}) ${h.context}${h.insight ? " -- " + h.insight : ""}`).join("\n")}`
    : screenContext
      ? `\n\nScreen context: ${screenContext}`
      : "";

  const modeLabel = mode && mode !== "general" ? `\nConversation mode: ${mode}` : "";

  try {
    const message = await anthropicClient.messages.create({
      model: CLAUDE_DEEP,
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: transcript,
        },
      ],
      system: `You are Tonvo, an elite conversation intelligence coach. Given a full transcript with tone, signal, and speaker annotations, produce a comprehensive post-session analysis as a JSON object:

- "overallTone": dominant tone ("positive", "neutral", "negative", "hesitant")
- "classification": overall conversation classification, one of: "very_positive", "positive", "neutral", "awkward", "negative"
- "score": object with sub-scores (each 0-100):
  - "overall": weighted average of all sub-scores
  - "engagement": how engaged and active both parties were
  - "tone": overall positivity and professionalism of the tone
  - "fluidity": how smooth and natural the conversation flowed
  - "interest": how much interest/enthusiasm was shown
- "keyPoints": array of 3-5 key points from the conversation
- "insights": array of 3-4 insights about conversation dynamics. When multiple speakers are identified, include insights about each speaker's behavior and the interaction quality.
- "recommendation": one actionable sentence for next conversation
- "diagnosis": 2-3 sentence diagnosis of the conversation quality, what went well, what could improve
- "objections": array of objects for each objection detected: { "text": the objection text, "label": short label, "timestamp": 0, "resolved": boolean whether it was addressed, "speaker": who raised it }
- "followUpActions": array of 2-4 concrete follow-up actions to take after this conversation
- "socialAttractivenessScore": 0-100 score estimating the speaker's communication effectiveness (charisma, likability, communication skill, persuasiveness)
- "strengths": array of 2-3 things the speaker did well
- "improvements": array of 2-3 specific things to improve
- "speakerBreakdown": object with:
  - "speaker1TalkRatio": 0-1 proportion of talk time for Speaker 1
  - "speaker2TalkRatio": 0-1 proportion of talk time for Speaker 2
  - "speaker1Tone": dominant tone for Speaker 1 ("positive", "neutral", "negative", "hesitant")
  - "speaker2Tone": dominant tone for Speaker 2 ("positive", "neutral", "negative", "hesitant")
- "screenInsights": array of 2-3 insights derived from cross-referencing what was said in the transcript with what was shown on screen (only if screen data is available, otherwise empty array)
- "visualNarrative": 1-2 sentence description of how the screen content evolved during the session (only if screen data is available, otherwise empty string)

When screen analysis data is provided, cross-reference what was said in the transcript with what was shown on screen. Note correlations, discrepancies, or patterns between the visual content and the spoken conversation.

Average quality score during session: ${qualityScore || "N/A"}.${signalSummary}${screenInfo}${modeLabel}

IMPORTANT: All text content in "keyPoints", "insights", "recommendation", "diagnosis", "followUpActions", "strengths", "improvements", "screenInsights", "visualNarrative", and objection labels MUST be written in ${language || "en"} (the user's language). JSON keys and enum values (tone names, classification values) stay in English.

Only return valid JSON. No markdown, no explanation.`,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    let summary;
    try {
      const cleaned = content.text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      summary = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse summary response:", content.text);
      return NextResponse.json({ error: "Failed to parse AI summary" }, { status: 500 });
    }

    // Validate and sanitize critical fields
    summary.overallTone = ["positive", "neutral", "negative", "hesitant"].includes(summary.overallTone) ? summary.overallTone : "neutral";
    summary.classification = ["very_positive", "positive", "neutral", "awkward", "negative"].includes(summary.classification) ? summary.classification : "neutral";
    summary.keyPoints = Array.isArray(summary.keyPoints) ? summary.keyPoints.slice(0, 5) : [];
    summary.insights = Array.isArray(summary.insights) ? summary.insights.slice(0, 4) : [];
    summary.recommendation = typeof summary.recommendation === "string" ? summary.recommendation : "";
    summary.diagnosis = typeof summary.diagnosis === "string" ? summary.diagnosis : "";
    summary.objections = Array.isArray(summary.objections) ? summary.objections : [];
    summary.followUpActions = Array.isArray(summary.followUpActions) ? summary.followUpActions.slice(0, 4) : [];
    summary.socialAttractivenessScore = typeof summary.socialAttractivenessScore === "number" ? Math.max(0, Math.min(100, summary.socialAttractivenessScore)) : 50;
    summary.strengths = Array.isArray(summary.strengths) ? summary.strengths.slice(0, 3) : [];
    summary.improvements = Array.isArray(summary.improvements) ? summary.improvements.slice(0, 3) : [];
    summary.screenInsights = Array.isArray(summary.screenInsights) ? summary.screenInsights.slice(0, 3) : [];
    summary.visualNarrative = typeof summary.visualNarrative === "string" ? summary.visualNarrative : "";

    if (summary.score && typeof summary.score === "object") {
      for (const key of ["overall", "engagement", "tone", "fluidity", "interest"]) {
        summary.score[key] = typeof summary.score[key] === "number" ? Math.max(0, Math.min(100, summary.score[key])) : 50;
      }
    } else {
      summary.score = { overall: 50, engagement: 50, tone: 50, fluidity: 50, interest: 50 };
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json({ error: "Summary failed" }, { status: 500 });
  }
}
