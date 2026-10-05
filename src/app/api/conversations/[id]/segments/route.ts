import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { badRequest, dbError, guard, readJson, segmentsSchema } from "@/lib/conversations-server";

/** POST /api/conversations/:id/segments { segments: [...] } → save the transcript (owner only). */

const idSchema = z.string().uuid();

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(req, { jsonBody: true });
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return badRequest("Invalid id");

  const parsed = segmentsSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(parsed.error);

  const owner = await supabaseAdmin
    .from("conversations")
    .select("id")
    .eq("id", id)
    .eq("user_id", auth.uid)
    .maybeSingle();
  if (owner.error) return dbError("owner", owner.error);
  if (!owner.data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rows = parsed.data.segments.map((s) => ({
    conversation_id: id,
    timestamp: s.timestamp,
    transcript: s.transcript,
    tone: s.tone,
    confidence: s.confidence,
    suggestion: s.suggestion ?? null,
  }));
  const { error } = await supabaseAdmin.from("analysis_segments").insert(rows);
  if (error) return dbError("insert segments", error);
  return NextResponse.json({ saved: rows.length }, { status: 201 });
}
