"use client";

import { memo } from "react";
import type { Tone } from "@/types/analysis";

const toneConfig: Record<Tone, { color: string; label: string; pulseClass: string }> = {
  positive: { color: "var(--color-positive)", label: "Positive", pulseClass: "pulse-positive" },
  neutral: { color: "var(--color-neutral)", label: "Neutral", pulseClass: "pulse-neutral" },
  negative: { color: "var(--color-negative)", label: "Negative", pulseClass: "pulse-negative" },
  hesitant: { color: "var(--color-neutral)", label: "Hesitant", pulseClass: "pulse-neutral" },
};

interface ToneIndicatorProps {
  tone: Tone;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function ToneIndicator({ tone, size = "md", showLabel = true }: ToneIndicatorProps) {
  const config = toneConfig[tone];
  const sizes = { sm: 12, md: 24, lg: 48 };
  const px = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div
        className={`rounded-full ${config.pulseClass}`}
        style={{
          width: px,
          height: px,
          backgroundColor: config.color,
        }}
      />
      {showLabel && (
        <span className="text-sm font-medium" style={{ color: config.color }}>
          {config.label}
        </span>
      )}
    </div>
  );
}

export default memo(ToneIndicator);
