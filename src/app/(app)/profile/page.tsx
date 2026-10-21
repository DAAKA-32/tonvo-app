"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { auth, updateProfile } from "@/lib/firebase";
import { authFetch } from "@/lib/api-client";
import AppShell from "@/components/AppShell";

interface SubscriptionInfo {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
  sessionsUsed: number;
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    authFetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid }),
    })
      .then((r) => r.json())
      .then((data) => setSubscription(data))
      .catch(() => {});
  }, [user]);

  async function handleSaveProfile() {
    if (!auth?.currentUser) return;
    setSaving(true);
    setError("");
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError(t("profile.profileUpdateFailed"));
    } finally {
      setSaving(false);
    }
  }

  const planLabel = subscription?.plan === "pro" ? "Plus" : subscription?.plan === "team" ? "Team" : "Free";
  const planColor = subscription?.plan === "free"
    ? "var(--color-text-muted)"
    : "var(--color-positive)";
  const planBg = subscription?.plan === "free"
    ? "var(--color-surface-2)"
    : "rgba(52, 211, 153, 0.12)";
  const planBorder = subscription?.plan === "free"
    ? "1px solid var(--color-border)"
    : "1px solid rgba(52, 211, 153, 0.2)";

  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "---";

  return (
    <AppShell>
      <div style={{ maxWidth: 720 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
            }}>
            <IconUser />
          </div>
          <div>
            <h1 className="text-xl font-bold m-0" style={{ color: "var(--color-text)" }}>
              {t("profile.title")}
            </h1>
            <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
              {t("profile.subtitle")}
            </p>
          </div>
        </div>

        {/* Avatar + Name Card */}
        <div
          className="kpi-card mb-6"
          style={{ padding: "32px" }}>
          <div className="flex items-start gap-6" style={{ flexWrap: "wrap" }}>
            {/* Avatar */}
            <div
              className="shrink-0 flex items-center justify-center rounded-full text-2xl font-bold"
              style={{
                width: 80,
                height: 80,
                background: "var(--color-surface-2)",
                color: "var(--color-accent-light)",
                border: "2px solid var(--color-border)",
              }}>
              {getInitials(user?.displayName, user?.email)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex flex-col gap-3">
                  <label
                    className="text-xs font-medium"
                    style={{ color: "var(--color-text-muted)" }}>
                    {t("profile.displayName")}
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="login-input w-full"
                    style={{
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      color: "var(--color-text)",
                      fontSize: 14,
                      outline: "none",
                    }}
                    autoFocus
                  />
                  {error && (
                    <p className="text-xs m-0" style={{ color: "var(--color-negative)" }}>
                      {error}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="btn-primary"
                      style={{ padding: "8px 20px", fontSize: 13 }}>
                      {saving ? t("common.saving") : t("common.save")}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setDisplayName(user?.displayName || "");
                        setError("");
                      }}
                      className="btn-secondary"
                      style={{ padding: "8px 20px", fontSize: 13 }}>
                      {t("common.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-semibold m-0" style={{ color: "var(--color-text)" }}>
                      {user?.displayName || "User"}
                    </h2>
                    {saved && (
                      <span
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: "var(--color-positive)" }}>
                        <IconCheck /> {t("common.saved")}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs font-medium border-none bg-transparent cursor-pointer"
                    style={{
                      color: "var(--color-accent-light)",
                      padding: 0,
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}>
                    {t("profile.editName")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))" }}>
          {/* Email */}
          <div className="kpi-card" style={{ padding: "20px 24px" }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="kpi-icon"
                style={{ width: 32, height: 32, borderRadius: 8 }}>
                <IconMail />
              </div>
              <span className="text-xs font-semibold uppercase" style={{ color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
                {t("profile.email")}
              </span>
            </div>
            <p className="text-sm font-medium m-0" style={{ color: "var(--color-text)" }}>
              {user?.email || "---"}
            </p>
          </div>

          {/* Account Created */}
          <div className="kpi-card" style={{ padding: "20px 24px" }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="kpi-icon"
                style={{ width: 32, height: 32, borderRadius: 8 }}>
                <IconCalendar />
              </div>
              <span className="text-xs font-semibold uppercase" style={{ color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
                {t("profile.memberSince")}
              </span>
            </div>
            <p className="text-sm font-medium m-0" style={{ color: "var(--color-text)" }}>
              {createdAt}
            </p>
          </div>
        </div>

        {/* Plan Card */}
        <div className="kpi-card mt-4" style={{ padding: "20px 24px" }}>
          <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
            <div>
              <span
                className="text-xs font-semibold uppercase block mb-2"
                style={{ color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
                {t("profile.currentPlan")}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{
                    background: planBg,
                    color: planColor,
                    border: planBorder,
                  }}>
                  {planLabel}
                </span>
                {subscription?.status && subscription.status !== "none" && (
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {subscription.status}
                  </span>
                )}
              </div>
            </div>

            {subscription?.plan === "free" && (
              <a
                href="/plans"
                className="btn-primary"
                style={{
                  padding: "8px 20px",
                  fontSize: 13,
                  textDecoration: "none",
                  display: "inline-block",
                }}>
                {t("common.upgrade")}
              </a>
            )}
          </div>

          {subscription?.plan !== "free" && subscription?.currentPeriodEnd && (
            <p className="text-xs mt-3 mb-0" style={{ color: "var(--color-text-muted)" }}>
              Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {subscription?.plan === "free" && (
            <p className="text-xs mt-3 mb-0" style={{ color: "var(--color-text-muted)" }}>
              {t("profile.sessionsUsed", { used: subscription.sessionsUsed })}
            </p>
          )}
        </div>

        {/* Auth Provider */}
        <div className="kpi-card mt-4" style={{ padding: "20px 24px" }}>
          <span
            className="text-xs font-semibold uppercase block mb-2"
            style={{ color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
            {t("profile.signInMethod")}
          </span>
          <div className="flex items-center gap-2">
            {user?.providerData?.[0]?.providerId === "google.com" ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm" style={{ color: "var(--color-text)" }}>{t("common.google")}</span>
              </>
            ) : (
              <>
                <IconMail />
                <span className="text-sm" style={{ color: "var(--color-text)" }}>{t("common.emailPassword")}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
