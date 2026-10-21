import type { FeatureEntry } from "./types";

export const features: FeatureEntry[] = [
  // ── 1. Real-Time Tone Detection ──────────────────────────────────
  {
    type: "features",
    slug: "real-time-tone-detection",
    title: "Tone Detection in Conversations | Tonvo",
    metaDescription:
      "Tonvo reads the tone of a conversation from the live transcript and gives you a short read on the moment, so you can choose your words with care.",
    h1: "See the tone of a conversation as it unfolds",
    subtitle:
      "Tonvo follows the words of a call, a meeting or a talk and gives you a short read on the moment, such as whether the other person sounds interested, tense or unsure.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "conversation-signal-detection", label: "Signal Detection" },
    ],
    targetKeywords: [
      "tone of a conversation",
      "tone analysis during a call",
      "how to read the mood of a conversation",
      "AI conversation tone detector",
      "sentiment analysis for conversations",
    ],
    faq: [
      {
        question: "How does Tonvo read tone?",
        answer:
          "Tonvo transcribes the conversation live and analyzes the text: the words people choose and how they phrase things. It does not measure pitch, pace or other features of the voice. The result is a short read on the moment, not a verdict, and it can be wrong.",
      },
      {
        question: "What kinds of conversations does it work for?",
        answer:
          "Any conversation Tonvo can hear: a work call, a meeting, an interview, a negotiation or an everyday talk. It listens through your microphone, and on a computer it can also hear the audio of a browser tab you share, so both sides of an online call come through. On a phone, put the call on speaker.",
      },
      {
        question: "Can I look at the tone after the conversation?",
        answer:
          "Yes. After a session, your summary describes the tone of the conversation, what went well, what to improve and follow-up actions. The text of your sessions is kept so you can read it again. Free keeps 7 days of history, and paid plans keep the full history.",
      },
      {
        question: "Does tone detection work in other languages?",
        answer:
          "Tonvo transcribes 10 languages: English, French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese and Korean, and it can detect the language automatically. Because tone comes from the transcript, a poor transcript, for example from background noise, can lead to a weaker read.",
      },
    ],
    featureName: "Tone Detection",
    howItWorks: {
      label: "How It Works",
      heading: "A read on the moment, based on the words",
      body: "Tonvo transcribes the conversation as it happens, then an AI model reads the text to understand where the moment stands. It looks at wording and phrasing, not at the sound of a voice. What you see is a short read on the moment, next to the question that was just asked and three replies you could use. On Plus and Team, live insights and signals add more detail. You stay in charge of what you say.",
    },
    benefits: [
      {
        icon: "heart",
        title: "Notice a shift in the room",
        description:
          "See when the other person seems to hesitate, agree or tense up, so you can slow down, clarify or change direction.",
      },
      {
        icon: "message",
        title: "Find words that fit the moment",
        description:
          "A short read on the moment, next to three ready-to-say replies, helps you answer in a way that suits how the conversation feels.",
      },
      {
        icon: "shield",
        title: "Understand more in a second language",
        description:
          "When a conversation is in a language you speak less well, a short read on the moment can help you follow what is going on.",
      },
    ],
    useCasesForFeature: [
      "Following a tense work call and choosing your next words",
      "Getting a sense of how an interviewer or a candidate is reacting",
      "Keeping a negotiation calm when the other side hesitates",
      "Handling a difficult everyday conversation with more confidence",
    ],
    technicalDetail: {
      label: "Under the Hood",
      heading: "Text-based, not voice-based",
      body: "Tone reads come from the transcript. Transcription is handled by AssemblyAI and the analysis is done by an AI model from Anthropic. Because only text is analyzed, Tonvo does not assess pitch, speaking pace or filler words, and it cannot see facial expressions. Treat the read as a suggestion, since it can be wrong.",
    },
  },

  // ── 2. AI Coaching Suggestions ───────────────────────────────────
  {
    type: "features",
    slug: "ai-coaching-suggestions",
    title: "Live Reply Suggestions for Any Conversation | Tonvo",
    metaDescription:
      "Get three ready-to-say replies live during a call, meeting or interview. Tonvo shows the question just asked, and you choose what to say.",
    h1: "Know what to say next, in the moment",
    subtitle:
      "Tonvo shows the question the other person just asked and three replies you can use. On Plus and Team, coaching tips add more guidance.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "real-time-tone-detection", label: "Tone Detection" },
    ],
    targetKeywords: [
      "live reply suggestions",
      "what to say in a conversation",
      "real-time conversation help",
      "AI conversation copilot",
      "help answering interview questions",
    ],
    faq: [
      {
        question: "What does Tonvo suggest?",
        answer:
          "Tonvo detects the question the other person just asked and offers three ready-to-say replies. This is available on every plan. On Plus and Team, you also get coaching tips and live insights while the conversation goes on.",
      },
      {
        question: "Will the other person see the suggestions?",
        answer:
          "Only if what you share includes Tonvo. On Plus and Team, Tonvo can show the copilot in a separate window (Picture-in-Picture on desktop Chrome, or a popup), which is not part of a tab or window you share. On Free, and on a phone, the copilot appears in the page itself. If you share your entire screen, others can see everything on it.",
      },
      {
        question: "Can I adapt the suggestions to my situation?",
        answer:
          "Yes. A live session has modes: general, sales, recruitment, support and networking. Pick the one closest to your conversation so the suggestions fit it.",
      },
      {
        question: "Does the AI remember my past conversations?",
        answer:
          "No. Tonvo has no notes or memory feature that carries context from one conversation to the next. The text of each session is kept so you can read it again, and the session summary lists what went well and what to improve.",
      },
    ],
    featureName: "Live Reply Suggestions",
    howItWorks: {
      label: "How It Works",
      heading: "Suggestions that follow the conversation",
      body: "As the conversation goes on, Tonvo transcribes it live and an AI model reads the text. When the other person asks something, Tonvo picks out the question and drafts three replies you could say. You can use one as it is, adapt it, or ignore it. On Plus and Team, coaching tips and live insights appear alongside the replies.",
    },
    benefits: [
      {
        icon: "brain",
        title: "Never freeze on a question",
        description:
          "When a question lands and your mind goes blank, three replies are already on screen to start from.",
      },
      {
        icon: "zap",
        title: "Answer with more clarity",
        description:
          "A tough or unexpected question is easier to handle when you can see it written out, with a few ways to answer.",
      },
      {
        icon: "message",
        title: "Fits the conversation you are in",
        description:
          "Choose general, sales, recruitment, support or networking, so suggestions suit a work call, an interview or a first chat with a new contact.",
      },
      {
        icon: "check",
        title: "You stay in control",
        description:
          "Tonvo suggests and you decide. Replies can be wrong, so read them, adjust them and say them in your own words.",
      },
    ],
    useCasesForFeature: [
      "Answering a tough question in a work meeting",
      "Finding the right words during a job interview",
      "Handling an objection or a price question on a sales call",
      "Supporting a customer who is upset, as a support agent",
      "Keeping a conversation going with someone you have just met",
    ],
    technicalDetail: {
      label: "Under the Hood",
      heading: "What runs behind the replies",
      body: "Transcription comes from AssemblyAI. The transcribed text is sent to an AI model from Anthropic, which finds the question and writes the replies. Because the analysis works on text, it follows what is said, not how it sounds. It is a suggestion tool, so it can be wrong, and you are the one speaking.",
    },
  },

  // ── 3. Conversation Signal Detection ─────────────────────────────
  {
    type: "features",
    slug: "conversation-signal-detection",
    title: "Conversation Signals: Objections and Hesitation | Tonvo",
    metaDescription:
      "On Plus and Team, Tonvo flags questions, objections, opportunities, hesitation, agreement and key points live, so you can notice what matters in a talk.",
    h1: "Notice what matters while the conversation is happening",
    subtitle:
      "Tonvo marks moments such as a question, an objection or a hesitation as the conversation goes. Live signals are part of Plus and Team.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "real-time-tone-detection", label: "Tone Detection" },
    ],
    targetKeywords: [
      "conversation signals",
      "detect objections in a call",
      "spot hesitation in a conversation",
      "real-time conversation insights",
      "notice buying signals",
    ],
    faq: [
      {
        question: "What types of signals does Tonvo show?",
        answer:
          "Tonvo shows six kinds of signals: question, objection, opportunity, hesitation, agreement and key point. Live signals are available on Plus and Team.",
      },
      {
        question: "How is a signal different from tone?",
        answer:
          "Tone is a read on how the moment feels overall. A signal marks a specific moment, such as someone saying they are not sure about the timing, or agreeing with a proposal. Both are based on the transcribed text.",
      },
      {
        question: "Can I choose which signals I see or set alerts?",
        answer:
          "No. Tonvo does not have alert settings or thresholds. Signals appear in the live view as the conversation goes, and you decide which ones to act on.",
      },
      {
        question: "What do I get after the session?",
        answer:
          "On every plan, you get a summary with the tone of the conversation, what went well, what to improve and follow-up actions. The text of the session is kept so you can read it again.",
      },
    ],
    featureName: "Conversation Signals",
    howItWorks: {
      label: "How It Works",
      heading: "Moments picked out of the transcript",
      body: "Tonvo transcribes the conversation live and an AI model reads the text for moments that deserve your attention. Someone doubting the timing, asking how something would work, or saying they agree each count as a different kind of moment. Each one is shown as a signal in the live view, so you can notice it while you can still respond. Signals come from the words, not from voice features.",
    },
    benefits: [
      {
        icon: "target",
        title: "Respond while it still matters",
        description:
          "A signal helps you notice an objection or a moment of hesitation while you can still address it, instead of realizing it after the conversation is over.",
      },
      {
        icon: "search",
        title: "Catch what is easy to miss",
        description:
          "When you are busy speaking, subtle moments slip by: a quick doubt, a hint of interest, a point worth coming back to. Signals help you notice them.",
      },
      {
        icon: "users",
        title: "Useful beyond sales",
        description:
          "Signals apply to interviews, negotiations, support calls and everyday talks too, because they come from what people say.",
      },
    ],
    useCasesForFeature: [
      "Spotting hesitation in a negotiation and choosing when to clarify",
      "Noticing an objection early in a sales call",
      "Catching a point of agreement during an interview",
      "Picking out the key point in a long meeting",
      "Recognizing an opening to move to a next step",
    ],
    technicalDetail: {
      label: "Under the Hood",
      heading: "How signals are produced",
      body: "Signals are produced from the transcribed text by an AI model from Anthropic, while AssemblyAI handles the transcription. Tonvo does not analyze the voice itself, so a signal reflects words, not tone of voice. Signals are suggestions that can be wrong, so use them as a prompt to listen closely, not as a conclusion.",
    },
  },

  // ── 4. Post-Session Analysis ─────────────────────────────────────
  {
    type: "features",
    slug: "post-session-analysis",
    title: "Session Summary: Review a Conversation | Tonvo",
    metaDescription:
      "After a session, Tonvo gives you a summary: the tone, what went well, what to improve and follow-up actions. Read it again whenever you need.",
    h1: "Look back on a conversation with a clear summary",
    subtitle:
      "When a session ends, Tonvo summarizes how it went and lists follow-up actions, so you remember what was said and what to do next.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "speaker-balance-tracking", label: "Speaker Balance" },
    ],
    targetKeywords: [
      "conversation summary",
      "call summary after the call",
      "how to review a conversation",
      "AI meeting summary",
      "follow-up actions from a call",
    ],
    faq: [
      {
        question: "What does the session summary include?",
        answer:
          "The summary covers the tone of the conversation, what went well, what to improve and follow-up actions. It is included on every plan.",
      },
      {
        question: "Does Tonvo store recordings?",
        answer:
          "No. Tonvo does not record or store audio. The text of your sessions is kept so you can read it again.",
      },
      {
        question: "How long is my history kept?",
        answer:
          "Free keeps 7 days of session history. Plus and Team keep the full history, and also include progress analytics.",
      },
      {
        question: "Can I export or share a summary?",
        answer:
          "Not at the moment. Tonvo has no PDF or CSV export, no sharing links and no team dashboard. You can open a session again from your history and read the summary there.",
      },
    ],
    featureName: "Session Summary",
    howItWorks: {
      label: "How It Works",
      heading: "From a live conversation to a summary",
      body: "While you talk, Tonvo transcribes the conversation. When the session ends, an AI model reads the transcript and writes a summary: the overall tone, what went well, what to improve and follow-up actions. The text of the session is kept so you can open it again from your history. Summaries are generated from text, so they can miss things, especially if the transcript was unclear.",
    },
    benefits: [
      {
        icon: "clock",
        title: "Less note-taking during the talk",
        description:
          "Focus on the person in front of you instead of writing, then read the summary afterwards.",
      },
      {
        icon: "layers",
        title: "Keep the thread of past conversations",
        description:
          "Your sessions stay in your history, 7 days on Free and the full history on Plus and Team, so you can go back to what was said.",
      },
      {
        icon: "trending-up",
        title: "See your own progress",
        description:
          "Plus and Team include progress analytics, so you can follow how your conversations are going over time.",
      },
    ],
    useCasesForFeature: [
      "Writing a follow-up after a work call with the actions in front of you",
      "Reviewing how a job interview went",
      "Looking back on a negotiation to see what to improve",
      "Reading again a conversation held in another language",
    ],
    technicalDetail: {
      label: "Good to know",
      heading: "What is kept and what is not",
      body: "Tonvo does not record or store audio. It keeps the text of your sessions and the summary so you can read them again. Transcription comes from AssemblyAI and the summary is written by an AI model from Anthropic. The summary is an aid, not a verbatim record, and it can contain mistakes. You remain responsible for informing the people you talk to and for following the rules that apply.",
    },
  },

  // ── 5. Screen Analysis ───────────────────────────────────────────
  {
    type: "features",
    slug: "screen-analysis",
    title: "Screen Analysis for Chats, DMs and Emails | Tonvo",
    metaDescription:
      "On Team, Tonvo reads the chat, DM or email you share on screen and helps you reply. On any plan, paste text or upload screenshots.",
    h1: "Get help replying to a chat, DM or email on your screen",
    subtitle:
      "Share a written conversation on your screen and Tonvo reads it, so you can answer with clearer words. Screen analysis is part of the Team plan.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "ai-coaching-suggestions", label: "AI Coaching" },
    ],
    targetKeywords: [
      "AI help replying to messages",
      "how to reply to a difficult email",
      "help replying to a DM",
      "screen analysis AI",
      "AI reply to a chat",
    ],
    faq: [
      {
        question: "What can Tonvo read on my screen?",
        answer:
          "Written conversations you share on screen, such as chats, DMs and emails. Screen analysis is part of the Team plan.",
      },
      {
        question: "Can I get help with a written conversation on another plan?",
        answer:
          "Yes. On every plan you can paste the text of a conversation or upload screenshots, and Tonvo helps you reply. Screen analysis of what you share on screen is only on Team, at $49 per user a month.",
      },
      {
        question: "Does Tonvo write and send messages for me?",
        answer:
          "No. Tonvo suggests wording and you decide. You read it, edit it and send it yourself. Suggestions can be wrong.",
      },
      {
        question: "Should I tell the people in the conversation?",
        answer:
          "Messages contain other people's words, and rules differ by country and context, for example at work. You are responsible for following the ones that apply to you, and Tonvo recommends telling the people you talk to.",
      },
    ],
    featureName: "Screen Analysis",
    howItWorks: {
      label: "How It Works",
      heading: "Reading a written conversation on your screen",
      body: "With screen analysis, you share a screen with Tonvo that shows a written conversation, such as a chat thread, a DM or an email. Tonvo reads what is there and helps you understand the message and find words to reply. You decide what to write and send it yourself. If you are not on the Team plan, you can paste the text or upload screenshots instead to get reply help.",
    },
    benefits: [
      {
        icon: "eye",
        title: "Replies that fit the message",
        description:
          "Tonvo works from the actual text on your screen, so suggestions answer what was written instead of a generic situation.",
      },
      {
        icon: "message",
        title: "Help with delicate messages",
        description:
          "When you are unsure how to answer a tense email or an awkward DM, you get wording to start from.",
      },
      {
        icon: "zap",
        title: "Less copying and pasting",
        description:
          "On Team, share the screen instead of copying text into the app each time.",
      },
    ],
    useCasesForFeature: [
      "Replying to a difficult email from a client or a manager",
      "Answering a DM from a recruiter or a new contact",
      "Handling a customer chat when you work in support",
      "Finding the right tone in a message written in another language",
    ],
  },

  // ── 6. Speaker Balance Tracking ──────────────────────────────────
  {
    type: "features",
    slug: "speaker-balance-tracking",
    title: "Talk Balance: See Who Is Speaking | Tonvo",
    metaDescription:
      "On Plus and Team, Tonvo shows who is speaking and how the talking is shared, so you can listen more and leave room for others.",
    h1: "See how the talking is shared in a conversation",
    subtitle:
      "Tonvo shows who is speaking as the conversation goes, so you can notice when you talk too much or when someone has not had a say.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "post-session-analysis", label: "Post-Session Analysis" },
    ],
    targetKeywords: [
      "talk time in a conversation",
      "who is speaking in a meeting",
      "speaker balance tool",
      "how to listen more in conversations",
      "meeting talk balance",
    ],
    faq: [
      {
        question: "How does Tonvo tell who is speaking?",
        answer:
          "Tonvo separates the voices it hears and shows who is speaking in the live view. It works best when voices come through clearly, so use a good microphone or share the tab of an online call so both sides are heard. It can be wrong, especially when people talk over each other.",
      },
      {
        question: "Which plans include talk balance?",
        answer:
          "Talk balance is part of Plus and Team. Free sessions show the detected question, three replies and a session summary.",
      },
      {
        question: "Does it work in group conversations?",
        answer:
          "Tonvo can show who is speaking in a group, but accuracy depends on the audio. When several voices come through one microphone, the labels can be less reliable.",
      },
      {
        question: "Does Tonvo tell me the ideal balance?",
        answer:
          "No. Tonvo shows the balance and leaves the judgment to you. The right balance depends on the conversation: an interview where you listen is different from a presentation you give.",
      },
    ],
    featureName: "Talk Balance",
    howItWorks: {
      label: "How It Works",
      heading: "Who is speaking, live",
      body: "While the conversation is transcribed, Tonvo also marks who is speaking. From that, the live view shows how the talking is shared between people. You can glance at it to notice when you have been speaking for a long time, or when someone has stayed quiet. It is information, not a rule, and it is up to you what to do with it.",
    },
    benefits: [
      {
        icon: "users",
        title: "Leave room for others",
        description:
          "Seeing who has spoken helps you notice a quiet person and invite them in, whether you lead a meeting or a family call.",
      },
      {
        icon: "bar-chart",
        title: "See your own habits",
        description:
          "A glance at who has been talking helps you notice whether you tend to take most of the space in a conversation.",
      },
      {
        icon: "mic",
        title: "A reminder to listen",
        description:
          "Seeing the balance shift can remind you to pause, ask a question and let the other person finish.",
      },
    ],
    useCasesForFeature: [
      "Following a discovery call to make sure the other person gets to talk",
      "Leading a meeting where everyone should contribute",
      "Checking that an interview leaves enough space for the candidate",
      "Noticing when you talk too much in a difficult conversation",
    ],
  },

  // ── 7. Multi-Language Support ────────────────────────────────────
  {
    type: "features",
    slug: "multi-language-support",
    title: "Live Conversation Help in 10 Languages | Tonvo",
    metaDescription:
      "Tonvo follows live conversations in English, French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese and Korean, with automatic detection.",
    h1: "Follow a conversation in 10 languages",
    subtitle:
      "Tonvo transcribes live in 10 languages and can detect the language for you, so a call, a meeting or a talk does not have to be in English.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "real-time-tone-detection", label: "Tone Detection" },
    ],
    targetKeywords: [
      "multilingual conversation assistant",
      "live transcription in 10 languages",
      "AI help for calls in another language",
      "live translation during a call",
      "conversation copilot in French",
    ],
    faq: [
      {
        question: "Which languages does Tonvo support?",
        answer:
          "Tonvo transcribes English, French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese and Korean. The language can be detected automatically.",
      },
      {
        question: "Can Tonvo translate a conversation live?",
        answer:
          "Yes, live translation is available on Plus and Team. On the Free plan you get live transcription, the detected question and three replies.",
      },
      {
        question: "What if a conversation mixes languages?",
        answer:
          "Tonvo can detect the language automatically, but a conversation that switches between languages is harder to transcribe, so the transcript and the suggestions can be less accurate.",
      },
      {
        question: "How accurate is it in languages other than English?",
        answer:
          "Accuracy depends on audio quality, accents and background noise, and it can differ from one language to another. Because the analysis works on the transcript, a clear transcript gives better suggestions. Tonvo can be wrong, so you decide what to say.",
      },
    ],
    featureName: "Multi-Language Support",
    howItWorks: {
      label: "How It Works",
      heading: "Transcription first, then the analysis",
      body: "Tonvo listens through your microphone and, on a computer, can also hear a browser tab you share. It transcribes the speech live in one of 10 languages, and the language can be detected automatically. An AI model then works from that text to find the question and suggest replies. On Plus and Team you can also use live translation to follow what is being said.",
    },
    benefits: [
      {
        icon: "globe",
        title: "Use it in your own language",
        description:
          "Conversations in French, Spanish, Japanese or any of the other 10 languages get the same live transcript and the same kind of help.",
      },
      {
        icon: "users",
        title: "Talk in a language you speak less well",
        description:
          "With live translation on Plus and Team, you can follow what is being said while you work on your own answer.",
      },
      {
        icon: "layers",
        title: "One copilot for many conversations",
        description:
          "Use the same tool for a call with a client abroad, a meeting in a second language or a chat with a friend.",
      },
    ],
    useCasesForFeature: [
      "Taking a call with a client or a supplier in another country",
      "Following a meeting held in your second language",
      "Answering interview questions in a language you are still learning",
      "Keeping up with a family or friends conversation in a language you are practicing",
    ],
  },

  // ── 8. Separate-window copilot (slug kept so existing links and rankings survive) ──
  {
    type: "features",
    slug: "separate-window-copilot",
    title: "Separate-Window Copilot | Tonvo",
    metaDescription:
      "On Plus and Team, Tonvo opens in its own window, so a shared tab or window shows only your call. See how it works, and what changes on the Free plan.",
    h1: "A copilot in its own window",
    subtitle:
      "On Plus and Team, Tonvo opens in a separate window next to your call. When you share a tab or a window, the people on the call see what you share, and not Tonvo.",
    lastModified: "2026-10-21",
    relatedSlugs: [
      { type: "features", slug: "ai-coaching-suggestions", label: "AI Coaching" },
    ],
    targetKeywords: [
      "separate window copilot",
      "conversation copilot window",
      "screen share and ai assistant",
      "picture in picture copilot",
    ],
    faq: [
      {
        question: "How does the separate window work?",
        answer:
          "On Plus and Team, on desktop Chrome, Tonvo opens its copilot in a Picture-in-Picture window. It is a different window from the tab or window you share, so a shared tab or window does not include it. Where that window type is not available, Tonvo opens a small popup instead. On the Free plan and on a phone, the copilot appears in the page itself.",
      },
      {
        question: "What if I share my entire screen?",
        answer:
          "Then everything on your screen can be seen by the others, including the Tonvo window. To keep it out of view, share a single tab or window instead of your entire screen.",
      },
      {
        question: "Does Tonvo hide itself from recordings?",
        answer:
          "No. Tonvo does not change how your video call tool shares or records. What is captured depends on what you choose to share, so check it before you start.",
      },
      {
        question: "Should I tell the other person I am using Tonvo?",
        answer:
          "Yes. Many places require you to tell the people you talk to, or to get their consent, before a conversation is analyzed. Rules vary by country and by context, and you are responsible for following the ones that apply to you.",
      },
    ],
    featureName: "Separate-window copilot",
    howItWorks: {
      label: "How It Works",
      heading: "A window of its own",
      body: "On Plus and Team, Tonvo shows replies and insights in a separate window: a Picture-in-Picture window on desktop Chrome, or a small popup elsewhere. Because that window is not part of the tab or window you share, a shared tab or window shows only your call or your content. On the Free plan and on a phone, Tonvo shows the copilot in the page itself.",
    },
    benefits: [
      {
        icon: "shield",
        title: "Stays out of a shared tab or window",
        description:
          "Share a tab or a window and the copilot stays on your side of the screen.",
      },
      {
        icon: "monitor",
        title: "Present while you read",
        description:
          "Share a deck or a demo and keep the replies in view next to it.",
      },
      {
        icon: "check",
        title: "You stay in control",
        description:
          "Tonvo suggests, you decide what to say, and you can close the window at any time.",
      },
    ],
    useCasesForFeature: [
      "Sharing a slide deck while following a call",
      "Keeping replies in view during a video meeting",
      "Following a conversation in another language with the copilot next to it",
    ],
    technicalDetail: {
      label: "Good to know",
      heading: "What is and is not shared",
      body: "The copilot window is separate from the surface you share, but it is not a way to hide Tonvo. If you share your entire screen, others can see it. Tonvo also does not change what your video call tool records. On the Free plan the replies appear in the page itself, so keep that page out of what you share.",
    },
  },
];
