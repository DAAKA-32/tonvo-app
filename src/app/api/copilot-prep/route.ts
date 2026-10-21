import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";
import { verifyAuth } from "@/lib/auth-server";

const MODE_CONTEXT: Record<string, string> = {
  general: "a professional conversation or meeting",
  sales: "a sales call with a prospect or client",
  recruitment: "a job interview (as interviewer or candidate)",
  support: "a customer support interaction",
  networking: "a professional networking conversation",
};

const MODE_TIPS: Record<string, string> = {
  general: "Focus on active listening, clear communication, and engagement.",
  sales: "Prepare your value proposition, anticipate objections, and plan your close.",
  recruitment: "Review the role requirements, prepare behavioral questions or STAR answers.",
  support: "Review the customer's history, prepare empathetic opening, have escalation paths ready.",
  networking: "Research the person, prepare a concise intro, and have 2-3 thoughtful questions.",
};

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`copilot-prep:${ip}`, RATE_LIMITS.analyze);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded", retryAfterMs: rl.retryAfterMs }, { status: 429 });
  }

  const body = await req.json();
  const { mode, language, context } = body;

  const conversationMode = mode && MODE_CONTEXT[mode] ? mode : "general";
  const contextDesc = MODE_CONTEXT[conversationMode];
  const modeTips = MODE_TIPS[conversationMode];

  try {
    const message = await anthropicClient.messages.create({
      model: CLAUDE_FAST,
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Prepare me for ${contextDesc}.${context ? ` Additional context: ${context}` : ""}`,
        },
      ],
      system: `You are Tonvo, a proactive AI copilot preparing a user BEFORE their conversation begins. The user is about to enter ${contextDesc}.

${modeTips}

Return a JSON object with:
- "greeting": a short motivational/preparatory sentence (1 line, warm but professional, e.g. "You've got this. Let's make this call count.")
- "prepTips": array of exactly 3 objects, each with:
  - "icon": one emoji that fits the tip
  - "title": 2-4 word title
  - "text": 1-2 sentence actionable tip
- "openingLines": array of exactly 3 objects — ready-to-say opening phrases the user can use to START the conversation, each with:
  - "text": the exact phrase (1-2 sentences, natural and confident)
  - "label": 2-3 word label (e.g. "Warm opener", "Direct start", "Build rapport")
  - "intent": one of "warm", "direct", "curious"
- "anticipatedQuestions": array of exactly 2 objects — questions the OTHER person is likely to ask, each with:
  - "question": the likely question
  - "suggestedAnswer": a strong answer (1-2 sentences)

All text content MUST be in ${language || "en"}. JSON keys stay in English.
Only return valid JSON. No markdown, no explanation.`,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "No text response" }, { status: 500 });
    }

    let result;
    try {
      const cleaned = content.text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse copilot-prep response");
      return NextResponse.json({
        greeting: "Ready when you are.",
        prepTips: [],
        openingLines: [],
        anticipatedQuestions: [],
      });
    }

    // Basic validation
    result.greeting = typeof result.greeting === "string" ? result.greeting : "Ready when you are.";
    result.prepTips = Array.isArray(result.prepTips) ? result.prepTips.slice(0, 3) : [];
    result.openingLines = Array.isArray(result.openingLines) ? result.openingLines.slice(0, 3) : [];
    result.anticipatedQuestions = Array.isArray(result.anticipatedQuestions) ? result.anticipatedQuestions.slice(0, 2) : [];

    return NextResponse.json(result);
  } catch (error) {
    console.error("Copilot prep error:", error);
    return NextResponse.json({ error: "Prep generation failed" }, { status: 500 });
  }
}
