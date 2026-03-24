"use client";

import { useTranslation } from "react-i18next";
import type { Participant } from "@/hooks/useParticipants";

interface ParticipantsListProps {
  participants: Participant[];
}

const AVATAR_COLORS = ["#818cf8", "#34d399", "#fb923c", "#f87171", "#38bdf8", "#c084fc"];

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  const { t } = useTranslation();
  if (participants.length === 0) return null;

  return (
    <div className="participants-list">
      <div className="participants-list__header">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>{t("copilot.participantCount", { count: participants.length })}</span>
      </div>
      <div className="participants-list__items">
        {participants.map((p, i) => {
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          const isActive = Date.now() - p.lastActive < 10000; // active in last 10s
          return (
            <div key={p.id} className="participants-list__item">
              <div
                className="participants-list__avatar"
                style={{ backgroundColor: color + "22", color, borderColor: isActive ? color : "transparent" }}
              >
                {p.isUser ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                ) : (
                  <span className="participants-list__initial">
                    {p.label.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="participants-list__name" style={{ color: p.isUser ? color : undefined }}>
                {p.label}
              </span>
              {isActive && <span className="participants-list__active-dot" style={{ backgroundColor: color }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
