import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAuth } from "@/lib/auth-server";

// Admin emails from env var (comma-separated). Validated against the Firebase auth token, not the request body.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
const VALID_PLANS = ["free", "pro", "team"];

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin gate: use the email from the verified Firebase token (not from request body)
  const callerEmail = (authUser.email || "").toLowerCase();
  if (!callerEmail || !ADMIN_EMAILS.includes(callerEmail)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { targetUserId, plan } = await req.json();

    if (!targetUserId || !plan) {
      return NextResponse.json({ error: "Missing targetUserId or plan" }, { status: 400 });
    }

    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: `Invalid plan. Must be one of: ${VALID_PLANS.join(", ")}` }, { status: 400 });
    }

    // Check if user already has a subscription row
    const { data: existing } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (existing && existing.plan === plan) {
      return NextResponse.json({
        message: `User already has the ${plan} plan`,
        subscription: existing,
      });
    }

    // Upsert the subscription
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          user_id: targetUserId,
          plan,
          status: plan === "free" ? "none" : "active",
          sessions_used: 0,
          sessions_reset: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .maybeSingle();

    if (error) {
      console.error("Assign plan error:", error);
      return NextResponse.json({ error: `Failed to assign plan: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({
      message: `User ${targetUserId} has been successfully upgraded to the ${plan.toUpperCase()} plan.`,
      subscription: data,
    });
  } catch (error) {
    console.error("Admin assign-plan error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
