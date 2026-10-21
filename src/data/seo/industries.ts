import type { IndustryEntry } from "./types";

export const industries: IndustryEntry[] = [
  // ── 1. SaaS Sales Teams ──────────────────────────────────────────────
  {
    type: "industries",
    slug: "saas-sales-teams",
    title: "Tonvo for SaaS Sales Teams | AI Conversation Copilot",
    metaDescription:
      "Tonvo helps SaaS sales teams close more deals with real-time tone detection, live coaching prompts, and post-call analytics on every discovery and demo call.",
    h1: "Close More SaaS Deals with Real-Time Conversation Intelligence",
    subtitle:
      "Tonvo analyzes every sales call in real time, coaching your reps on tone, objection handling, and engagement so pipeline velocity increases from day one.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "AI Copilot for Sales Calls" },
      { type: "use-cases", slug: "sdr-onboarding-with-call-review", label: "SDR Onboarding with Call Review" },
    ],
    targetKeywords: [
      "saas sales call coaching",
      "ai copilot for sales teams",
      "real-time sales conversation intelligence",
      "tone detection sales calls",
      "sales call analytics software",
    ],
    faq: [
      {
        question: "How does Tonvo help SaaS sales reps close more deals?",
        answer:
          "Tonvo listens to your calls on Zoom, Meet, or Discord and surfaces real-time coaching cues such as objection-handling prompts, pacing reminders, and sentiment shifts so reps can adjust mid-call instead of reviewing mistakes after the fact.",
      },
      {
        question: "Can managers review call performance across the team?",
        answer:
          "Yes. On the Team plan ($49/user/mo) managers get aggregated post-session analytics, including talk-time ratios, sentiment trends, and engagement scores for every rep.",
      },
      {
        question: "Does Tonvo integrate with my existing sales stack?",
        answer:
          "It requires no CRM plugin to start delivering value, though you can export session summaries to feed into your CRM workflow.",
      },
      {
        question: "Is there a free trial for sales teams?",
        answer:
          "Tonvo's Free plan includes 3 sessions per month so you can evaluate real-time coaching and sentiment detection before upgrading to Plus ($19/mo) or Team ($49/user/mo).",
      },
    ],
    industryName: "SaaS Sales",
    painPoints: [
      "Reps miss buying signals and objection cues during fast-paced discovery calls",
      "Managers lack visibility into individual call quality without listening to every recording",
      "New SDRs take months to ramp because feedback only comes after the call ends",
      "Inconsistent talk-to-listen ratios lead to poor prospect engagement",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Real-Time Coaching That Moves the Revenue Needle",
      body: "When a prospect shows hesitation, Tonvo nudges your rep with a contextual coaching prompt. After the session, a full analytics report highlights what went well and where to improve, turning every call into a learning opportunity.",
    },
    features: [
      {
        icon: "zap",
        title: "Live Objection Alerts",
        description:
          "Detects negative sentiment shifts and prompts reps with objection-handling cues before the moment passes.",
      },
      {
        icon: "bar-chart",
        title: "Post-Call Analytics",
        description:
          "Breaks down talk-time ratio, sentiment arc, and engagement score so managers can coach with data, not guesswork.",
      },
      {
        icon: "brain",
        title: "Adaptive Coaching Prompts",
        description:
          "Context-aware suggestions adjust to the conversation stage, from discovery openers to closing techniques.",
      },
      {
        icon: "trending-up",
        title: "Pipeline Trend Dashboard",
        description:
          "Track call quality metrics over time and correlate coaching improvements with win-rate changes.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "ai-copilot-for-sales-calls",
      "sdr-onboarding-with-call-review",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 2. Customer Success Teams ────────────────────────────────────────
  {
    type: "industries",
    slug: "customer-success-teams",
    title: "Tonvo for Customer Success Teams | Reduce Churn with AI",
    metaDescription:
      "Tonvo detects at-risk sentiment in real time during customer calls, giving CS teams the signals they need to reduce churn and boost net retention.",
    h1: "Detect At-Risk Accounts Before They Churn",
    subtitle:
      "Tonvo monitors tone and sentiment on every customer call, alerting your CS team to frustration signals so they can course-correct in real time.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "customer-support-tone-detection", label: "Customer Support Tone Detection" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
    ],
    targetKeywords: [
      "customer success tone detection",
      "reduce churn ai",
      "real-time sentiment customer calls",
      "cs team conversation analytics",
      "ai copilot customer success",
    ],
    faq: [
      {
        question: "How does Tonvo help CS teams reduce churn?",
        answer:
          "Tonvo analyzes tone and sentiment during live customer calls. When frustration or disengagement is detected, your CS manager receives a real-time alert with suggested de-escalation language, allowing them to save the relationship before it deteriorates.",
      },
      {
        question: "Can Tonvo track customer sentiment over multiple sessions?",
        answer:
          "Yes. Post-session analytics are stored per account, letting CS teams view sentiment trends across renewal cycles and QBRs to identify accounts trending toward churn.",
      },
      {
        question: "Does Tonvo work for both 1:1 and group customer calls?",
        answer:
          "Absolutely. Tonvo supports multi-participant calls on Zoom, Meet, and Discord, analyzing each speaker's tone independently so you know exactly where dissatisfaction originates.",
      },
      {
        question: "What pricing plan do CS teams typically choose?",
        answer:
          "Individual CSMs can trial the Free plan (3 sessions/mo) first.",
      },
    ],
    industryName: "Customer Success",
    painPoints: [
      "Subtle frustration signals go unnoticed until the customer files a cancellation",
      "QBRs lack objective data on how customers truly feel about the product",
      "CS managers cannot monitor every call across a growing book of business",
      "Post-call notes are subjective and miss critical sentiment context",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Turn Every Customer Call into a Retention Signal",
      body: "When sentiment dips below a configurable threshold, your CS rep receives a discreet coaching nudge with de-escalation strategies. After the session, the sentiment timeline feeds into account health dashboards so leadership can prioritize at-risk accounts with confidence.",
    },
    features: [
      {
        icon: "heart",
        title: "Sentiment Health Score",
        description:
          "Each call generates a composite sentiment score that rolls up into an account health timeline visible to CS leadership.",
      },
      {
        icon: "message",
        title: "De-escalation Prompts",
        description:
          "Real-time suggestions help CS reps acknowledge frustration and steer the conversation toward resolution.",
      },
      {
        icon: "eye",
        title: "Multi-Speaker Analysis",
        description:
          "Independently tracks tone for every participant, isolating who is dissatisfied and why.",
      },
      {
        icon: "bar-chart",
        title: "Renewal Risk Reports",
        description:
          "Aggregate sentiment data across calls to flag accounts approaching renewal with declining satisfaction.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "customer-support-tone-detection",
      "team-meeting-engagement-tracking",
      "remote-meeting-communication",
    ],
  },

  // ── 3. Recruitment Agencies ──────────────────────────────────────────
  {
    type: "industries",
    slug: "recruitment-agencies",
    title: "Tonvo for Recruitment Agencies | AI Interview Copilot",
    metaDescription:
      "Tonvo gives recruiters real-time candidate sentiment analysis and structured post-interview insights to make faster, more confident hiring decisions.",
    h1: "Screen Candidates Faster with AI-Powered Interview Intelligence",
    subtitle:
      "Tonvo analyzes candidate tone, confidence, and engagement during live interviews, giving recruiters objective data to complement their gut instinct.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-coaching-for-job-interviews", label: "AI Coaching for Job Interviews" },
      { type: "use-cases", slug: "user-research-interview-insights", label: "Interview Insights" },
      { type: "industries", slug: "consulting-firms", label: "Consulting Firms" },
    ],
    targetKeywords: [
      "ai interview analysis",
      "recruitment call analytics",
      "candidate sentiment detection",
      "interview copilot recruiters",
      "hiring screening ai tool",
    ],
    faq: [
      {
        question: "How does Tonvo help recruiters during candidate screens?",
        answer:
          "Tonvo listens to your interview on Zoom, Meet, or Discord and provides real-time indicators of candidate confidence, enthusiasm, and hesitation. After the call, a structured report highlights engagement peaks and sentiment dips tied to specific questions.",
      },
      {
        question: "Is Tonvo appropriate for use in hiring processes?",
        answer:
          "Tonvo analyzes vocal tone and conversational dynamics, not content biases. It provides supplementary data that helps interviewers ask better follow-up questions, and it should be used alongside your existing evaluation frameworks.",
      },
      {
        question: "Can multiple interviewers in a panel use Tonvo simultaneously?",
        answer:
          "Yes. Tonvo tracks each speaker independently, so in a panel setting every interviewer and the candidate are analyzed separately, giving you a holistic view of the dynamic.",
      },
      {
        question: "What plan works best for recruitment agencies?",
        answer:
          "Solo recruiters can start with Plus ($19/mo) for unlimited sessions.",
      },
    ],
    industryName: "Recruitment & Staffing",
    painPoints: [
      "Interviewers rely on subjective impressions that introduce unconscious bias",
      "High-volume screening leaves little time for detailed post-interview analysis",
      "Candidate engagement and enthusiasm are hard to quantify consistently",
      "Debrief notes between panel members often conflict without shared data",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Objective Interview Data in Real Time",
      body: "Discreet prompts help interviewers probe deeper when hesitation is detected. Post-session, a structured scorecard with engagement metrics lets your hiring panel align quickly on candidate fit.",
    },
    features: [
      {
        icon: "search",
        title: "Candidate Confidence Tracker",
        description:
          "Monitors vocal steadiness and pacing to surface objective confidence indicators throughout the interview.",
      },
      {
        icon: "brain",
        title: "Follow-Up Question Prompts",
        description:
          "When hesitation or uncertainty is detected, Tonvo suggests targeted follow-up questions to dig deeper.",
      },
      {
        icon: "users",
        title: "Panel Alignment Reports",
        description:
          "Generates a shared scorecard after panel interviews so team members evaluate candidates from the same data set.",
      },
      {
        icon: "clock",
        title: "Time-to-Insight Reduction",
        description:
          "Structured post-interview reports eliminate hours of manual debrief, accelerating your hiring pipeline.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "ai-coaching-for-job-interviews",
      "user-research-interview-insights",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 4. Consulting Firms ──────────────────────────────────────────────
  {
    type: "industries",
    slug: "consulting-firms",
    title: "Tonvo for Consulting Firms | Client Session Intelligence",
    metaDescription:
      "Tonvo helps consultants read client sentiment in real time, deliver sharper recommendations, and produce structured session summaries automatically.",
    h1: "Deliver Higher-Impact Client Sessions with AI Conversation Intelligence",
    subtitle:
      "Tonvo gives consultants a real-time read on client sentiment and engagement, plus automatic post-session summaries that save hours of documentation.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "freelancer-client-call-assistant", label: "Client Call Assistant" },
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Meeting Communication" },
    ],
    targetKeywords: [
      "consulting call analytics",
      "client session sentiment analysis",
      "ai copilot for consultants",
      "consulting meeting intelligence",
      "real-time client engagement tracking",
    ],
    faq: [
      {
        question: "How does Tonvo improve consulting engagements?",
        answer:
          "Tonvo monitors client tone and engagement in real time during Zoom, Meet, or Discord sessions. If a client shows confusion or disengagement, Tonvo nudges the consultant to clarify or pivot, improving session outcomes and client satisfaction.",
      },
      {
        question: "Can Tonvo generate session summaries automatically?",
        answer:
          "Yes. After every session, Tonvo produces a structured analytics report including sentiment timeline, key discussion moments, and engagement metrics that can serve as the foundation for your client deliverable.",
      },
      {
        question: "Is Tonvo suitable for both solo consultants and large firms?",
        answer:
          "Solo practitioners can use the Plus plan ($19/mo) for unlimited sessions.",
      },
      {
        question: "Does Tonvo store or share client conversation content?",
        answer:
          "Tonvo analyzes tone and sentiment signals, not transcript content. Your client conversations remain private. Review our security documentation for full details on data handling.",
      },
    ],
    industryName: "Management Consulting",
    painPoints: [
      "Consultants miss subtle client dissatisfaction until feedback surveys arrive weeks later",
      "Session documentation is manual, time-consuming, and inconsistent across the team",
      "Junior consultants struggle to read the room in high-stakes client meetings",
      "Engagement quality varies widely between consultants with no objective benchmark",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Read the Room, Even on a Video Call",
      body: "Tonvo sits alongside your Zoom, Meet, or Discord session and continuously evaluates client engagement, confusion signals, and satisfaction levels. Real-time coaching prompts help consultants adjust their delivery on the fly. Post-session, a detailed analytics report gives you an objective baseline for session quality and client sentiment trends across an engagement.",
    },
    features: [
      {
        icon: "eye",
        title: "Client Engagement Radar",
        description:
          "Tracks real-time engagement signals so consultants know when to slow down, ask questions, or pivot topics.",
      },
      {
        icon: "layers",
        title: "Session Summary Reports",
        description:
          "Automatically generates structured session summaries with sentiment timelines and key moment highlights.",
      },
      {
        icon: "trending-up",
        title: "Engagement Benchmarking",
        description:
          "Compares session quality across consultants and engagements to establish objective performance baselines.",
      },
      {
        icon: "message",
        title: "Clarity Prompts",
        description:
          "Detects client confusion signals and prompts the consultant to rephrase or provide additional context.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "freelancer-client-call-assistant",
      "remote-meeting-communication",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 5. Tech Startups ─────────────────────────────────────────────────
  {
    type: "industries",
    slug: "tech-startups",
    title: "Tonvo for Tech Startups | AI Meeting Copilot for Small Teams",
    metaDescription:
      "Tonvo gives early-stage startups real-time conversation coaching on investor calls, customer discovery, and team syncs without adding headcount.",
    h1: "Ship Faster, Communicate Better with AI Conversation Intelligence",
    subtitle:
      "From investor pitches to customer discovery calls, Tonvo gives lean startup teams real-time coaching and post-session insights without another hire.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "AI Copilot for Sales Calls" },
      { type: "use-cases", slug: "user-research-interview-insights", label: "User Research Insights" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
    ],
    targetKeywords: [
      "startup meeting copilot",
      "ai conversation tool for startups",
      "investor pitch tone analysis",
      "customer discovery call analytics",
      "small team meeting intelligence",
    ],
    faq: [
      {
        question: "Why do early-stage startups need Tonvo?",
        answer:
          "Startups run on conversations: investor pitches, customer discovery, team stand-ups. Tonvo gives founders objective feedback on how those conversations land, so they iterate on communication as fast as they iterate on product.",
      },
      {
        question: "Can I use Tonvo on investor pitch calls?",
        answer:
          "Yes. Tonvo analyzes your tone, pacing, and the investor's engagement signals in real time during Zoom, Meet, or Discord calls, helping you adjust your delivery on the spot.",
      },
      {
        question: "What does Tonvo cost for a small startup?",
        answer:
          "The Free plan (3 sessions/mo) lets you test on your most important calls. Plus ($19/mo) unlocks unlimited sessions for a single user, ideal for solo founders. The Team plan ($49/user/mo) scales as you hire.",
      },
      {
        question: "Does Tonvo work for async or recorded calls?",
        answer:
          "Tonvo is optimized for live, real-time analysis on Zoom, Meet, and Discord. The value is in receiving coaching cues during the conversation when you can still act on them.",
      },
    ],
    industryName: "Tech Startups",
    painPoints: [
      "Founders wear many hats and have no dedicated sales or CS coach",
      "Investor pitch feedback comes too late to refine delivery for the next meeting",
      "Customer discovery calls lack structure and miss critical emotional signals",
      "Remote-first teams struggle with meeting engagement and alignment",
      "Limited budget means no room for expensive enterprise conversation tools",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "A Communication Coach That Scales with You",
      body: "Tonvo plugs into the tools startups already use: Zoom, Meet, and Discord. During any call, it monitors tone, pacing, and engagement for every participant. Founders get discreet nudges to slow down, clarify, or ask better questions. After the session, a concise analytics report becomes the objective record that replaces scattered notes and subjective recall.",
    },
    features: [
      {
        icon: "zap",
        title: "Pitch Delivery Coaching",
        description:
          "Real-time pacing and tone cues help founders deliver investor pitches with confidence and clarity.",
      },
      {
        icon: "search",
        title: "Discovery Call Insights",
        description:
          "Identifies emotional signals from prospects during customer discovery so founders validate the right pain points.",
      },
      {
        icon: "users",
        title: "Team Sync Engagement",
        description:
          "Tracks participation balance and engagement across stand-ups and retrospectives to keep remote teams aligned.",
      },
      {
        icon: "target",
        title: "Free Plan to Start",
        description:
          "Three free sessions per month let budget-conscious startups experience real-time coaching risk-free.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "ai-copilot-for-sales-calls",
      "user-research-interview-insights",
      "remote-meeting-communication",
    ],
  },

  // ── 6. Financial Services ────────────────────────────────────────────
  {
    type: "industries",
    slug: "financial-services",
    title: "Tonvo for Financial Services | Client Conversation Copilot",
    metaDescription:
      "Tonvo helps financial advisors follow client conversations, catch questions and signs of confusion, and review each session afterwards.",
    h1: "Clearer Client Conversations, Live",
    subtitle:
      "Tonvo follows advisor-client calls as they happen, with ready replies and a short read on the moment, so advisors can explain complex topics clearly.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "customer-support-tone-detection", label: "Tone Detection" },
      { type: "industries", slug: "healthcare-communication", label: "Healthcare Communication" },
    ],
    targetKeywords: [
      "financial advisor call analytics",
      "financial advisor conversation assistant",
      "ai tone detection financial services",
      "advisor client communication tool",
      "wealth management call coaching",
    ],
    faq: [
      {
        question: "Does Tonvo replace our compliance recording and review?",
        answer:
          "No. Tonvo is a conversation assistant for the advisor. It does not replace any recording, supervision or review that your regulator requires.",
      },
      {
        question: "Can Tonvo detect when a client is confused or hesitant about a recommendation?",
        answer:
          "Yes. Tonvo identifies hesitation and confusion signals in real time, prompting the advisor to pause and clarify, which helps ensure clients truly understand the recommendations being made.",
      },
      {
        question: "Is Tonvo suitable for regulated financial environments?",
        answer:
          "Tonvo transcribes the conversation to suggest replies, and sends that text to AI service providers to process it (see our Privacy Policy). Financial firms should evaluate it against their own regulatory, confidentiality and data-processing requirements before use.",
      },
      {
        question: "What does the post-session report include for financial advisors?",
        answer:
          "After a session, the report includes a summary, tone and engagement scores, what went well, and suggested follow-up actions.",
      },
    ],
    industryName: "Financial Services",
    painPoints: [
      "Advisors cannot objectively assess client understanding during complex product discussions",
      "Advisors have little time to prepare an answer when a client asks an unexpected question",
      "Client dissatisfaction surfaces only after formal complaints rather than during the conversation",
      "Junior advisors need coaching but supervisors cannot attend every client call",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Support for the Advisor in the Moment",
      body: "Tonvo follows advisor-client calls on Zoom, Meet or any call whose audio you can share, and puts ready replies and a short read on the moment next to the call. When the client seems unsure, the advisor gets a prompt to pause and clarify. After the session, the advisor gets a summary and suggested follow-up actions.",
    },
    features: [
      {
        icon: "shield",
        title: "Built to Assist, Not to Replace Review",
        description:
          "Tonvo helps the advisor in the moment. It is not a recording or supervision system.",
      },
      {
        icon: "eye",
        title: "Client Understanding Signals",
        description:
          "Detects confusion and hesitation in real time so advisors can ensure clients fully understand recommendations.",
      },
      {
        icon: "bar-chart",
        title: "Session Summaries",
        description:
          "After each session, a summary with scores and suggested follow-ups.",
      },
      {
        icon: "brain",
        title: "Advisor Coaching Nudges",
        description:
          "Real-time prompts help junior advisors adopt the communication patterns of top performers.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "customer-support-tone-detection",
      "remote-meeting-communication",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 7. Healthcare Communication ──────────────────────────────────────
  {
    type: "industries",
    slug: "healthcare-communication",
    title: "Tonvo for Healthcare | Improve Provider-Patient Communication",
    metaDescription:
      "Tonvo helps healthcare providers communicate with empathy and clarity during telehealth calls with real-time tone coaching and patient engagement analytics.",
    h1: "Better Provider-Patient Communication Through Real-Time AI Coaching",
    subtitle:
      "Tonvo analyzes tone and engagement during telehealth sessions, coaching providers to communicate with the empathy and clarity patients deserve.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Meeting Communication" },
      { type: "industries", slug: "financial-services", label: "Financial Services" },
    ],
    targetKeywords: [
      "telehealth communication tool",
      "patient sentiment analysis",
      "healthcare tone detection ai",
      "provider patient call coaching",
      "empathetic communication healthcare",
    ],
    faq: [
      {
        question: "How does Tonvo improve telehealth communication?",
        answer:
          "Tonvo monitors provider tone and patient engagement signals during video calls on Zoom or Meet. When a patient shows signs of confusion, anxiety, or disengagement, the provider receives a discreet coaching cue to adjust their communication approach.",
      },
      {
        question: "Does Tonvo comply with healthcare privacy regulations?",
        answer:
          "Tonvo has not been assessed against healthcare privacy regulations such as HIPAA, and it is not designed for clinical use. It transcribes the conversation and sends the text to AI service providers. Do not use it for conversations that contain protected health information unless your organization has reviewed and approved it.",
      },
      {
        question: "Can Tonvo help train new healthcare communicators?",
        answer:
          "Yes. Post-session analytics provide objective feedback on empathy signals, pacing, and patient engagement that training programs can use to accelerate communication skill development.",
      },
      {
        question: "What platforms does Tonvo support for telehealth?",
        answer:
          "Tonvo works with Zoom and Google Meet, which are the most common telehealth video platforms. It also supports Discord for team-internal training and debrief sessions.",
      },
    ],
    industryName: "Healthcare & Telehealth",
    painPoints: [
      "Providers struggle to gauge patient understanding and emotional state through a screen",
      "Telehealth visits feel impersonal, reducing patient trust and adherence",
      "Communication training programs lack objective metrics to measure improvement",
      "Patient anxiety goes unaddressed when providers focus on clinical information delivery",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Empathetic Communication, Coached in Real Time",
      body: "When it detects a communication gap, the provider receives a gentle nudge to slow down, express empathy, or check understanding. Post-session analytics help training programs benchmark and improve communication quality across the care team.",
    },
    features: [
      {
        icon: "heart",
        title: "Empathy Signal Detection",
        description:
          "Identifies moments where patients exhibit anxiety or distress, prompting providers to acknowledge emotions before continuing.",
      },
      {
        icon: "mic",
        title: "Pacing & Clarity Alerts",
        description:
          "Monitors speaking pace and complexity, nudging providers to slow down when patients show signs of information overload.",
      },
      {
        icon: "check",
        title: "Understanding Checkpoints",
        description:
          "Suggests natural moments to confirm patient comprehension, improving adherence to care instructions.",
      },
      {
        icon: "bar-chart",
        title: "Training Analytics Dashboard",
        description:
          "Provides communication quality metrics that training programs use to track provider improvement over time.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "customer-support-tone-detection",
      "remote-meeting-communication",
      "team-meeting-engagement-tracking",
    ],
  },

  // ── 8. Education & Training ──────────────────────────────────────────
  {
    type: "industries",
    slug: "education-training",
    title: "Tonvo for Education & Training | AI Coaching for Instructors",
    metaDescription:
      "Tonvo helps educators and corporate trainers improve learner engagement with real-time tone feedback and post-session participation analytics.",
    h1: "Elevate Teaching and Training with Real-Time Engagement Intelligence",
    subtitle:
      "Tonvo monitors learner engagement and instructor delivery in real time, giving educators and trainers the feedback they need to keep every session impactful.",
    lastModified: "2026-04-09",
    relatedSlugs: [
      { type: "use-cases", slug: "team-meeting-engagement-tracking", label: "Meeting Engagement Tracking" },
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Communication" },
      { type: "industries", slug: "consulting-firms", label: "Consulting Firms" },
    ],
    targetKeywords: [
      "teacher engagement analytics",
      "training session tone analysis",
      "ai coaching for educators",
      "corporate training conversation ai",
      "learner engagement detection",
    ],
    faq: [
      {
        question: "How does Tonvo help educators improve their sessions?",
        answer:
          "Tonvo monitors learner engagement signals during live Zoom, Meet, or Discord sessions. When participation drops or confusion is detected, the instructor receives a real-time cue to adjust pacing, invite questions, or switch approaches.",
      },
      {
        question: "Can Tonvo be used for corporate training programs?",
        answer:
          "Absolutely. Corporate L&D teams use Tonvo to coach facilitators, measure session engagement objectively, and identify which training modules resonate most with learners.",
      },
      {
        question: "Does Tonvo work for large group sessions?",
        answer:
          "Tonvo supports multi-participant calls and analyzes engagement across speakers. For large lectures, it tracks overall audience engagement signals and instructor delivery metrics.",
      },
      {
        question: "What plan is best for a training department?",
        answer:
          "Individual trainers can start with Plus ($19/mo) for unlimited personal sessions.",
      },
    ],
    industryName: "Education & Corporate Training",
    painPoints: [
      "Instructors cannot see learner faces or body language in large virtual sessions",
      "Training effectiveness is measured by completion rates, not actual engagement quality",
      "New facilitators lack real-time feedback to improve their delivery style",
      "Post-session evaluations are subjective and arrive too late to change outcomes",
      "Remote learning fatigue causes learners to disengage silently",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Know When Your Audience Is Engaged, Not Just Present",
      body: "Tonvo integrates with Zoom, Meet, and Discord to track vocal engagement, participation balance, and sentiment across every session participant. When the audience disengages, the instructor receives a discreet prompt to re-energize the room. Post-session analytics show exactly when engagement peaked and dipped, turning each session into a data-driven improvement opportunity.",
    },
    features: [
      {
        icon: "monitor",
        title: "Engagement Heatmap",
        description:
          "Visualizes participant engagement levels throughout the session, highlighting peaks and drop-off points.",
      },
      {
        icon: "zap",
        title: "Re-engagement Prompts",
        description:
          "Alerts instructors when audience engagement dips, suggesting interactive techniques to recapture attention.",
      },
      {
        icon: "users",
        title: "Participation Balance",
        description:
          "Tracks who is contributing and who is silent, helping facilitators draw in quieter participants.",
      },
      {
        icon: "trending-up",
        title: "Session-over-Session Trends",
        description:
          "Compares engagement metrics across sessions so trainers can measure the impact of delivery improvements.",
      },
    ],
    stats: [],
    useCaseLinks: [
      "team-meeting-engagement-tracking",
      "remote-meeting-communication",
      "sdr-onboarding-with-call-review",
    ],
  },
];
