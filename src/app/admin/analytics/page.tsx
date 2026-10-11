"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { authFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface Counts {
  visitors: number;
  clicks: number;
  signups: number;
  activated: number;
  checkoutStarted: number;
  paid: number;
}
interface Report {
  days: number;
  truncated: boolean;
  totals: Counts;
  bySource: Array<Counts & { source: string }>;
  topPages: Array<{ path: string; visitors: number }>;
  vsl: { sound: number; fullscreen: number };
}

const STEPS: Array<keyof Counts> = ["visitors", "clicks", "signups", "activated", "checkoutStarted", "paid"];
const PERIODS = [7, 30, 90] as const;

function rate(n: number, of: number): string {
  if (of <= 0) return "–";
  return `${Math.round((n / of) * 1000) / 10}%`;
}

export default function AdminAnalyticsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [days, setDays] = useState<(typeof PERIODS)[number]>(30);
  const [report, setReport] = useState<Report | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "forbidden" | "error">("loading");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setState("loading");
    authFetch(`/api/admin/analytics?days=${days}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 403) return setState("forbidden");
        if (!res.ok) return setState("error");
        setReport((await res.json()) as Report);
        setState("ok");
      })
      .catch(() => !cancelled && setState("error"));
    return () => {
      cancelled = true;
    };
  }, [user, days]);

  const totals = report?.totals;
  const max = totals ? Math.max(1, totals.visitors) : 1;
  const empty = totals ? STEPS.every((s) => totals[s] === 0) : false;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10" style={{ color: "var(--color-text)" }}>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">{t("adminAnalytics.title")}</h1>
            <p className="text-sm mt-1 max-w-xl" style={{ color: "var(--color-text-muted)" }}>
              {t("adminAnalytics.subtitle")}
            </p>
          </div>
          <div className="flex gap-1 rounded-xl p-1" style={{ border: "1px solid var(--color-border)" }} role="group">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setDays(p)}
                aria-pressed={days === p}
                className="px-3 py-1.5 rounded-lg text-sm font-medium focus-visible:outline focus-visible:outline-2"
                style={{
                  background: days === p ? "var(--color-surface)" : "transparent",
                  color: days === p ? "var(--color-text)" : "var(--color-text-muted)",
                }}
              >
                {t("adminAnalytics.days", { n: p })}
              </button>
            ))}
          </div>
        </div>

        {state === "loading" && <p style={{ color: "var(--color-text-muted)" }}>{t("adminAnalytics.loading")}</p>}
        {state === "forbidden" && <p style={{ color: "var(--color-text-muted)" }}>{t("adminAnalytics.forbidden")}</p>}
        {state === "error" && <p style={{ color: "var(--color-negative)" }}>{t("adminAnalytics.error")}</p>}

        {state === "ok" && report && totals && (
          <>
            {empty && (
              <p className="mb-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
                {t("adminAnalytics.empty")}
              </p>
            )}

            <section aria-labelledby="funnel-h" className="mb-10">
              <h2 id="funnel-h" className="sr-only">{t("adminAnalytics.funnel")}</h2>
              <ol className="space-y-3">
                {STEPS.map((step, i) => {
                  const n = totals[step];
                  const prev = i === 0 ? n : totals[STEPS[i - 1]];
                  return (
                    <li key={step} className="grid grid-cols-[minmax(0,11rem)_1fr_auto] items-center gap-3">
                      <span className="text-sm font-medium">{t(`adminAnalytics.${step}`)}</span>
                      <span className="h-7 rounded-md overflow-hidden" style={{ background: "var(--color-surface)" }}>
                        <span
                          className="block h-full rounded-md"
                          style={{
                            width: `${Math.max(n > 0 ? 2 : 0, (n / max) * 100)}%`,
                            background: "linear-gradient(90deg, rgba(52,211,153,0.55), rgba(52,211,153,0.25))",
                          }}
                        />
                      </span>
                      <span className="text-sm tabular-nums text-right min-w-[7.5rem]">
                        <strong>{n}</strong>
                        {i > 0 && (
                          <span className="ml-2" style={{ color: "var(--color-text-muted)" }}>
                            {t("adminAnalytics.stepRate", { rate: rate(n, prev) })}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section aria-labelledby="source-h" className="mb-10">
              <h2 id="source-h" className="text-lg font-semibold mb-3">{t("adminAnalytics.bySource")}</h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
                <table className="w-full text-sm">
                  <thead style={{ color: "var(--color-text-muted)" }}>
                    <tr>
                      <th className="text-left font-medium px-3 py-2">{t("adminAnalytics.source")}</th>
                      {STEPS.map((s) => (
                        <th key={s} className="text-right font-medium px-3 py-2">{t(`adminAnalytics.${s}`)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.bySource.map((row) => (
                      <tr key={row.source} style={{ borderTop: "1px solid var(--color-border)" }}>
                        <td className="px-3 py-2 font-medium">{row.source}</td>
                        {STEPS.map((s) => (
                          <td key={s} className="px-3 py-2 text-right tabular-nums">{row[s]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>{t("adminAnalytics.note")}</p>
            </section>

            <div className="grid gap-6 sm:grid-cols-2">
              <section aria-labelledby="pages-h">
                <h2 id="pages-h" className="text-lg font-semibold mb-3">{t("adminAnalytics.topPages")}</h2>
                <ul className="text-sm space-y-1.5">
                  {report.topPages.map((p) => (
                    <li key={p.path} className="flex justify-between gap-3">
                      <span className="truncate">{p.path}</span>
                      <span className="tabular-nums" style={{ color: "var(--color-text-muted)" }}>{p.visitors}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="vsl-h">
                <h2 id="vsl-h" className="text-lg font-semibold mb-3">{t("adminAnalytics.vsl")}</h2>
                <ul className="text-sm space-y-1.5">
                  <li className="flex justify-between gap-3">
                    <span>{t("adminAnalytics.vslSound")}</span>
                    <span className="tabular-nums">{report.vsl.sound}</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>{t("adminAnalytics.vslFullscreen")}</span>
                    <span className="tabular-nums">{report.vsl.fullscreen}</span>
                  </li>
                </ul>
              </section>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
