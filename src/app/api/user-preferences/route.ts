import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET  — fetch the user's saved preferences (theme, etc.)
 * POST — upsert the user's preferences
 */

export async function GET(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from("user_preferences")
    .select("theme")
    .eq("user_id", authUser.uid)
    .maybeSingle();

  return NextResponse.json({ theme: data?.theme ?? null });
}

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { theme } = await req.json();

  if (theme !== "dark" && theme !== "light") {
    return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("user_preferences")
    .upsert(
      { user_id: authUser.uid, theme, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Failed to save preferences:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
