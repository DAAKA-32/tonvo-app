"use client";

interface SuggestionCardProps {
  suggestion: string;
  emotions: string[];
}

export default function SuggestionCard({ suggestion, emotions }: SuggestionCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
        border: "1px solid rgba(167, 139, 250, 0.12)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <span
        aria-hidden
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(167, 139, 250, 0.24), transparent 70%)",
          filter: "blur(28px)",
          opacity: 0.5,
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--shimmer-accent-1)" }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Suggestion
          </span>
        </div>
        <p
          className="text-sm leading-relaxed m-0"
          style={{ color: "var(--color-text)" }}
        >
          {suggestion}
        </p>
        {emotions.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {emotions.map((emotion) => (
              <span
                key={emotion}
                className="text-[11px] px-2.5 py-1 rounded-full"
                style={{
                  background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                  color: "var(--color-text-silver)",
                }}
              >
                {emotion}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
