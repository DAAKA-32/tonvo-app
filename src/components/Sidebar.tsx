"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { auth, firebaseSignOut } from "@/lib/firebase";
import TonvoLogo from "@/components/Logo";

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function IconText() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
    </svg>
  );
}

function IconPricing() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "U";
}

const navItems = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: IconDashboard },
  { href: "/session", labelKey: "nav.liveSession", icon: IconMic },
  { href: "/history", labelKey: "nav.history", icon: IconHistory },
  { href: "/analyze-text", labelKey: "nav.analyzeText", icon: IconText },
  { href: "/analytics", labelKey: "nav.analytics", icon: IconAnalytics },
  { href: "/pricing", labelKey: "nav.pricing", icon: IconPricing },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user } = useAuth();
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    if (!user) return;
    fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid }),
    })
      .then((r) => r.json())
      .then((data) => { if (data.plan) setPlan(data.plan); })
      .catch(() => {});
  }, [user]);

  return (
    <>
      <div className={`sidebar-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Logo */}
        <Link href="/" className="sidebar-logo">
          <TonvoLogo size="sidebar" />
        </Link>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">{t("nav.menu")}</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                onClick={onClose}>
                <item.icon />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {user && (
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl"
              style={{
                background: pathname === "/profile" ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.02)",
                textDecoration: "none",
                transition: "background 0.15s ease",
              }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(200,200,216,0.12) 0%, rgba(200,200,216,0.04) 100%)",
                  color: "var(--color-accent-light)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}>
                {getInitials(user.displayName, user.email)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium m-0 truncate" style={{ color: "var(--color-text)" }}>
                  {user.displayName || "User"}
                </p>
                <p className="text-xs m-0 truncate" style={{ color: "var(--color-text-muted)", fontSize: 11 }}>
                  {user.email}
                </p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{
                  background: plan === "free" ? "rgba(200, 200, 216, 0.08)" : "rgba(52, 211, 153, 0.12)",
                  color: plan === "free" ? "var(--color-text-muted)" : "var(--color-positive)",
                  border: plan === "free" ? "1px solid rgba(200, 200, 216, 0.1)" : "1px solid rgba(52, 211, 153, 0.2)",
                }}>
                {plan === "free" ? t("common.free") : plan === "pro" ? t("common.pro") : t("common.team")}
              </span>
            </Link>
          )}
          <Link
            href="/settings"
            onClick={onClose}
            className={`sidebar-link ${pathname === "/settings" ? "active" : ""}`}>
            <IconSettings />
            {t("nav.settings")}
          </Link>
        </div>
      </aside>
    </>
  );
}
