"use client";

import { useState, useCallback } from "react";

export type MeetingPlatform = "zoom" | "meet" | "teams" | null;

interface MeetingInfo {
  platform: MeetingPlatform;
  url: string;
  label: string;
}

interface MeetingLinkInputProps {
  onJoin: (info: MeetingInfo) => void;
  disabled?: boolean;
}

const PLATFORM_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string; rgba: string }> = {
  zoom: {
    label: "Zoom",
    color: "#60a5fa",
    bg: "rgba(96, 165, 250, 0.12)",
    icon: "Z",
    rgba: "96, 165, 250",
  },
  meet: {
    label: "Google Meet",
    color: "#34d399",
    bg: "rgba(52, 211, 153, 0.12)",
    icon: "M",
    rgba: "52, 211, 153",
  },
  teams: {
    label: "Microsoft Teams",
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.12)",
    icon: "T",
    rgba: "167, 139, 250",
  },
};

function detectPlatform(url: string): MeetingPlatform {
  const u = url.trim().toLowerCase();
  if (u.includes("zoom.us/j/") || u.includes("zoom.us/my/") || u.includes("zoom.us/s/")) return "zoom";
  if (u.includes("meet.google.com/")) return "meet";
  if (u.includes("teams.microsoft.com/") || u.includes("teams.live.com/")) return "teams";
  return null;
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str.trim());
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export default function MeetingLinkInput({ onJoin, disabled = false }: MeetingLinkInputProps) {
  const [link, setLink] = useState("");
  const [platform, setPlatform] = useState<MeetingPlatform>(null);

  const handleChange = useCallback((val: string) => {
    setLink(val);
    setPlatform(detectPlatform(val));
  }, []);

  const handleJoin = useCallback(() => {
    if (!platform || !isValidUrl(link)) return;
    const cfg = PLATFORM_CONFIG[platform];
    onJoin({ platform, url: link.trim(), label: cfg.label });
  }, [platform, link, onJoin]);

  const cfg = platform ? PLATFORM_CONFIG[platform] : null;
  const accentRgba = cfg?.rgba ?? "255, 255, 255";
  const ready = !!(platform && isValidUrl(link));

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl"
      style={{
        background: cfg
          ? `linear-gradient(135deg, rgba(${accentRgba}, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)`
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
        border: cfg
          ? `1px solid rgba(${accentRgba}, 0.18)`
          : "1px solid rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}
    >
      {/* corner accent halo */}
      <span
        aria-hidden
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none"
        style={{
          background: cfg
            ? `radial-gradient(circle, rgba(${accentRgba}, 0.3), transparent 70%)`
            : "radial-gradient(circle, rgba(255, 255, 255, 0.10), transparent 70%)",
          filter: "blur(28px)",
          opacity: cfg ? 0.7 : 0.3,
          transition: "opacity 0.4s ease",
        }}
      />

      <div className="relative p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="relative inline-flex w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: cfg ? cfg.color : "rgba(255, 255, 255, 0.6)",
              opacity: cfg ? 1 : 0.7,
            }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Join a meeting
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-stretch">
          <div className="relative flex-1 min-w-0">
            {cfg && (
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold pointer-events-none"
                style={{ color: cfg.color, backgroundColor: cfg.bg }}
              >
                {cfg.icon}
              </span>
            )}
            <input
              type="url"
              value={link}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin();
              }}
              placeholder="Paste Zoom, Meet, or Teams link…"
              disabled={disabled}
              className="w-full text-sm rounded-xl"
              style={{
                paddingLeft: cfg ? 48 : 16,
                paddingRight: 16,
                height: 48,
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                color: "var(--color-text)",
                outline: "none",
                transition: "border-color 0.2s ease, background 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = cfg
                  ? `rgba(${accentRgba}, 0.4)`
                  : "rgba(255, 255, 255, 0.18)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
              }}
            />
          </div>
          <button
            onClick={handleJoin}
            disabled={disabled || !ready}
            className="text-sm font-semibold rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 px-5"
            style={{
              height: 48,
              minWidth: 100,
              background: ready
                ? `linear-gradient(135deg, rgba(${accentRgba}, 0.25), rgba(${accentRgba}, 0.10))`
                : "rgba(255, 255, 255, 0.03)",
              border: ready
                ? `1px solid rgba(${accentRgba}, 0.45)`
                : "1px solid rgba(255, 255, 255, 0.06)",
              color: ready ? cfg!.color : "var(--color-text-muted)",
              boxShadow: ready
                ? `0 12px 30px -12px rgba(${accentRgba}, 0.45)`
                : "none",
              transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {ready ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Join {cfg!.label}
              </>
            ) : (
              "Join"
            )}
          </button>
        </div>

        {link.length > 5 && !platform && (
          <p
            className="text-xs mt-3 m-0 flex items-center gap-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Paste a valid Zoom, Google Meet, or Teams link
          </p>
        )}

        {platform && (
          <div
            className="text-xs mt-3 flex items-center gap-2"
            style={{ color: cfg!.color }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ color: "var(--color-text-silver)" }}>
              <span style={{ color: cfg!.color, fontWeight: 600 }}>{cfg!.label}</span> détecté — Tonvo ouvrira le meeting et démarrera l&apos;analyse automatiquement
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
