import type { UseCaseEntry } from "./types";

export const useCases: UseCaseEntry[] = [
  // ─── 1. AI Copilot for Sales Calls ───
  {
    type: "use-cases",
    slug: "ai-copilot-for-sales-calls",
    title: "AI Copilot for Sales Calls — Close More Deals with Live Coaching",
    metaDescription:
      "Tonvo gives sales reps real-time AI coaching during live calls. Detect buyer objections, read sentiment shifts, and get closing suggestions instantly.",
    h1: "Real-Time AI Sales Call Coaching That Helps You Close",
    subtitle:
      "Tonvo listens to your sales calls in real time, detects buyer objections and sentiment shifts, and delivers coaching prompts so you never miss a closing opportunity. Works on Zoom, Meet, and Discord.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "sdr-onboarding-with-call-review", label: "SDR Onboarding with Call Review" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
    ],
    targetKeywords: [
      "ai sales call coaching",
      "real-time sales copilot",
      "ai objection handling",
      "live call coaching software",
      "sales conversation intelligence",
      "ai for sales reps",
    ],
    faq: [
      {
        question: "How does Tonvo coach me during a live sales call?",
        answer:
          "Tonvo analyzes the conversation in real time, detecting buyer sentiment, objections, and hesitation signals. It surfaces contextual coaching prompts—such as reframing a price objection or asking a discovery question—directly in an overlay so you can act without losing momentum.",
      },
      {
        question: "Does the buyer know Tonvo is running?",
        answer:
          "Tonvo runs locally as a silent assistant visible only to you. It does not inject audio, alter the call, or require the other party to install anything. You should follow your organization's recording and disclosure policies.",
      },
      {
        question: "Which calling platforms does Tonvo support for sales?",
        answer:
          "Tonvo integrates with Zoom, Google Meet, and Discord. It captures the audio stream from your active call and provides coaching in a lightweight sidebar overlay.",
      },
      {
        question: "Can I review my sales calls after they end?",
        answer:
          "Yes. Every session generates a post-call analysis with a sentiment timeline, detected objections, talk-time ratio, and actionable recommendations you can use to prepare for follow-ups.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Sales reps miss buying signals and lose winnable deals",
      body: "On live calls, reps juggle discovery, objection handling, and rapport building simultaneously. Subtle tone shifts—hesitation before pricing, enthusiasm about a feature—go unnoticed. Without real-time guidance, even experienced reps leave revenue on the table.",
    },
    solution: {
      label: "The Solution",
      heading: "An AI copilot that coaches you in the moment",
      body: "Tonvo monitors every second of your call, translating vocal cues into actionable prompts. When a prospect hesitates, you get a suggested reframe. When they signal excitement, you see a prompt to advance the deal. After the call, a full analysis helps you refine your approach for next time.",
    },
    features: [
      {
        icon: "zap",
        title: "Live Objection Alerts",
        description:
          "Instant notifications when the buyer raises price, timing, or competitor objections, paired with suggested responses.",
      },
      {
        icon: "eye",
        title: "Buyer Sentiment Timeline",
        description:
          "A real-time sentiment graph that shows when the prospect is engaged, neutral, or pulling away so you can adjust mid-call.",
      },
      {
        icon: "target",
        title: "Opportunity Signals",
        description:
          "Automatic detection of buying signals like budget confirmation, urgency cues, and champion language so you know when to close.",
      },
      {
        icon: "bar-chart",
        title: "Post-Call Deal Analysis",
        description:
          "A session summary with talk-time ratio, key moments, and next-step recommendations to strengthen your follow-up.",
      },
    ],
    stats: [],
  },

  // ─── 2. Customer Support Tone Detection ───
  {
    type: "use-cases",
    slug: "customer-support-tone-detection",
    title: "Customer Support Tone Detection — Resolve Issues Before They Escalate",
    metaDescription:
      "Detect frustrated or confused customers in real time with Tonvo. AI tone analysis helps support teams de-escalate calls and boost satisfaction scores.",
    h1: "Detect Customer Frustration Before It Escalates",
    subtitle:
      "Tonvo uses real-time tone and sentiment analysis to flag frustrated or confused customers the moment their mood shifts. Support agents get live de-escalation suggestions to resolve issues faster and protect your CSAT score.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Meeting Communication" },
    ],
    targetKeywords: [
      "customer support tone detection",
      "ai frustration detection",
      "real-time sentiment analysis support",
      "call center ai assistant",
      "customer mood detection software",
      "support de-escalation ai",
    ],
    faq: [
      {
        question: "How does Tonvo detect customer frustration?",
        answer:
          "When these indicators cross a frustration threshold, it alerts the agent with a contextual de-escalation suggestion within milliseconds.",
      },
      {
        question: "Can managers see frustration trends across the team?",
        answer:
          "Yes.",
      },
      {
        question: "Does Tonvo work with existing support platforms?",
        answer:
          "Tonvo captures audio from Zoom, Google Meet, and Discord. If your support calls run on one of these platforms, Tonvo works alongside your existing ticketing and CRM tools without requiring a separate integration.",
      },
      {
        question: "Will Tonvo slow down my support workflow?",
        answer:
          "No. Agents see coaching prompts in a sidebar without leaving their current workflow or switching applications.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Agents recognize frustration too late to prevent escalation",
      body: "By the time a support agent notices a customer is upset, the conversation has often passed the point of easy recovery. Missed vocal cues lead to longer handle times, escalations to supervisors, and lower satisfaction scores—costing your team both time and trust.",
    },
    solution: {
      label: "The Solution",
      heading: "AI-powered tone alerts that keep every call on track",
      body: "Tonvo continuously monitors the customer's vocal tone and flags rising frustration within milliseconds. Agents receive live prompts with empathy phrases, clarifying questions, and resolution shortcuts tailored to the detected mood, turning potential escalations into positive outcomes.",
    },
    features: [
      {
        icon: "heart",
        title: "Emotion Detection Alerts",
        description:
          "Real-time flags for frustration, confusion, and satisfaction shifts so agents can adjust their approach immediately.",
      },
      {
        icon: "message",
        title: "De-Escalation Prompts",
        description:
          "Context-aware suggestions like empathy statements and resolution steps delivered the moment frustration is detected.",
      },
      {
        icon: "bar-chart",
        title: "Conversation Summaries",
        description:
          "After each session, a summary with the tone of the conversation, what went well and suggested follow-up actions.",
      },
      {
        icon: "clock",
        title: "Faster Resolution Times",
        description:
          "Early intervention reduces average handle time by addressing root concerns before the customer disengages.",
      },
    ],
    stats: [],
  },

  // ─── 3. AI Coaching for Job Interviews ───
  {
    type: "use-cases",
    slug: "ai-coaching-for-job-interviews",
    title: "AI Coaching for Job Interviews — Ace Your Next Interview",
    metaDescription:
      "Prepare for job interviews with Tonvo's real-time AI coaching. Get live feedback on your tone, confidence, clarity, and pacing to land your next offer.",
    h1: "Land Your Next Job with Real-Time Interview Coaching",
    subtitle:
      "Tonvo provides live feedback on your tone, confidence, and pacing during mock and real interviews. Review your performance with a detailed post-session analysis and walk into every interview fully prepared.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "freelancer-client-call-assistant", label: "Freelancer Client Call Assistant" },
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
    ],
    targetKeywords: [
      "ai interview coaching",
      "real-time interview feedback",
      "job interview preparation ai",
      "interview tone analysis",
      "ai mock interview tool",
      "interview confidence coaching",
    ],
    faq: [
      {
        question: "Can I use Tonvo during a real interview?",
        answer:
          "Yes. Tonvo runs as a discreet overlay on your screen during Zoom, Meet, or Discord calls. It provides subtle coaching prompts about your tone and pacing that only you can see. Always check the employer's recording policy first.",
      },
      {
        question: "What feedback does Tonvo give during an interview?",
        answer:
          "It provides real-time nudges—like slowing down when you rush or projecting more confidence when your tone drops—and a full analysis after the session.",
      },
      {
        question: "Is there a free tier I can use for interview prep?",
        answer:
          "Absolutely. Tonvo's Free plan includes 3 sessions per month at no cost, which is ideal for practicing before key interviews. Upgrade to Plus at $19/month for unlimited sessions and deeper analytics.",
      },
      {
        question: "How does the post-interview analysis work?",
        answer:
          "You can review specific timestamps and track improvement across sessions.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Interview nerves undermine qualified candidates",
      body: "Traditional mock interviews lack the real-time, objective feedback needed to build lasting habits before the high-stakes call.",
    },
    solution: {
      label: "The Solution",
      heading: "A personal interview coach that listens in real time",
      body: "After the call, a detailed performance breakdown helps you improve systematically.",
    },
    features: [
      {
        icon: "mic",
        title: "Confidence & Tone Tracking",
        description:
          "A short read on the moment as the conversation unfolds, so you can stay calm and answer with confidence.",
      },
      {
        icon: "clock",
        title: "Live Reply Suggestions",
        description:
          "Ready-to-say replies written for what was just said, so you are never stuck for an answer.",
      },
      {
        icon: "bar-chart",
        title: "Session-Over-Session Progress",
        description:
          "Track improvements in confidence, clarity, and pacing across multiple practice sessions with trend visualizations.",
      },
    ],
    stats: [],
  },

  // ─── 4. Team Meeting Engagement Tracking ───
  {
    type: "use-cases",
    slug: "team-meeting-engagement-tracking",
    title: "Team Meeting Engagement Tracking — Keep Every Meeting Productive",
    metaDescription:
      "Track participation and engagement in team meetings with Tonvo. AI-powered analysis reveals who's disengaged so managers can run more productive meetings.",
    h1: "Track Real-Time Engagement to Run Better Team Meetings",
    subtitle:
      "Tonvo monitors participation, energy levels, and engagement signals during team meetings. Managers get a live dashboard and post-meeting report to identify disengaged team members and improve meeting culture.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Meeting Communication" },
    ],
    targetKeywords: [
      "meeting engagement tracking",
      "team meeting analytics",
      "ai meeting productivity tool",
      "track meeting participation",
      "meeting engagement software",
      "remote meeting engagement",
    ],
    faq: [
      {
        question: "How does Tonvo measure engagement during meetings?",
        answer:
          "Tonvo tracks multiple signals: speaking time distribution, vocal energy levels, response latency, and interaction frequency. These indicators are combined into an engagement score for each participant, updated in real time.",
      },
      {
        question: "Can team members see their own engagement data?",
        answer:
          "On the Team plan, administrators can configure visibility settings. Individual contributors can see their own metrics for self-improvement, while managers get the aggregate team view for coaching purposes.",
      },
      {
        question: "Does Tonvo require each team member to install the app?",
        answer:
          "Only the meeting host needs Tonvo running to capture the session's audio. Individual engagement metrics are derived from voice analysis of the shared audio stream, so participants do not need to install anything.",
      },
      {
        question: "What actions can I take based on engagement data?",
        answer:
          "Tonvo's post-meeting report highlights low-engagement participants, unbalanced talk-time ratios, and energy dips. Managers use this data to adjust meeting formats, shorten agendas, or have targeted 1:1 follow-ups.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Managers can't tell who's checked out in virtual meetings",
      body: "Remote and hybrid meetings make it nearly impossible to gauge engagement through body language alone. Low-participation meetings waste time, breed miscommunication, and quietly erode team alignment—but most managers only realize there's a problem after the damage is done.",
    },
    solution: {
      label: "The Solution",
      heading: "Live engagement scoring powered by voice intelligence",
      body: "Tonvo analyzes every participant's vocal signals—speaking frequency, energy, and response timing—to produce a real-time engagement dashboard. After the meeting, a detailed report reveals participation imbalances and energy drops so you can iterate on your meeting format.",
    },
    features: [
      {
        icon: "users",
        title: "Participation Balance View",
        description:
          "See exactly how speaking time is distributed across participants with a live breakdown, updated every 30 seconds.",
      },
      {
        icon: "trending-up",
        title: "Energy & Engagement Scores",
        description:
          "Per-participant engagement scores based on vocal energy, interaction frequency, and response latency throughout the meeting.",
      },
      {
        icon: "bar-chart",
        title: "Post-Meeting Engagement Report",
        description:
          "A downloadable summary with engagement trends, silent participants, energy dips, and actionable recommendations.",
      },
      {
        icon: "search",
        title: "Meeting Format Insights",
        description:
          "Aggregate analytics across meetings to identify which formats, times, and durations yield the highest engagement.",
      },
    ],
    stats: [],
  },

  // ─── 5. Freelancer Client Call Assistant ───
  {
    type: "use-cases",
    slug: "freelancer-client-call-assistant",
    title: "Freelancer Client Call Assistant — Win and Retain More Clients",
    metaDescription:
      "Tonvo helps freelancers and consultants read client sentiment during calls. Get live coaching to handle scope creep, negotiate rates, and build trust.",
    h1: "Read Your Clients Better and Win More Freelance Work",
    subtitle:
      "Tonvo gives freelancers and independent consultants real-time insight into client sentiment during calls. Detect hesitation around pricing, spot scope-creep signals early, and get coaching prompts to keep conversations productive and professional.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "AI Copilot for Sales Calls" },
    ],
    targetKeywords: [
      "freelancer call assistant",
      "client call ai tool",
      "freelance negotiation ai",
      "consultant call coaching",
      "client sentiment analysis",
      "freelancer communication tool",
    ],
    faq: [
      {
        question: "How does Tonvo help freelancers specifically?",
        answer:
          "Freelancers handle sales, project management, and delivery solo. Tonvo acts as a second set of ears—detecting client hesitation around pricing, flagging scope-creep language, and suggesting professional responses so you maintain boundaries while keeping clients happy.",
      },
      {
        question: "Can Tonvo help me negotiate better rates?",
        answer:
          "Yes. Tonvo detects when a client hesitates or shows resistance to pricing. It provides real-time coaching prompts with reframing techniques, value anchoring language, and confidence cues to help you hold your rate with professionalism.",
      },
      {
        question: "Is the Free plan enough for a freelancer?",
        answer:
          "The Free plan gives you 3 sessions per month, which works well for occasional client calls. Most active freelancers find the Plus plan at $19/month worthwhile for unlimited sessions and deeper post-call analytics.",
      },
      {
        question: "Does Tonvo store my client conversations?",
        answer:
          "Tonvo processes audio in real time for analysis but does not record or store raw audio. Post-session reports contain aggregated insights and timestamps, not transcripts, ensuring client confidentiality.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Freelancers lose deals and margin by misreading clients",
      body: "Without a team to debrief with, freelancers rely on gut instinct during client calls. Missed hesitation signals lead to underpriced proposals, undetected scope creep erodes margins, and awkward silences after pricing discussions cost winnable projects.",
    },
    solution: {
      label: "The Solution",
      heading: "Your personal AI advisor for every client conversation",
      body: "Tonvo monitors client sentiment throughout the call and delivers targeted prompts—when to hold firm on pricing, when to offer a concession, and when to redirect a scope-creep conversation. After the call, a summary highlights key moments and recommended next steps.",
    },
    features: [
      {
        icon: "shield",
        title: "Scope Creep Detection",
        description:
          "Automatic alerts when client language signals expanding requirements beyond the agreed scope, with boundary-setting suggestions.",
      },
      {
        icon: "target",
        title: "Pricing Confidence Coaching",
        description:
          "Real-time prompts when client tone shifts during rate discussions, helping you anchor value and negotiate with confidence.",
      },
      {
        icon: "brain",
        title: "Client Mood Insights",
        description:
          "Continuous sentiment tracking that shows when a client is enthusiastic, uncertain, or disengaged so you can adapt instantly.",
      },
    ],
    stats: [],
  },

  // ─── 6. SDR Onboarding with Call Review ───
  {
    type: "use-cases",
    slug: "sdr-onboarding-with-call-review",
    title: "SDR Onboarding with AI Call Review — Ramp Reps 2x Faster",
    metaDescription:
      "Accelerate SDR onboarding with Tonvo's AI-powered call review. New sales reps get real-time coaching and post-call analysis to ramp and hit quota faster.",
    h1: "Ramp New SDRs Faster with AI-Powered Call Review",
    subtitle:
      "Tonvo helps sales development teams onboard new reps by providing real-time coaching during live calls and detailed post-session analysis for manager review. Reduce ramp time, standardize messaging, and get new hires to quota faster.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "AI Copilot for Sales Calls" },
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
    ],
    targetKeywords: [
      "sdr onboarding tool",
      "ai call review for sales",
      "sales rep ramp time",
      "sdr coaching software",
      "new hire sales training ai",
      "call review for onboarding",
    ],
    faq: [
      {
        question: "How does Tonvo reduce SDR ramp time?",
        answer:
          "New SDRs receive live coaching prompts during their actual calls—objection-handling cues, messaging reminders, and tone guidance. Managers review post-call analyses to provide targeted feedback, replacing time-intensive call shadowing with scalable AI-assisted coaching.",
      },
      {
        question: "Can managers review specific call moments?",
        answer:
          "Yes. Post-session reports include a timestamped timeline of key moments—objections raised, sentiment shifts, missed opportunities—so managers can jump directly to coachable moments instead of listening to entire recordings.",
      },
      {
        question: "How is this different from call recording tools?",
        answer:
          "Traditional recording tools require managers to review full calls after the fact. Tonvo provides coaching in real time during the call and generates structured analyses that highlight the exact moments that matter, saving hours of review time per week.",
      },
      {
        question: "What pricing works for an SDR team?",
        answer:
          "It is designed specifically for teams that need coaching at scale.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "New SDRs take months to ramp and managers can't scale coaching",
      body: "The average SDR takes 3-4 months to reach full productivity. Managers can only shadow a fraction of live calls, leaving new reps to make repeated mistakes. Call recordings pile up unreviewed, and generic training materials fail to address individual weaknesses.",
    },
    solution: {
      label: "The Solution",
      heading: "AI coaching on every call, structured review for every manager",
      body: "Tonvo gives each new SDR a personal AI coach that provides guidance during every call—not just the ones a manager can attend. After each session, managers receive a structured analysis highlighting specific coaching opportunities, making feedback targeted and scalable.",
    },
    features: [
      {
        icon: "layers",
        title: "Structured Call Analysis",
        description:
          "Post-call reports organized by talk-time ratio, objection handling, messaging adherence, and sentiment progression for easy manager review.",
      },
      {
        icon: "zap",
        title: "Real-Time Rep Coaching",
        description:
          "Live prompts that guide new reps through objections, qualifying questions, and next-step suggestions during actual prospect calls.",
      },
      {
        icon: "trending-up",
        title: "Ramp Progress Tracking",
        description:
          "Dashboards that show each SDR's improvement trajectory across key metrics—confidence, objection handling, and talk ratio—over time.",
      },
      {
        icon: "users",
        title: "Manager Review Queue",
        description:
          "A prioritized queue of sessions that need attention, sorted by coaching opportunity density so managers focus on high-impact reviews.",
      },
    ],
    stats: [],
  },

  // ─── 7. User Research Interview Insights ───
  {
    type: "use-cases",
    slug: "user-research-interview-insights",
    title: "User Research Interview Insights — Capture What Users Really Mean",
    metaDescription:
      "Tonvo detects sentiment and hesitation during user research interviews. PMs and UX researchers capture deeper insights without missing subtle signals.",
    h1: "Capture Deeper User Research Insights with AI Sentiment Detection",
    subtitle:
      "Tonvo helps product managers and UX researchers detect real user sentiment during research interviews. Catch hesitation, enthusiasm, and confusion in real time so you build products based on what users actually feel, not just what they say.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "team-meeting-engagement-tracking", label: "Meeting Engagement Tracking" },
    ],
    targetKeywords: [
      "user research sentiment analysis",
      "ux research ai tool",
      "user interview insights",
      "product research ai",
      "qualitative research sentiment",
      "user research interview tool",
    ],
    faq: [
      {
        question: "How does Tonvo help during user research interviews?",
        answer:
          "Tonvo monitors the participant's vocal tone throughout the interview, flagging moments of genuine enthusiasm, hesitation, confusion, or frustration. These sentiment markers are overlaid on a timeline so researchers can identify the most insightful moments instantly.",
      },
      {
        question: "Can I tag and annotate key moments?",
        answer:
          "Tonvo's post-session analysis automatically highlights sentiment-significant moments with timestamps. Researchers can use these markers to jump directly to the most meaningful parts of the conversation when synthesizing findings.",
      },
      {
        question: "Is this useful for moderated usability tests?",
        answer:
          "Yes. During moderated sessions, Tonvo detects confusion and frustration in the participant's voice, alerting the researcher to probe deeper on specific tasks or features that are causing friction—even when the participant doesn't explicitly say so.",
      },
      {
        question: "How does Tonvo compare to traditional research note-taking?",
        answer:
          "Manual notes are subject to researcher bias and missed moments. Tonvo provides an objective, continuous sentiment layer that captures signals human note-takers often miss, especially in back-to-back interview sessions where fatigue sets in.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Researchers miss the gap between what users say and what they feel",
      body: "Users often say 'it's fine' while their tone reveals frustration. In rapid-fire interview sessions, researchers focus on asking the next question and miss subtle vocal cues. Critical insights about product friction, confusion, and delight go uncaptured—leading to decisions based on incomplete data.",
    },
    solution: {
      label: "The Solution",
      heading: "Real-time sentiment detection that reveals true user feelings",
      body: "Tonvo analyzes participant vocal patterns throughout each interview, flagging moments where expressed sentiment diverges from stated opinions. Researchers see a live sentiment feed during the session and receive a comprehensive analysis afterward, making synthesis faster and more accurate.",
    },
    features: [
      {
        icon: "search",
        title: "Say-Feel Gap Detection",
        description:
          "Identifies moments where a participant's tone contradicts their words, revealing hidden friction points and unspoken preferences.",
      },
      {
        icon: "eye",
        title: "Live Sentiment Overlay",
        description:
          "A real-time sentiment stream visible during the interview so researchers can probe deeper on emotionally significant topics.",
      },
      {
        icon: "brain",
        title: "Insight Synthesis Report",
        description:
          "Post-session analysis with categorized sentiment moments, theme clusters, and participant-level insight summaries for faster synthesis.",
      },
      {
        icon: "check",
        title: "Cross-Interview Patterns",
        description:
          "Aggregate analysis across multiple interviews to surface recurring sentiment patterns and validate or challenge hypotheses.",
      },
    ],
    stats: [],
  },

  // ─── 8. Remote Meeting Communication ───
  {
    type: "use-cases",
    slug: "remote-meeting-communication",
    title: "Remote Meeting Communication — Communicate Clearly Across Distance",
    metaDescription:
      "Improve remote team communication with Tonvo's AI. Real-time tone feedback and engagement analysis help distributed teams collaborate more effectively.",
    h1: "Communicate More Effectively in Every Remote Meeting",
    subtitle:
      "Tonvo helps remote and distributed teams overcome the communication barriers of virtual meetings. Get real-time feedback on tone clarity, engagement levels, and conversational dynamics to ensure every voice is heard and every message lands.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "team-meeting-engagement-tracking", label: "Meeting Engagement Tracking" },
    ],
    targetKeywords: [
      "remote meeting communication",
      "virtual meeting ai tool",
      "remote team communication",
      "distributed team meeting tool",
      "improve virtual meetings",
      "remote collaboration ai",
    ],
    faq: [
      {
        question: "How does Tonvo improve remote communication?",
        answer:
          "Tonvo analyzes tone, pacing, and conversational dynamics in real time. It alerts participants when their tone comes across as flat or unclear, flags when someone hasn't spoken in a while, and provides a post-meeting report on communication effectiveness.",
      },
      {
        question: "Does Tonvo work across different time zones?",
        answer:
          "Yes. Tonvo processes audio locally on the host's device and delivers insights in real time regardless of participant locations. Post-meeting reports are generated instantly after the session ends and accessible to all authorized team members.",
      },
      {
        question: "Can Tonvo help non-native English speakers?",
        answer:
          "Tonvo's tone and clarity feedback is particularly valuable for non-native speakers. It provides real-time nudges about pacing and clarity that help team members communicate more effectively, building confidence in multilingual environments.",
      },
      {
        question: "What's the difference between this and a transcription tool?",
        answer:
          "Transcription captures what was said. Tonvo captures how it was said—tone, confidence, engagement, and emotional dynamics. These complementary layers give teams a complete picture of communication quality, not just content.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Remote meetings lose nuance and erode team connection",
      body: "Without in-person cues, remote meetings suffer from misread tones, uneven participation, and passive attendees. Over time, these small communication gaps compound into misalignment, low morale, and decisions made without full team input.",
    },
    solution: {
      label: "The Solution",
      heading: "AI-powered communication feedback for distributed teams",
      body: "Tonvo gives every remote meeting participant insight into how they communicate—not just what they say. Real-time tone and engagement feedback helps individuals adjust on the fly, while post-meeting analytics give team leads the data to improve meeting culture across the organization.",
    },
    features: [
      {
        icon: "globe",
        title: "Tone Clarity Feedback",
        description:
          "Real-time alerts when your delivery sounds flat, rushed, or unclear, helping you communicate with intention even through a screen.",
      },
      {
        icon: "users",
        title: "Participation Equity Tracking",
        description:
          "Live visibility into who has and hasn't contributed, enabling facilitators to bring quieter voices into the conversation.",
      },
      {
        icon: "monitor",
        title: "Communication Health Dashboard",
        description:
          "Post-meeting analytics on tone balance, engagement distribution, and conversational dynamics for continuous improvement.",
      },
      {
        icon: "headphones",
        title: "Personal Communication Score",
        description:
          "An individual score based on clarity, energy, and engagement that helps team members track and improve their remote communication skills.",
      },
    ],
    stats: [],
  },
];
