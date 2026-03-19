import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { anthropicClient, CLAUDE_DEEP } from "@/lib/anthropic";
import { verifyAuth } from "@/lib/auth-server";

/**
 * POST /api/analyze-conversation
 *
 * Accepts conversation content (images, text, or audio transcript)
 * and returns a full analysis report.
 *
 * Body (FormData):
 *  - type: "images" | "text" | "audio"
 *  - language: locale code
 *  - context: optional user-provided context
 *  - mode: conversation mode (general, sales, etc.)
 *  - text: (for type=text) the conversation text
 *  - transcript: (for type=audio) the transcribed text
 *  - images: (for type=images) one or more image files
 */
export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rl = checkRateLimit(`summarize:${ip}`, RATE_LIMITS.summarize);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfterMs: rl.retryAfterMs },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const type = formData.get("type") as string;
    const language = (formData.get("language") as string) || "en";
    const context = (formData.get("context") as string) || "";
    const mode = (formData.get("mode") as string) || "general";

    if (!type || !["images", "text", "audio"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    /* ── Build content blocks for Claude ── */
    const contentBlocks: Array<
      | { type: "text"; text: string }
      | { type: "image"; source: { type: "base64"; media_type: ImageMediaType; data: string } }
    > = [];

    if (type === "images") {
      const files: File[] = [];
      formData.forEach((value, key) => {
        if (key === "images" && value instanceof File) files.push(value);
      });

      if (files.length === 0) {
        return NextResponse.json({ error: "No images provided" }, { status: 400 });
      }

      // Limit to 10 images max
      for (const file of files.slice(0, 10)) {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const VALID_MIMES: ImageMediaType[] = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        const mime: ImageMediaType = VALID_MIMES.includes(file.type as ImageMediaType)
          ? (file.type as ImageMediaType)
          : "image/jpeg";
        contentBlocks.push({
          type: "image",
          source: { type: "base64", media_type: mime, data: base64 },
        });
      }

      contentBlocks.push({
        type: "text",
        text: `Analyze the conversation shown in these ${files.length} screenshot(s). Extract the full conversation text, identify speakers, then analyze.${context ? `\n\nUser context: ${context}` : ""}`,
      });
    } else if (type === "text") {
      const text = formData.get("text") as string;
      if (!text?.trim()) {
        return NextResponse.json({ error: "No text provided" }, { status: 400 });
      }
      contentBlocks.push({
        type: "text",
        text: `Analyze this conversation:\n\n${text}${context ? `\n\nUser context: ${context}` : ""}`,
      });
    } else if (type === "audio") {
      const transcript = formData.get("transcript") as string;
      if (!transcript?.trim()) {
        return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
      }
      contentBlocks.push({
        type: "text",
        text: `Analyze this conversation transcript (from audio):\n\n${transcript}${context ? `\n\nUser context: ${context}` : ""}`,
      });
    }

    const MODE_LABELS: Record<string, string> = {
      general: "general communication",
      sales: "sales call",
      recruitment: "recruitment interview",
      support: "customer support",
      networking: "networking / social",
      dating: "dating / social interaction",
    };

    const modeLabel = MODE_LABELS[mode] || "general communication";

    const message = await anthropicClient.messages.create({
      model: CLAUDE_DEEP,
      max_tokens: 2000,
      messages: [{ role: "user", content: contentBlocks }],
      system: `You are Tonvo, an elite conversation intelligence coach. Analyze the provided conversation (from screenshots, text, or audio transcript) in the context of a ${modeLabel} interaction.

Return a JSON object with ALL these fields:

- "overallTone": dominant tone — "positive", "neutral", "negative", or "hesitant"
- "classification": overall vibe — "very_positive", "positive", "neutral", "awkward", or "negative"
- "score": object with sub-scores (each 0-100):
  - "overall": weighted average
  - "engagement": how engaged both parties are
  - "tone": positivity and professionalism
  - "fluidity": how smooth the conversation flows
  - "interest": interest/enthusiasm shown
- "keyPoints": array of 3-5 key takeaways
- "insights": array of 3-4 insights about the dynamics (who is more invested, power balance, interest signals, etc.)
- "recommendation": one actionable next-step sentence
- "diagnosis": 2-3 sentence summary of the conversation quality
- "strengths": array of 2-3 things that went well
- "improvements": array of 2-3 areas to improve
- "signals": array of detected signals, each: { "type": "objection"|"question"|"opportunity"|"hesitation"|"agreement"|"key_point", "label": "short description" }
- "socialScore": 0-100 social attractiveness / likability score based on communication style
- "toneTimeline": array of objects { "speaker": "name/label", "tone": "positive"|"neutral"|"negative"|"hesitant", "excerpt": "short quote" } — at most 6 entries showing how tone evolved
- "speakerBreakdown": object with:
  - "speakers": array of { "name": string, "talkRatio": number (0-1), "dominantTone": string, "style": string (1-2 words like "direct", "warm", "hesitant") }

IMPORTANT: All text content (keyPoints, insights, recommendation, diagnosis, strengths, improvements, signal labels, excerpts) MUST be written in ${language}. JSON keys and enum values (tone, classification) stay in English.

Only return valid JSON. No markdown, no explanation, no wrapping.`,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "No text response" }, { status: 500 });
    }

    let analysis;
    try {
      const cleaned = content.text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      analysis = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse conversation analysis:", content.text);
      return NextResponse.json({ error: "Failed to parse analysis" }, { status: 500 });
    }

    // Validate & clamp scores
    if (analysis.score) {
      for (const key of ["overall", "engagement", "tone", "fluidity", "interest"]) {
        if (typeof analysis.score[key] === "number") {
          analysis.score[key] = Math.max(0, Math.min(100, Math.round(analysis.score[key])));
        } else {
          analysis.score[key] = 50;
        }
      }
    }
    if (typeof analysis.socialScore === "number") {
      analysis.socialScore = Math.max(0, Math.min(100, Math.round(analysis.socialScore)));
    }

    // Validate enums
    const VALID_TONES = ["positive", "neutral", "negative", "hesitant"];
    const VALID_CLASS = ["very_positive", "positive", "neutral", "awkward", "negative"];
    if (!VALID_TONES.includes(analysis.overallTone)) analysis.overallTone = "neutral";
    if (!VALID_CLASS.includes(analysis.classification)) analysis.classification = "neutral";

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Conversation analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
