"use client";

interface SuggestionCardProps {
  suggestion: string;
  emotions: string[];
}

export default function SuggestionCard({ suggestion, emotions }: SuggestionCardProps) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: "var(--color-surface-2)",
        borderColor: "var(--color-border)",
      }}>
      <div className="text-xs font-medium uppercase tracking-wider mb-2"
        style={{ color: "var(--color-accent-light)" }}>
        Suggestion
      </div>
      <p className="text-sm leading-relaxed m-0" style={{ color: "var(--color-text)" }}>
        {suggestion}
      </p>
      {emotions.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {emotions.map((emotion) => (
            <span
              key={emotion}
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-muted)",
              }}>
              {emotion}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
