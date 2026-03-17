"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { useToast } from "@/components/Toast";
import ToneIndicator from "@/components/ToneIndicator";
import SuggestionCard from "@/components/SuggestionCard";
import type { Tone, ToneResult } from "@/types/analysis";

export default function AnalyzeTextPage() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [result, setResult] = useState<ToneResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const toast = useToast();

  async function handleAnalyze() {
    if (!text.trim()) return;
    setAnalyzing(true);
    const toastId = toast.show(t("common.analyzing"), { type: "processing" });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data: ToneResult = await res.json();
      setResult(data);
      toast.update(toastId, t("analyzeTextPage.analysisComplete"), { type: "success", duration: 3000 });
    } catch {
      toast.update(toastId, t("analyzeTextPage.analysisFailed"), { type: "error", duration: 5000 });
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 640 }}>
        <h1 className="section-heading text-glow mb-2">{t("analyzeTextPage.title")}</h1>
        <p className="body-muted text-sm mb-8">
          {t("analyzeTextPage.subtitle")}
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("analyzeTextPage.placeholder")}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-y"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        />

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !text.trim()}
          className="mt-4 px-6 py-3 rounded-xl font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--color-accent)" }}>
          {analyzing ? t("common.analyzing") : t("common.analyze")}
        </button>

        {result && (
          <div className="mt-8 space-y-4">
            <div
              className="glass-card p-6 flex items-center gap-6">
              <ToneIndicator tone={result.tone as Tone} size="lg" />
              <div>
                <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>
                  {t("analyzeTextPage.confidence", { value: Math.round(result.confidence * 100) })}
                </p>
              </div>
            </div>
            <SuggestionCard suggestion={result.suggestion} emotions={result.emotions || []} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
