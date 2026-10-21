"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { track } from "@/lib/analytics/client";

/**
 * First-run chooser on the dashboard: "What would you like help with?".
 * Every option leads to something that works today (live session, message help, scripted demo).
 * Not a modal and not required: it shows until the person picks or dismisses it. The choice is kept
 * in localStorage, so it is once per browser and account (not synced across devices).
 */
const CHOICES = [
  { id: "words", href: "/session" },
  { id: "message", href: "/analyze-text" },
  { id: "language", href: "/session" },
  { id: "demo", href: "/session?demo=1" },
] as const;

const storageKey = (uid: string) => `tonvo-onboarding-v1:${uid}`;

function isDone(uid: string): boolean {
  try {
    return window.localStorage.getItem(storageKey(uid)) === "1";
  } catch {
    return false;
  }
}

function markDone(uid: string): void {
  try {
    window.localStorage.setItem(storageKey(uid), "1");
  } catch {
    /* storage blocked: the card simply shows again next visit */
  }
}

export default function OnboardingChooser({ uid }: { uid: string }) {
  const { t } = useTranslation();
  // Hidden until storage is read, so the server render and first client render match.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!isDone(uid));
  }, [uid]);

  if (!visible) return null;

  const pick = (choice: string) => {
    markDone(uid);
    track("onboarding_choice", { choice });
  };

  return (
    <section
      aria-labelledby="onboarding-title"
      style={{
        position: "relative",
        zIndex: 1,
        marginBottom: 40,
        padding: 24,
        borderRadius: 16,
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      <h2
        id="onboarding-title"
        style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--color-text)" }}
      >
        {t("onboarding.title")}
      </h2>
      <p style={{ margin: "6px 0 18px", fontSize: 14, color: "var(--color-text-muted)" }}>
        {t("onboarding.subtitle")}
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {CHOICES.map((c) => (
          <li key={c.id}>
            <Link
              href={c.href}
              onClick={() => pick(c.id)}
              className="block h-full rounded-xl p-4 no-underline transition-colors hover:bg-(--color-surface-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-light)"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--color-text)" }}>
                {t(`onboarding.${c.id}.title`)}
              </span>
              <span
                style={{ display: "block", marginTop: 4, fontSize: 13, lineHeight: 1.5, color: "var(--color-text-muted)" }}
              >
                {t(`onboarding.${c.id}.desc`)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => {
          markDone(uid);
          track("onboarding_choice", { choice: "skip" });
          setVisible(false);
        }}
        className="mt-3 min-h-11 cursor-pointer border-none bg-transparent px-2 text-sm underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-light)"
        style={{ color: "var(--color-text-muted)" }}
      >
        {t("onboarding.skip")}
      </button>
    </section>
  );
}
