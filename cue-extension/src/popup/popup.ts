import type { SessionState } from "../shared/types";
import { getSettings, saveSettings } from "../shared/storage";

const mainBtn = document.getElementById("mainBtn") as HTMLButtonElement;
const statusDot = document.getElementById("statusDot") as HTMLDivElement;
const sessionInfo = document.getElementById("sessionInfo") as HTMLDivElement;
const idleMsg = document.getElementById("idleMsg") as HTMLDivElement;
const elapsedEl = document.getElementById("elapsed") as HTMLSpanElement;
const segmentCount = document.getElementById("segmentCount") as HTMLSpanElement;
const currentTone = document.getElementById("currentTone") as HTMLSpanElement;
const qualityScoreEl = document.getElementById("qualityScore") as HTMLSpanElement;
const settingsToggle = document.getElementById("settingsToggle") as HTMLButtonElement;
const settingsPanel = document.getElementById("settingsPanel") as HTMLDivElement;
const apiUrlInput = document.getElementById("apiUrl") as HTMLInputElement;
const saveBtn = document.getElementById("saveSettings") as HTMLButtonElement;

let isRecording = false;
let startTime: number | null = null;
let timerInterval: ReturnType<typeof setInterval> | null = null;

// Init
async function init() {
  const settings = await getSettings();
  apiUrlInput.value = settings.apiBaseUrl;

  // Get current state from background
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    if (response?.state) {
      updateUI(response.state);
    }
  });
}

function updateUI(state: SessionState) {
  isRecording = state.isRecording;
  startTime = state.startTime;

  if (isRecording) {
    mainBtn.textContent = "Stop Session";
    mainBtn.classList.add("recording");
    statusDot.className = "status-dot recording";
    sessionInfo.style.display = "block";
    idleMsg.style.display = "none";

    segmentCount.textContent = String(state.segments.length);
    currentTone.textContent = state.currentTone;
    currentTone.className = `tone-pill ${state.currentTone}`;
    qualityScoreEl.textContent = state.qualityScore > 0 ? String(state.qualityScore) : "--";

    // Start timer
    if (!timerInterval && startTime) {
      timerInterval = setInterval(() => updateTimer(), 1000);
      updateTimer();
    }
  } else {
    mainBtn.textContent = "Start Session";
    mainBtn.classList.remove("recording");
    statusDot.className = "status-dot connected";
    sessionInfo.style.display = "none";
    idleMsg.style.display = "block";

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
}

function updateTimer() {
  if (!startTime) return;
  const secs = Math.floor((Date.now() - startTime) / 1000);
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  elapsedEl.textContent = `${m}:${s}`;
}

// Start/Stop
mainBtn.addEventListener("click", async () => {
  if (isRecording) {
    mainBtn.disabled = true;
    chrome.runtime.sendMessage({ type: "STOP_SESSION" }, () => {
      isRecording = false;
      mainBtn.disabled = false;
      updateUI({
        isRecording: false, tabId: null, segments: [], currentTone: "neutral",
        currentSuggestion: "", currentEmotions: [], coachingTip: "", liveInsight: "",
        qualityScore: 0, engagementScore: 0, classification: "neutral",
        signals: [], conversationSummary: "", startTime: null,
      });
    });
  } else {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    mainBtn.disabled = true;
    mainBtn.textContent = "Starting...";

    chrome.runtime.sendMessage({ type: "START_SESSION", tabId: tab.id }, (response) => {
      mainBtn.disabled = false;
      if (response?.ok) {
        updateUI({
          isRecording: true, tabId: tab.id!, segments: [], currentTone: "neutral",
          currentSuggestion: "", currentEmotions: [], coachingTip: "", liveInsight: "",
          qualityScore: 0, engagementScore: 0, classification: "neutral",
          signals: [], conversationSummary: "", startTime: Date.now(),
        });
      } else {
        mainBtn.textContent = "Start Session";
      }
    });
  }
});

// Settings
settingsToggle.addEventListener("click", () => {
  settingsPanel.style.display = settingsPanel.style.display === "none" ? "block" : "none";
});

saveBtn.addEventListener("click", async () => {
  const url = apiUrlInput.value.trim().replace(/\/$/, "");
  if (url) {
    await saveSettings({ apiBaseUrl: url });
    saveBtn.textContent = "Saved!";
    setTimeout(() => { saveBtn.textContent = "Save"; }, 1500);
  }
});

// Poll for updates while popup is open
setInterval(() => {
  if (!isRecording) return;
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    if (response?.state) updateUI(response.state);
  });
}, 2000);

init();
