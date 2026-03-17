// Offscreen document: runs MediaRecorder on tab audio stream
// Service worker cannot access DOM/MediaRecorder, so this document handles it.

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let sendInterval: ReturnType<typeof setInterval> | null = null;

function getSupportedMimeType(): string {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "audio/webm";
}

async function startRecording(streamId: string) {
  try {
    // Get the tab audio stream using the streamId from tabCapture
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        // @ts-expect-error - Chrome-specific constraint for tab capture
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      },
    });

    const mimeType = getSupportedMimeType();
    mediaRecorder = new MediaRecorder(stream, { mimeType });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.start(5000); // 5-second chunks

    // Send chunks to service worker every 5.5s
    sendInterval = setInterval(async () => {
      if (audioChunks.length > 0) {
        const blob = new Blob(audioChunks, { type: mimeType });
        audioChunks = [];

        // Convert to ArrayBuffer then to number array for message passing
        const buffer = await blob.arrayBuffer();
        const data = Array.from(new Uint8Array(buffer));

        chrome.runtime.sendMessage({ type: "AUDIO_CHUNK", data });
      }
    }, 5500);

  } catch (err) {
    console.error("Offscreen recording error:", err);
  }
}

function stopRecording() {
  if (sendInterval) {
    clearInterval(sendInterval);
    sendInterval = null;
  }

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    // Stop all tracks
    mediaRecorder.stream.getTracks().forEach((t) => t.stop());
  }

  mediaRecorder = null;
  audioChunks = [];
}

// Listen for messages from service worker
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "START_RECORDING" && msg.streamId) {
    startRecording(msg.streamId);
  } else if (msg.type === "STOP_RECORDING") {
    stopRecording();
  }
});
