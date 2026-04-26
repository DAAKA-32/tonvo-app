"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAuthToken } from "@/lib/api-client";

export type CopilotMode = "translate_only" | "translate_summary" | "summary_only";

export interface IncomingSegment {
  id: string;
  text: string;
  speaker?: string;
  sourceLang?: string | null;
}

interface TranslatedSegment {
  id: string;
  speaker?: string;
  original: string;
  translated: string;
  sourceLang?: string | null;
  streaming: boolean;
}

interface UseLiveTranslationArgs {
  segments: IncomingSegment[];
  targetLang: string;
  mode: CopilotMode;
  enabled: boolean;
}

interface UseLiveTranslationResult {
  items: TranslatedSegment[];
  summary: string;
  summaryStreaming: boolean;
  error: string | null;
  clear: () => void;
}

const SUMMARY_DEBOUNCE_MS = 1200;
const SUMMARY_MIN_NEW_SEGMENTS = 2;

export function useLiveTranslation({
  segments,
  targetLang,
  mode,
  enabled,
}: UseLiveTranslationArgs): UseLiveTranslationResult {
  const [items, setItems] = useState<TranslatedSegment[]>([]);
  const [summary, setSummary] = useState("");
  const [summaryStreaming, setSummaryStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inFlight = useRef<Set<string>>(new Set());
  const translateAborts = useRef<Map<string, AbortController>>(new Map());
  const summaryAbort = useRef<AbortController | null>(null);
  const summaryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSummarizedCount = useRef(0);
  const summaryRevision = useRef(0);

  const wantsTranslation = enabled && (mode === "translate_only" || mode === "translate_summary");
  const wantsSummary = enabled && (mode === "translate_summary" || mode === "summary_only");

  const streamTranslation = useCallback(
    async (seg: IncomingSegment) => {
      if (inFlight.current.has(seg.id)) return;
      inFlight.current.add(seg.id);

      const ctrl = new AbortController();
      translateAborts.current.set(seg.id, ctrl);

      setItems((prev) => {
        if (prev.some((p) => p.id === seg.id)) return prev;
        return [
          ...prev,
          {
            id: seg.id,
            speaker: seg.speaker,
            original: seg.text,
            translated: "",
            sourceLang: seg.sourceLang ?? null,
            streaming: true,
          },
        ];
      });

      try {
        const token = await getAuthToken();
        const res = await fetch("/api/copilot/translate/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            text: seg.text,
            sourceLang: seg.sourceLang ?? null,
            targetLang,
            segmentId: seg.id,
          }),
          signal: ctrl.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Translation HTTP ${res.status}`);
        }

        await consumeSSE(res.body, (event, payload) => {
          if (event === "delta" && typeof payload?.text === "string") {
            const chunk = payload.text as string;
            setItems((prev) => prev.map((p) => (p.id === seg.id ? { ...p, translated: p.translated + chunk } : p)));
          } else if (event === "done") {
            setItems((prev) => prev.map((p) => (p.id === seg.id ? { ...p, streaming: false } : p)));
          } else if (event === "error") {
            setError(typeof payload?.message === "string" ? payload.message : "Translation error");
            setItems((prev) => prev.map((p) => (p.id === seg.id ? { ...p, streaming: false } : p)));
          }
        });
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Translation failed");
        setItems((prev) => prev.map((p) => (p.id === seg.id ? { ...p, streaming: false } : p)));
      } finally {
        translateAborts.current.delete(seg.id);
      }
    },
    [targetLang],
  );

  useEffect(() => {
    if (!wantsTranslation) return;
    for (const seg of segments) {
      if (!inFlight.current.has(seg.id)) {
        streamTranslation(seg);
      }
    }
  }, [segments, wantsTranslation, streamTranslation]);

  const runSummary = useCallback(async () => {
    if (!wantsSummary) return;
    if (segments.length < SUMMARY_MIN_NEW_SEGMENTS) return;
    if (segments.length - lastSummarizedCount.current < SUMMARY_MIN_NEW_SEGMENTS) return;

    summaryAbort.current?.abort();
    const ctrl = new AbortController();
    summaryAbort.current = ctrl;
    const revision = ++summaryRevision.current;

    setSummaryStreaming(true);
    setSummary("");

    try {
      const token = await getAuthToken();
      const payloadSegments = segments.map((s) => ({ speaker: s.speaker, text: s.text }));
      const res = await fetch("/api/copilot/summarize/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ segments: payloadSegments, targetLang, revision }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) throw new Error(`Summary HTTP ${res.status}`);

      await consumeSSE(res.body, (event, payload) => {
        if (payload?.revision !== revision) return;
        if (event === "delta" && typeof payload?.text === "string") {
          setSummary((prev) => prev + payload.text);
        } else if (event === "done") {
          setSummaryStreaming(false);
          lastSummarizedCount.current = segments.length;
        } else if (event === "error") {
          setSummaryStreaming(false);
        }
      });
    } catch (err) {
      if ((err as { name?: string })?.name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Summary failed");
      }
      setSummaryStreaming(false);
    }
  }, [segments, targetLang, wantsSummary]);

  useEffect(() => {
    if (!wantsSummary) return;
    if (summaryTimer.current) clearTimeout(summaryTimer.current);
    summaryTimer.current = setTimeout(runSummary, SUMMARY_DEBOUNCE_MS);
    return () => {
      if (summaryTimer.current) clearTimeout(summaryTimer.current);
    };
  }, [segments.length, wantsSummary, runSummary]);

  useEffect(() => {
    if (enabled) return;
    translateAborts.current.forEach((c) => c.abort());
    translateAborts.current.clear();
    summaryAbort.current?.abort();
    summaryAbort.current = null;
    if (summaryTimer.current) clearTimeout(summaryTimer.current);
  }, [enabled]);

  const clear = useCallback(() => {
    translateAborts.current.forEach((c) => c.abort());
    translateAborts.current.clear();
    summaryAbort.current?.abort();
    summaryAbort.current = null;
    inFlight.current.clear();
    lastSummarizedCount.current = 0;
    summaryRevision.current = 0;
    setItems([]);
    setSummary("");
    setSummaryStreaming(false);
    setError(null);
  }, []);

  return { items, summary, summaryStreaming, error, clear };
}

async function consumeSSE(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: string, data: { [k: string]: unknown }) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const raw = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      const lines = raw.split("\n");
      let event = "message";
      let dataLine = "";
      for (const line of lines) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) dataLine += line.slice(5).trim();
      }
      if (!dataLine) continue;
      try {
        const data = JSON.parse(dataLine);
        onEvent(event, data);
      } catch {
        // ignore malformed frame
      }
    }
  }
}
