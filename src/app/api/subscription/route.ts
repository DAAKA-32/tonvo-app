import { NextRequest, NextResponse } from "next/server";
import { getUserSubscription, canStartSession, incrementSessionCount } from "@/lib/subscription";
import { verifyAuth } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, action } = await req.json();

    if (userId && userId !== authUser.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
