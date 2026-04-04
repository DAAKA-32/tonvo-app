import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";
import { verifyAuth } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`copilot-ask:${ip}`, RATE_LIMITS.analyze);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded", retryAfterMs: rl.retryAfterMs }, { status: 429 });
  }

  const { question, conversationSummary, mode, language } = await req.json();
  if (!question || typeof question !== "string" || question.trim().length === 0 || question.length > 2000) {
    return NextResponse.json({ error: "Invalid question (1-2000 chars required)" }, { status: 400 });
  }

  const MODE_CONTEXT: Record<string, string> = {
    general: "general conversation coaching",
    sales: "sales call coaching — focus on objections, closing, value delivery",
    recruitment: "recruitment interview coaching — focus on cultural fit, skill validation",
    support: "customer support coaching — focus on empathy, resolution, de-escalation",
    networking: "networking conversation coaching — focus on rapport, follow-ups",
  };

  const modeCtx = MODE_CONTEXT[mode || "general"] || MODE_CONTEXT.general;
  const lang = language || "en";

  try {
    const res = await anthropicClient.messages.create({
      model: CLAUDE_FAST,
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are a real-time ${modeCtx} assistant embedded in a meeting copilot.
${conversationSummary ? `Current conversation context:\n${conversationSummary}\n` : ""}
The user asks: "${question}"

Reply in ${lang}. Be concise (2-3 sentences max), actionable, and directly useful during a live conversation. No preamble.`,
        },
      ],
    });

    const answer = res.content[0]?.type === "text" ? res.content[0].text : "Sorry, I couldn't generate a response.";
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Copilot ask error:", err);
    return NextResponse.json({ answer: "Sorry, an error occurred. Please try again." }, { status: 500 });
  }
}
