import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { dbError, guard } from "@/lib/conversations-server";

/** POST /api/consent → record that the signed-in user accepted the terms and privacy policy. */
export async function POST(req: NextRequest) {
  const auth = await guard(req);
  if (auth instanceof NextResponse) return auth;

  const { error } = await supabaseAdmin.from("user_consent").upsert(
    {
      user_id: auth.uid,
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      privacy_accepted: true,
    },
    { onConflict: "user_id" },
  );
  if (error) return dbError("consent", error);
  return NextResponse.json({ ok: true });
}
