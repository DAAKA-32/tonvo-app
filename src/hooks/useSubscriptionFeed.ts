"use client";

import { useEffect, useState } from "react";
import { SOCIAL_PROOF } from "@/lib/social-proof/config";
import { demoSubscriptionEvents } from "@/lib/social-proof/demo-events";
import { selectLiveEvents } from "@/lib/social-proof/feed";
import { feedResponseSchema, type SubscriptionEvent } from "@/lib/social-proof/types";

export interface SubscriptionFeed {
  events: SubscriptionEvent[];
  /** "demo" events are placeholders and are always shown with a Demo badge. */
  mode: "demo" | "live";
}

/**
 * Picks the notification source: real subscriptions from /api/social-proof
 * when there are enough of them, otherwise the demo examples, which always
 * carry a visible Demo badge. The two are never mixed. ?social-proof=demo
 * forces the examples, =live the real feed only, =off hides the widget.
 */
export function useSubscriptionFeed(): SubscriptionFeed | null {
  const [feed, setFeed] = useState<SubscriptionFeed | null>(null);

  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get(SOCIAL_PROOF.queryParam);
    if (flag === "off") return;
    const showDemo = () => setFeed({ events: demoSubscriptionEvents(), mode: "demo" });
    if (flag === "demo") {
      showDemo();
      return;
    }

    const controller = new AbortController();
    const fallback = () => {
      if (flag !== "live" && !controller.signal.aborted) showDemo();
    };
    fetch("/api/social-proof", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: unknown) => {
        const parsed = feedResponseSchema.safeParse(json);
        const events = parsed.success ? selectLiveEvents(parsed.data.events, Date.now(), SOCIAL_PROOF) : [];
        if (events.length) setFeed({ events, mode: "live" });
        else fallback();
      })
      .catch(fallback);
    return () => controller.abort();
  }, []);

  return feed;
}
