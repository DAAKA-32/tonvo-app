import { NextRequest, NextResponse } from "next/server";
import { getUserSubscription, canStartSession, incrementSessionCount } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const { userId, action } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (action === "check-session") {
      const result = await canStartSession(userId);
      return NextResponse.json(result);
    }

    if (action === "increment") {
      await incrementSessionCount(userId);
      return NextResponse.json({ ok: true });
    }

    // Default: return subscription info
    const sub = await getUserSubscription(userId);
    return NextResponse.json(sub);
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json({ error: "Failed to check subscription" }, { status: 500 });
  }
}
