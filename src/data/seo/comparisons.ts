import type { ComparisonEntry } from "./types";

export const comparisons: ComparisonEntry[] = [
  // ─── 1. Tonvo vs Gong ───
  {
    type: "compare",
    slug: "tonvo-vs-gong",
    title: "Tonvo vs Gong: live help or sales call analytics",
    metaDescription:
      "Tonvo helps you during a conversation. Gong analyzes sales calls for revenue teams. See how the two differ and which one fits what you need.",
    h1: "Tonvo vs Gong",
    subtitle:
      "Gong is a conversation analytics platform built for sales organizations. Tonvo is a copilot for the conversation you are in right now: it follows along and suggests what to say while you talk.",
    lastModified: "2026-10-21",
    relatedSlugs: [],
    targetKeywords: [
      "tonvo vs gong",
      "gong alternative",
      "gong alternative for individuals",
      "live conversation copilot",
      "real-time call assistant vs call analytics",
    ],
    faq: [
      {
        question: "How is Tonvo different from Gong?",
        answer:
          "Gong is a conversation analytics platform for sales organizations, built around recorded calls and what a revenue team learns from them. Tonvo is a copilot for the conversation itself. It follows along live, shows the question the other person just asked, and suggests three replies you can use. You decide what to say.",
      },
      {
        question: "Can I use Tonvo if I am not part of a sales team?",
        answer:
          "Yes. Tonvo is for anyone who wants help during a conversation: work calls and meetings, interviews, negotiations, talks in another language, and sales calls too. You can start on the Free plan with 3 live sessions a month, and Plus is $19 a month.",
      },
      {
        question: "Does Tonvo replace Gong for a sales team?",
        answer:
          "No. Tonvo has no CRM integration, no manager or team dashboards, no call recordings and no forecasting. If your organization needs deal and pipeline analytics, that is what a platform like Gong is for. Tonvo is for the person on the call who wants help in the moment.",
      },
      {
        question: "Does Tonvo store my audio?",
        answer:
          "No. Tonvo does not record or store audio. It transcribes the conversation live, and the text of your sessions is kept so you can read it again. You are responsible for telling the people you talk to and for following the rules that apply to you.",
      },
    ],
    competitorName: "Gong",
    competitorDescription:
      "Gong is a conversation analytics and revenue intelligence platform for sales organizations. It works from recorded calls and meetings to help teams review conversations, track deals and coach reps.",
    comparisonRows: [
      { feature: "Built for", tonvo: "The person in the conversation", competitor: "Sales organizations and revenue teams" },
      { feature: "Main moment of use", tonvo: "During the conversation", competitor: "Review of recorded calls" },
      { feature: "Replies suggested live", tonvo: "Three ready-to-say replies", competitor: "Not its focus" },
      { feature: "Calls and recordings", tonvo: "No audio recorded or stored", competitor: "Recordings and transcripts" },
      { feature: "Deal and pipeline analytics", tonvo: false, competitor: true },
      { feature: "Manager and team dashboards", tonvo: false, competitor: true },
      { feature: "CRM integration", tonvo: false, competitor: true },
      { feature: "How it hears the call", tonvo: "Microphone or a shared browser tab", competitor: "Connects to calls and meetings" },
      { feature: "Languages for live transcription", tonvo: "10", competitor: "Check the vendor" },
      { feature: "Pricing", tonvo: "Free plan, Plus $19/mo, Team $49/user/mo", competitor: "Quote-based, sold to organizations" },
      { feature: "Setup", tonvo: "Open in the browser, no install", competitor: "Set up by an organization" },
    ],
    tonvoAdvantages: [
      {
        icon: "zap",
        title: "Help While You Are Talking",
        description:
          "Tonvo shows the question that was just asked and three replies you can say, so the help arrives in the moment the conversation needs it.",
      },
      {
        icon: "shield",
        title: "No Audio Recorded or Stored",
        description:
          "Tonvo does not record or store audio. The text of your sessions is kept so you can read it again, and you choose what to say.",
      },
      {
        icon: "users",
        title: "Made for One Person to Start",
        description:
          "Start free with 3 live sessions a month, or move to Plus at $19 a month. No sales process and no team setup to begin.",
      },
    ],
    summary: {
      heading: "Different Tools for Different Jobs",
      body: "Gong is built for sales organizations that want to analyze their conversations across a team and track deals. Tonvo does none of that: no CRM integration, no dashboards, no recordings, no forecasting. It does one thing, which is to help you during a conversation by following it live and suggesting what to say. If you want analytics for a revenue team, look at Gong. If you want help in the conversation you are having, try Tonvo.",
    },
  },

  // ─── 2. Tonvo vs Fireflies ───
  {
    type: "compare",
    slug: "tonvo-vs-fireflies",
    title: "Tonvo vs Fireflies: live help or meeting notes",
    metaDescription:
      "Tonvo helps during a conversation. Fireflies.ai records and summarizes meetings afterwards. See the difference and decide which one you need.",
    h1: "Tonvo vs Fireflies.ai",
    subtitle:
      "Fireflies.ai is a meeting assistant that transcribes and summarizes meetings. Tonvo is a copilot that helps while the conversation is happening, with the question just asked and three replies you can use.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "compare", slug: "tonvo-vs-otter", label: "Tonvo vs Otter.ai" },
    ],
    targetKeywords: [
      "tonvo vs fireflies",
      "fireflies alternative",
      "fireflies.ai alternative for live conversations",
      "ai meeting copilot vs transcription",
      "live conversation assistant",
    ],
    faq: [
      {
        question: "Does Tonvo take meeting notes like Fireflies?",
        answer:
          "Not in the same way. Fireflies is built to transcribe meetings and produce notes and summaries. Tonvo transcribes live so it can help you in the moment, and after a session it gives you a summary with tone, what went well, what to improve and follow-up actions. It does not record audio.",
      },
      {
        question: "What does Tonvo do during a conversation?",
        answer:
          "It follows the conversation as it happens and shows the question the other person just asked, three ready-to-say replies and a short read on the moment. On Plus and Team you also get live signals such as objections, hesitation or agreement. You decide what to say, and Tonvo can be wrong.",
      },
      {
        question: "Which one should I pick?",
        answer:
          "If you need a record of meetings, searchable notes and shared summaries, a meeting assistant like Fireflies is built for that. If you want help while you are talking, Tonvo is built for that. They solve different problems, so some people use both.",
      },
      {
        question: "Does Tonvo join my call as a bot?",
        answer:
          "No. Tonvo does not join calls and does not integrate with Zoom, Meet, Teams or Discord. It hears your microphone, and on a computer it can also hear the audio of a browser tab you share, so it can follow both sides of an online call. It does not record or store audio.",
      },
    ],
    competitorName: "Fireflies.ai",
    competitorDescription:
      "Fireflies.ai is an AI meeting assistant that records and transcribes meetings and turns them into searchable notes and summaries.",
    comparisonRows: [
      { feature: "Main job", tonvo: "Help during the conversation", competitor: "Meeting transcripts and summaries" },
      { feature: "Main moment of use", tonvo: "While you talk", competitor: "Notes and review afterwards" },
      { feature: "Replies suggested live", tonvo: "Three ready-to-say replies", competitor: "Not its focus" },
      { feature: "Transcription", tonvo: "Live, text of sessions kept", competitor: "Full meeting transcripts" },
      { feature: "Audio", tonvo: "Not recorded or stored", competitor: "Recordings and transcripts" },
      { feature: "Summary after the session", tonvo: true, competitor: true },
      { feature: "How it hears the call", tonvo: "Microphone or a shared browser tab", competitor: "Connects to meetings" },
      { feature: "Joins your call as a bot", tonvo: false, competitor: "Check the vendor" },
      { feature: "Integrations with other tools", tonvo: false, competitor: true },
      { feature: "Free plan", tonvo: "3 sessions a month, 5 min each", competitor: true },
      { feature: "Languages for live transcription", tonvo: "10", competitor: "Check the vendor" },
    ],
    tonvoAdvantages: [
      {
        icon: "brain",
        title: "Help, Not Just a Record",
        description:
          "A meeting assistant captures what was said. Tonvo helps with what to say next, with three replies you can use while the other person is still waiting.",
      },
      {
        icon: "eye",
        title: "Signals on Plus and Team",
        description:
          "Paid plans add live signals such as question, objection, opportunity, hesitation and agreement, plus a view of who is speaking.",
      },
      {
        icon: "shield",
        title: "No Audio Stored",
        description:
          "Tonvo does not record or store audio. The text of your sessions is kept so you can read it again.",
      },
      {
        icon: "headphones",
        title: "Separate Copilot Window on Plus and Team",
        description:
          "On Plus and Team, the copilot can run in its own window. It is not part of a tab or window you share, but if you share your entire screen, others can see it.",
      },
    ],
    summary: {
      heading: "Notes Afterwards or Help Right Now",
      body: "Fireflies is a good fit if you want transcripts, searchable notes and summaries of your meetings. Tonvo does not replace that: it has no integrations with other tools and does not record audio. It is for the moment you are in the conversation and want to find the right words. Some people use both, one for the record and one for help in the moment.",
    },
  },

  // ─── 3. Tonvo vs Otter.ai ───
  {
    type: "compare",
    slug: "tonvo-vs-otter",
    title: "Tonvo vs Otter.ai: live replies or AI meeting notes",
    metaDescription:
      "Tonvo suggests replies while you talk. Otter.ai turns meetings into transcripts and notes. See how the two differ and which one fits your need.",
    h1: "Tonvo vs Otter.ai",
    subtitle:
      "Otter.ai turns spoken meetings into searchable transcripts and notes. Tonvo is a copilot that helps while a conversation is happening, with the question just asked and three replies you can use.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "compare", slug: "tonvo-vs-fireflies", label: "Tonvo vs Fireflies" },
    ],
    targetKeywords: [
      "tonvo vs otter",
      "otter ai alternative",
      "otter.ai alternative for live conversations",
      "meeting notes vs live copilot",
      "real-time conversation assistant",
    ],
    faq: [
      {
        question: "What does Tonvo do that a notes tool does not?",
        answer:
          "Tonvo is built for help during the conversation. It follows along live, shows the question the other person just asked and suggests three replies you can say. A notes tool like Otter.ai is built to turn the meeting into a transcript and notes.",
      },
      {
        question: "Is Otter.ai better for taking meeting notes?",
        answer:
          "If notes and searchable transcripts are your main need, a tool built for that is the better choice. Tonvo does give you a summary after each session, with tone, what went well, what to improve and follow-up actions, but it is not a note-taking or archive tool.",
      },
      {
        question: "Can I use both Tonvo and Otter.ai?",
        answer:
          "Yes, they do different jobs. You can keep a notes tool for the record and use Tonvo for help while you talk. Tonvo hears your microphone or a shared browser tab, so check that both tools can work on your setup before an important call.",
      },
      {
        question: "Which tool costs less?",
        answer:
          "Tonvo has a Free plan with 3 live sessions a month, up to 5 minutes each. Plus is $19 a month with unlimited sessions, and Team is $49 per user a month. Check the vendor's site for current Otter.ai pricing, since plans change.",
      },
    ],
    competitorName: "Otter.ai",
    competitorDescription:
      "Otter.ai is an AI meeting assistant that transcribes conversations and produces searchable transcripts, notes and summaries.",
    comparisonRows: [
      { feature: "Main job", tonvo: "Help during the conversation", competitor: "Transcripts and meeting notes" },
      { feature: "Replies suggested live", tonvo: "Three ready-to-say replies", competitor: "Not its focus" },
      { feature: "Live transcription", tonvo: true, competitor: true },
      { feature: "Session history", tonvo: "7 days on Free, full on paid plans", competitor: "Searchable transcripts" },
      { feature: "Audio", tonvo: "Not recorded or stored", competitor: "Transcripts and recordings" },
      { feature: "Summary after the session", tonvo: true, competitor: true },
      { feature: "How it hears the call", tonvo: "Microphone or a shared browser tab", competitor: "Connects to meetings" },
      { feature: "Languages for live transcription", tonvo: "10", competitor: "Check the vendor" },
      { feature: "Free plan", tonvo: "3 sessions a month, 5 min each", competitor: true },
      { feature: "Paid plans", tonvo: "Plus $19/mo, Team $49/user/mo", competitor: "See the vendor" },
    ],
    tonvoAdvantages: [
      {
        icon: "zap",
        title: "Help in the Moment",
        description:
          "Tonvo shows the question that was just asked and three replies you can say, while the conversation is still going.",
      },
      {
        icon: "message",
        title: "Works for Written Talks Too",
        description:
          "Paste a conversation or upload screenshots and get help writing your reply. This is available on every plan.",
      },
      {
        icon: "globe",
        title: "10 Languages for Live Transcription",
        description:
          "Tonvo transcribes live in English, French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese and Korean, and can detect the language. Plus and Team add live translation.",
      },
    ],
    summary: {
      heading: "Notes or Help in the Moment",
      body: "Otter.ai is a good choice if you want meetings turned into transcripts and notes you can search later. Tonvo is built for something else: help while you are talking, with the question just asked and three replies to choose from. It does not record audio and it is not an archive. Choose a notes tool for documentation, Tonvo for the live conversation, or use both.",
    },
  },

  // ─── 4. Tonvo vs Chorus ───
  {
    type: "compare",
    slug: "tonvo-vs-chorus",
    title: "Tonvo vs Chorus: live copilot or call analytics",
    metaDescription:
      "Tonvo helps during a conversation. Chorus by ZoomInfo analyzes sales calls for organizations. See how they differ and which one fits you.",
    h1: "Tonvo vs Chorus by ZoomInfo",
    subtitle:
      "Chorus by ZoomInfo is a conversation analytics platform for sales organizations. Tonvo is a copilot for one person in a live conversation, suggesting what to say while you talk.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
      { type: "compare", slug: "tonvo-vs-gong", label: "Tonvo vs Gong" },
    ],
    targetKeywords: [
      "tonvo vs chorus",
      "chorus alternative",
      "chorus zoominfo alternative",
      "chorus conversation intelligence alternative",
      "live conversation copilot",
    ],
    faq: [
      {
        question: "How does Chorus differ from Tonvo?",
        answer:
          "Chorus by ZoomInfo is a conversation analytics platform for sales organizations, built around reviewing recorded calls. Tonvo helps during the conversation itself: it follows along live, shows the question just asked and suggests three replies. It is made for the person on the call, not for a sales organization.",
      },
      {
        question: "Does Tonvo do what Chorus does for a sales team?",
        answer:
          "No. Tonvo has no CRM integration, no manager or team dashboards, no call recordings and no forecasting. If your organization needs those, a platform like Chorus is built for them. Tonvo is for the moment of the conversation.",
      },
      {
        question: "Can a small team or an individual use Tonvo?",
        answer:
          "Yes. Anyone can start on the Free plan with 3 live sessions a month, up to 5 minutes each. Plus is $19 a month for unlimited sessions, and Team is $49 per user a month. There is a 7-day money-back guarantee on paid plans.",
      },
      {
        question: "Is Tonvo only for sales calls?",
        answer:
          "No. Sales is one mode among several. Tonvo also has modes for general conversations, recruitment, support and networking, and it can help with interviews, meetings, negotiations and talks in another language.",
      },
    ],
    competitorName: "Chorus",
    competitorDescription:
      "Chorus by ZoomInfo is a conversation analytics platform for sales organizations. It works from recorded calls and meetings to help teams review conversations and coach reps.",
    comparisonRows: [
      { feature: "Built for", tonvo: "The person in the conversation", competitor: "Sales organizations" },
      { feature: "Main moment of use", tonvo: "During the conversation", competitor: "Review of recorded calls" },
      { feature: "Replies suggested live", tonvo: "Three ready-to-say replies", competitor: "Not its focus" },
      { feature: "Calls and recordings", tonvo: "No audio recorded or stored", competitor: "Recordings and transcripts" },
      { feature: "Deal intelligence and forecasting", tonvo: false, competitor: true },
      { feature: "Manager and team dashboards", tonvo: false, competitor: true },
      { feature: "CRM integration", tonvo: false, competitor: true },
      { feature: "How it hears the call", tonvo: "Microphone or a shared browser tab", competitor: "Connects to calls and meetings" },
      { feature: "Pricing", tonvo: "Public: Free, Plus $19/mo, Team $49/user/mo", competitor: "Sold to organizations" },
      { feature: "Setup", tonvo: "Open in the browser, no install", competitor: "Set up by an organization" },
    ],
    tonvoAdvantages: [
      {
        icon: "target",
        title: "Made for the Person on the Call",
        description:
          "No organization-wide rollout and no integrations. Open Tonvo in the browser, pick a mode and start a session.",
      },
      {
        icon: "clock",
        title: "Help While It Is Happening",
        description:
          "Tonvo gives you the question just asked and three replies to choose from while the conversation is still going.",
      },
      {
        icon: "shield",
        title: "No Audio Stored",
        description:
          "Tonvo does not record or store audio. The text of your sessions is kept so you can read it again.",
      },
      {
        icon: "layers",
        title: "Beyond Sales",
        description:
          "Modes for general talks, sales, recruitment, support and networking cover interviews, client calls, meetings and negotiations.",
      },
    ],
    summary: {
      heading: "Analytics for Organizations or a Copilot for You",
      body: "Chorus is built for sales organizations that want to analyze conversations across a team. Tonvo does not offer that: no CRM integration, no dashboards, no recordings, no forecasting. It is a copilot for one person in a live conversation, with public pricing and nothing to install. Pick the one that matches the job you need done.",
    },
  },

  // ─── 5. Tonvo vs Manual Note-Taking ───
  {
    type: "compare",
    slug: "tonvo-vs-manual-notes",
    title: "Tonvo vs Manual Notes: stay present in a talk",
    metaDescription:
      "Taking notes while you talk splits your attention. Compare it with Tonvo, a live copilot that suggests replies and summarizes the session afterwards.",
    h1: "Tonvo vs Manual Note-Taking",
    subtitle:
      "Writing notes during a conversation splits your attention. Tonvo follows the conversation for you, shows the question just asked and suggests three replies, then summarizes the session afterwards.",
    lastModified: "2026-10-21",
    relatedSlugs: [],
    targetKeywords: [
      "alternative to taking notes during calls",
      "ai help during conversations",
      "conversation copilot vs notes",
      "stay present during calls",
      "live conversation assistant",
    ],
    faq: [
      {
        question: "Can Tonvo replace taking notes during a conversation?",
        answer:
          "For many conversations, partly. After each session Tonvo gives you a summary with tone, what went well, what to improve and follow-up actions, and the text of the session is kept so you can read it again. It does not record audio and it has no notes feature, so write things down yourself if you need your own notes.",
      },
      {
        question: "Does taking notes really change a conversation?",
        answer:
          "It can. Writing while listening means your attention is split, and some people find they lose the thread or look distracted. Others think better with a pen in hand, and that is a good reason to keep taking notes.",
      },
      {
        question: "Can the other person see Tonvo?",
        answer:
          "On Plus and Team, the copilot can run in its own window, which is not part of a tab or window you share. On the Free plan the replies appear in the page itself, so keep that page out of what you share. If you share your entire screen, others can see it. Tell the people you talk to when you use a tool like this, and follow the rules that apply to you.",
      },
      {
        question: "Can I use Tonvo and still take my own notes?",
        answer:
          "Yes. Tonvo works on its own while you write notes the way you like. Many people keep a short list of their own and let the session summary cover the rest.",
      },
    ],
    competitorName: "Manual Note-Taking",
    competitorDescription:
      "Manual note-taking means writing or typing key points while you listen and take part in the conversation.",
    comparisonRows: [
      { feature: "Attention", tonvo: "Follows the conversation for you", competitor: "Shared between notes and listening" },
      { feature: "Help with what to say", tonvo: "Three ready-to-say replies", competitor: false },
      { feature: "Question just asked", tonvo: "Shown live", competitor: "Only if you wrote it down" },
      { feature: "Live signals", tonvo: "On Plus and Team", competitor: false },
      { feature: "After the session", tonvo: "Summary with tone, what went well, what to improve, follow-ups", competitor: "Only what you wrote down" },
      { feature: "Languages", tonvo: "Live transcription in 10", competitor: "Limited to your own fluency" },
      { feature: "Audio", tonvo: "Not recorded or stored", competitor: "Not applicable" },
      { feature: "Your own notes and memory", tonvo: "No notes feature", competitor: true },
      { feature: "Cost", tonvo: "Free plan, Plus $19/mo", competitor: "Free" },
      { feature: "Setup", tonvo: "Open in the browser, no install", competitor: "None" },
    ],
    tonvoAdvantages: [
      {
        icon: "eye",
        title: "Look Up from the Page",
        description:
          "Tonvo follows the conversation and shows the question just asked, so you can spend less attention writing and more on the person you are talking to.",
      },
      {
        icon: "message",
        title: "Words When You Need Them",
        description:
          "Three ready-to-say replies appear as the conversation moves. You decide what to say, and Tonvo can be wrong.",
      },
      {
        icon: "bar-chart",
        title: "A Summary Afterwards",
        description:
          "Every session ends with a summary of tone, what went well, what to improve and follow-up actions, on every plan.",
      },
      {
        icon: "globe",
        title: "Help in Other Languages",
        description:
          "Live transcription covers 10 languages, and Plus and Team add live translation, which a notebook cannot give you.",
      },
    ],
    summary: {
      heading: "Your Notes or a Copilot",
      body: "Manual notes are free, familiar and entirely yours, and for some people writing is how they think. Tonvo offers something different: it follows the conversation live, suggests what to say and summarizes the session afterwards. It has no notes feature and does not record audio. The Free plan includes 3 live sessions a month, so you can try it next to your own notes.",
    },
  },
];
