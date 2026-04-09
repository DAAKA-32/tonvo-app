import type { FeatureEntry } from "./types";

export const features: FeatureEntry[] = [
  // ── 1. Real-Time Tone Detection ──────────────────────────────────
  {
    type: "features",
    slug: "real-time-tone-detection",
    title: "Real-Time Tone Detection | Tonvo AI Copilot",
    metaDescription:
      "Tonvo analyzes speaker tone and sentiment in real time during calls. Detect frustration, excitement, and hesitation instantly to improve conversations.",
    h1: "Understand Every Conversation with Real-Time Tone and Sentiment Analysis",
    subtitle:
      "Tonvo monitors vocal tone, word choice, and cadence to surface sentiment shifts the moment they happen — so you can respond with confidence.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "sales-calls", label: "Sales Call Optimization" },
      { type: "features", slug: "conversation-signal-detection", label: "Signal Detection" },
      { type: "guides", slug: "reading-customer-sentiment", label: "Guide: Reading Customer Sentiment" },
    ],
    targetKeywords: [
      "real-time tone detection",
      "sentiment analysis calls",
      "AI tone analyzer",
      "call sentiment monitoring",
      "voice emotion detection",
    ],
    faq: [
      {
        question: "How does Tonvo detect tone in real time?",
        answer:
          "Tonvo processes the live audio stream using natural language processing models that evaluate word choice, phrasing patterns, and conversational context to classify sentiment as positive, negative, or neutral — updating every few seconds.",
      },
      {
        question: "Does tone detection work on all supported platforms?",
        answer:
          "Yes. Real-time tone detection works on Discord, Zoom, and Google Meet. Tonvo listens to the conversation audio regardless of the platform and applies the same sentiment analysis engine.",
      },
      {
        question: "Can I see a history of tone shifts after the call?",
        answer:
          "Absolutely. Every tone shift is logged with a timestamp and context snippet. You can review the full sentiment timeline in your post-session analysis dashboard.",
      },
      {
        question: "Is tone detection accurate for non-native English speakers?",
        answer:
          "Tonvo's models are trained on diverse speech patterns and accents. While accuracy is highest in English, the system supports 10 languages and continually improves through updated training data.",
      },
    ],
    featureName: "Real-Time Tone Detection",
    howItWorks: {
      label: "How It Works",
      heading: "Sentiment Analysis That Keeps Up with the Conversation",
      body: "Tonvo captures the live audio transcript and runs each utterance through a multi-layer NLP pipeline. The first layer tokenizes speech and evaluates lexical sentiment. The second layer examines phrasing context — sarcasm markers, hedge words, and intensifiers. Results are merged into a composite sentiment score that updates on-screen in near real time, giving you a continuous emotional pulse of the conversation.",
    },
    benefits: [
      {
        icon: "heart",
        title: "Catch Emotional Shifts Instantly",
        description:
          "See when a prospect's enthusiasm drops or a teammate grows frustrated, so you can pivot your approach before the moment passes.",
      },
      {
        icon: "trending-up",
        title: "Improve Close Rates",
        description:
          "Sales teams using live sentiment data report stronger objection handling and more personalized pitches that resonate with buyers.",
      },
      {
        icon: "shield",
        title: "Reduce Miscommunication",
        description:
          "Tone cues help remote teams avoid misunderstandings that text-only communication often creates, building trust across distributed teams.",
      },
    ],
    useCasesForFeature: [
      "Sales teams tracking prospect engagement during discovery calls",
      "Customer success managers detecting frustration before it escalates",
      "Hiring managers gauging candidate enthusiasm in interviews",
      "Team leads monitoring morale during all-hands meetings",
    ],
    technicalDetail: {
      label: "Under the Hood",
      heading: "Multi-Layer NLP Pipeline",
      body: "Tonvo combines transformer-based sentiment classifiers with rule-based hedge-word detection. The system processes utterances in sliding windows of five seconds, normalizing for speaker pace and filler words. Sentiment scores are smoothed with exponential moving averages to prevent flicker, and the final output is a three-tier classification (positive, neutral, negative) with a continuous confidence percentage.",
    },
  },

  // ── 2. AI Coaching Suggestions ───────────────────────────────────
  {
    type: "features",
    slug: "ai-coaching-suggestions",
    title: "AI Coaching Suggestions | Tonvo Live Call Copilot",
    metaDescription:
      "Get live AI coaching tips during calls. Tonvo suggests better phrasing, questions, and responses in real time to help you communicate more effectively.",
    h1: "Live AI Coaching Suggestions That Make Every Conversation Better",
    subtitle:
      "Tonvo whispers smart suggestions as you speak — better questions to ask, objection responses, and phrasing improvements — all without interrupting your flow.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "sales-calls", label: "Sales Call Optimization" },
      { type: "features", slug: "real-time-tone-detection", label: "Tone Detection" },
      { type: "industries", slug: "saas-sales", label: "SaaS Sales Teams" },
    ],
    targetKeywords: [
      "AI coaching suggestions",
      "live call coaching",
      "real-time conversation tips",
      "AI sales coaching",
      "call copilot suggestions",
    ],
    faq: [
      {
        question: "What kind of suggestions does Tonvo provide?",
        answer:
          "Tonvo offers contextual suggestions including better ways to phrase statements, follow-up questions to deepen the conversation, objection handling scripts, and reminders to let the other person speak when talk-time is unbalanced.",
      },
      {
        question: "Will the other person on the call see the coaching tips?",
        answer:
          "No. Suggestions appear only in your Tonvo sidebar or overlay. When Invisible Copilot Mode is enabled, the coaching panel is also hidden from screen share, so participants never see your AI assistance.",
      },
      {
        question: "Can I customize the type of coaching I receive?",
        answer:
          "Yes. You can configure coaching profiles — for example, a 'Discovery Call' profile emphasizes open-ended questions, while a 'Negotiation' profile focuses on anchoring and concession strategies.",
      },
      {
        question: "Does the AI learn from my past conversations?",
        answer:
          "Tonvo improves suggestions over time by analyzing patterns in your conversation history. The more you use it, the more tailored and relevant the coaching becomes to your communication style.",
      },
    ],
    featureName: "AI Coaching Suggestions",
    howItWorks: {
      label: "How It Works",
      heading: "Context-Aware Coaching Delivered in Real Time",
      body: "As the conversation flows, Tonvo continuously evaluates the transcript against your selected coaching profile. It identifies moments where a better question, a softer reframe, or a strategic pause could improve outcomes. Suggestions are generated by a fine-tuned language model that understands sales methodologies, negotiation frameworks, and general communication best practices. Tips appear in a non-intrusive sidebar with one-click dismissal.",
    },
    benefits: [
      {
        icon: "brain",
        title: "Never Miss the Right Question",
        description:
          "Tonvo prompts high-impact questions at the right moment, helping you uncover needs and objections that would otherwise go unspoken.",
      },
      {
        icon: "zap",
        title: "Respond Faster Under Pressure",
        description:
          "When a tough objection lands, Tonvo instantly surfaces proven response frameworks so you can reply with clarity instead of scrambling.",
      },
      {
        icon: "trending-up",
        title: "Accelerate Team Ramp-Up",
        description:
          "New hires perform like seasoned reps from day one. Live coaching compresses months of training into real-time, on-the-job guidance.",
      },
      {
        icon: "target",
        title: "Stay Aligned with Methodology",
        description:
          "Whether your team follows MEDDIC, SPIN, or Challenger, Tonvo keeps reps on-script by surfacing methodology-specific prompts.",
      },
    ],
    useCasesForFeature: [
      "Sales reps handling objections during live demos",
      "Account executives running discovery calls with enterprise prospects",
      "New hires getting real-time mentorship during onboarding calls",
      "Managers coaching team members by reviewing suggestion acceptance rates",
      "Customer support agents de-escalating frustrated callers",
    ],
    technicalDetail: {
      label: "Under the Hood",
      heading: "Profile-Based Suggestion Engine",
      body: "Tonvo's coaching engine matches live transcript segments against a vector database of proven conversation patterns, objection-response pairs, and methodology playbooks. A retrieval-augmented generation (RAG) pipeline selects the most relevant pattern, then a language model adapts it to the current conversational context. Suggestions are ranked by relevance and urgency, and only the top suggestion is surfaced to avoid cognitive overload.",
    },
  },

  // ── 3. Conversation Signal Detection ─────────────────────────────
  {
    type: "features",
    slug: "conversation-signal-detection",
    title: "Conversation Signal Detection | Tonvo AI",
    metaDescription:
      "Tonvo detects objections, buying signals, hesitation, and opportunities in real time. Never miss a critical conversation moment on your calls again.",
    h1: "Detect Objections, Opportunities, and Hesitation as They Happen",
    subtitle:
      "Tonvo flags critical conversation signals the moment they surface — objections, buying intent, hesitation, and topic shifts — so you always know what matters most.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "features", slug: "real-time-tone-detection", label: "Tone Detection" },
      { type: "use-cases", slug: "deal-coaching", label: "Deal Coaching" },
      { type: "guides", slug: "handling-objections-effectively", label: "Guide: Handling Objections" },
    ],
    targetKeywords: [
      "conversation signal detection",
      "objection detection AI",
      "buying signal detection",
      "call intelligence signals",
      "real-time conversation insights",
    ],
    faq: [
      {
        question: "What types of signals does Tonvo detect?",
        answer:
          "Tonvo identifies six core signal types: objections, buying signals, hesitation markers, competitive mentions, budget discussions, and authority indicators. Each signal is tagged with a confidence score and highlighted in the live transcript.",
      },
      {
        question: "How does signal detection differ from tone detection?",
        answer:
          "Tone detection measures overall emotional sentiment (positive, negative, neutral). Signal detection identifies specific conversational events — like a prospect saying 'we're also evaluating competitors' or 'I need to check with my manager.' They work together to give you a complete picture.",
      },
      {
        question: "Can I set alerts for specific signal types?",
        answer:
          "Yes. You can configure which signals trigger visual alerts, and you can set priority levels so that high-value signals like buying intent are more prominent than informational signals.",
      },
      {
        question: "Are detected signals included in the post-call summary?",
        answer:
          "Every detected signal is included in the post-session analysis with a timestamp, context excerpt, and recommended follow-up action. You can also filter the summary to show only signals of a specific type.",
      },
    ],
    featureName: "Conversation Signal Detection",
    howItWorks: {
      label: "How It Works",
      heading: "Pattern-Matched Intelligence from Every Utterance",
      body: "Tonvo runs each transcript segment through a signal classification model trained on thousands of annotated sales, support, and meeting conversations. The model recognizes linguistic patterns associated with objections ('we're not sure about the timing'), buying intent ('what would implementation look like?'), hesitation (long pauses, hedge words), and more. Detected signals are categorized, timestamped, and displayed as color-coded badges alongside the live transcript.",
    },
    benefits: [
      {
        icon: "target",
        title: "Act on Signals Before They Fade",
        description:
          "Real-time signal badges ensure you address objections and capitalize on buying intent the moment they appear, not minutes later when the window has closed.",
      },
      {
        icon: "search",
        title: "Surface Hidden Opportunities",
        description:
          "Many buying signals are subtle — a question about implementation timelines or a mention of budget approval. Tonvo catches what human ears often miss.",
      },
      {
        icon: "bar-chart",
        title: "Track Signal Trends Across Calls",
        description:
          "Aggregate signal data over time reveals patterns — which objections recur, which competitors appear most, and where deals stall in the pipeline.",
      },
    ],
    useCasesForFeature: [
      "Sales teams identifying buying signals during pipeline calls",
      "Revenue leaders tracking common objection patterns across the team",
      "Negotiators detecting hesitation and concession openings",
      "Product managers capturing feature requests mentioned in customer calls",
      "Partnership managers spotting competitive intelligence in conversations",
    ],
    technicalDetail: {
      label: "Under the Hood",
      heading: "Multi-Class Signal Classifier",
      body: "The signal detection engine uses a fine-tuned transformer classifier that assigns one or more signal labels to each transcript segment. Training data includes over 50,000 annotated conversation excerpts spanning sales, support, and internal meetings. The model outputs a probability distribution across signal classes, and only signals exceeding a configurable confidence threshold are surfaced. A post-processing layer deduplicates overlapping signals and merges related detections into unified signal events.",
    },
  },

  // ── 4. Post-Session Analysis ─────────────────────────────────────
  {
    type: "features",
    slug: "post-session-analysis",
    title: "Post-Session Analysis | Tonvo Call Review",
    metaDescription:
      "Review AI-generated call summaries, key moments, and actionable insights after every conversation. Tonvo turns every call into a learning opportunity.",
    h1: "Turn Every Call into Actionable Insights with Post-Session Analysis",
    subtitle:
      "After each conversation, Tonvo generates a structured breakdown — key moments, sentiment arcs, detected signals, and concrete next steps — so nothing falls through the cracks.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "features", slug: "speaker-balance-tracking", label: "Speaker Balance" },
      { type: "use-cases", slug: "team-coaching", label: "Team Coaching & Review" },
      { type: "industries", slug: "recruiting", label: "Recruiting Teams" },
    ],
    targetKeywords: [
      "post-call analysis AI",
      "call summary generator",
      "meeting insights review",
      "conversation analytics dashboard",
      "AI call breakdown",
    ],
    faq: [
      {
        question: "What does the post-session analysis include?",
        answer:
          "Each analysis includes an executive summary, a sentiment timeline, all detected signals with timestamps, speaker balance metrics, key moments, topic segments, and AI-generated next-step recommendations.",
      },
      {
        question: "How quickly is the analysis available after a call?",
        answer:
          "The post-session report is generated within 60 seconds of the call ending. You receive a notification with a direct link to the analysis dashboard as soon as it is ready.",
      },
      {
        question: "Can I share the analysis with teammates who were not on the call?",
        answer:
          "Yes. You can share a read-only link to any post-session report. Recipients can view the summary, listen to key moments, and leave comments without needing a Tonvo account.",
      },
      {
        question: "Does Tonvo store call recordings?",
        answer:
          "Tonvo processes audio in real time but does not store raw audio recordings by default. Post-session analysis is generated from the processed transcript and signal data. You can enable optional recording in your workspace settings.",
      },
    ],
    featureName: "Post-Session Analysis",
    howItWorks: {
      label: "How It Works",
      heading: "Structured Intelligence from Unstructured Conversations",
      body: "When a call ends, Tonvo compiles the full transcript, detected signals, sentiment scores, and speaker metrics into a unified dataset. A summarization model generates an executive summary and extracts key moments — defined as transcript segments where signals clustered or sentiment shifted sharply. The system then cross-references detected topics against your CRM data (when connected) to suggest next steps like follow-up emails, task creation, or deal-stage updates.",
    },
    benefits: [
      {
        icon: "clock",
        title: "Save Hours of Manual Note-Taking",
        description:
          "Stop scribbling notes during calls. Tonvo captures everything and organizes it into a structured report you can reference, search, and share.",
      },
      {
        icon: "layers",
        title: "Build a Searchable Conversation Library",
        description:
          "Every analysis is indexed and searchable. Find any past conversation by topic, signal type, participant, or keyword in seconds.",
      },
      {
        icon: "users",
        title: "Enable Asynchronous Coaching",
        description:
          "Managers can review call analyses on their own schedule, leave feedback on specific moments, and track rep improvement over time without shadowing every call.",
      },
    ],
    useCasesForFeature: [
      "Sales managers reviewing rep performance across weekly calls",
      "Account executives preparing follow-ups with accurate conversation context",
      "Customer success teams identifying at-risk accounts from sentiment trends",
      "Recruiters reviewing candidate interview signals before making decisions",
    ],
    technicalDetail: {
      label: "Under the Hood",
      heading: "Multi-Pass Summarization Pipeline",
      body: "Post-session analysis runs a three-pass pipeline. Pass one segments the transcript by topic using a topic-boundary detection model. Pass two extracts key moments by scoring each segment on signal density, sentiment variance, and information content. Pass three generates the executive summary and next-step recommendations using a long-context language model conditioned on the extracted data. The final output is structured as JSON and rendered in the Tonvo dashboard.",
    },
  },

  // ── 5. Screen Analysis ───────────────────────────────────────────
  {
    type: "features",
    slug: "screen-analysis",
    title: "Screen Analysis | Tonvo Visual Context AI",
    metaDescription:
      "Tonvo analyzes on-screen content during calls to provide richer context. Get AI insights from slides, documents, and shared screens in real time.",
    h1: "Add Visual Intelligence to Every Call with Screen Analysis",
    subtitle:
      "Tonvo reads slides, documents, and shared screens during your calls, combining visual context with conversation data for deeper, more relevant AI insights.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "features", slug: "ai-coaching-suggestions", label: "AI Coaching" },
      { type: "use-cases", slug: "product-demos", label: "Product Demos" },
      { type: "guides", slug: "optimizing-sales-demos", label: "Guide: Optimizing Sales Demos" },
    ],
    targetKeywords: [
      "screen analysis AI",
      "visual context call AI",
      "screen content analysis",
      "AI slide analysis calls",
      "presentation intelligence tool",
    ],
    faq: [
      {
        question: "What types of screen content can Tonvo analyze?",
        answer:
          "Tonvo can analyze slides, documents, spreadsheets, dashboards, browser content, and application interfaces. The system uses optical character recognition and layout analysis to extract text, data, and structural elements from any visible content.",
      },
      {
        question: "Does screen analysis require screen sharing to be active?",
        answer:
          "Screen analysis works by capturing your local screen content. It does not require you to share your screen with other call participants. The analysis happens entirely on your side.",
      },
      {
        question: "How does visual context improve coaching suggestions?",
        answer:
          "When Tonvo can see what is on screen — for example, a pricing slide or a competitor comparison — it tailors coaching suggestions to that specific context, like 'The prospect is viewing the enterprise tier, emphasize volume discounts.'",
      },
      {
        question: "Is screen content stored or shared with anyone?",
        answer:
          "Screen captures are processed in real time and discarded immediately after analysis. No screenshots are stored on Tonvo's servers. Only the extracted textual insights are retained as part of your session data.",
      },
    ],
    featureName: "Screen Analysis",
    howItWorks: {
      label: "How It Works",
      heading: "Real-Time Visual Context Extraction",
      body: "Tonvo periodically captures a frame of the active screen or shared content and processes it through a vision model. The model extracts text via OCR, identifies layout elements (headings, charts, tables), and classifies the content type (presentation, document, dashboard). This extracted context is merged with the live conversation transcript to generate richer coaching suggestions, more accurate signal detection, and context-aware post-session analysis.",
    },
    benefits: [
      {
        icon: "eye",
        title: "Context-Aware Suggestions",
        description:
          "Coaching tips reference what is actually on screen, making them far more specific and actionable than audio-only analysis can provide.",
      },
      {
        icon: "monitor",
        title: "Track Slide-by-Slide Engagement",
        description:
          "See which slides or content sections correlated with positive sentiment and engagement spikes, so you can refine your presentation over time.",
      },
      {
        icon: "zap",
        title: "Automatic Content Tagging",
        description:
          "Screen content is automatically tagged (pricing, features, case study, competitive) and linked to conversation moments for enriched post-session analysis.",
      },
    ],
    useCasesForFeature: [
      "Sales reps presenting product demos and receiving slide-specific coaching",
      "Consultants reviewing client dashboards and getting data-aware talking points",
      "Trainers delivering presentations with real-time audience engagement context",
      "Support agents troubleshooting with screen-visible error messages analyzed in context",
    ],
  },

  // ── 6. Speaker Balance Tracking ──────────────────────────────────
  {
    type: "features",
    slug: "speaker-balance-tracking",
    title: "Speaker Balance Tracking | Tonvo Talk-Time Analytics",
    metaDescription:
      "Monitor who speaks and for how long during calls. Tonvo tracks talk-time ratios in real time to help you maintain balanced, productive conversations.",
    h1: "Keep Conversations Balanced with Real-Time Speaker Tracking",
    subtitle:
      "Tonvo tracks talk-time ratios for every participant in real time, helping you listen more, dominate less, and create space for the voices that matter.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
      { type: "use-cases", slug: "team-coaching", label: "Team Coaching" },
      { type: "industries", slug: "consulting", label: "Consulting Firms" },
    ],
    targetKeywords: [
      "speaker balance tracking",
      "talk-time analytics",
      "call participation metrics",
      "conversation balance tool",
      "meeting talk ratio monitor",
    ],
    faq: [
      {
        question: "How does Tonvo distinguish between speakers?",
        answer:
          "Tonvo uses speaker diarization — an AI technique that identifies distinct speakers based on vocal characteristics. Each speaker is assigned a label, and their talk-time is tracked independently throughout the call.",
      },
      {
        question: "What is the ideal talk-time ratio for sales calls?",
        answer:
          "Research suggests a 40/60 ratio (rep/prospect) is optimal for discovery calls. Tonvo displays the live ratio and gently alerts you when your talk-time exceeds a configurable threshold, helping you stay in the listening zone.",
      },
      {
        question: "Does speaker tracking work in group calls?",
        answer:
          "Yes. Tonvo tracks up to 10 simultaneous speakers in a group call, displaying individual talk-time percentages and identifying participants who have not spoken, so you can invite quieter voices into the conversation.",
      },
      {
        question: "Can I review historical talk-time patterns?",
        answer:
          "Your post-session analysis includes a talk-time breakdown for every call. Over time, Tonvo aggregates this data into trends so you can see if your listening ratio is improving across weeks or months.",
      },
    ],
    featureName: "Speaker Balance Tracking",
    howItWorks: {
      label: "How It Works",
      heading: "Diarization-Powered Talk-Time Monitoring",
      body: "Tonvo's speaker diarization engine segments the audio stream into speaker turns using a neural embedding model that maps voice characteristics into a vector space. Speakers are clustered automatically, and each turn's duration is accumulated into a live talk-time counter. The ratio is displayed as a simple visual bar that updates every few seconds. When the ratio crosses a user-defined threshold, a gentle nudge appears in the coaching panel.",
    },
    benefits: [
      {
        icon: "users",
        title: "Create Space for Every Voice",
        description:
          "Visual talk-time data helps facilitators notice when someone has been quiet and proactively invite them to contribute, leading to more inclusive meetings.",
      },
      {
        icon: "bar-chart",
        title: "Data-Driven Conversation Coaching",
        description:
          "Managers use talk-time metrics to coach reps on active listening. Teams that track speaker balance consistently improve discovery-call conversion rates.",
      },
      {
        icon: "mic",
        title: "Real-Time Self-Awareness",
        description:
          "A simple glance at the talk-time bar reminds you to pause, ask a question, and let the other person elaborate — a habit that compounds into better outcomes.",
      },
    ],
    useCasesForFeature: [
      "Sales teams maintaining optimal talk/listen ratios during discovery",
      "Meeting facilitators ensuring all participants contribute in brainstorms",
      "Interview panels balancing speaking time across interviewers",
      "Managers identifying reps who over-talk during customer calls",
    ],
  },

  // ── 7. Multi-Language Support ────────────────────────────────────
  {
    type: "features",
    slug: "multi-language-support",
    title: "Multi-Language Support | Tonvo Global AI Copilot",
    metaDescription:
      "Tonvo supports real-time conversation analysis in 10 languages. Get tone detection, coaching, and signal insights in English, Spanish, French, and more.",
    h1: "AI Conversation Intelligence in 10 Languages",
    subtitle:
      "Tonvo delivers the same real-time tone detection, coaching suggestions, and signal analysis across 10 languages — so global teams get equal AI support on every call.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "features", slug: "real-time-tone-detection", label: "Tone Detection" },
      { type: "industries", slug: "global-enterprise", label: "Global Enterprises" },
      { type: "use-cases", slug: "international-sales", label: "International Sales" },
    ],
    targetKeywords: [
      "multi-language call AI",
      "multilingual conversation analysis",
      "AI copilot multiple languages",
      "global call intelligence tool",
      "multilingual sentiment analysis",
    ],
    faq: [
      {
        question: "Which languages does Tonvo support?",
        answer:
          "Tonvo currently supports English, Spanish, French, German, Portuguese, Italian, Dutch, Japanese, Korean, and Mandarin Chinese. Each language includes full tone detection, signal classification, and coaching suggestion capabilities.",
      },
      {
        question: "Can Tonvo handle calls where multiple languages are spoken?",
        answer:
          "Yes. Tonvo detects language switches within a conversation and adapts its analysis engine accordingly. If a call starts in English and shifts to Spanish, Tonvo transitions seamlessly without any manual configuration.",
      },
      {
        question: "Are coaching suggestions localized or just translated?",
        answer:
          "Coaching suggestions are culturally adapted, not just machine-translated. Tonvo accounts for communication norms, politeness frameworks, and common objection patterns specific to each language and region.",
      },
      {
        question: "How accurate is sentiment detection in non-English languages?",
        answer:
          "Sentiment models are trained on native-language datasets for each supported language. Accuracy is comparable to English for the top five languages and continues to improve as Tonvo expands training data in all supported languages.",
      },
    ],
    featureName: "Multi-Language Support",
    howItWorks: {
      label: "How It Works",
      heading: "Language-Aware NLP Across Every Feature",
      body: "Tonvo begins each session with automatic language identification using a lightweight classifier that evaluates the first few seconds of speech. Once the language is detected, the system loads the corresponding NLP models — including tokenizers, sentiment classifiers, signal detectors, and coaching playbooks — optimized for that language. If a language switch is detected mid-call, Tonvo hot-swaps models within seconds to maintain uninterrupted analysis.",
    },
    benefits: [
      {
        icon: "globe",
        title: "Serve Global Markets with Confidence",
        description:
          "Equip every team member with the same AI-powered conversation intelligence regardless of the language they conduct business in.",
      },
      {
        icon: "users",
        title: "Unify Cross-Regional Teams",
        description:
          "Global revenue teams get consistent coaching frameworks and signal detection, making pipeline reviews and forecasting language-agnostic.",
      },
      {
        icon: "layers",
        title: "One Tool, Zero Fragmentation",
        description:
          "Replace separate tools for different regions with a single platform that handles multilingual analysis, reducing cost and complexity.",
      },
    ],
    useCasesForFeature: [
      "International sales teams closing deals across European and Asian markets",
      "Global support centers handling customer calls in local languages",
      "Multinational companies running cross-border internal meetings",
      "Localization teams reviewing communication quality across language pairs",
    ],
  },

  // ── 8. Invisible Copilot Mode ────────────────────────────────────
  {
    type: "features",
    slug: "invisible-copilot-mode",
    title: "Invisible Copilot Mode | Tonvo Stealth AI",
    metaDescription:
      "Hide Tonvo from screen share during calls. Invisible Copilot Mode keeps AI coaching and insights visible only to you — completely hidden from participants.",
    h1: "Get AI Coaching Without Anyone Knowing — Invisible Copilot Mode",
    subtitle:
      "Tonvo's Invisible Copilot Mode hides every coaching panel, signal badge, and sentiment indicator from screen share — so you get full AI support while participants see nothing.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "features", slug: "ai-coaching-suggestions", label: "AI Coaching" },
      { type: "use-cases", slug: "sales-calls", label: "Sales Call Optimization" },
      { type: "guides", slug: "screen-share-best-practices", label: "Guide: Screen Share Best Practices" },
    ],
    targetKeywords: [
      "invisible copilot mode",
      "hidden AI assistant calls",
      "stealth call coaching",
      "screen share hide AI",
      "private conversation copilot",
    ],
    faq: [
      {
        question: "How does Invisible Copilot Mode work technically?",
        answer:
          "Tonvo uses platform-level window exclusion APIs to remove its overlay from the screen-capture pipeline. On supported platforms, the Tonvo panel is flagged as a non-capturable window, so screen-share and recording tools never see it.",
      },
      {
        question: "Does this work on all video conferencing platforms?",
        answer:
          "Invisible Copilot Mode is fully supported on Discord, Zoom, and Google Meet. On platforms that do not support window-level exclusion, Tonvo falls back to a separate-monitor mode where the panel displays on a secondary screen.",
      },
      {
        question: "Can I toggle Invisible Mode on and off during a call?",
        answer:
          "Yes. You can enable or disable Invisible Copilot Mode with a single keyboard shortcut at any point during the call. The transition is instant and does not interrupt your conversation or the AI analysis.",
      },
      {
        question: "Is using a hidden AI assistant during calls ethical?",
        answer:
          "Tonvo is designed as a personal productivity tool, similar to having notes or a prepared script in front of you. It does not record or share any data with third parties. Many professionals use reference materials during calls, and Tonvo simply makes that support smarter.",
      },
    ],
    featureName: "Invisible Copilot Mode",
    howItWorks: {
      label: "How It Works",
      heading: "Screen-Share Exclusion at the OS Level",
      body: "When Invisible Copilot Mode is activated, Tonvo sets the WDA_EXCLUDEFROMCAPTURE flag (on Windows) or the sharingType exclusion property (on macOS) on its overlay window. This instructs the operating system to exclude Tonvo's rendering surface from all screen-capture and screen-share pipelines. The result: you see Tonvo's full coaching interface on your screen, but anyone viewing your screen share sees only your application content — with no trace of the copilot.",
    },
    benefits: [
      {
        icon: "shield",
        title: "Complete Privacy on Every Call",
        description:
          "Your AI coaching remains entirely private. Participants, recordings, and screen captures never reveal that you are using Tonvo.",
      },
      {
        icon: "monitor",
        title: "Present Confidently While Assisted",
        description:
          "Share your screen during demos and presentations without worrying about coaching tips or signal badges appearing in front of your audience.",
      },
      {
        icon: "zap",
        title: "One-Key Toggle",
        description:
          "Switch between visible and invisible modes instantly with a keyboard shortcut — no settings menus, no interruptions, no friction.",
      },
    ],
    useCasesForFeature: [
      "Sales reps screen-sharing product demos while receiving hidden coaching",
      "Executives presenting in board meetings with discreet AI support",
      "Consultants sharing analysis decks while getting real-time talking points",
      "Candidates in technical interviews receiving private conversation guidance",
    ],
    technicalDetail: {
      label: "Under the Hood",
      heading: "OS-Level Window Exclusion",
      body: "Tonvo leverages platform-native APIs for screen-capture exclusion. On Windows, the SetWindowDisplayAffinity API with the WDA_EXCLUDEFROMCAPTURE flag is applied to the Electron BrowserWindow. On macOS, the window's sharingType property is set to .none. These OS-level mechanisms ensure that no pixel data from Tonvo's overlay enters the capture buffer used by video conferencing applications, providing a reliable and tamper-proof invisibility layer.",
    },
  },
];
