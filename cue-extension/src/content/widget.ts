import type { ToneResult, Tone, ConversationSignal, ConversationClassification } from "../shared/types";
import { TONE_COLORS, SIGNAL_CONFIG, CLASSIFICATION_CONFIG } from "../shared/constants";
import { getSettings, saveSettings } from "../shared/storage";

export class TonvoWidget {
  private shadow: ShadowRoot;
  private container: HTMLDivElement;
  private isExpanded = true;
  private isSessionActive = false;

  // State
  private tone: Tone = "neutral";
  private suggestion = "";
  private coachingTip = "";
  private liveInsight = "";
  private emotions: string[] = [];
  private qualityScore = 0;
  private engagementScore = 0;
  private classification: ConversationClassification = "neutral";
  private signals: Array<{ signal: ConversationSignal; label: string }> = [];
  private isProcessing = false;

  // Drag state
  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  constructor() {
    // Create host element
    const host = document.createElement("div");
    host.id = "tonvo-widget-host";
    document.body.appendChild(host);

    this.shadow = host.attachShadow({ mode: "closed" });
    this.container = document.createElement("div");
    this.shadow.appendChild(this.container);

    // Inject CSS
    const style = document.createElement("style");
    // CSS is injected by content-script after import
    this.shadow.prepend(style);

    this.render();
    this.restorePosition();
  }

  setStyleContent(css: string) {
    const style = this.shadow.querySelector("style");
    if (style) style.textContent = css;
  }

  private async restorePosition() {
    const settings = await getSettings();
    const widget = this.container.querySelector(".cue-widget") as HTMLElement;
    if (!widget) return;

    if (settings.widgetPosition.x >= 0 && settings.widgetPosition.y >= 0) {
      widget.style.right = "auto";
      widget.style.bottom = "auto";
      widget.style.left = `${settings.widgetPosition.x}px`;
      widget.style.top = `${settings.widgetPosition.y}px`;
    }

    this.isExpanded = settings.widgetExpanded;
    widget.style.opacity = String(settings.widgetOpacity);
    this.render();
  }

  // ---------- Public API ----------

  onSessionStarted() {
    this.isSessionActive = true;
    this.tone = "neutral";
    this.suggestion = "";
    this.coachingTip = "";
    this.liveInsight = "";
    this.emotions = [];
    this.qualityScore = 0;
    this.engagementScore = 0;
    this.classification = "neutral";
    this.signals = [];
    this.render();
  }

  onSessionStopped() {
    this.isSessionActive = false;
    this.isProcessing = false;
    this.render();
  }

  onToneUpdate(data: ToneResult) {
    this.tone = data.tone;
    this.suggestion = data.suggestion;
    this.emotions = data.emotions || [];
    this.isProcessing = false;

    if (data.coachingTip) this.coachingTip = data.coachingTip;
    if (data.liveInsight) this.liveInsight = data.liveInsight;
    if (data.classification) this.classification = data.classification;
    if (data.qualityScore != null) {
      this.qualityScore = this.qualityScore === 0
        ? data.qualityScore
        : Math.round((this.qualityScore + data.qualityScore) / 2);
    }
    if (data.engagementScore != null) {
      this.engagementScore = this.engagementScore === 0
        ? data.engagementScore
        : Math.round((this.engagementScore + data.engagementScore) / 2);
    }

    this.render();
  }

  onSignalDetected(signal: ConversationSignal, label: string) {
    if (signal === "none") return;
    this.signals = [...this.signals.slice(-4), { signal, label }]; // keep last 5
    this.render();
  }

  onProcessing() {
    this.isProcessing = true;
    this.render();
  }

  showPlatformPrompt(platform: string) {
    const existing = this.shadow.querySelector(".cue-platform-prompt");
    if (existing) existing.remove();

    const names: Record<string, string> = { meet: "Google Meet", zoom: "Zoom", teams: "Microsoft Teams" };

    const prompt = document.createElement("div");
    prompt.className = "cue-platform-prompt cue-enter";
    prompt.innerHTML = `
      <div class="cue-logo-dot" style="width:8px;height:8px;border-radius:50%;background:#c8c8d8"></div>
      <span class="cue-platform-text"><strong>${names[platform] || platform}</strong> detected</span>
      <button class="cue-platform-btn">Start Tonvo</button>
      <button class="cue-platform-dismiss">x</button>
    `;

    prompt.querySelector(".cue-platform-btn")?.addEventListener("click", () => {
      // Send start request
      chrome.tabs.getCurrent().then(() => {});
      // Actually request start from popup context -- dispatch custom event
      prompt.remove();
      // The user should use the popup to start, so just expand the widget
      this.isExpanded = true;
      this.render();
    });

    prompt.querySelector(".cue-platform-dismiss")?.addEventListener("click", () => {
      prompt.remove();
    });

    this.shadow.appendChild(prompt);

    // Auto-dismiss after 10s
    setTimeout(() => prompt.remove(), 10000);
  }

  // ---------- Rendering ----------

  private render() {
    if (!this.isExpanded) {
      this.renderMinimized();
      return;
    }

    const toneColor = TONE_COLORS[this.tone] || TONE_COLORS.neutral;
    const classConfig = CLASSIFICATION_CONFIG[this.classification] || CLASSIFICATION_CONFIG.neutral;

    const getScoreColor = (s: number) => s >= 70 ? "#34d399" : s >= 40 ? "#fbbf24" : "#f87171";

    this.container.innerHTML = `
      <div class="cue-widget">
        <div class="cue-header">
          <div class="cue-header-left">
            <div class="cue-logo-dot" style="background:${this.isSessionActive ? toneColor : '#3a3a42'}"></div>
            <span class="tonvo-logo-text">Tonvo</span>
            ${this.isSessionActive ? `<span style="font-size:10px;color:#8b8b96;margin-left:4px">LIVE</span>` : ''}
          </div>
          <div class="cue-header-right">
            <button class="cue-header-btn" data-action="minimize" title="Minimize">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
        <div class="cue-body">
          ${this.isSessionActive ? this.renderActiveSession(toneColor, classConfig, getScoreColor) : this.renderIdle()}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private renderActiveSession(
    toneColor: string,
    classConfig: { label: string; color: string },
    getScoreColor: (s: number) => string
  ): string {
    let html = "";

    // Tone + scores row
    html += `
      <div class="cue-tone-section">
        <div class="cue-tone-dot ${this.tone}"></div>
        <div class="cue-tone-info">
          <div class="cue-tone-label" style="color:${toneColor}">${this.tone}</div>
          <div class="cue-tone-classification">${classConfig.label}</div>
        </div>
        <div class="cue-scores">
          ${this.qualityScore > 0 ? `<span class="cue-score-badge" style="color:${getScoreColor(this.qualityScore)}">Q:${this.qualityScore}</span>` : ''}
          ${this.engagementScore > 0 ? `<span class="cue-score-badge" style="color:${getScoreColor(this.engagementScore)}">E:${this.engagementScore}</span>` : ''}
        </div>
      </div>
    `;

    // Processing indicator
    if (this.isProcessing) {
      html += `<div class="cue-processing cue-enter"><div class="cue-spinner"></div>Analyzing...</div>`;
    }

    // Coaching tip
    if (this.coachingTip) {
      html += `
        <div class="cue-coaching cue-enter">
          <div class="cue-coaching-label">AI Coach</div>
          <div class="cue-coaching-text">${this.escapeHtml(this.coachingTip)}</div>
        </div>
      `;
    }

    // Live insight
    if (this.liveInsight) {
      html += `
        <div class="cue-insight cue-enter">
          <div class="cue-insight-label">Insight</div>
          <div class="cue-insight-text">${this.escapeHtml(this.liveInsight)}</div>
        </div>
      `;
    }

    // Suggestion
    if (this.suggestion) {
      html += `
        <div class="cue-suggestion">
          <div class="cue-suggestion-text">${this.escapeHtml(this.suggestion)}</div>
        </div>
      `;
    }

    // Signals
    if (this.signals.length > 0) {
      html += `<div class="cue-signals">`;
      for (const s of this.signals) {
        const cfg = SIGNAL_CONFIG[s.signal];
        if (!cfg || !cfg.label) continue;
        html += `
          <div class="cue-signal-badge" style="background:${cfg.bg};color:${cfg.color};border-color:${cfg.color}">
            <div class="cue-signal-dot" style="background:${cfg.color}"></div>
            ${s.label || cfg.label}
          </div>
        `;
      }
      html += `</div>`;
    }

    // Emotions
    if (this.emotions.length > 0) {
      html += `<div class="cue-emotions">`;
      for (const e of this.emotions) {
        html += `<span class="cue-emotion-tag">${this.escapeHtml(e)}</span>`;
      }
      html += `</div>`;
    }

    return html;
  }

  private renderIdle(): string {
    return `<div class="cue-idle">Start a session from the Tonvo popup to begin conversation coaching.</div>`;
  }

  private renderMinimized() {
    const toneClass = this.isSessionActive ? this.tone : "idle";

    this.container.innerHTML = `
      <div class="cue-widget minimized">
        <div class="cue-mini-dot ${toneClass}"></div>
      </div>
    `;

    const widget = this.container.querySelector(".cue-widget") as HTMLElement;
    widget?.addEventListener("click", () => {
      this.isExpanded = true;
      saveSettings({ widgetExpanded: true });
      this.render();
    });
  }

  // ---------- Event handling ----------

  private attachEvents() {
    const widget = this.container.querySelector(".cue-widget") as HTMLElement;
    if (!widget) return;

    // Minimize
    const minimizeBtn = widget.querySelector('[data-action="minimize"]');
    minimizeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.isExpanded = false;
      saveSettings({ widgetExpanded: false });
      this.render();
    });

    // Drag
    const header = widget.querySelector(".cue-header") as HTMLElement;
    if (header) {
      header.addEventListener("mousedown", (e: MouseEvent) => {
        // Don't drag from buttons
        if ((e.target as HTMLElement).closest(".cue-header-btn")) return;

        this.isDragging = true;
        const rect = widget.getBoundingClientRect();
        this.dragOffsetX = e.clientX - rect.left;
        this.dragOffsetY = e.clientY - rect.top;

        e.preventDefault();
      });

      const onMouseMove = (e: MouseEvent) => {
        if (!this.isDragging) return;
        const x = e.clientX - this.dragOffsetX;
        const y = e.clientY - this.dragOffsetY;

        // Clamp to viewport
        const maxX = window.innerWidth - widget.offsetWidth;
        const maxY = window.innerHeight - widget.offsetHeight;

        widget.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        widget.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        widget.style.right = "auto";
        widget.style.bottom = "auto";
      };

      const onMouseUp = () => {
        if (!this.isDragging) return;
        this.isDragging = false;

        // Persist position
        const rect = widget.getBoundingClientRect();
        saveSettings({
          widgetPosition: { x: rect.left, y: rect.top },
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  }

  private escapeHtml(str: string): string {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  destroy() {
    const host = document.getElementById("tonvo-widget-host");
    host?.remove();
  }
}
