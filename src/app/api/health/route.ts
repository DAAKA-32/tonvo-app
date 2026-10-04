import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "*",
  "access-control-max-age": "86400",
  "cache-control": "no-store",
};

/**
 * GET /api/health          → liveness (used by the desktop app's offline probe)
 * GET /api/health?deep=1   → also checks each dependency the live copilot needs.
 *                            Booleans only, no secrets; cached 60 s per instance.
 */

type DepName = "redis" | "supabase" | "assemblyai" | "anthropic";
type DeepReport = Record<DepName, boolean>;

const PROBE_TIMEOUT_MS = 1_500;
const CACHE_MS = 60_000;
let cached: { at: number; report: DeepReport } | null = null;

async function probe(url: string | undefined, init: RequestInit, isUp: (res: Response) => boolean): Promise<boolean> {
  if (!url) return false;
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(PROBE_TIMEOUT_MS), cache: "no-store" });
    return isUp(res);
  } catch {
    return false;
  }
}

async function deepReport(): Promise<DeepReport> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.report;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_KV_REST_API_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const assemblyKey = process.env.ASSEMBLYAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const [redis, supabase, assemblyai, anthropic] = await Promise.all([
    probe(redisUrl && redisToken ? `${redisUrl}/ping` : undefined, { headers: { authorization: `Bearer ${redisToken}` } }, (r) => r.ok),
    // Any HTTP answer below 500 means the project exists and is reachable.
    probe(supabaseUrl && supabaseKey ? `${supabaseUrl}/rest/v1/` : undefined, { headers: { apikey: supabaseKey ?? "" } }, (r) => r.status < 500),
    probe(assemblyKey ? "https://api.assemblyai.com/v2/transcript?limit=1" : undefined, { headers: { authorization: assemblyKey ?? "" } }, (r) => r.ok),
    probe(anthropicKey ? "https://api.anthropic.com/v1/models?limit=1" : undefined, { headers: { "x-api-key": anthropicKey ?? "", "anthropic-version": "2023-06-01" } }, (r) => r.ok),
  ]);

  const report = { redis, supabase, assemblyai, anthropic };
  cached = { at: Date.now(), report };
  return report;
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("deep") !== "1") {
    return NextResponse.json(
      { ok: true, service: "cue", ts: Date.now() },
      { headers: CORS_HEADERS },
    );
  }
  const deps = await deepReport();
  // The live copilot needs AssemblyAI + Anthropic; Redis and Supabase degrade gracefully.
  return NextResponse.json(
    { ok: deps.assemblyai && deps.anthropic, service: "cue", ts: Date.now(), deps },
    { headers: CORS_HEADERS },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
