import type { ComparisonEntry } from "./types";

export const comparisons: ComparisonEntry[] = [
  // ─── 1. Tonvo vs Gong ───
  {
    type: "compare",
    slug: "tonvo-vs-gong",
    title: "Tonvo vs Gong: Real-Time AI Copilot vs Post-Call Analytics",
    metaDescription:
      "Compare Tonvo and Gong side by side. See how real-time conversation coaching and live tone analysis differs from post-call revenue intelligence.",
    h1: "Tonvo vs Gong",
    subtitle:
      "Gong is the industry standard for post-call revenue intelligence. Tonvo takes a different approach: real-time coaching and tone analysis while the conversation is still happening.",
    lastModified: "2026-04-09",
    relatedSlugs: [],
    targetKeywords: [
      "tonvo vs gong",
      "gong alternative",
      "real-time conversation coaching",
      "gong competitor for individuals",
      "ai call coaching vs post-call analytics",
    ],
    faq: [
      {
        question: "How is Tonvo different from Gong?",
        answer:
          "Gong records calls and provides analytics after the conversation ends. Tonvo works in real time during the call, giving you live coaching suggestions, tone detection, and conversation signals as the discussion unfolds.",
      },
      {
        question: "Can I use Tonvo if I'm an individual, not a sales team?",
        answer:
          "Yes. Unlike Gong, which is designed for enterprise sales teams with multi-seat contracts, Tonvo offers a free tier and a $19/mo Plus plan that works great for freelancers, founders, and individual professionals.",
      },
      {
        question: "Does Gong offer real-time coaching like Tonvo?",
        answer:
          "Gong focuses on post-call analysis, deal intelligence, and pipeline forecasting. It does not provide live in-call coaching or real-time tone analysis the way Tonvo does.",
      },
      {
        question: "Is my audio data stored with Tonvo?",
        answer:
          "No. Tonvo is privacy-first and never stores your audio. The analysis happens in real time and audio is discarded immediately. Gong, by contrast, records and stores full call recordings for later review.",
      },
    ],
    competitorName: "Gong",
    competitorDescription:
      "Gong is a revenue intelligence platform that records, transcribes, and analyzes sales calls to surface deal insights and coaching opportunities after the conversation ends.",
    comparisonRows: [
      { feature: "Analysis timing", tonvo: "Real-time during calls", competitor: "Post-call only" },
      { feature: "Live coaching suggestions", tonvo: true, competitor: false },
      { feature: "Tone & sentiment detection", tonvo: "Real-time", competitor: "Post-call transcript analysis" },
      { feature: "Audio storage", tonvo: "Never stored", competitor: "Full recordings stored" },
      { feature: "Free tier available", tonvo: true, competitor: false },
      { feature: "Individual plan", tonvo: "$19/mo Plus", competitor: "Enterprise pricing only" },
      { feature: "Multi-platform support", tonvo: "Discord, Zoom, Meet, Teams", competitor: "Zoom, Meet, Teams" },
      { feature: "Deal & pipeline analytics", tonvo: false, competitor: true },
      { feature: "Language support", tonvo: "10 languages", competitor: "70+ languages" },
      { feature: "Separate-window copilot", tonvo: true, competitor: false },
      { feature: "Setup time", tonvo: "Open in the browser, no install", competitor: "Requires CRM integration" },
    ],
    tonvoAdvantages: [
      {
        icon: "zap",
        title: "Coaching While It Matters",
        description:
          "Tonvo delivers suggestions in real time so you can adjust your approach mid-conversation, not after the deal is already won or lost.",
      },
      {
        icon: "shield",
        title: "Privacy-First Architecture",
        description:
          "Tonvo does not store audio. Analysis happens live, and the text of your sessions is kept so you can review it.",
      },
      {
        icon: "users",
        title: "Built for Everyone, Not Just Enterprise",
        description:
          "Start for free with 3 sessions per month, or upgrade to Plus for $19/mo. No enterprise sales cycle, no multi-seat minimums.",
      },
    ],
    summary: {
      heading: "Different Tools for Different Needs",
      body: "Gong excels at post-call revenue intelligence and pipeline analytics for large sales organizations. Tonvo is purpose-built for real-time coaching and tone awareness during live conversations, with pricing and simplicity that work for individuals and small teams alike. If you need in-the-moment guidance rather than after-the-fact analysis, Tonvo is the better fit.",
    },
  },

  // ─── 2. Tonvo vs Fireflies ───
  {
    type: "compare",
    slug: "tonvo-vs-fireflies",
    title: "Tonvo vs Fireflies: AI Coaching Copilot vs Meeting Transcription",
    metaDescription:
      "Tonvo vs Fireflies.ai compared. See how real-time conversation coaching and live sentiment analysis stacks up against automated meeting transcription.",
    h1: "Tonvo vs Fireflies.ai",
    subtitle:
      "Fireflies is a popular meeting transcription tool. Tonvo goes beyond transcription to deliver live coaching, tone detection, and conversation signals during your calls.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "compare", slug: "tonvo-vs-otter", label: "Tonvo vs Otter.ai" },
    ],
    targetKeywords: [
      "tonvo vs fireflies",
      "fireflies alternative",
      "ai meeting copilot vs transcription",
      "real-time call coaching",
      "fireflies ai competitor",
    ],
    faq: [
      {
        question: "Does Tonvo also transcribe meetings like Fireflies?",
        answer:
          "Tonvo focuses on real-time coaching, tone analysis, and conversation signals rather than full transcription. It provides post-session analysis summaries, but its primary value is in-the-moment guidance, not verbatim transcripts.",
      },
      {
        question: "Can Fireflies provide live coaching during a call?",
        answer:
          "No. Fireflies is designed for automated note-taking and transcription. It generates summaries and action items after the meeting, but does not offer real-time coaching or live sentiment analysis.",
      },
      {
        question: "Which tool is better for improving my communication skills?",
        answer:
          "Tonvo is built specifically for this. Its real-time tone detection and coaching suggestions help you adjust how you communicate as the conversation happens, which is more actionable than reviewing a transcript afterward.",
      },
      {
        question: "Does Fireflies store my call recordings?",
        answer:
          "Yes, Fireflies records and stores audio for transcription. Tonvo takes a privacy-first approach and never stores audio data. If data privacy is a priority, this is an important distinction.",
      },
    ],
    competitorName: "Fireflies.ai",
    competitorDescription:
      "Fireflies.ai is an AI meeting assistant that automatically records, transcribes, and summarizes meetings across video conferencing platforms.",
    comparisonRows: [
      { feature: "Primary function", tonvo: "Real-time coaching & analysis", competitor: "Transcription & summaries" },
      { feature: "Live coaching suggestions", tonvo: true, competitor: false },
      { feature: "Tone & sentiment detection", tonvo: "Real-time", competitor: false },
      { feature: "Meeting transcription", tonvo: "Post-session summary", competitor: "Full verbatim transcript" },
      { feature: "Audio storage", tonvo: "Never stored", competitor: "Stored for playback" },
      { feature: "Conversation signal detection", tonvo: true, competitor: false },
      { feature: "CRM integrations", tonvo: false, competitor: true },
      { feature: "Free tier", tonvo: "3 sessions/month", competitor: "Limited minutes" },
      { feature: "Platform support", tonvo: "Discord, Zoom, Meet, Teams", competitor: "Zoom, Meet, Teams, Webex" },
      { feature: "Separate-window copilot", tonvo: true, competitor: false },
    ],
    tonvoAdvantages: [
      {
        icon: "brain",
        title: "Coaching, Not Just Recording",
        description:
          "While Fireflies captures what was said, Tonvo helps you communicate better in the moment with actionable real-time suggestions.",
      },
      {
        icon: "eye",
        title: "Live Conversation Signals",
        description:
          "Detect engagement drops, confusion, hesitation, and other conversation signals as they happen so you can respond immediately.",
      },
      {
        icon: "shield",
        title: "No Audio Stored",
        description:
          "Tonvo does not store your audio. Analysis happens live, and the text of your sessions is kept so you can review it.",
      },
      {
        icon: "headphones",
        title: "Separate-Window Copilot",
        description:
          "On Plus and Team, Tonvo runs in its own window, so a shared tab or window shows only your call.",
      },
    ],
    summary: {
      heading: "Transcription vs Real-Time Intelligence",
      body: "Fireflies is an excellent choice if your primary need is meeting transcription, searchable notes, and post-meeting summaries. Tonvo is the better fit if you want real-time coaching, live tone awareness, and conversation signal detection that helps you perform better during the call itself. Many users find the two tools complementary rather than mutually exclusive.",
    },
  },

  // ─── 3. Tonvo vs Otter.ai ───
  {
    type: "compare",
    slug: "tonvo-vs-otter",
    title: "Tonvo vs Otter.ai: Live Coaching vs AI Meeting Notes",
    metaDescription:
      "Compare Tonvo with Otter.ai. See how real-time conversation coaching and live tone analysis differs from automated meeting notes and transcription tools.",
    h1: "Tonvo vs Otter.ai",
    subtitle:
      "Otter.ai excels at turning spoken words into searchable notes. Tonvo focuses on making you a better communicator in real time with live coaching and sentiment analysis.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "compare", slug: "tonvo-vs-fireflies", label: "Tonvo vs Fireflies" },
    ],
    targetKeywords: [
      "tonvo vs otter",
      "otter ai alternative",
      "ai coaching vs meeting notes",
      "real-time call assistant",
      "otter ai competitor",
    ],
    faq: [
      {
        question: "What does Tonvo do that Otter.ai doesn't?",
        answer:
          "Tonvo provides real-time coaching suggestions, live tone and sentiment detection, and conversation signal analysis during your calls. Otter focuses on automated transcription, meeting notes, and post-meeting summaries.",
      },
      {
        question: "Is Otter.ai better for taking meeting notes?",
        answer:
          "Yes, Otter.ai is specifically optimized for generating detailed, searchable meeting notes and transcripts. If verbatim notes are your main need, Otter is a strong choice. Tonvo provides post-session summaries but focuses more on real-time performance improvement.",
      },
      {
        question: "Can I use both Tonvo and Otter.ai together?",
        answer:
          "Absolutely. Many users run Otter for transcription and notes while using Tonvo for real-time coaching. On Plus and Team, Tonvo runs in its own window, so it does not interfere with other tools running on the same call.",
      },
      {
        question: "Which tool is more affordable?",
        answer:
          "Both offer free tiers. Tonvo's free plan includes 3 sessions per month, while Otter's free plan offers limited transcription minutes. Tonvo Plus is $19/mo and Otter Pro is $16.99/mo, making them comparably priced.",
      },
    ],
    competitorName: "Otter.ai",
    competitorDescription:
      "Otter.ai is an AI-powered meeting assistant that provides real-time transcription, automated meeting notes, and searchable conversation records.",
    comparisonRows: [
      { feature: "Core purpose", tonvo: "Real-time coaching & tone analysis", competitor: "Transcription & meeting notes" },
      { feature: "Live coaching suggestions", tonvo: true, competitor: false },
      { feature: "Real-time transcription", tonvo: false, competitor: true },
      { feature: "Tone & sentiment analysis", tonvo: "Real-time", competitor: false },
      { feature: "Searchable meeting archive", tonvo: false, competitor: true },
      { feature: "Audio storage", tonvo: "Never stored", competitor: "Stored with transcript" },
      { feature: "Post-session analysis", tonvo: true, competitor: true },
      { feature: "Language support", tonvo: "10 languages", competitor: "English-focused" },
      { feature: "Separate-window copilot", tonvo: true, competitor: false },
      { feature: "Free tier", tonvo: "3 sessions/month", competitor: "300 min/month" },
      { feature: "Platform support", tonvo: "Discord, Zoom, Meet, Teams", competitor: "Zoom, Meet, Teams" },
    ],
    tonvoAdvantages: [
      {
        icon: "zap",
        title: "Act in the Moment",
        description:
          "Tonvo helps you adjust your communication approach while the conversation is happening, turning every call into a growth opportunity.",
      },
      {
        icon: "heart",
        title: "Emotional Intelligence Layer",
        description:
          "Real-time tone and sentiment detection gives you awareness of how the conversation feels, not just what words are being said.",
      },
      {
        icon: "globe",
        title: "Multilingual Real-Time Analysis",
        description:
          "Tonvo supports 10 languages for live coaching and tone detection, making it effective for international and cross-cultural conversations.",
      },
    ],
    summary: {
      heading: "Notes vs Performance",
      body: "Otter.ai is the go-to tool if you need comprehensive meeting transcription and searchable notes. Tonvo serves a different purpose: helping you communicate more effectively during the call with real-time coaching, tone detection, and conversation signals. Choose Otter for documentation, Tonvo for performance, or use both for the complete picture.",
    },
  },

  // ─── 4. Tonvo vs Chorus ───
  {
    type: "compare",
    slug: "tonvo-vs-chorus",
    title: "Tonvo vs Chorus: Accessible AI Copilot vs Enterprise Conversation Intelligence",
    metaDescription:
      "Compare Tonvo and Chorus by ZoomInfo. See how an accessible real-time AI coaching copilot compares to enterprise-grade conversation intelligence tools.",
    h1: "Tonvo vs Chorus by ZoomInfo",
    subtitle:
      "Chorus is an enterprise conversation intelligence platform owned by ZoomInfo. Tonvo offers real-time coaching that's accessible to individuals and teams of any size.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
      { type: "compare", slug: "tonvo-vs-gong", label: "Tonvo vs Gong" },
    ],
    targetKeywords: [
      "tonvo vs chorus",
      "chorus alternative",
      "chorus zoominfo competitor",
      "affordable conversation intelligence",
      "enterprise vs individual call coaching",
    ],
    faq: [
      {
        question: "How does Chorus differ from Tonvo?",
        answer:
          "Chorus is an enterprise conversation intelligence platform focused on post-call analytics, deal intelligence, and sales team management. Tonvo provides real-time coaching and tone analysis during calls, with plans starting at $0 for individuals.",
      },
      {
        question: "Do I need a ZoomInfo subscription to use Chorus?",
        answer:
          "Chorus is part of the ZoomInfo platform and is typically sold as part of an enterprise bundle. Tonvo is a standalone product that requires no other subscriptions and can be set up in under two minutes.",
      },
      {
        question: "Can a small team use Chorus?",
        answer:
          "Chorus is designed for mid-market and enterprise sales organizations and its pricing reflects that. Tonvo's Team plan at $49/user/month is built for teams of any size, with a free tier and $19/mo Plus plan for individuals.",
      },
      {
        question: "Which tool provides better real-time assistance?",
        answer:
          "Tonvo is built entirely around real-time assistance with live coaching, tone detection, and conversation signals during calls. Chorus focuses on post-call analytics and does not provide in-call coaching.",
      },
    ],
    competitorName: "Chorus",
    competitorDescription:
      "Chorus by ZoomInfo is an enterprise conversation intelligence platform that captures and analyzes sales calls to provide deal insights, competitive intelligence, and team coaching recommendations.",
    comparisonRows: [
      { feature: "Analysis timing", tonvo: "Real-time during calls", competitor: "Post-call only" },
      { feature: "Live coaching suggestions", tonvo: true, competitor: false },
      { feature: "Tone & sentiment detection", tonvo: "Real-time", competitor: "Post-call analysis" },
      { feature: "Target audience", tonvo: "Individuals & teams", competitor: "Enterprise sales teams" },
      { feature: "Pricing transparency", tonvo: "Public pricing from $0/mo", competitor: "Custom enterprise quotes" },
      { feature: "Audio storage", tonvo: "Never stored", competitor: "Full recordings stored" },
      { feature: "Setup complexity", tonvo: "No install, no integrations required", competitor: "CRM & tech stack integration needed" },
      { feature: "Deal intelligence & forecasting", tonvo: false, competitor: true },
      { feature: "Multi-platform support", tonvo: "Discord, Zoom, Meet, Teams", competitor: "Zoom, Meet, Teams" },
      { feature: "Separate-window copilot", tonvo: true, competitor: false },
      { feature: "Free tier available", tonvo: true, competitor: false },
      { feature: "Language support", tonvo: "10 languages", competitor: "Multiple languages" },
    ],
    tonvoAdvantages: [
      {
        icon: "target",
        title: "Accessible to Everyone",
        description:
          "No enterprise contract or CRM integration required. Sign up and start using Tonvo in minutes with a free plan or affordable Plus subscription.",
      },
      {
        icon: "clock",
        title: "Real-Time, Not Retrospective",
        description:
          "Tonvo gives you coaching and tone awareness while the conversation is still happening, when you can still change the outcome.",
      },
      {
        icon: "shield",
        title: "Privacy by Design",
        description:
          "Tonvo never records or stores audio. Your conversations stay private with zero data retention, a strong contrast to platforms that store full recordings.",
      },
      {
        icon: "layers",
        title: "Works Beyond Sales",
        description:
          "While Chorus is sales-focused, Tonvo is effective for any conversation type: interviews, client calls, team meetings, negotiations, and more.",
      },
    ],
    summary: {
      heading: "Enterprise Intelligence vs Accessible Real-Time Coaching",
      body: "Chorus is a powerful tool for enterprise sales organizations that need deal intelligence, competitive analysis, and team-wide coaching insights. Tonvo fills a different gap: real-time, in-call coaching and tone awareness that's accessible to anyone regardless of team size or budget. If you need live guidance rather than post-call dashboards, and you value transparent pricing and privacy, Tonvo is the right choice.",
    },
  },

  // ─── 5. Tonvo vs Manual Note-Taking ───
  {
    type: "compare",
    slug: "tonvo-vs-manual-notes",
    title: "Tonvo vs Manual Note-Taking: AI Copilot vs Pen and Paper",
    metaDescription:
      "Compare using Tonvo's AI conversation copilot against manual note-taking during calls. Discover what you gain with real-time coaching and analysis.",
    h1: "Tonvo vs Manual Note-Taking",
    subtitle:
      "Taking notes during calls splits your attention and misses emotional context. Tonvo runs invisibly in the background, coaching you in real time while you stay fully present.",
    lastModified: "2026-04-09",
    relatedSlugs: [],
    targetKeywords: [
      "ai note taking during calls",
      "alternative to manual notes meetings",
      "conversation copilot vs notes",
      "stay present during calls",
      "ai meeting assistant for focus",
    ],
    faq: [
      {
        question: "Can Tonvo fully replace note-taking during calls?",
        answer:
          "Tonvo provides post-session analysis summaries that capture key moments, tone shifts, and conversation signals. For many users, this replaces the need for manual notes. However, if you need verbatim transcripts, pairing Tonvo with a dedicated transcription tool may be ideal.",
      },
      {
        question: "How does manual note-taking affect call quality?",
        answer:
          "You miss social cues, respond more slowly, and participants may feel you're distracted. Tonvo lets you stay fully present.",
      },
      {
        question: "Can the other person see Tonvo?",
        answer:
          "On Plus and Team, not when you share a tab or a window, because Tonvo runs in its own window. On the Free plan the replies appear in the page itself, so keep that page out of what you share. If you share your entire screen, they can see it. You should tell the people you talk to when you use a tool like this.",
      },
      {
        question: "What if I prefer taking my own notes?",
        answer:
          "You can use Tonvo alongside your own note-taking. The real-time coaching and tone detection work independently. Many users find that the AI coaching is most valuable and gradually rely less on manual notes as they trust the post-session summaries.",
      },
    ],
    competitorName: "Manual Note-Taking",
    competitorDescription:
      "Manual note-taking during calls involves writing or typing key points while simultaneously listening and participating in the conversation.",
    comparisonRows: [
      { feature: "Attention required", tonvo: "Runs in background, no attention needed", competitor: "Splits focus between notes and conversation" },
      { feature: "Real-time coaching", tonvo: true, competitor: false },
      { feature: "Tone & sentiment detection", tonvo: true, competitor: false },
      { feature: "Conversation signal detection", tonvo: true, competitor: false },
      { feature: "Post-session summary", tonvo: "Automatic with key moments", competitor: "Only what you wrote down" },
      { feature: "Active listening", tonvo: "Fully present", competitor: "Compromised" },
      { feature: "Cost", tonvo: "Free tier available, Plus at $19/mo", competitor: "Free" },
      { feature: "Setup required", tonvo: "2-minute setup", competitor: "None" },
      { feature: "Works across languages", tonvo: "10 languages", competitor: "Limited to your own fluency" },
      { feature: "Captures emotional context", tonvo: true, competitor: false },
    ],
    tonvoAdvantages: [
      {
        icon: "eye",
        title: "Stay Fully Present",
        description:
          "Stop splitting your attention. Tonvo handles coaching and analysis in the background so you can focus entirely on the person you're talking to.",
      },
      {
        icon: "brain",
        title: "Insights You Can't Write Down",
        description:
          "Tone shifts, sentiment changes, and conversation signals are nearly impossible to capture manually. Tonvo detects them automatically and in real time.",
      },
      {
        icon: "bar-chart",
        title: "Consistent Post-Session Analysis",
        description:
          "Manual notes vary in quality based on your focus and energy. Tonvo delivers consistent, structured analysis after every session regardless of how busy the call was.",
      },
      {
        icon: "trending-up",
        title: "Improvement Over Time",
        description:
          "Tonvo's coaching helps you build better communication habits session after session, something no notebook can do.",
      },
    ],
    summary: {
      heading: "From Distracted Scribbling to Intelligent Awareness",
      body: "Manual note-taking is familiar and free, but it comes with real costs: split attention, missed emotional cues, and inconsistent records. Tonvo eliminates these trade-offs by running invisibly during your calls, providing real-time coaching, and delivering automatic post-session analysis. The free tier makes it easy to try, and most users find the improvement in call quality and presence well worth the switch.",
    },
  },
];
