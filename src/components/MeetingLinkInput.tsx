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

const PLATFORM_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  zoom: {
    label: "Zoom",
    color: "#2D8CFF",
    bg: "rgba(45, 140, 255, 0.1)",
    icon: "Z",
  },
  meet: {
    label: "Google Meet",
    color: "#00897B",
    bg: "rgba(0, 137, 123, 0.1)",
    icon: "M",
  },
  teams: {
    label: "Microsoft Teams",
    color: "#6264A7",
    bg: "rgba(98, 100, 167, 0.1)",
    icon: "T",
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

  return (
    <div className="meeting-link">
      <div className="meeting-link__header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 10l5 5-5 5" />
          <path d="M4 4v7a4 4 0 0 0 4 4h12" />
        </svg>
        <span>Join a meeting</span>
      </div>

      <div className="meeting-link__row">
        <div className="meeting-link__input-wrap">
          {cfg && (
            <span className="meeting-link__platform-badge" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
              {cfg.icon}
            </span>
          )}
          <input
            className="meeting-link__input"
            type="url"
            value={link}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
            placeholder="Paste Zoom, Meet, or Teams link..."
            disabled={disabled}
            style={cfg ? { paddingLeft: 36 } : undefined}
          />
        </div>
        <button
          className="meeting-link__btn"
          onClick={handleJoin}
          disabled={disabled || !platform || !isValidUrl(link)}
          style={cfg ? { backgroundColor: cfg.bg, color: cfg.color, borderColor: `${cfg.color}33` } : undefined}
        >
          {cfg ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Join {cfg.label}
            </>
          ) : (
            "Join"
          )}
        </button>
      </div>

      {link.length > 5 && !platform && (
        <p className="meeting-link__hint">Paste a valid Zoom, Google Meet, or Teams meeting link</p>
      )}

      {platform && (
        <div className="meeting-link__info" style={{ color: cfg!.color }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          {cfg!.label} detected — Tonvo will open the meeting and start analyzing automatically
        </div>
      )}
    </div>
  );
}
