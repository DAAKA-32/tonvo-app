"use strict";(()=>{var u=`
/* ===== Reset inside shadow DOM ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:host {
  all: initial;
  position: fixed;
  z-index: 2147483647;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  font-size: 13px;
  color: #fafafa;
  line-height: 1.4;
}

/* ===== Container ===== */
.cue-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 340px;
  max-height: 520px;
  background: rgba(9, 9, 11, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, opacity 0.3s ease;
  user-select: none;
}

.cue-widget.minimized {
  width: 48px;
  height: 48px;
  max-height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cue-widget.hidden {
  display: none;
}

/* ===== Header ===== */
.cue-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: grab;
  flex-shrink: 0;
}
.cue-header:active { cursor: grabbing; }

.cue-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cue-logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c8c8d8;
  flex-shrink: 0;
}

.cue-logo-text {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fafafa;
}

.cue-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cue-header-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #8b8b96;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.cue-header-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fafafa;
}

/* ===== Body ===== */
.cue-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cue-body::-webkit-scrollbar { width: 4px; }
.cue-body::-webkit-scrollbar-track { background: transparent; }
.cue-body::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }

/* ===== Tone Section ===== */
.cue-tone-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cue-tone-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 0.3s, box-shadow 0.3s;
}
.cue-tone-dot.positive {
  background: #34d399;
  box-shadow: 0 0 16px rgba(52, 211, 153, 0.3);
}
.cue-tone-dot.neutral, .cue-tone-dot.hesitant {
  background: #fbbf24;
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.3);
}
.cue-tone-dot.negative {
  background: #f87171;
  box-shadow: 0 0 16px rgba(248, 113, 113, 0.3);
}

.cue-tone-info {
  flex: 1;
  min-width: 0;
}
.cue-tone-label {
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
  color: #fafafa;
}
.cue-tone-classification {
  font-size: 11px;
  color: #8b8b96;
  margin-top: 2px;
}

.cue-scores {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.cue-score-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(200, 200, 216, 0.08);
}

/* ===== Suggestion ===== */
.cue-suggestion {
  background: rgba(17, 17, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 12px;
}
.cue-suggestion-text {
  font-size: 12px;
  line-height: 1.5;
  color: #c8c8d8;
}

/* ===== Coaching Card ===== */
.cue-coaching {
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  position: relative;
  overflow: hidden;
}
.cue-coaching::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #818cf8, transparent);
  opacity: 0.5;
}
.cue-coaching-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #818cf8;
  margin-bottom: 6px;
}
.cue-coaching-text {
  font-size: 12px;
  line-height: 1.5;
  color: #e0e0ec;
}

/* ===== Insight Card ===== */
.cue-insight {
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  position: relative;
  overflow: hidden;
}
.cue-insight::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #38bdf8, transparent);
  opacity: 0.5;
}
.cue-insight-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #38bdf8;
  margin-bottom: 6px;
}
.cue-insight-text {
  font-size: 12px;
  line-height: 1.5;
  color: #e0e0ec;
}

/* ===== Signals ===== */
.cue-signals {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cue-signal-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid;
}
.cue-signal-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ===== Emotions ===== */
.cue-emotions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.cue-emotion-tag {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(200, 200, 216, 0.08);
  color: #b8b8c8;
  text-transform: capitalize;
}

/* ===== Minimized pill ===== */
.cue-mini-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: background 0.3s, box-shadow 0.3s;
}
.cue-mini-dot.positive { background: #34d399; box-shadow: 0 0 12px rgba(52, 211, 153, 0.4); }
.cue-mini-dot.neutral, .cue-mini-dot.hesitant { background: #fbbf24; box-shadow: 0 0 12px rgba(251, 191, 36, 0.4); }
.cue-mini-dot.negative { background: #f87171; box-shadow: 0 0 12px rgba(248, 113, 113, 0.4); }
.cue-mini-dot.idle { background: #3a3a42; }

/* ===== Platform prompt ===== */
.cue-platform-prompt {
  position: fixed;
  top: 12px;
  right: 24px;
  background: rgba(9, 9, 11, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 2147483647;
  animation: cue-slide-down 0.3s ease;
}
@keyframes cue-slide-down {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}
.cue-platform-text {
  font-size: 12px;
  color: #c8c8d8;
}
.cue-platform-text strong {
  color: #fafafa;
  font-weight: 600;
}
.cue-platform-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: #5c5c6e;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.cue-platform-btn:hover { background: #6e6e82; }
.cue-platform-dismiss {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #8b8b96;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.cue-platform-dismiss:hover { color: #fafafa; }

/* ===== Processing indicator ===== */
.cue-processing {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(200, 200, 216, 0.06);
  border-radius: 8px;
  font-size: 11px;
  color: #8b8b96;
}
.cue-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid #3a3a42;
  border-top-color: #c8c8d8;
  border-radius: 50%;
  animation: cue-spin 0.8s linear infinite;
}
@keyframes cue-spin {
  to { transform: rotate(360deg); }
}

/* ===== Idle state ===== */
.cue-idle {
  text-align: center;
  padding: 20px 12px;
  color: #8b8b96;
  font-size: 12px;
}

/* ===== Slide-in animation ===== */
@keyframes cue-widget-enter {
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.cue-widget { animation: cue-widget-enter 0.3s ease; }

/* ===== Segment enter ===== */
@keyframes cue-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.cue-enter { animation: cue-fade-in 0.2s ease; }
`;var h="http://localhost:3000";var d={positive:"#34d399",neutral:"#fbbf24",negative:"#f87171",hesitant:"#fbbf24"},b={objection:{label:"Objection",color:"#f87171",bg:"rgba(248, 113, 113, 0.15)"},question:{label:"Question",color:"#fbbf24",bg:"rgba(251, 191, 36, 0.15)"},opportunity:{label:"Opportunity",color:"#34d399",bg:"rgba(52, 211, 153, 0.15)"},hesitation:{label:"Hesitation",color:"#fbbf24",bg:"rgba(251, 191, 36, 0.15)"},agreement:{label:"Agreement",color:"#34d399",bg:"rgba(52, 211, 153, 0.15)"},key_point:{label:"Key Point",color:"#c8c8d8",bg:"rgba(200, 200, 216, 0.15)"},none:{label:"",color:"",bg:""}},g={very_positive:{label:"Excellent",color:"#34d399"},positive:{label:"Positive",color:"#6ee7b7"},neutral:{label:"Neutral",color:"#fbbf24"},awkward:{label:"Awkward",color:"#fb923c"},negative:{label:"Negative",color:"#f87171"}};var v={apiBaseUrl:h,widgetPosition:{x:-1,y:-1},widgetExpanded:!0,widgetOpacity:1};async function p(){let s=await chrome.storage.local.get("settings");return{...v,...s.settings||{}}}async function c(s){let e=await p();await chrome.storage.local.set({settings:{...e,...s}})}var l=class{shadow;container;isExpanded=!0;isSessionActive=!1;tone="neutral";suggestion="";coachingTip="";liveInsight="";emotions=[];qualityScore=0;engagementScore=0;classification="neutral";signals=[];isProcessing=!1;isDragging=!1;dragOffsetX=0;dragOffsetY=0;constructor(){let e=document.createElement("div");e.id="cue-widget-host",document.body.appendChild(e),this.shadow=e.attachShadow({mode:"closed"}),this.container=document.createElement("div"),this.shadow.appendChild(this.container);let t=document.createElement("style");this.shadow.prepend(t),this.render(),this.restorePosition()}setStyleContent(e){let t=this.shadow.querySelector("style");t&&(t.textContent=e)}async restorePosition(){let e=await p(),t=this.container.querySelector(".cue-widget");t&&(e.widgetPosition.x>=0&&e.widgetPosition.y>=0&&(t.style.right="auto",t.style.bottom="auto",t.style.left=`${e.widgetPosition.x}px`,t.style.top=`${e.widgetPosition.y}px`),this.isExpanded=e.widgetExpanded,t.style.opacity=String(e.widgetOpacity),this.render())}onSessionStarted(){this.isSessionActive=!0,this.tone="neutral",this.suggestion="",this.coachingTip="",this.liveInsight="",this.emotions=[],this.qualityScore=0,this.engagementScore=0,this.classification="neutral",this.signals=[],this.render()}onSessionStopped(){this.isSessionActive=!1,this.isProcessing=!1,this.render()}onToneUpdate(e){this.tone=e.tone,this.suggestion=e.suggestion,this.emotions=e.emotions||[],this.isProcessing=!1,e.coachingTip&&(this.coachingTip=e.coachingTip),e.liveInsight&&(this.liveInsight=e.liveInsight),e.classification&&(this.classification=e.classification),e.qualityScore!=null&&(this.qualityScore=this.qualityScore===0?e.qualityScore:Math.round((this.qualityScore+e.qualityScore)/2)),e.engagementScore!=null&&(this.engagementScore=this.engagementScore===0?e.engagementScore:Math.round((this.engagementScore+e.engagementScore)/2)),this.render()}onSignalDetected(e,t){e!=="none"&&(this.signals=[...this.signals.slice(-4),{signal:e,label:t}],this.render())}onProcessing(){this.isProcessing=!0,this.render()}showPlatformPrompt(e){let t=this.shadow.querySelector(".cue-platform-prompt");t&&t.remove();let n={meet:"Google Meet",zoom:"Zoom",teams:"Microsoft Teams"},i=document.createElement("div");i.className="cue-platform-prompt cue-enter",i.innerHTML=`
      <div class="cue-logo-dot" style="width:8px;height:8px;border-radius:50%;background:#c8c8d8"></div>
      <span class="cue-platform-text"><strong>${n[e]||e}</strong> detected</span>
      <button class="cue-platform-btn">Start Cue</button>
      <button class="cue-platform-dismiss">x</button>
    `,i.querySelector(".cue-platform-btn")?.addEventListener("click",()=>{chrome.tabs.getCurrent().then(()=>{}),i.remove(),this.isExpanded=!0,this.render()}),i.querySelector(".cue-platform-dismiss")?.addEventListener("click",()=>{i.remove()}),this.shadow.appendChild(i),setTimeout(()=>i.remove(),1e4)}render(){if(!this.isExpanded){this.renderMinimized();return}let e=d[this.tone]||d.neutral,t=g[this.classification]||g.neutral,n=i=>i>=70?"#34d399":i>=40?"#fbbf24":"#f87171";this.container.innerHTML=`
      <div class="cue-widget">
        <div class="cue-header">
          <div class="cue-header-left">
            <div class="cue-logo-dot" style="background:${this.isSessionActive?e:"#3a3a42"}"></div>
            <span class="cue-logo-text">Cue</span>
            ${this.isSessionActive?'<span style="font-size:10px;color:#8b8b96;margin-left:4px">LIVE</span>':""}
          </div>
          <div class="cue-header-right">
            <button class="cue-header-btn" data-action="minimize" title="Minimize">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
        <div class="cue-body">
          ${this.isSessionActive?this.renderActiveSession(e,t,n):this.renderIdle()}
        </div>
      </div>
    `,this.attachEvents()}renderActiveSession(e,t,n){let i="";if(i+=`
      <div class="cue-tone-section">
        <div class="cue-tone-dot ${this.tone}"></div>
        <div class="cue-tone-info">
          <div class="cue-tone-label" style="color:${e}">${this.tone}</div>
          <div class="cue-tone-classification">${t.label}</div>
        </div>
        <div class="cue-scores">
          ${this.qualityScore>0?`<span class="cue-score-badge" style="color:${n(this.qualityScore)}">Q:${this.qualityScore}</span>`:""}
          ${this.engagementScore>0?`<span class="cue-score-badge" style="color:${n(this.engagementScore)}">E:${this.engagementScore}</span>`:""}
        </div>
      </div>
    `,this.isProcessing&&(i+='<div class="cue-processing cue-enter"><div class="cue-spinner"></div>Analyzing...</div>'),this.coachingTip&&(i+=`
        <div class="cue-coaching cue-enter">
          <div class="cue-coaching-label">AI Coach</div>
          <div class="cue-coaching-text">${this.escapeHtml(this.coachingTip)}</div>
        </div>
      `),this.liveInsight&&(i+=`
        <div class="cue-insight cue-enter">
          <div class="cue-insight-label">Insight</div>
          <div class="cue-insight-text">${this.escapeHtml(this.liveInsight)}</div>
        </div>
      `),this.suggestion&&(i+=`
        <div class="cue-suggestion">
          <div class="cue-suggestion-text">${this.escapeHtml(this.suggestion)}</div>
        </div>
      `),this.signals.length>0){i+='<div class="cue-signals">';for(let r of this.signals){let o=b[r.signal];!o||!o.label||(i+=`
          <div class="cue-signal-badge" style="background:${o.bg};color:${o.color};border-color:${o.color}">
            <div class="cue-signal-dot" style="background:${o.color}"></div>
            ${r.label||o.label}
          </div>
        `)}i+="</div>"}if(this.emotions.length>0){i+='<div class="cue-emotions">';for(let r of this.emotions)i+=`<span class="cue-emotion-tag">${this.escapeHtml(r)}</span>`;i+="</div>"}return i}renderIdle(){return'<div class="cue-idle">Start a session from the Cue popup to begin conversation coaching.</div>'}renderMinimized(){let e=this.isSessionActive?this.tone:"idle";this.container.innerHTML=`
      <div class="cue-widget minimized">
        <div class="cue-mini-dot ${e}"></div>
      </div>
    `,this.container.querySelector(".cue-widget")?.addEventListener("click",()=>{this.isExpanded=!0,c({widgetExpanded:!0}),this.render()})}attachEvents(){let e=this.container.querySelector(".cue-widget");if(!e)return;e.querySelector('[data-action="minimize"]')?.addEventListener("click",i=>{i.stopPropagation(),this.isExpanded=!1,c({widgetExpanded:!1}),this.render()});let n=e.querySelector(".cue-header");if(n){n.addEventListener("mousedown",o=>{if(o.target.closest(".cue-header-btn"))return;this.isDragging=!0;let a=e.getBoundingClientRect();this.dragOffsetX=o.clientX-a.left,this.dragOffsetY=o.clientY-a.top,o.preventDefault()});let i=o=>{if(!this.isDragging)return;let a=o.clientX-this.dragOffsetX,f=o.clientY-this.dragOffsetY,m=window.innerWidth-e.offsetWidth,x=window.innerHeight-e.offsetHeight;e.style.left=`${Math.max(0,Math.min(a,m))}px`,e.style.top=`${Math.max(0,Math.min(f,x))}px`,e.style.right="auto",e.style.bottom="auto"},r=()=>{if(!this.isDragging)return;this.isDragging=!1;let o=e.getBoundingClientRect();c({widgetPosition:{x:o.left,y:o.top}})};document.addEventListener("mousemove",i),document.addEventListener("mouseup",r)}}escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}destroy(){document.getElementById("cue-widget-host")?.remove()}};if(window===window.top){let e=function(){return s||(s=new l,s.setStyleContent(u)),s};S=e;let s=null;chrome.runtime.onMessage.addListener(t=>{let n=e();switch(t.type){case"SESSION_STARTED":n.onSessionStarted();break;case"SESSION_STOPPED":n.onSessionStopped();break;case"TONE_UPDATE":n.onToneUpdate(t.data);break;case"SIGNAL_DETECTED":n.onSignalDetected(t.signal,t.label);break;case"PROCESSING":n.onProcessing();break;case"PLATFORM_DETECTED":n.showPlatformPrompt(t.platform);break}}),e()}var S;})();
//# sourceMappingURL=content-script.js.map
