import { NextRequest } from "next/server";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";
import { verifyAuth } from "@/lib/auth-server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

const LANG_NAMES: Record<string, string> = {
  fr: "French", en: "English", es: "Spanish", de: "German", it: "Italian",
  ja: "Japanese", ko: "Korean", nl: "Dutch", pt: "Portuguese", zh: "Chinese",
};

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) return new Response("Unauthorized", { status: 401 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const rl = checkRateLimit(`translate-stream:${ip}`, RATE_LIMITS.analyze);
  if (!rl.allowed) return new Response("Rate limit exceeded", { status: 429 });

  const { text, sourceLang, targetLang, segmentId } = await req.json();

  if (!text || typeof text !== "string" || !targetLang || !LANG_NAMES[targetLang]) {
    return new Response("Invalid payload", { status: 400 });
  }

  if (sourceLang && sourceLang === targetLang) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(sseEvent("start", { segmentId }));
        controller.enqueue(sseEvent("delta", { segmentId, text }));
        controller.enqueue(sseEvent("done", { segmentId, sourceLang: targetLang }));
        controller.close();
      },
    });
    return sseResponse(stream);
  }

  const targetName = LANG_NAMES[targetLang];
  const sourceHint = sourceLang && LANG_NAMES[sourceLang] ? ` from ${LANG_NAMES[sourceLang]}` : "";

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(sseEvent("start", { segmentId }));
      try {
        const response = await anthropicClient.messages.stream({
          model: CLAUDE_FAST,
          max_tokens: 800,
          system: `You are a professional real-time interpreter. Translate the user's message${sourceHint} to ${targetName}.
Rules:
- Output ONLY the translation, no preamble, no quotes, no explanation.
- Preserve meaning, tone, and natural phrasing.
- Keep proper nouns unchanged.
- If the text is already in ${targetName}, output it as-is.`,
          messages: [{ role: "user", content: text }],
        });

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(sseEvent("delta", { segmentId, text: event.delta.text }));
          }
        }

        controller.enqueue(sseEvent("done", { segmentId }));
        controller.close();
      } catch (err) {
        controller.enqueue(sseEvent("error", { segmentId, message: err instanceof Error ? err.message : "translate failed" }));
        controller.close();
      }
    },
  });

  return sseResponse(stream);
}

function sseEvent(event: string, data: unknown): Uint8Array {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  return new TextEncoder().encode(payload);
}

function sseResponse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
