import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { anthropicClient, CLAUDE_DEEP } from "@/lib/anthropic";
import { verifyAuth } from "@/lib/auth-server";

const ScreenSummarySchema = z.object({
  attractionScore: z.number().min(0).max(100).default(0),
  conversationTone: z.enum(["very_positive", "positive", "neutral", "awkward", "negative"]).default("neutral"),
  summary: z.string().default(""),
  keyInsights: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  recommendation: z.string().default(""),
});

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { screenContext, contentType, mood, insight, analysisHistory, language } = body;

  if (!screenContext) {
    return NextResponse.json({ error: "No screen context provided" }, { status: 400 });
  }

  const historyBlock = analysisHistory?.length
    ? `\n\nFull analysis history (${analysisHistory.length} captures):\n${analysisHistory.map((h: { context: string; mood: string; contentType: string; insight: string }, i: number) => `[Capture ${i + 1}] (${h.contentType}, ${h.mood}) ${h.context} -- Insight: ${h.insight}`).join("\n")}`
    : "";

  try {
    const message = await anthropicClient.messages.create({
      model: CLAUDE_DEEP,
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `Screen content type: ${contentType || "unknown"}
Overall mood detected: ${mood || "unknown"}
Latest screen context: ${screenContext}
Latest insight: ${insight || "none"}${historyBlock}`,
        },
      ],
      system: `You are Tonvo, an elite conversation intelligence system. You analyzed a user's screen that contained a conversation (chat, DM, email, video call, etc.).

Given the screen analysis data, produce a structured summary as a JSON object:

- "attractionScore": number 0-100 representing the level of interest/engagement from the other person in the conversation.
- "conversationTone": one of "very_positive", "positive", "neutral", "awkward", "negative"
- "summary": 2-3 sentence global summary of the conversation quality
- "keyInsights": array of 3-5 short insight strings
- "strengths": array of 2-3 things the user did well
- "improvements": array of 2-3 actionable things the user could improve
- "recommendation": one actionable sentence for the next interaction

Rules:
- If no clear conversation is visible, set attractionScore to 0 and note it in summary
- Never invent data -- base everything on what was actually observed on screen
- Be honest but constructive
- Keep insights short and actionable

IMPORTANT: Write "summary", "keyInsights", "strengths", "improvements", and "recommendation" in ${language || "en"} (the user's language). JSON keys and enum values stay in English.

Only return valid JSON. No markdown, no explanation.`,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    let raw;
    try {
      const cleaned = content.text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      raw = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse screen summary response:", content.text);
      return NextResponse.json({ error: "Failed to parse AI screen summary" }, { status: 500 });
    }

    const summary = ScreenSummarySchema.parse(raw);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Screen summary error:", error);
    return NextResponse.json({ error: "Screen summary failed" }, { status: 500 });
  }
}
