import Anthropic from "@anthropic-ai/sdk";

let anthropicClient: Anthropic;

const apiKey = process.env.ANTHROPIC_API_KEY;

if (apiKey) {
  anthropicClient = new Anthropic({ apiKey });
} else {
  anthropicClient = new Proxy({} as Anthropic, {
    get() {
      throw new Error("Anthropic not configured. Set ANTHROPIC_API_KEY.");
    },
  });
}

export { anthropicClient };

// Model aliases
export const CLAUDE_FAST = "claude-haiku-4-5-20251001"; // Real-time analysis
export const CLAUDE_DEEP = "claude-sonnet-4-5-20250929"; // Final summaries
