import { NextRequest, NextResponse } from "next/server";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";

/**
 * POST /api/translate
 * Translates session report fields to the requested language.
 * Uses Claude Haiku for fast, cost-effective translation.
 *
 * Input: { fields: Record<string, string | string[]>, targetLanguage: string }
 * Output: { translated: Record<string, string | string[]> }
 */
export async function POST(req: NextRequest) {
  try {
    const { fields, targetLanguage } = await req.json();

    if (!fields || typeof fields !== "object" || !targetLanguage) {
      return NextResponse.json({ error: "Missing fields or targetLanguage" }, { status: 400 });
    }

    // Don't translate if target is English (source language)
    if (targetLanguage === "en") {
      return NextResponse.json({ translated: fields });
    }

    const message = await anthropicClient.messages.create({
      model: CLAUDE_FAST,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: JSON.stringify(fields),
        },
      ],
      system: `You are a professional translator. Translate ALL text values in the provided JSON object to ${targetLanguage}.

Rules:
- Translate every string value and every string in arrays
- Keep JSON keys exactly as they are (do not translate keys)
- Keep the same JSON structure
- Do not translate enum values like tone names (positive, neutral, negative, etc.)
- Do not translate proper nouns or technical terms unless they have a well-known translation
- Be natural and fluent, not literal
- Return ONLY valid JSON, no markdown, no explanation`,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "No text response" }, { status: 500 });
    }

    let translated;
    try {
      const cleaned = content.text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      translated = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse translation:", content.text);
      return NextResponse.json({ translated: fields });
    }

    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
