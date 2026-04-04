import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAuth } from "@/lib/auth-server";
import { getAppUrl } from "@/lib/url";

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = await req.json();

    if (userId && userId !== authUser.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const appUrl = getAppUrl();

    const session = await getStripe().billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${appUrl}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
