import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET  — fetch the user's saved preferences (theme, etc.)
 * POST — upsert the user's preferences
 */

const SUPPORTED_LANGS = new Set(["fr", "en", "es", "de", "it", "ja", "ko", "nl", "pt", "zh"]);
const SUPPORTED_MODES = new Set(["translate_only", "translate_summary", "summary_only"]);

export async function GET(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from("user_preferences")
    .select("theme, copilot_target_lang, copilot_mode")
    .eq("user_id", authUser.uid)
    .maybeSingle();

  return NextResponse.json({
    theme: data?.theme ?? null,
    copilotTargetLang: data?.copilot_target_lang ?? null,
    copilotMode: data?.copilot_mode ?? null,
  });
}

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { theme, copilotTargetLang, copilotMode } = body;

  const update: Record<string, unknown> = {
    user_id: authUser.uid,
    updated_at: new Date().toISOString(),
  };

  if (theme !== undefined) {
    if (theme !== "dark" && theme !== "light") {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }
    update.theme = theme;
  }

  if (copilotTargetLang !== undefined) {
    if (!SUPPORTED_LANGS.has(copilotTargetLang)) {
      return NextResponse.json({ error: "Invalid copilotTargetLang" }, { status: 400 });
    }
    update.copilot_target_lang = copilotTargetLang;
  }

  if (copilotMode !== undefined) {
    if (!SUPPORTED_MODES.has(copilotMode)) {
      return NextResponse.json({ error: "Invalid copilotMode" }, { status: 400 });
    }
    update.copilot_mode = copilotMode;
  }

  if (Object.keys(update).length <= 2) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("user_preferences")
    .upsert(update, { onConflict: "user_id" });

  if (error) {
    console.error("Failed to save preferences:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
