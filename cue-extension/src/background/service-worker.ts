import type { Message } from "../shared/messages";
import type { TranscriptSegment } from "../shared/types";
import { DEFAULT_SESSION } from "../shared/types";
import { WHISPER_HALLUCINATIONS, SUMMARY_THRESHOLD } from "../shared/constants";
import { getSession, saveSession, clearSession } from "../shared/storage";
import { transcribeAudio, analyzeText, updateConversationContext } from "./api-client";
import { detectPlatform } from "./platform-detector";

// In-memory state (faster than storage for hot path)
let session = { ...DEFAULT_SESSION };
let unsummarizedSegments: Array<{ text: string; tone: string; signal?: string; signalLabel?: string }> = [];
let summaryPending = false;

// Restore state on service worker wake
async function restoreState() {
  session = await getSession();
}
restoreState();

// ---------- Offscreen document management ----------

let offscreenReady = false;

async function ensureOffscreen() {
  // @ts-expect-error - getContexts is available in MV3
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
  });

  if (contexts.length > 0) {
    offscreenReady = true;
    return;
  }

  await chrome.offscreen.createDocument({
    url: "offscreen/offscreen.html",
    reasons: [chrome.offscreen.Reason.USER_MEDIA],
    justification: "Recording tab audio for conversation analysis",
  });
  offscreenReady = true;
}

async function closeOffscreen() {
  if (!offscreenReady) return;
  try {
    await chrome.offscreen.closeDocument();
  } catch { /* already closed */ }
  offscreenReady = false;
}

// ---------- Tab capture ----------

async function startCapture(tabId: number) {
  // Get a media stream ID for the tab
  const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tabId });

  await ensureOffscreen();

  // Tell offscreen document to start recording
  chrome.runtime.sendMessage({ type: "START_RECORDING", streamId });
}

function stopCapture() {
  chrome.runtime.sendMessage({ type: "STOP_RECORDING" });
}

// ---------- Audio processing pipeline ----------

async function processAudioChunk(audioData: number[]) {
  if (!session.isRecording) return;

  // Notify widget: processing
  broadcastToTab({ type: "PROCESSING" });

  try {
    // 1. Transcribe
    const text = await transcribeAudio(audioData);

    // Filter hallucinations
    const lower = (text || "").trim().toLowerCase();
    const isHallucination = !text || lower.length < 3 ||
      WHISPER_HALLUCINATIONS.some((h) => lower.includes(h));

    if (isHallucination) return;

    // 2. Analyze
    const recentSegs = session.segments.slice(-3).map((s) => ({
      text: s.text,
      tone: s.tone.tone,
    }));

    const analysis = await analyzeText(text, session.conversationSummary || undefined, recentSegs);

    // 3. Build segment
    const segment: TranscriptSegment = { text, timestamp: Date.now(), tone: analysis };
    session.segments.push(segment);

    // Update session state
    session.currentTone = analysis.tone;
    session.currentSuggestion = analysis.suggestion;
    session.currentEmotions = analysis.emotions || [];
    if (analysis.classification) session.classification = analysis.classification;
    if (analysis.coachingTip) session.coachingTip = analysis.coachingTip;
    if (analysis.liveInsight) session.liveInsight = analysis.liveInsight;
    if (analysis.qualityScore != null) {
      session.qualityScore = session.qualityScore === 0
        ? analysis.qualityScore
        : Math.round((session.qualityScore + analysis.qualityScore) / 2);
    }
    if (analysis.engagementScore != null) {
      session.engagementScore = session.engagementScore === 0
        ? analysis.engagementScore
        : Math.round((session.engagementScore + analysis.engagementScore) / 2);
    }

    // Track signals
    if (analysis.signal && analysis.signal !== "none") {
      session.signals.push({
        signal: analysis.signal,
        label: analysis.signalLabel || analysis.signal,
        time: Date.now(),
      });
      broadcastToTab({
        type: "SIGNAL_DETECTED",
        signal: analysis.signal,
        label: analysis.signalLabel || "",
      });
    }

    // 4. Send to widget
    broadcastToTab({ type: "TONE_UPDATE", data: analysis });

    // 5. Rolling summary
    unsummarizedSegments.push({
      text,
      tone: analysis.tone,
      signal: analysis.signal,
      signalLabel: analysis.signalLabel,
    });

    if (unsummarizedSegments.length >= SUMMARY_THRESHOLD && !summaryPending) {
      summaryPending = true;
      const segsToSummarize = [...unsummarizedSegments];
      unsummarizedSegments = [];
      updateConversationContext(session.conversationSummary || null, segsToSummarize)
        .then((summary) => { if (summary) session.conversationSummary = summary; })
        .catch((err) => console.error("Rolling summary error:", err))
        .finally(() => { summaryPending = false; });
    }

    // Persist to storage (non-blocking)
    saveSession(session);

  } catch (err) {
    console.error("Audio processing error:", err);
  }
}

// ---------- Broadcasting to content script ----------

function broadcastToTab(msg: Message) {
  if (session.tabId) {
    chrome.tabs.sendMessage(session.tabId, msg).catch(() => {});
  }
}

// ---------- Message handler ----------

chrome.runtime.onMessage.addListener((msg: Message, _sender, sendResponse) => {
  switch (msg.type) {
    case "START_SESSION": {
      const { tabId } = msg;
      session = { ...DEFAULT_SESSION, isRecording: true, tabId, startTime: Date.now() };
      unsummarizedSegments = [];
      summaryPending = false;
      saveSession(session);

      startCapture(tabId)
        .then(() => {
          broadcastToTab({ type: "SESSION_STARTED" });
          sendResponse({ ok: true });
        })
        .catch((err) => {
          console.error("Capture error:", err);
          session.isRecording = false;
          saveSession(session);
          sendResponse({ ok: false, error: String(err) });
        });

      return true; // async response
    }

    case "STOP_SESSION": {
      session.isRecording = false;
      saveSession(session);
      stopCapture();
      closeOffscreen();
      broadcastToTab({ type: "SESSION_STOPPED" });
      sendResponse({ ok: true });
      break;
    }

    case "GET_STATUS": {
      sendResponse({ state: session });
      break;
    }

    case "AUDIO_CHUNK": {
      processAudioChunk(msg.data);
      break;
    }

    case "PLATFORM_DETECTED": {
      // Could show a notification or badge
      console.log(`Platform detected: ${msg.platform}`);
      break;
    }
  }
});

// ---------- Platform detection on tab update ----------

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const platform = detectPlatform(tab.url);
    if (platform && tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: "PLATFORM_DETECTED",
        platform,
      }).catch(() => {});
    }
  }
});
