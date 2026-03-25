import { NextRequest, NextResponse } from "next/server";
import { getPlanFeatures } from "@/lib/plan-features";
import { z } from "zod/v4";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";
import { verifyAuth } from "@/lib/auth-server";
import { getUserSubscription } from "@/lib/subscription";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const ChatMetricsSchema = z.object({
  visibleMessageCount: z.number().default(0),
  lastMessageSender: z.enum(["user", "other", "unknown"]).default("unknown"),
  averageMessageLength: z.enum(["short", "medium", "long"]).default("medium"),
  responseGapDetected: z.boolean().default(false),
  emojiReactionPresent: z.boolean().default(false),
  messageLengthAsymmetry: z.enum(["balanced", "user_longer", "other_longer"]).default("balanced"),
});

const ScreenAnalysisSchema = z.object({
  context: z.string().default(""),
  mood: z.enum(["positive", "neutral", "negative", "hesitant"]).default("neutral"),
  insight: z.string().default(""),
  contentType: z.enum(["presentation", "code", "document", "chat", "video", "website", "email", "spreadsheet", "other"]).default("other"),
  analysisComplete: z.boolean().default(false),
  chatMetrics: ChatMetricsSchema.optional(),
});

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`screen:${ip}`, RATE_LIMITS.screenAnalysis);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded", retryAfterMs: rl.retryAfterMs }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    // Resolve plan server-side (never trust client-provided plan)
    const sub = await getUserSubscription(authUser.uid, authUser.email);
    const features = getPlanFeatures(sub.plan);
    if (!features.screenAnalysis) {
      return NextResponse.json(
        { error: "Screen analysis requires the Pro plan.", upgrade: true },
        { status: 403 }
      );
    }

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const previousContext = formData.get("previousContext") as string | null;
    const visualHistory = formData.get("visualHistory") as string | null;
    const transcriptContext = formData.get("transcriptContext") as string | null;
    const lastTranscript = formData.get("lastTranscript") as string | null;
    const language = formData.get("language") as string | null;

    const buffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = (imageFile.type || "image/jpeg") as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const message = await anthropicClient.messages.create({
      model: CLAUDE_FAST,
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64,
              },
            },
            {
              type: "text",
              text: "Analyze this screen capture.",
            },
          ],
        },
      ],
      system: `You are Tonvo, a screen analysis assistant. Analyze the shared screen content and return a JSON object with:
- "context": a brief description of what is on screen (1-2 sentences max)
- "mood": the general mood/tone of the content ("positive", "neutral", "negative", "hesitant")
- "insight": one actionable insight or observation about the screen content (1 sentence). When audio transcript context is available, cross-reference what you see with what is being said for deeper insights.
- "contentType": the type of content visible ("presentation", "code", "document", "chat", "video", "website", "email", "spreadsheet", "other")
- "analysisComplete": boolean - set to true ONLY if the screen content has been fully analyzed and there is nothing new or meaningful left to extract.

If the content is a chat or messaging interface, also include:
- "chatMetrics": object with:
  - "visibleMessageCount": number of messages visible on screen
  - "lastMessageSender": "user" or "other" or "unknown"
  - "averageMessageLength": "short" (1-2 words), "medium" (sentence), or "long" (paragraph)
  - "responseGapDetected": true if there are visible time gaps between messages
  - "emojiReactionPresent": true if emojis or reactions are visible
  - "messageLengthAsymmetry": "balanced", "user_longer", or "other_longer"
Only include chatMetrics when contentType is "chat".

IMPORTANT: Write "context" and "insight" text in ${language || "en"} (the user's language). JSON keys and enum values stay in English.

Only return valid JSON. No markdown, no explanation.${visualHistory ? `\n\nScreen capture history (recent frames):\n${visualHistory}\nUse this history to understand how screen content has evolved. If the current content matches the most recent entry with no meaningful change, set analysisComplete to true.` : previousContext ? `\n\nPrevious analysis context: "${previousContext}". Compare the current screen to this. If the content is essentially the same, set analysisComplete to true.` : ""}${transcriptContext ? `\n\nConversation audio context (what is being discussed):\n${transcriptContext}` : ""}${lastTranscript ? `\n\nLast thing said: "${lastTranscript}"` : ""}`,
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
      console.error("Failed to parse screen analysis:", content.text);
      return NextResponse.json({
        context: "",
        mood: "neutral",
        insight: "",
        contentType: "other",
        analysisComplete: false,
      });
    }

    const analysis = ScreenAnalysisSchema.parse(raw);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Screen analysis error:", error);
    return NextResponse.json({ error: "Screen analysis failed" }, { status: 500 });
  }
}
