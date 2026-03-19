import { NextRequest, NextResponse } from "next/server";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";
import { verifyAuth } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { previousSummary, newSegments, language } = body;

  if (!newSegments || !Array.isArray(newSegments) || newSegments.length === 0) {
    return NextResponse.json({ error: "Missing newSegments array" }, { status: 400 });
  }

  const newText = newSegments
    .map((s: { text: string; tone: string; speaker?: string; signal?: string; signalLabel?: string }) =>
      `[${s.speaker || "Unknown"}][${s.tone}${s.signal && s.signal !== "none" ? ` | ${s.signal}: ${s.signalLabel}` : ""}] ${s.text}`
    )
    .join("\n");

  try {
    const message = await anthropicClient.messages.create({
      model: CLAUDE_FAST,
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: newText,
        },
      ],
      system: `You are a conversation summarizer for Tonvo, a real-time conversation intelligence tool. Your job is to maintain a structured rolling summary of an ongoing conversation.

${previousSummary ? `Current conversation summary so far:\n"${previousSummary}"` : "This is the beginning of the conversation."}

New transcript segments have just been captured. Update the summary to incorporate the new information.

Your summary MUST be structured with these sections (use this exact format):

TOPICS: [comma-separated list of main topics discussed so far]
SPEAKERS: [brief note on who is talking and their roles if identifiable]
STATUS: [1-2 sentences on what is currently being discussed and the conversation flow]
OPEN_ITEMS: [any unresolved questions, objections, or pending topics]
TONE_SHIFT: [note any changes in mood or engagement, or "stable" if no change]
KEY_FACTS: [important facts, numbers, names, or commitments mentioned]

Rules:
- Keep the TOTAL summary under 300 words maximum
- Be factual and concise -- no filler
- Track speaker dynamics when multiple speakers are detected
- If objections were raised, track them in OPEN_ITEMS until resolved
- Note any shifts in engagement or mood in TONE_SHIFT
- Update sections incrementally -- don't rewrite from scratch

IMPORTANT: Write all summary content in ${language || "en"} (the user's language). Section headers (TOPICS, SPEAKERS, etc.) stay in English.

Return ONLY the structured summary. No JSON, no markdown code blocks.`,
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
