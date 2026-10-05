import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { badRequest, conversationPatchSchema, dbError, guard, readJson } from "@/lib/conversations-server";

/**
 * GET   /api/conversations/:id  → the session + its transcript segments (owner only)
 * PATCH /api/conversations/:id  → update end time, tone and report fields (owner only)
 */

const idSchema = z.string().uuid();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return badRequest("Invalid id");

  const conv = await supabaseAdmin
    .from("conversations")
    .select("*")
    .eq("id", id)
    .eq("user_id", auth.uid)
    .maybeSingle();
  if (conv.error) return dbError("get", conv.error);
  if (!conv.data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const segs = await supabaseAdmin
    .from("analysis_segments")
    .select("*")
    .eq("conversation_id", id)
    .order("timestamp", { ascending: true });
  if (segs.error) return dbError("segments", segs.error);

  return NextResponse.json({ conversation: conv.data, segments: segs.data ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guard(req, { jsonBody: true });
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return badRequest("Invalid id");

  const parsed = conversationPatchSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(parsed.error);
  if (Object.keys(parsed.data).length === 0) return badRequest("Nothing to update");

  const { data, error } = await supabaseAdmin
    .from("conversations")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", auth.uid)
    .select("id")
    .maybeSingle();
  if (error) return dbError("update", error);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
