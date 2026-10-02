"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import type { PlanId } from "@/lib/pricing-config";
import { SOCIAL_PROOF } from "@/lib/social-proof/config";
import { isJustNow, relativeTime } from "@/lib/social-proof/feed";
import type { SubscriptionEvent } from "@/lib/social-proof/types";

const PLAN_NAME_KEY: Record<PlanId, string> = {
  free: "pricing.planFree.name",
  pro: "pricing.planPro.name",
  team: "pricing.planTeam.name",
};

/* The app's speaker-avatar rotation (brand bible §2). */
const AVATAR_COLORS = ["#818cf8", "#34d399", "#fb923c", "#f87171", "#38bdf8", "#c084fc"];

/** Gentle ease-in-out: the old words melt out while the new ones settle in. */
const DISSOLVE = [0.45, 0, 0.55, 1] as const;

function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

/**
 * Cross-fades whatever changes with `id`. Outgoing and incoming content share
 * one grid cell, so they overlap in place: no slide, no layout jump.
 */
function Dissolve({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const soft = reduce ? "blur(0px)" : "blur(2px)";
  return (
    <span className={`grid ${className}`}>
      <AnimatePresence initial={false}>
        <motion.span
          key={id}
          style={{ gridArea: "1 / 1" }}
          initial={{ opacity: 0, filter: soft }}
          animate={{ opacity: 1, filter: "blur(0px)", transition: { duration: 0.75, ease: DISSOLVE } }}
          exit={{ opacity: 0, filter: soft, transition: { duration: 0.55, ease: DISSOLVE } }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface SubscriptionNotificationProps {
  event: SubscriptionEvent;
  now: number;
  demo: boolean;
}

/**
 * One notification: who, which plan, how long ago. The card, the live dot and
 * the Demo badge never move; only the words that change dissolve into the next.
 */
export default function SubscriptionNotification({ event, now, demo }: SubscriptionNotificationProps) {
  const { t, i18n } = useTranslation();
  const just = isJustNow(event.createdAt, now, SOCIAL_PROOF.justNowMinutes);
  const name = event.displayName;
  const key = name
    ? just ? "socialProof.justJoined" : "socialProof.joined"
    : just ? "socialProof.justJoinedAnonymous" : "socialProof.joinedAnonymous";
  const strong = <strong className="font-semibold" style={{ color: "var(--color-text)" }} />;
  const color = name ? avatarColor(name) : null;

  return (
    <div className="flex items-center gap-3 min-w-0">
      <span
        aria-hidden
        className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full text-[13px] font-semibold"
        style={{
          ...(color
            ? { color, background: `${color}1f`, borderColor: `${color}40` }
            : { color: "var(--color-text-silver)", background: "var(--color-surface-2)", borderColor: "var(--color-border)" }),
          borderWidth: 1,
          borderStyle: "solid",
          transition: "color 0.75s ease, background-color 0.75s ease, border-color 0.75s ease",
        }}
      >
        <Dissolve id={event.id} className="place-items-center">
          {name ? (
            name.charAt(0)
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </Dissolve>
      </span>

      <div className="min-w-0 flex-1">
        <p className="m-0 text-[13.5px] leading-snug" style={{ color: "var(--color-text-silver)" }}>
          <Dissolve id={event.id}>
            <span className="line-clamp-2">
              <Trans i18nKey={key} values={{ name: name ?? "", plan: t(PLAN_NAME_KEY[event.planId]) }} components={{ name: strong, plan: strong }} />
            </span>
          </Dissolve>
        </p>
        <p className="m-0 mt-1 flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-positive)" }} aria-hidden />
          <Dissolve id={event.id} className="tabular-nums whitespace-nowrap">
            {relativeTime(event.createdAt, now, i18n.language)}
          </Dissolve>
          {demo && (
            <span
              className="px-1.5 py-px rounded text-[11px] font-semibold"
              style={{ color: "var(--color-text)", background: "rgba(255, 255, 255, 0.07)", border: "1px solid rgba(255, 255, 255, 0.18)" }}
            >
              {t("socialProof.demo")}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
