"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/components/PublicProviders";

/** 404 inside a language: same language, a way home. (An unknown language falls back to app/not-found.tsx.) */
export default function LocaleNotFound() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text-silver)",
      }}
    >
      <p style={{ margin: 0, fontSize: 14, letterSpacing: "0.12em", color: "var(--color-text-muted)" }}>404</p>
      <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--color-text)" }}>{t("notFound.title")}</h1>
      <p style={{ margin: 0, maxWidth: 420 }}>{t("notFound.body")}</p>
      <Link
        href={lp("/")}
        className="no-underline font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          marginTop: 8,
          padding: "10px 20px",
          borderRadius: 999,
          color: "var(--color-text)",
          border: "1px solid rgba(52, 211, 153, 0.45)",
          background: "rgba(52, 211, 153, 0.12)",
        }}
      >
        {t("notFound.home")}
      </Link>
    </main>
  );
}
