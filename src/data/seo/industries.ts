import type { IndustryEntry } from "./types";

export const industries: IndustryEntry[] = [
  // ── 1. SaaS Sales Teams ──────────────────────────────────────────────
  {
    type: "industries",
    slug: "saas-sales-teams",
    title: "Tonvo for SaaS Sales Teams | Copilot for Every Call",
    metaDescription:
      "Tonvo follows your discovery calls and demos live, shows the buyer's question and suggests three replies you can use. Works from your mic or a shared tab.",
    h1: "Find the Right Words on Every Discovery Call and Demo",
    subtitle:
      "Tonvo follows your sales conversations as they happen, shows the question the buyer just asked and offers three replies. You decide what to say.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "AI Copilot for Sales Calls" },
      { type: "use-cases", slug: "sdr-onboarding-with-call-review", label: "SDR Onboarding with Call Review" },
    ],
    targetKeywords: [
      "ai copilot for sales calls",
      "what to say on a sales call",
      "live sales call assistant",
      "handle objections on a call",
      "saas demo call assistant",
    ],
    faq: [
      {
        question: "How does Tonvo help during a sales call?",
        answer:
          "Tonvo follows the conversation live and shows the question the other person just asked, three replies you can use and a short read on the moment. It suggests and you decide. It can be wrong, so treat it as a second opinion rather than a script.",
      },
      {
        question: "Does Tonvo join my Zoom or Meet calls?",
        answer:
          "No. Tonvo does not join calls as a bot and does not integrate with Zoom, Meet, Teams, Discord or any CRM. It listens through your microphone, or through the audio of a browser tab you share so it can hear both sides of an online call. You are responsible for informing the people you talk to and following the rules that apply.",
      },
      {
        question: "Does Tonvo offer dashboards for sales managers?",
        answer:
          "No. Tonvo is a copilot for the person on the call, so there are no manager dashboards or shared analytics. The Team plan ($49 per user a month) adds screen analysis of what you share on screen, such as chats and emails.",
      },
      {
        question: "Is there a free plan for sales reps?",
        answer:
          "Yes. The Free plan includes 3 live sessions a month, up to 5 minutes each, with detected questions, three replies and a session summary. Plus is $19 a month for unlimited sessions, and paid plans have a 7-day money-back guarantee.",
      },
    ],
    industryName: "SaaS Sales",
    painPoints: [
      "A buyer asks a pricing or security question you did not prepare for, and the pause shows",
      "Objections arrive mid-sentence and are easy to miss while you take notes",
      "Running a demo, a chat window and a conversation at once leaves little attention for what the buyer actually said",
      "Details and next steps blur together once the call is over",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "A Second Pair of Ears During the Call",
      body: "Open Tonvo in your browser and let it listen through your microphone, or share the tab your call runs in so it can hear both sides. It shows the question just asked, three ready-to-say replies and a short read on the moment. Pick sales mode, and after the session read a summary with what went well, what to improve and follow-up actions.",
    },
    features: [
      {
        icon: "message",
        title: "The Question, Spotted",
        description:
          "Shows the question the prospect just asked, so you answer what was said and not what you assumed.",
      },
      {
        icon: "zap",
        title: "Three Ready-to-Say Replies",
        description:
          "Each moment comes with three replies you can say as they are or adapt. You stay in charge of the conversation.",
      },
      {
        icon: "eye",
        title: "Signals on Plus and Team",
        description:
          "Paid plans flag questions, objections, opportunities, hesitation and agreement as the call unfolds.",
      },
      {
        icon: "bar-chart",
        title: "Session Summary",
        description:
          "After the session, read the tone, what went well, what to improve and the suggested follow-up actions.",
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
    title: "Tonvo for Customer Success | Copilot for Client Calls",
    metaDescription:
      "Tonvo follows onboarding, check-in and renewal calls live, shows the customer's question and suggests replies for tense moments. Mic or shared tab.",
    h1: "Stay Present on Every Customer Call",
    subtitle:
      "From onboarding to renewals and escalations, Tonvo follows what the customer says and offers replies for the tricky moments, so you can focus on the person.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "customer-support-tone-detection", label: "Customer Support Tone Detection" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
    ],
    targetKeywords: [
      "customer success call assistant",
      "what to say to an upset customer",
      "ai copilot for customer success",
      "renewal call preparation help",
      "handle escalation calls",
    ],
    faq: [
      {
        question: "How does Tonvo help during a customer call?",
        answer:
          "Tonvo follows the conversation live and shows the question the customer just asked, three replies you can use and a short read on the moment. When a call gets tense, the replies give you words to acknowledge the issue and move forward. You decide what to say, and Tonvo can be wrong.",
      },
      {
        question: "Does Tonvo track customer health across accounts?",
        answer:
          "No. Tonvo does not keep account records or aggregate analytics. Each session has its own summary with tone, what went well and follow-up actions, and paid plans keep your full session history so you can read earlier sessions again.",
      },
      {
        question: "Does Tonvo work for calls with several participants?",
        answer:
          "It works with the audio it can hear. If you share the browser tab your call runs in, it hears both sides of an online call, including several participants. On paid plans a talk balance shows who is speaking. Tonvo does not join the call or integrate with Zoom, Meet or Discord.",
      },
      {
        question: "Which plan do customer success teams start with?",
        answer:
          "Start on Free: 3 live sessions a month, up to 5 minutes each. Plus is $19 a month for unlimited sessions. Team is $49 per user a month and adds screen analysis of chats and emails you share on screen. Paid plans have a 7-day money-back guarantee.",
      },
    ],
    industryName: "Customer Success",
    painPoints: [
      "A frustrated customer asks a pointed question and the right words do not come",
      "Taking notes during a renewal or escalation call pulls attention away from the customer",
      "Customers jump between topics, and the question behind a comment is easy to miss",
      "Follow-up actions are hard to recall accurately after back-to-back calls",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Keep Up with the Conversation, Calmly",
      body: "Run Tonvo in the browser next to your customer call. It listens through your microphone or a shared tab, shows the question the customer just asked and three replies you can use, including for tense moments. Choose support mode for escalations. Afterward, the session summary lists the tone, what went well and follow-up actions.",
    },
    features: [
      {
        icon: "message",
        title: "Replies for Tense Moments",
        description:
          "Three ready-to-say replies help you acknowledge frustration and steer the conversation toward a next step.",
      },
      {
        icon: "eye",
        title: "Signals on Plus and Team",
        description:
          "Question, objection, hesitation and agreement signals help you notice what the customer is really saying.",
      },
      {
        icon: "headphones",
        title: "Support Mode",
        description:
          "Pick support mode for escalations and troubleshooting calls, or general mode for check-ins and renewals.",
      },
      {
        icon: "check",
        title: "Follow-Up Actions",
        description:
          "Each session summary lists suggested follow-up actions, so the next steps are on the page when the call ends.",
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
    title: "Tonvo for Recruiters | Copilot for Candidate Interviews",
    metaDescription:
      "Tonvo follows candidate screens and interviews live, shows the question just asked and suggests three replies. Recruitment mode, from mic or shared tab.",
    h1: "Stay Focused on the Candidate During Every Interview",
    subtitle:
      "Tonvo follows screening calls and interviews as they happen, so you can answer candidate questions clearly and keep your attention on the person, not your notes.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-coaching-for-job-interviews", label: "AI Coaching for Job Interviews" },
      { type: "use-cases", slug: "user-research-interview-insights", label: "Interview Insights" },
      { type: "industries", slug: "consulting-firms", label: "Consulting Firms" },
    ],
    targetKeywords: [
      "recruiter call assistant",
      "ai copilot for recruiters",
      "candidate screening call help",
      "answer candidate questions live",
      "interview call copilot",
    ],
    faq: [
      {
        question: "How does Tonvo help recruiters during candidate screens?",
        answer:
          "Tonvo follows the conversation live and shows the question the candidate just asked, with three replies you can use and a short read on the moment. Pick recruitment mode to tune it to interviews and screening calls. You decide what to say.",
      },
      {
        question: "Does Tonvo score or rank candidates?",
        answer:
          "No. Tonvo helps you follow the conversation and find your words. It does not rate or rank candidates, and it does not analyze voice pitch, pace or filler words. Your own judgment and evaluation process decide.",
      },
      {
        question: "Do I need to tell candidates I use Tonvo?",
        answer:
          "You are responsible for informing the people you talk to and for following the rules that apply, including consent and your workplace policies. Tonvo's guidance is to tell them. It does not join the call, it listens through your microphone or a shared browser tab.",
      },
      {
        question: "What plan works best for recruiters?",
        answer:
          "Start on Free with 3 live sessions a month, up to 5 minutes each. Plus ($19 a month) gives unlimited sessions, live translation and full history, which helps if you run many calls or interview in another language.",
      },
    ],
    industryName: "Recruitment & Staffing",
    painPoints: [
      "Candidates ask about pay, process or the client, and the answer you need is not at hand",
      "Taking notes during a screening call splits your attention between typing and listening",
      "Back-to-back calls blur together, making it hard to remember what each candidate said",
      "Calls in another language add effort to every question and answer",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Keep Your Attention on the Candidate",
      body: "Open Tonvo in your browser and let it listen through your microphone, or share the tab your video call runs in. It shows the question just asked, three replies you can use and a short read on the moment. After the call, the session summary gives you the tone, what went well and follow-up actions to read back.",
    },
    features: [
      {
        icon: "users",
        title: "Recruitment Mode",
        description:
          "Choose recruitment mode for screening calls and interviews, or switch to general mode for any other conversation.",
      },
      {
        icon: "message",
        title: "Questions and Ready Replies",
        description:
          "Shows the question a candidate just asked and three replies you can use, from role details to next steps.",
      },
      {
        icon: "globe",
        title: "Live Translation on Plus and Team",
        description:
          "Follow conversations in another language. Live transcription covers 10 languages, with live translation on paid plans.",
      },
      {
        icon: "check",
        title: "Session Summary",
        description:
          "Read back the tone, what went well, what to improve and suggested follow-up actions after each call.",
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
    title: "Tonvo for Consultants | Copilot for Client Meetings",
    metaDescription:
      "Tonvo follows client calls and workshops live, shows the question just asked and suggests three replies, with a summary after each session.",
    h1: "Follow Every Client Meeting and Find the Right Words",
    subtitle:
      "From kickoff calls to steering committees, Tonvo follows the discussion live, shows client questions and offers replies when you are put on the spot.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "freelancer-client-call-assistant", label: "Client Call Assistant" },
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Meeting Communication" },
    ],
    targetKeywords: [
      "ai assistant for consultants",
      "client meeting copilot",
      "consultant call assistant",
      "answer client questions live",
      "workshop facilitation assistant",
    ],
    faq: [
      {
        question: "How does Tonvo help consultants in client meetings?",
        answer:
          "Tonvo follows the discussion live and shows the question a client just asked, three replies you can use and a short read on the moment. It helps when you are put on the spot. You decide what to say, and it can be wrong.",
      },
      {
        question: "Can Tonvo produce a session summary?",
        answer:
          "Yes. After each session you get a summary with the tone, what went well, what to improve and suggested follow-up actions. It is a starting point for your own notes, not a finished client deliverable.",
      },
      {
        question: "Is Tonvo suitable for solo consultants and larger firms?",
        answer:
          "Each person uses their own account, and there are no shared firm dashboards. Plus ($19 a month) covers unlimited sessions for a solo consultant. Team ($49 per user a month) adds screen analysis of what you share on screen, such as chats and emails.",
      },
      {
        question: "Does Tonvo store client conversations?",
        answer:
          "Tonvo does not record or store audio. It transcribes the conversation live and sends that text to AI service providers to process it (see our Privacy Policy). The text of your sessions is kept so you can read it again. Check your client's confidentiality terms before using it.",
      },
    ],
    industryName: "Management Consulting",
    painPoints: [
      "A client asks a pointed question in a steering meeting and you need an answer worth saying out loud",
      "Leading a discussion while capturing what was decided splits your attention",
      "Junior consultants facing senior stakeholders can lose the thread under pressure",
      "Action items from a long session are hard to reconstruct accurately afterward",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Follow the Discussion While You Lead It",
      body: "Tonvo does not join your Zoom, Meet or Teams call. It listens through your microphone or a browser tab you share, and shows the question just asked, three replies you can use and a short read on the moment. Afterward, the session summary lists the tone, what went well and follow-up actions, so you can start your own notes from something concrete.",
    },
    features: [
      {
        icon: "message",
        title: "Questions and Ready Replies",
        description:
          "Shows the question a client just asked and three replies you can say as they are or adapt to your own view.",
      },
      {
        icon: "eye",
        title: "Signals on Plus and Team",
        description:
          "Paid plans flag questions, objections, hesitation and key points, and show a talk balance of who is speaking.",
      },
      {
        icon: "layers",
        title: "Session Summaries",
        description:
          "After each session, a summary with the tone, what went well, what to improve and follow-up actions.",
      },
      {
        icon: "monitor",
        title: "Screen Analysis on Team",
        description:
          "The Team plan reads what you share on screen, such as chats, DMs and emails, to help you reply.",
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
    title: "Tonvo for Startup Founders | Copilot for Key Calls",
    metaDescription:
      "Tonvo follows investor calls, customer discovery and early sales talks live and suggests three replies for the moment. Free to start, from mic or tab.",
    h1: "Find the Words for Pitches, Customer Calls and Hiring",
    subtitle:
      "Founders have a lot of high-stakes conversations and no script. Tonvo follows them live and suggests what to say, from investor calls to customer discovery.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "AI Copilot for Sales Calls" },
      { type: "use-cases", slug: "user-research-interview-insights", label: "User Research Insights" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
    ],
    targetKeywords: [
      "ai copilot for founders",
      "investor call assistant",
      "customer discovery call help",
      "what to say on an investor call",
      "startup conversation copilot",
    ],
    faq: [
      {
        question: "Why would a startup founder use Tonvo?",
        answer:
          "Startups run on conversations: investor calls, customer discovery, early sales, hiring. Tonvo follows them live, shows the question just asked and suggests three replies, so you can find your words without a coach on every call.",
      },
      {
        question: "Can I use Tonvo on an investor call?",
        answer:
          "Yes, on any call whose audio it can hear through your microphone or a shared browser tab. It shows the investor's question and three replies you can use. It suggests and you decide, and it does not replace knowing your own business. Tell the people you talk to that you use it.",
      },
      {
        question: "What does Tonvo cost for a small startup?",
        answer:
          "The Free plan gives 3 live sessions a month, up to 5 minutes each. Plus is $19 a month for unlimited sessions for one person. Team is $49 per user a month and adds screen analysis. Paid plans have a 7-day money-back guarantee.",
      },
      {
        question: "Does Tonvo work for written conversations too?",
        answer:
          "Yes. Paste the text of a conversation or upload screenshots, such as an email thread or a DM, and get help replying. This is available on all plans. For spoken conversations, Tonvo works live.",
      },
    ],
    industryName: "Tech Startups",
    painPoints: [
      "Investors ask hard questions fast, and there is no time to think",
      "Customer discovery calls drift, and the follow-up question you wanted to ask slips away",
      "Founders run sales, hiring and support conversations in the same week",
      "Early teams have no coach to look back with on how a conversation went",
      "A tight budget means a tool has to be easy to try before paying",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "One Copilot for the Conversations Founders Have",
      body: "Tonvo runs in the browser, so there is nothing to install on the call. It listens through your microphone or a shared tab and shows the question just asked, three ready-to-say replies and a short read on the moment. Switch between general, sales, recruitment, support and networking modes, and read a summary after each session.",
    },
    features: [
      {
        icon: "zap",
        title: "Questions and Ready Replies",
        description:
          "Shows the question you were just asked and three replies, so a hard question on a pitch does not leave you stuck.",
      },
      {
        icon: "layers",
        title: "Five Conversation Modes",
        description:
          "General, sales, recruitment, support and networking modes cover the range of calls a founder takes.",
      },
      {
        icon: "message",
        title: "Help with Written Conversations",
        description:
          "Paste text or upload screenshots of emails and messages and get help replying.",
      },
      {
        icon: "target",
        title: "Free Plan to Start",
        description:
          "Three free live sessions a month, up to 5 minutes each, let you test Tonvo on your most important calls.",
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
    title: "Tonvo for Financial Advisors | Client Conversation Copilot",
    metaDescription:
      "Tonvo helps advisors follow client meetings live, see the question just asked and find clear words for complex topics. Not a compliance or recording tool.",
    h1: "Clearer Client Conversations, Live",
    subtitle:
      "Tonvo follows advisor-client calls as they happen, with ready replies and a short read on the moment, so advisors can explain complex topics in plain words.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "customer-support-tone-detection", label: "Tone Detection" },
      { type: "industries", slug: "healthcare-communication", label: "Healthcare Communication" },
    ],
    targetKeywords: [
      "financial advisor conversation assistant",
      "advisor client meeting copilot",
      "explain complex topics to clients",
      "advisor client communication tool",
      "ai assistant for financial advisors",
    ],
    faq: [
      {
        question: "Does Tonvo replace our compliance recording and review?",
        answer:
          "No. Tonvo is a conversation assistant for the advisor. It does not replace any recording, supervision or review that your regulator requires.",
      },
      {
        question: "Can Tonvo tell when a client is confused or hesitant about a recommendation?",
        answer:
          "Sometimes it can flag a moment of hesitation, a question or an objection. Signals are available on Plus and Team, they are based on the transcribed text, and they can be wrong. Tonvo suggests, the advisor decides when to pause and clarify.",
      },
      {
        question: "Is Tonvo suitable for regulated financial environments?",
        answer:
          "Tonvo transcribes the conversation to suggest replies, and sends that text to AI service providers to process it (see our Privacy Policy). Financial firms should evaluate it against their own regulatory, confidentiality and data-processing requirements before use.",
      },
      {
        question: "What does the post-session summary include for financial advisors?",
        answer:
          "After a session, the summary includes the tone, what went well, what to improve and suggested follow-up actions.",
      },
    ],
    industryName: "Financial Services",
    painPoints: [
      "A client asks an unexpected question about a product, and the advisor has to answer clearly on the spot",
      "Explaining complex topics in plain language is hard while also following the client's reactions",
      "Taking notes during a meeting competes with listening",
      "Meetings in another language or with several people add effort to every answer",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Support for the Advisor in the Moment",
      body: "Tonvo does not join the call. It listens through your microphone or a shared browser tab, so it works alongside Zoom, Meet or any call whose audio you can share, and puts ready replies and a short read on the moment next to the call. On paid plans, signals such as hesitation can flag a moment worth a pause. After the session, the advisor gets a summary and suggested follow-up actions.",
    },
    features: [
      {
        icon: "shield",
        title: "Built to Assist, Not to Replace Review",
        description:
          "Tonvo helps the advisor in the moment. It is not a recording or supervision system.",
      },
      {
        icon: "message",
        title: "Questions and Ready Replies",
        description:
          "Shows the question the client just asked and three replies you can adapt, to help you explain clearly.",
      },
      {
        icon: "eye",
        title: "Signals on Plus and Team",
        description:
          "Paid plans flag questions, hesitation and key points in the conversation. Signals are suggestions and can be wrong.",
      },
      {
        icon: "bar-chart",
        title: "Session Summaries",
        description:
          "After each session, a summary with the tone, what went well and suggested follow-ups.",
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
    title: "Tonvo for Healthcare | Non-Clinical Conversation Copilot",
    metaDescription:
      "Tonvo follows non-clinical healthcare conversations live, like admin calls and team meetings, and suggests replies. Not designed for clinical use or PHI.",
    h1: "Clearer Words for Non-Clinical Healthcare Conversations",
    subtitle:
      "Tonvo follows live conversations such as scheduling calls, staff meetings and training sessions and suggests what to say. It is not designed for clinical use.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Meeting Communication" },
      { type: "industries", slug: "financial-services", label: "Financial Services" },
    ],
    targetKeywords: [
      "healthcare staff communication tool",
      "conversation assistant for admin calls",
      "healthcare team meeting assistant",
      "live translation for calls",
      "non-clinical conversation copilot",
    ],
    faq: [
      {
        question: "Can Tonvo be used in clinical conversations?",
        answer:
          "No. Tonvo is not designed for clinical use and is not a medical, diagnostic or recording tool. It is meant for non-clinical conversations such as administrative calls, staff meetings and training.",
      },
      {
        question: "Does Tonvo comply with healthcare privacy regulations?",
        answer:
          "Tonvo has not been assessed against healthcare privacy regulations such as HIPAA, and it is not designed for clinical use. It transcribes the conversation and sends the text to AI service providers. Do not use it for conversations that contain protected health information unless your organization has reviewed and approved it.",
      },
      {
        question: "What kinds of healthcare conversations does Tonvo fit?",
        answer:
          "Conversations that do not involve protected health information: scheduling and billing calls, staff meetings, training sessions, job interviews and conversations in another language. It suggests replies, and the person decides what to say.",
      },
      {
        question: "How does Tonvo hear a call?",
        answer:
          "Through your microphone, or through the audio of a browser tab you share. Tonvo does not join calls, does not integrate with Zoom or Meet, and does not record or store audio. You are responsible for informing the people you talk to and following your organization's rules.",
      },
    ],
    industryName: "Healthcare & Telehealth",
    painPoints: [
      "Administrative and billing calls bring unexpected questions that need a clear answer",
      "Staff meetings and training sessions move quickly, and it is hard to follow and contribute at once",
      "Conversations in another language add effort to every question and answer",
      "Trainers and managers lead session after session with little time to look back on how each went",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Find the Words in Everyday Conversations",
      body: "Open Tonvo in your browser and let it listen through your microphone or a shared tab. It shows the question just asked, three replies you can use and a short read on the moment, and a summary after the session. Do not use it for conversations that contain protected health information unless your organization has reviewed and approved it.",
    },
    features: [
      {
        icon: "message",
        title: "Questions and Ready Replies",
        description:
          "Shows the question just asked and three replies you can use, for admin calls, meetings and training.",
      },
      {
        icon: "globe",
        title: "Live Translation on Plus and Team",
        description:
          "Follow conversations in another language. Live transcription covers 10 languages, with live translation on paid plans.",
      },
      {
        icon: "check",
        title: "Session Summary",
        description:
          "After a session, read the tone, what went well, what to improve and suggested follow-up actions.",
      },
      {
        icon: "shield",
        title: "Not for Clinical Use",
        description:
          "Tonvo is a conversation copilot, not a clinical tool, and it has not been assessed against healthcare privacy regulations.",
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
    title: "Tonvo for Educators | Copilot for Lessons and Meetings",
    metaDescription:
      "Tonvo follows online lessons, workshops and parent meetings live, shows the question just asked and suggests replies. Works from your mic or a shared tab.",
    h1: "Find the Right Words When Learners Ask",
    subtitle:
      "From online lessons to workshops and parent-teacher meetings, Tonvo follows the conversation, shows the question just asked and suggests replies you can use.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "team-meeting-engagement-tracking", label: "Meeting Engagement Tracking" },
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Communication" },
      { type: "industries", slug: "consulting-firms", label: "Consulting Firms" },
    ],
    targetKeywords: [
      "ai assistant for teachers",
      "answer student questions live",
      "online lesson assistant",
      "parent teacher meeting help",
      "corporate trainer conversation assistant",
    ],
    faq: [
      {
        question: "How does Tonvo help educators during a session?",
        answer:
          "Tonvo follows the conversation live and shows the question a learner just asked, three replies you can use and a short read on the moment. You decide what to say, and it can be wrong, so check anything factual yourself.",
      },
      {
        question: "Can corporate trainers use Tonvo?",
        answer:
          "Yes, for the conversational parts of a session such as questions and discussion. Tonvo follows a conversation and helps you find your words. It does not measure learner engagement or give participation data.",
      },
      {
        question: "Does Tonvo work for large group sessions?",
        answer:
          "It works with the audio it can hear through your microphone or a shared browser tab. It is built to follow a conversation, not to track every participant in a class. On paid plans, a talk balance shows who is speaking.",
      },
      {
        question: "What plan is best for a teacher or trainer?",
        answer:
          "Start on Free: 3 live sessions a month, up to 5 minutes each. Plus is $19 a month for unlimited sessions and live translation, useful for multilingual groups. Paid plans have a 7-day money-back guarantee.",
      },
    ],
    industryName: "Education & Corporate Training",
    painPoints: [
      "A learner asks an unexpected question mid-lesson and the answer needs to be clear on the spot",
      "In large virtual sessions, questions arrive by voice and by chat while you are mid-explanation",
      "Parent-teacher and student meetings can be sensitive, and finding the right words matters",
      "Teaching in a second language or to a multilingual group adds effort",
      "Trainers run session after session with little time to look back on how each went",
    ],
    howTonvoHelps: {
      label: "How It Works",
      heading: "Keep Up with Questions, Whatever the Session",
      body: "Tonvo does not join your Zoom, Meet or Teams session. It listens through your microphone or a browser tab you share, and shows the question just asked, three replies you can use and a short read on the moment. Afterward, the session summary lists the tone, what went well, what to improve and follow-up actions.",
    },
    features: [
      {
        icon: "message",
        title: "Questions and Ready Replies",
        description:
          "Shows the question a learner just asked and three replies you can adapt, so you can answer clearly.",
      },
      {
        icon: "globe",
        title: "Live Translation on Plus and Team",
        description:
          "Follow a conversation in another language. Live transcription covers 10 languages, with live translation on paid plans.",
      },
      {
        icon: "monitor",
        title: "Screen Analysis on Team",
        description:
          "The Team plan reads what you share on screen, such as chat messages and emails, to help you reply.",
      },
      {
        icon: "check",
        title: "Session Summary",
        description:
          "After each session, read the tone, what went well, what to improve and suggested follow-up actions.",
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
