import { NextRequest, NextResponse } from "next/server";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";
import { verifyAuth } from "@/lib/auth-server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`context:${ip}`, RATE_LIMITS.contextUpdate);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded", retryAfterMs: rl.retryAfterMs }, { status: 429 });
  }

  const body = await req.json();
  const { previousSummary, newSegments, language } = body;

  if (!newSegments || !Array.isArray(newSegments) || newSegments.length === 0) {
    return NextResponse.json({ error: "Missing newSegments array" }, { status: 400 });
  }

  const newText = newSegments
    .map((s: { text: string; tone: string; speaker?: string; signal?: string; signalLabel?: string }) =>
      `[${s.speaker || "?"}][${s.tone}${s.signal && s.signal !== "none" ? `|${s.signal}` : ""}] ${s.text}`
    )
    .join("\n");

  try {
    const message = await anthropicClient.messages.create({
      model: CLAUDE_FAST,
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: newText,
        },
      ],
      system: `You maintain a compact rolling summary of a live conversation.

${previousSummary ? `Current summary:\n${previousSummary}` : "This is the start of the conversation."}

Update the summary with the new segments. Use this exact format:

TOPICS: [comma-separated, max 8]
SPEAKERS: [who + role if known]
STATUS: [1 sentence — what's being discussed right now]
OPEN_ITEMS: [unresolved questions/objections, remove when resolved]
TONE: [current mood, or "stable"]
FACTS: [key numbers, names, commitments]

Rules:
- HARD LIMIT: 150 words total. If approaching limit, drop older resolved items.
- Replace outdated info, don't append endlessly
- Be factual, no filler
- Write in ${language || "en"}. Section headers stay in English.

Return ONLY the summary. No JSON, no markdown.`,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    return NextResponse.json({ summary: content.text.trim() });
  } catch (error) {
    console.error("Context summary error:", error);
    return NextResponse.json({ error: "Context summary failed" }, { status: 500 });
  }
}
