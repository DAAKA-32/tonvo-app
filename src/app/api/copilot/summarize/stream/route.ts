import { NextRequest } from "next/server";
import { anthropicClient, CLAUDE_FAST } from "@/lib/anthropic";
import { verifyAuth } from "@/lib/auth-server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

const LANG_NAMES: Record<string, string> = {
  fr: "French", en: "English", es: "Spanish", de: "German", it: "Italian",
  ja: "Japanese", ko: "Korean", nl: "Dutch", pt: "Portuguese", zh: "Chinese",
};

interface Segment {
  speaker?: string;
  text: string;
}

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) return new Response("Unauthorized", { status: 401 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const rl = checkRateLimit(`summarize-stream:${ip}`, RATE_LIMITS.contextUpdate);
  if (!rl.allowed) return new Response("Rate limit exceeded", { status: 429 });

  const { segments, targetLang, revision } = await req.json();

  if (!Array.isArray(segments) || segments.length === 0 || !targetLang || !LANG_NAMES[targetLang]) {
    return new Response("Invalid payload", { status: 400 });
  }

  const targetName = LANG_NAMES[targetLang];
  const transcript = (segments as Segment[])
    .map((s) => `${s.speaker ? `[${s.speaker}] ` : ""}${s.text}`)
    .join("\n");

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(sseEvent("start", { revision }));
      try {
        const response = await anthropicClient.messages.stream({
          model: CLAUDE_FAST,
          max_tokens: 350,
          system: `You are a real-time meeting notetaker. Write a concise rolling summary of the conversation so far in ${targetName}.
Rules:
- 2 to 4 short sentences max.
- Focus on decisions, numbers, asks, commitments.
- Never invent facts. If content is too thin, say so briefly.
- Output ONLY the summary text — no headers, no markdown, no preamble.`,
          messages: [{ role: "user", content: transcript }],
        });

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(sseEvent("delta", { revision, text: event.delta.text }));
          }
        }

        controller.enqueue(sseEvent("done", { revision }));
        controller.close();
      } catch (err) {
        controller.enqueue(sseEvent("error", { revision, message: err instanceof Error ? err.message : "summarize failed" }));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

function sseEvent(event: string, data: unknown): Uint8Array {
  return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}
