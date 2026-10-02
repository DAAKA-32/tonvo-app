"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSubscriptionFeed } from "@/hooks/useSubscriptionFeed";
import { SOCIAL_PROOF } from "@/lib/social-proof/config";
import SubscriptionNotification from "./SubscriptionNotification";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Recent-subscription notifications: one at a time, bottom left (bottom
 * center on phones), rotating every few seconds. Pauses on hover, keyboard
 * focus and hidden tabs; the visitor can hide it for the current page view. Renders
 * nothing until the feed has events (see useSubscriptionFeed).
 */
export default function SubscriptionNotifications() {
  const feed = useSubscriptionFeed();
  const { t } = useTranslation();
  const reduce = !!useReducedMotion();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!feed) return;
    const id = setTimeout(() => {
      setNow(Date.now());
      setReady(true);
    }, SOCIAL_PROOF.initialDelayMs);
    return () => clearTimeout(id);
  }, [feed]);

  const count = feed?.events.length ?? 0;
  useEffect(() => {
    if (!ready || dismissed || paused || tabHidden || count < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
      setNow(Date.now());
    }, SOCIAL_PROOF.rotateMs);
    return () => clearInterval(id);
  }, [ready, dismissed, paused, tabHidden, count]);

  // Hides them for this page view only: they come back on every visit to the landing.
  const dismiss = () => setDismissed(true);

  const event = feed && count ? feed.events[index % count] : null;
  const visible = !!event && ready && !dismissed;

  return (
    <div
      className="fixed inset-x-0 z-30 flex justify-center sm:justify-start px-3 sm:px-5 pointer-events-none"
      style={{ bottom: "calc(12px + env(safe-area-inset-bottom))" }}
    >
      <AnimatePresence>
        {visible && event && (
          <motion.aside
            key="subscription-notifications"
            aria-label={t("socialProof.region")}
            className="pointer-events-auto relative w-full max-w-[400px] sm:w-[360px] flex items-center gap-2 rounded-2xl pl-3 pr-2 py-3"
            style={{
              background: "rgba(17, 17, 20, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 18px 48px -14px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(16px) saturate(1.4)",
              WebkitBackdropFilter: "blur(16px) saturate(1.4)",
            }}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 12 }}
            transition={{ duration: 0.5, ease: EASE }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
            }}
          >
            {/* The card stays put; the notification dissolves its own changing words. */}
            <div className="flex-1 min-w-0">
              <SubscriptionNotification event={event} now={now} demo={feed?.mode === "demo"} />
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label={t("socialProof.dismiss")}
              className="shrink-0 self-start inline-flex items-center justify-center w-7 h-7 rounded-full border-0 bg-transparent cursor-pointer transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: "var(--color-text-muted)", outlineColor: "var(--color-positive)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
