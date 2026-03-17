// Default to production URL. Users can override via the extension popup settings.
// For local development, change in popup settings or set CUE_API_URL at build time.
export const API_BASE_URL = "https://cue-app.vercel.app";

export const PLATFORM_PATTERNS: Record<string, RegExp> = {
  meet: /^https:\/\/meet\.google\.com\/.+/,
  zoom: /^https:\/\/([\w-]+\.)?zoom\.us\/(j|wc)\//,
  teams: /^https:\/\/teams\.(microsoft|live)\.com\/.*(meetup-join|meeting)/,
};

export const TONE_COLORS: Record<string, string> = {
  positive: "#34d399",
  neutral: "#fbbf24",
  negative: "#f87171",
  hesitant: "#fbbf24",
};

export const SIGNAL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  objection:   { label: "Objection",   color: "#f87171", bg: "rgba(248, 113, 113, 0.15)" },
  question:    { label: "Question",    color: "#fbbf24", bg: "rgba(251, 191, 36, 0.15)" },
  opportunity: { label: "Opportunity", color: "#34d399", bg: "rgba(52, 211, 153, 0.15)" },
  hesitation:  { label: "Hesitation",  color: "#fbbf24", bg: "rgba(251, 191, 36, 0.15)" },
  agreement:   { label: "Agreement",   color: "#34d399", bg: "rgba(52, 211, 153, 0.15)" },
  key_point:   { label: "Key Point",   color: "#c8c8d8", bg: "rgba(200, 200, 216, 0.15)" },
  none:        { label: "",            color: "",        bg: "" },
};

export const CLASSIFICATION_CONFIG: Record<string, { label: string; color: string }> = {
  very_positive: { label: "Excellent", color: "#34d399" },
  positive:      { label: "Positive",  color: "#6ee7b7" },
  neutral:       { label: "Neutral",   color: "#fbbf24" },
  awkward:       { label: "Awkward",    color: "#fb923c" },
  negative:      { label: "Negative",  color: "#f87171" },
};

// Whisper hallucination filter
export const WHISPER_HALLUCINATIONS = [
  "sous-titres", "amara.org", "sous-titrage", "merci d'avoir regard",
  "merci de votre visionnage", "thank you for watching", "subtitles by",
  "transcrit par", "please subscribe", "music",
];

export const AUDIO_CHUNK_INTERVAL = 5000;
export const SEND_INTERVAL = 5500;
export const SUMMARY_THRESHOLD = 3;
