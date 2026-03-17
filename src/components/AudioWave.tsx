"use client";

interface AudioWaveProps {
  active: boolean;
}

export default function AudioWave({ active }: AudioWaveProps) {
  return (
    <div className="flex items-center gap-1 h-8">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="audio-wave-bar"
          style={{
            height: active ? undefined : "4px",
            animationDelay: `${i * 0.15}s`,
            animationPlayState: active ? "running" : "paused",
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
