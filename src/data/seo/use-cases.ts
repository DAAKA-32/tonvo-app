import type { UseCaseEntry } from "./types";

export const useCases: UseCaseEntry[] = [
  // ─── 1. Sales calls ───
  {
    type: "use-cases",
    slug: "ai-copilot-for-sales-calls",
    title: "Live Help on Sales Calls: Replies as You Talk | Tonvo",
    metaDescription:
      "Tonvo follows your sales call and shows the buyer's question with three ready-to-say replies. Works from your mic or a shared tab. Free plan available.",
    h1: "A Copilot for Your Sales Calls",
    subtitle:
      "In the middle of a call, a buyer asks something and you need the right words. Tonvo shows the question that was just asked and three replies you can say. You decide what to use.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "sdr-onboarding-with-call-review", label: "SDR Onboarding with Call Review" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
    ],
    targetKeywords: [
      "sales call assistant",
      "what to say on a sales call",
      "handle sales objections live",
      "live sales call help",
      "ai copilot for sales calls",
      "sales call replies",
    ],
    faq: [
      {
        question: "How does Tonvo help me during a live sales call?",
        answer:
          "Tonvo follows the conversation as it happens. It shows the question the other person just asked, gives you three replies you can say, and adds a short read on the moment. It suggests and you decide. It can be wrong, so use your own judgment.",
      },
      {
        question: "Does the other person know Tonvo is running?",
        answer:
          "Tonvo does not join the call as a bot and does not add anything to the call. It listens through your microphone or the audio of a browser tab you share. You are responsible for informing the people you talk to and for following the rules that apply, such as consent and recording rules. Tonvo recommends telling them.",
      },
      {
        question: "Does Tonvo work with Zoom, Meet, or my CRM?",
        answer:
          "Tonvo has no integration with those tools. It is a web app that captures audio from your microphone or a shared browser tab, so it can run next to whatever call tool you use. On a phone it listens through the microphone only, so put the call on speaker.",
      },
      {
        question: "Can I review a sales call after it ends?",
        answer:
          "Yes. After each session you get a summary with the tone, what went well, what to improve, and follow-up actions. Tonvo does not record or store audio, but the text of your sessions is kept so you can read it again: 7 days of history on Free and full history on paid plans.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Hard questions arrive faster than you can think",
      body: "On a live call you listen, keep rapport, take in a question, and plan your next step all at once. A question about price, or a polite \"we need to think about it\", can leave you searching for words, and by the time you find them the moment has passed.",
    },
    solution: {
      label: "The Solution",
      heading: "Tonvo shows you the question and three ways to answer",
      body: "Tonvo follows the call as it happens, through your microphone or the audio of a browser tab you share, so it can hear both sides of an online call. It shows the question the other person just asked, three replies you can say, and a short read on the moment. Sales mode is built for this kind of conversation. After the session, a summary lists the tone, what went well, what to improve, and follow-up actions.",
    },
    features: [
      {
        icon: "zap",
        title: "Three Ready-to-Say Replies",
        description:
          "Each time a question comes up, Tonvo writes three replies for what was just said, so a price or timing question does not leave you stuck.",
      },
      {
        icon: "eye",
        title: "Signals on Paid Plans",
        description:
          "Plus and Team show signals as the call moves: question, objection, opportunity, hesitation, agreement, and key point.",
      },
      {
        icon: "target",
        title: "Sales Mode",
        description:
          "Pick sales mode in a live session so the replies fit a buyer conversation. General, recruitment, support, and networking modes cover other kinds of talks.",
      },
      {
        icon: "bar-chart",
        title: "Summary After the Call",
        description:
          "A session summary with tone, what went well, what to improve, and follow-up actions, so you can pick up where the call left off.",
      },
    ],
    stats: [],
  },

  // ─── 2. Customer support ───
  {
    type: "use-cases",
    slug: "customer-support-tone-detection",
    title: "Support Chats and Calls: Calm, Clear Replies | Tonvo",
    metaDescription:
      "Tonvo follows support calls and written chats, shows the customer's question, and suggests three replies. Works from your mic or a shared tab. Free plan.",
    h1: "Stay Calm and Clear in Tough Support Conversations",
    subtitle:
      "When a customer is upset or confused, finding the right words is hard. Tonvo follows the conversation, shows what was just asked, and offers three replies you can adapt, on a call or in a written chat.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Meeting Communication" },
    ],
    targetKeywords: [
      "customer support call assistant",
      "what to say to an angry customer",
      "de-escalate customer calls",
      "ai help for support agents",
      "reply to an upset customer",
      "support conversation copilot",
    ],
    faq: [
      {
        question: "How does Tonvo notice that a customer is frustrated?",
        answer:
          "Tonvo works on the transcribed text of the conversation, not on the sound of the voice. Every plan gives a short read on the moment, and Plus and Team add signals such as hesitation, objection, and agreement. It can be wrong, so treat it as a hint and not a verdict.",
      },
      {
        question: "Can managers see frustration trends across the team?",
        answer:
          "No. Tonvo has no manager or team dashboard. Each person sees their own sessions. The Team plan is billed per user and adds screen analysis of what you share on screen.",
      },
      {
        question: "Does Tonvo work with my support platform?",
        answer:
          "Tonvo does not integrate with support platforms, Zoom, Meet, Teams, Discord, or CRM tools. It is a web app that listens through your microphone or a browser tab you share. You are responsible for informing the customer and following your workplace rules, and Tonvo recommends telling them.",
      },
      {
        question: "Does Tonvo work for written chats as well as calls?",
        answer:
          "Yes. On every plan you can paste text or upload screenshots of a written conversation and get help replying. For calls, Tonvo listens through your microphone or a shared tab, and on a phone you should put the call on speaker.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Upset customers make it harder to find the right words",
      body: "When a customer is frustrated, you are still expected to listen, stay calm, and reply clearly, often while looking for the answer somewhere else. A hard question or an angry message can make you hesitate, and a hesitant reply tends to add to the tension.",
    },
    solution: {
      label: "The Solution",
      heading: "Three replies and a short read on the moment",
      body: "Tonvo follows the conversation as it happens and shows the question or complaint the customer just raised, three replies you can say, and a short read on the moment. Support mode is built for this kind of talk. The analysis runs on the transcribed words, so it looks at tone and signals in what is said. On the Team plan, screen analysis also looks at chats, DMs, and emails you share on screen.",
    },
    features: [
      {
        icon: "heart",
        title: "A Short Read on the Moment",
        description:
          "A quick read on how the conversation is going, based on the transcribed words, so you can adjust your approach as you go.",
      },
      {
        icon: "message",
        title: "Three Replies to Adapt",
        description:
          "Ready-to-say replies written for what the customer just said. Put them in your own words and keep to your company's policies.",
      },
      {
        icon: "bar-chart",
        title: "Summary After the Session",
        description:
          "After each session, a summary with the tone of the conversation, what went well, what to improve, and follow-up actions.",
      },
      {
        icon: "monitor",
        title: "Screen Analysis on Team",
        description:
          "Share a chat, DM, or email on screen and Tonvo analyzes it to help you reply. Screen analysis is available on the Team plan only.",
      },
    ],
    stats: [],
  },

  // ─── 3. Job interviews ───
  {
    type: "use-cases",
    slug: "ai-coaching-for-job-interviews",
    title: "Interview Help: See the Question, Get Reply Ideas | Tonvo",
    metaDescription:
      "In an interview, Tonvo shows the question just asked and three ready-to-say replies, plus a short read on the moment. Mic or shared tab. Free plan.",
    h1: "Find the Right Words in a Job Interview",
    subtitle:
      "A question catches you off guard and your mind goes blank. Tonvo shows the question that was just asked and three replies you can say, and the final answer stays yours.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "freelancer-client-call-assistant", label: "Freelancer Client Call Assistant" },
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
    ],
    targetKeywords: [
      "help during a job interview",
      "what to say in an interview",
      "ai interview assistant",
      "interview answers live",
      "online interview help",
      "how to answer interview questions",
    ],
    faq: [
      {
        question: "Can I use Tonvo during a real interview?",
        answer:
          "Tonvo can listen through your microphone or a shared browser tab during an online interview. It does not join the call. Whether you may use it is your call, so check the employer's rules first. Tonvo recommends telling the people you talk to.",
      },
      {
        question: "What does Tonvo show me during an interview?",
        answer:
          "It shows the question that was just asked, three ready-to-say replies, and a short read on the moment. Plus and Team also add coaching tips and signals. Tonvo suggests and you decide, and it can be wrong.",
      },
      {
        question: "Is there a free plan I can try before an interview?",
        answer:
          "Yes. Free includes 3 live sessions a month of up to 5 minutes each, enough to try Tonvo in a short practice conversation with a friend. Plus is $19 a month and removes the session limit.",
      },
      {
        question: "What do I get after the interview?",
        answer:
          "A session summary with the tone, what went well, what to improve, and follow-up actions. Tonvo does not record or store audio, but the text of the session is kept so you can read it again: 7 days on Free and full history on paid plans.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Nerves make good answers hard to find",
      body: "In an interview, an unexpected question can empty your head. You are listening, thinking, and trying to sound calm all at once, and it is easy to fall into a long pause or a rambling answer even when you know your story well.",
    },
    solution: {
      label: "The Solution",
      heading: "See the question, then choose your words",
      body: "Tonvo follows the conversation as it happens and shows the question the interviewer just asked, three replies you can say, and a short read on the moment. For an online interview, share the browser tab so it can hear both sides, or let it listen through your microphone. Recruitment mode is available in a live session for conversations like this. Adapt every reply to your own experience.",
    },
    features: [
      {
        icon: "mic",
        title: "The Question, Picked Out",
        description:
          "Tonvo picks out the question that was just asked, so you can spend your attention on answering it.",
      },
      {
        icon: "message",
        title: "Live Reply Suggestions",
        description:
          "Ready-to-say replies written for what was just said, so you are never stuck for a way to start.",
      },
      {
        icon: "bar-chart",
        title: "Summary and History",
        description:
          "After the session, a summary with tone, what went well, what to improve, and follow-up actions. Free keeps 7 days of history, paid plans keep full history and progress analytics.",
      },
    ],
    stats: [],
  },

  // ─── 4. Work meetings ───
  {
    type: "use-cases",
    slug: "team-meeting-engagement-tracking",
    title: "Meetings: Catch Every Question and Reply Calmly | Tonvo",
    metaDescription:
      "Tonvo follows a work meeting through your mic or a shared tab, shows the question just asked, and suggests three replies. Free plan available.",
    h1: "Follow Every Question in a Busy Meeting",
    subtitle:
      "In a long meeting it is easy to lose the thread, and harder when someone puts you on the spot. Tonvo follows the discussion and shows what was just asked, with three replies you can use.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "remote-meeting-communication", label: "Remote Meeting Communication" },
    ],
    targetKeywords: [
      "ai meeting assistant",
      "what to say in a meeting",
      "answer questions in meetings",
      "live meeting copilot",
      "help when put on the spot in a meeting",
      "online meeting assistant",
    ],
    faq: [
      {
        question: "Does everyone in the meeting need Tonvo?",
        answer:
          "No, only you. Tonvo is a web app that listens through your microphone or the audio of a browser tab you share. It does not join the meeting as a bot and does not add anything for the other participants. You are responsible for informing them and following your workplace rules, and Tonvo recommends telling them.",
      },
      {
        question: "Can Tonvo show me engagement for each person?",
        answer:
          "No. Tonvo has no participant dashboard and no per-person reports. On Plus and Team, talk balance shows who is speaking, and conversation and engagement scores are also available.",
      },
      {
        question: "Does Tonvo work with Zoom, Meet, or Teams?",
        answer:
          "Tonvo has no integration with those tools. Share the browser tab your meeting runs in so it can hear everyone, or let it listen through your microphone in a room. On a phone it listens through the microphone only, so use the speaker.",
      },
      {
        question: "What do I get after the meeting?",
        answer:
          "A session summary with the tone, what went well, what to improve, and follow-up actions. Tonvo does not record or store audio, but the text of the session is kept so you can read it again.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Being put on the spot in the middle of a meeting",
      body: "Meetings move quickly. You are following slides, taking notes, and half listening when someone turns to you with a question. Missing the exact question or losing the thread is easy, and you rarely get a second chance to answer well.",
    },
    solution: {
      label: "The Solution",
      heading: "A live view of what was asked and what you could say",
      body: "Tonvo follows the meeting as it happens and shows the question that was just asked, three ready-to-say replies, and a short read on the moment. For an online meeting, share the browser tab so Tonvo can hear everyone, or use the microphone in a room. Only you need Tonvo. On Plus and Team, talk balance shows who is speaking, and after the session a summary lists the tone, what went well, what to improve, and follow-up actions.",
    },
    features: [
      {
        icon: "message",
        title: "The Question Just Asked",
        description:
          "Tonvo picks out the question that was just asked, so you can answer it even if your attention was elsewhere for a moment.",
      },
      {
        icon: "zap",
        title: "Three Replies You Can Use",
        description:
          "Ready-to-say replies written for what was just said. Pick one, change it, or ignore all three.",
      },
      {
        icon: "users",
        title: "Talk Balance on Paid Plans",
        description:
          "See who is speaking during the meeting. Talk balance is available on Plus and Team.",
      },
      {
        icon: "bar-chart",
        title: "Follow-Up Actions",
        description:
          "After the session, a summary lists the tone, what went well, what to improve, and the follow-up actions to take.",
      },
    ],
    stats: [],
  },

  // ─── 5. Freelancers and client calls ───
  {
    type: "use-cases",
    slug: "freelancer-client-call-assistant",
    title: "Client Calls for Freelancers: Rates and Scope | Tonvo",
    metaDescription:
      "Tonvo helps freelancers find the words in client calls about rates and scope. Three ready-to-say replies from your mic or a shared tab. Free plan.",
    h1: "Handle Rate and Scope Talks with More Confidence",
    subtitle:
      "Talking about price or extra work with a client is awkward when you are on your own. Tonvo shows what the client just asked and three replies you can say, or helps you answer a message.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "AI Copilot for Sales Calls" },
    ],
    targetKeywords: [
      "freelancer client call help",
      "how to negotiate rates with a client",
      "what to say when a client asks for more work",
      "freelance pricing conversation",
      "client call assistant",
      "reply to a client message",
    ],
    faq: [
      {
        question: "How does Tonvo help freelancers?",
        answer:
          "Tonvo follows a client call as it happens, shows the question the client just asked, gives you three replies you can say, and adds a short read on the moment. It does not decide for you, and you can change any reply into your own words.",
      },
      {
        question: "Can Tonvo help me negotiate my rate?",
        answer:
          "It can give you three replies for the moment, for example when a client questions your price. Plus and Team also show signals such as hesitation and objection. Tonvo makes no promise about the result, and the decision and the wording stay yours.",
      },
      {
        question: "Is the Free plan enough for a freelancer?",
        answer:
          "Free includes 3 live sessions a month of up to 5 minutes each, which is enough to try Tonvo on short client conversations. Plus is $19 a month for unlimited sessions, coaching tips, signals, live translation, and full history. Help with written messages works on every plan.",
      },
      {
        question: "Does Tonvo store my client conversations?",
        answer:
          "Tonvo does not record or store audio. The text of your sessions is kept so you can read it again: 7 days on Free and full history on paid plans. You are responsible for telling clients how you use it, and Tonvo recommends doing so.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Alone on a call when the conversation turns to money",
      body: "Freelancers handle sales, delivery, and client talks without a colleague to debrief with. When a client pushes back on your rate or asks for a little extra outside the agreed work, it is easy to say yes too fast or to freeze.",
    },
    solution: {
      label: "The Solution",
      heading: "A second set of ideas for tough client moments",
      body: "Tonvo follows the call as it happens and shows the question the client just asked, three replies you can say, and a short read on the moment. For a message from a client, paste the text or upload a screenshot and get help replying. Use sales mode or general mode depending on the conversation. After the session, a summary lists the tone, what went well, what to improve, and follow-up actions.",
    },
    features: [
      {
        icon: "target",
        title: "Replies for Rate Talks",
        description:
          "When a client asks about price or pushes back on a rate, Tonvo writes three replies for what was just said, so you can choose your own wording.",
      },
      {
        icon: "shield",
        title: "Replies for Scope Questions",
        description:
          "When a request goes beyond what was agreed, get three ways to respond that you can adapt, on a call or in a message.",
      },
      {
        icon: "message",
        title: "Help Replying to Messages",
        description:
          "Paste a client's message or upload a screenshot and get help writing your reply. This works on every plan.",
      },
    ],
    stats: [],
  },

  // ─── 6. New SDRs ───
  {
    type: "use-cases",
    slug: "sdr-onboarding-with-call-review",
    title: "First Sales Calls: A Copilot for New SDRs | Tonvo",
    metaDescription:
      "New SDR? Tonvo shows the prospect's question and three ready-to-say replies during live calls, plus a summary after each session. Free plan available.",
    h1: "A Copilot for Your First Sales Calls as a New SDR",
    subtitle:
      "Starting as an SDR means live calls before you feel ready. Tonvo shows the question the prospect just asked and three replies you can say, then gives you a summary of each call to learn from.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "ai-copilot-for-sales-calls", label: "AI Copilot for Sales Calls" },
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
      { type: "industries", slug: "saas-sales-teams", label: "SaaS Sales Teams" },
    ],
    targetKeywords: [
      "new sdr help on calls",
      "sdr first sales calls",
      "sdr call assistant",
      "what to say on cold calls",
      "sales call copilot for beginners",
      "sdr objection replies",
    ],
    faq: [
      {
        question: "How can Tonvo help a new SDR on calls?",
        answer:
          "During a live call, Tonvo shows the question the prospect just asked, three ready-to-say replies, and a short read on the moment. After the session you get a summary with the tone, what went well, what to improve, and follow-up actions. Tonvo suggests and you decide, so keep to your company's script and rules.",
      },
      {
        question: "Can managers review my calls in Tonvo?",
        answer:
          "No. Tonvo has no manager dashboard and no review queue. Each user sees their own sessions and summaries. You can read your own summary and session text, and go through them with your manager if you wish.",
      },
      {
        question: "How is this different from a call recording tool?",
        answer:
          "Tonvo does not record or store audio, and it is not a recording or supervision system. It works during the call by showing the question and replies, then keeps the text of the session so you can read it again.",
      },
      {
        question: "What pricing works for an SDR?",
        answer:
          "Free includes 3 live sessions a month of up to 5 minutes each. Plus is $19 a month for unlimited sessions. Team is $49 per user a month and adds screen analysis. Paid plans have a 7-day money-back guarantee and are billed in US dollars.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Live calls start before you feel ready",
      body: "New sales development reps are asked to make real calls early, with scripts and training notes they cannot always recall on the spot. When a prospect asks something unexpected or says they are not interested, the right reply is hard to find, and there is often nobody nearby who can help in the moment.",
    },
    solution: {
      label: "The Solution",
      heading: "Help during the call, and a summary to learn from afterwards",
      body: "Tonvo follows each call as it happens and shows the question the prospect just asked, three ready-to-say replies, and a short read on the moment. Sales mode in a live session fits this kind of call. After each session, a summary lists the tone, what went well, what to improve, and follow-up actions, so you can look back at your own calls. Make each reply your own.",
    },
    features: [
      {
        icon: "layers",
        title: "Summary After Each Call",
        description:
          "A session summary with tone, what went well, what to improve, and follow-up actions, ready to read once the call is over.",
      },
      {
        icon: "zap",
        title: "Replies During the Call",
        description:
          "Three ready-to-say replies for the question the prospect just asked, so an unexpected objection does not leave you without words.",
      },
      {
        icon: "trending-up",
        title: "Session History",
        description:
          "Free keeps 7 days of session history. Paid plans keep full history and add progress analytics, so you can look back across your calls.",
      },
      {
        icon: "users",
        title: "Team Plan, Billed per User",
        description:
          "Team is $49 per user a month and adds screen analysis. There are no manager dashboards, so each rep reviews their own sessions.",
      },
    ],
    stats: [],
  },

  // ─── 7. Research interviews ───
  {
    type: "use-cases",
    slug: "user-research-interview-insights",
    title: "Research Interviews: Live Transcript and Prompts | Tonvo",
    metaDescription:
      "Tonvo transcribes research interviews live in 10 languages and gives a short read on the moment, with a summary after. Mic or shared tab. Free plan.",
    h1: "Stay Present in Research Interviews While Tonvo Follows Along",
    subtitle:
      "When you lead a user interview you listen, ask, and think about the next question at once. Tonvo transcribes the conversation live and gives you a short read on the moment, so your attention stays on the person.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "team-meeting-engagement-tracking", label: "Meeting Engagement Tracking" },
    ],
    targetKeywords: [
      "user interview assistant",
      "live transcription for interviews",
      "user research interview help",
      "interview follow-up questions",
      "transcribe interviews in another language",
      "ux interview tool",
    ],
    faq: [
      {
        question: "How does Tonvo help during a user research interview?",
        answer:
          "Tonvo follows the interview as it happens through your microphone or a shared browser tab and transcribes it live. It gives a short read on the moment and three ready-to-say replies you can use to word a follow-up. After the session you get a summary with tone, what went well, what to improve, and follow-up actions.",
      },
      {
        question: "Can I tag and annotate key moments?",
        answer:
          "No. Tonvo has no tagging, notes feature, or export. After a session you get a summary and the text can be read again, so keep your usual research tool next to it if you need tagging.",
      },
      {
        question: "Does Tonvo read feelings from the participant's voice?",
        answer:
          "No. Tonvo works on the transcribed words and does not analyze the sound of the voice. On Plus and Team it shows signals such as hesitation, agreement, and key point based on what is said. It can be wrong, so treat it as a hint.",
      },
      {
        question: "Do participants need to know Tonvo is running?",
        answer:
          "You are responsible for informing the people you talk to and for following the rules that apply, such as consent. Tonvo recommends telling them. It does not join the call, and it does not record or store audio.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "It is hard to listen closely and plan the next question",
      body: "In a user interview you are listening, keeping the conversation natural, and deciding what to ask next. Details slip by, and when the participant speaks in a language you only partly follow, it is even harder to keep up.",
    },
    solution: {
      label: "The Solution",
      heading: "A live transcript and a read on the moment",
      body: "Tonvo follows the interview as it happens and transcribes live in 10 languages, with the language auto-detected. It gives a short read on the moment and three ready-to-say replies you can use to word a follow-up. On Plus and Team, signals and live translation are also available. After the session, a summary lists the tone, what went well, what to improve, and follow-up actions. The analysis runs on the transcribed words, and audio is not stored.",
    },
    features: [
      {
        icon: "search",
        title: "Live Transcription in 10 Languages",
        description:
          "Follow the conversation as text while it happens, in English, French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese, or Korean.",
      },
      {
        icon: "eye",
        title: "Signals on Paid Plans",
        description:
          "Plus and Team show signals in the conversation, such as hesitation, agreement, and key point, based on the transcribed words.",
      },
      {
        icon: "brain",
        title: "Replies for Follow-Ups",
        description:
          "Three ready-to-say replies for what was just said, which you can reword into a follow-up question of your own.",
      },
      {
        icon: "globe",
        title: "Live Translation on Paid Plans",
        description:
          "Interviewing in a language you only partly speak? Live translation is available on Plus and Team.",
      },
    ],
    stats: [],
  },

  // ─── 8. Meetings in another language ───
  {
    type: "use-cases",
    slug: "remote-meeting-communication",
    title: "Meetings in Another Language: Follow Along | Tonvo",
    metaDescription:
      "Tonvo transcribes online meetings live in 10 languages and shows the question just asked with three replies. Share a tab or use your mic. Free plan.",
    h1: "Take Part in Online Meetings in a Language You Are Still Learning",
    subtitle:
      "In a call held in a second language, you can lose the thread and the words. Tonvo transcribes live in 10 languages and shows the question just asked with three replies you can say.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "use-cases", slug: "team-meeting-engagement-tracking", label: "Meeting Engagement Tracking" },
    ],
    targetKeywords: [
      "help in meetings in a foreign language",
      "follow remote meetings in another language",
      "live transcription for video calls",
      "live translation during calls",
      "non native speaker meeting help",
      "remote meeting assistant",
    ],
    faq: [
      {
        question: "How does Tonvo help in a meeting held in another language?",
        answer:
          "Tonvo follows the meeting as it happens and transcribes it live. It shows the question that was just asked, three ready-to-say replies, and a short read on the moment. Live translation is available on Plus and Team. You decide what to say.",
      },
      {
        question: "Which languages does Tonvo transcribe?",
        answer:
          "Live transcription covers 10 languages: English, French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese, and Korean. The language can be auto-detected.",
      },
      {
        question: "Does Tonvo work with Zoom, Meet, or Teams?",
        answer:
          "Tonvo has no integration with those tools and does not join the meeting. Share the browser tab your meeting runs in so it can hear both sides, or let it listen through your microphone. On a phone it listens through the microphone only, so put the call on speaker.",
      },
      {
        question: "How is this different from a transcription tool?",
        answer:
          "Live transcription is part of it, but Tonvo also shows the question just asked, three replies, and a short read on the moment, then gives you a summary. It does not record or store audio. The text of your sessions is kept so you can read it again, and you should tell the other participants how you use it.",
      },
    ],
    problem: {
      label: "The Problem",
      heading: "Online meetings are harder when the language is not your first",
      body: "On a video call you miss the cues of a room, and in a second language you can also miss words, accents, and speed. A question comes, you are not sure you caught it, and by the time you find your answer the discussion has moved on.",
    },
    solution: {
      label: "The Solution",
      heading: "A live transcript, the question, and replies you can say",
      body: "Tonvo follows the meeting as it happens. Share the browser tab with the meeting so it can hear both sides, or use your microphone. It transcribes live in 10 languages and can detect the language, then shows the question just asked, three ready-to-say replies, and a short read on the moment. Live translation is available on Plus and Team. You choose what to say.",
    },
    features: [
      {
        icon: "globe",
        title: "Live Transcription in 10 Languages",
        description:
          "Read the conversation as it happens, with the language auto-detected, so a missed word does not cost you the thread.",
      },
      {
        icon: "message",
        title: "Live Translation on Paid Plans",
        description:
          "Plus and Team add live translation, which helps when the meeting is not in the language you think in.",
      },
      {
        icon: "headphones",
        title: "Both Sides of an Online Call",
        description:
          "Share a browser tab to let Tonvo hear everyone in an online meeting, or use your microphone for a call in a room.",
      },
      {
        icon: "bar-chart",
        title: "Summary After the Meeting",
        description:
          "A session summary with tone, what went well, what to improve, and follow-up actions, kept as text you can read again.",
      },
    ],
    stats: [],
  },
];
