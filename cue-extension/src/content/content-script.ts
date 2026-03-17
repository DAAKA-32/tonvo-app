import type { Message } from "../shared/messages";
import { WIDGET_CSS } from "./widget-css";
import { TonvoWidget } from "./widget";

// Don't inject into extension pages or iframes
if (window === window.top) {
  let widget: TonvoWidget | null = null;

  function ensureWidget(): TonvoWidget {
    if (!widget) {
      widget = new TonvoWidget();
      widget.setStyleContent(WIDGET_CSS);
    }
    return widget;
  }

  // Listen for messages from background service worker
  chrome.runtime.onMessage.addListener((msg: Message) => {
    const w = ensureWidget();

    switch (msg.type) {
      case "SESSION_STARTED":
        w.onSessionStarted();
        break;

      case "SESSION_STOPPED":
        w.onSessionStopped();
        break;

      case "TONE_UPDATE":
        w.onToneUpdate(msg.data);
        break;

      case "SIGNAL_DETECTED":
        w.onSignalDetected(msg.signal, msg.label);
        break;

      case "PROCESSING":
        w.onProcessing();
        break;

      case "PLATFORM_DETECTED":
        w.showPlatformPrompt(msg.platform);
        break;
    }
  });

  // Initialize widget (will show idle state)
  ensureWidget();
}
