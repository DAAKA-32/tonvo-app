"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import {
  auth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  firebaseSignOut,
} from "@/lib/firebase";
import { authFetch } from "@/lib/api-client";
import AppShell from "@/components/AppShell";
import { SUPPORTED_LANGUAGES } from "@/i18n/config";

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}


function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Wrapper                                                    */
/* ------------------------------------------------------------------ */
function SettingsSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="kpi-card mb-4" style={{ padding: "24px" }}>
      <div className="flex items-center gap-3 mb-5">
        <div
          className="kpi-icon"
          style={{ width: 32, height: 32, borderRadius: 8 }}>
          {icon}
        </div>
        <h2 className="text-sm font-semibold m-0 uppercase" style={{ color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings Row                                                       */
/* ------------------------------------------------------------------ */
function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{
        borderBottom: "1px solid rgba(39, 39, 42, 0.5)",
        gap: 16,
        flexWrap: "wrap",
      }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium m-0" style={{ color: "var(--color-text)" }}>
          {label}
        </p>
        {description && (
          <p className="text-xs m-0 mt-1" style={{ color: "var(--color-text-muted)" }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [plan, setPlan] = useState("free");
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Subscription
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    authFetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.plan) setPlan(data.plan);
        if (data.currentPeriodEnd) setPeriodEnd(data.currentPeriodEnd);
        if (data.cancelAtPeriodEnd != null) setCancelAtPeriodEnd(data.cancelAtPeriodEnd);
      })
      .catch(() => {});
  }, [user]);

  const isEmailUser = user?.providerData?.[0]?.providerId === "password";

  async function handleChangePassword() {
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError(t("settings.passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("settings.passwordMismatch"));
      return;
    }
    if (!auth?.currentUser || !user?.email) return;

    setPasswordLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setPasswordSuccess(true);
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError(t("settings.passwordIncorrect"));
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleCancelOrReactivate() {
    if (!user) return;
    setCancelLoading(true);
    try {
      const action = cancelAtPeriodEnd ? "reactivate" : "cancel";
      const res = await authFetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, action }),
      });
      const data = await res.json();
      if (data.canceled) setCancelAtPeriodEnd(true);
      if (data.reactivated) setCancelAtPeriodEnd(false);
    } catch {
      // fail silently
    } finally {
      setCancelLoading(false);
    }
  }

  async function handleManageBilling() {
    if (!user) return;
    setPortalLoading(true);
    try {
      const res = await authFetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // fail silently
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleSignOut() {
    if (auth) await firebaseSignOut(auth);
  }

  async function handleLanguageChange(langCode: string) {
    const { loadLanguage } = await import("@/i18n/config");
    await loadLanguage(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem("tonvo-language", langCode);
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 720 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(200, 200, 216, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}>
            <IconSettings />
          </div>
          <div>
            <h1 className="text-xl font-bold m-0" style={{ color: "var(--color-text)" }}>
              {t("settings.title")}
            </h1>
            <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
              {t("settings.subtitle")}
            </p>
          </div>
        </div>

        {/* ---- Language ---- */}
        <SettingsSection icon={<IconGlobe />} title={t("settings.language")}>
          <SettingsRow
            label={t("settings.languageLabel")}
            description={t("settings.languageDesc")}>
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="border-none cursor-pointer text-sm font-medium"
              style={{
                background: "var(--color-surface-2)",
                color: "var(--color-text)",
                borderRadius: 10,
                padding: "8px 14px",
                outline: "none",
                border: "1px solid var(--color-border)",
                minWidth: 160,
              }}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </SettingsRow>
        </SettingsSection>

        {/* ---- Security ---- */}
        <SettingsSection icon={<IconLock />} title={t("settings.security")}>
          <SettingsRow
            label={t("settings.password")}
            description={isEmailUser ? t("settings.changePasswordDesc") : t("settings.managedByGoogle")}>
            {isEmailUser ? (
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="btn-secondary"
                style={{ padding: "6px 16px", fontSize: 12 }}>
                {showPasswordForm ? t("common.cancel") : t("common.change")}
              </button>
            ) : (
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {t("settings.googleSSO")}
              </span>
            )}
          </SettingsRow>

          {showPasswordForm && isEmailUser && (
            <div
              className="mt-4 p-4 rounded-xl"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
              }}>
              <div className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder={t("settings.currentPassword")}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="login-input"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "var(--color-text)",
                    fontSize: 13,
                    outline: "none",
                    width: "100%",
                  }}
                />
                <input
                  type="password"
                  placeholder={t("settings.newPassword")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="login-input"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "var(--color-text)",
                    fontSize: 13,
                    outline: "none",
                    width: "100%",
                  }}
                />
                <input
                  type="password"
                  placeholder={t("settings.confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="login-input"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "var(--color-text)",
                    fontSize: 13,
                    outline: "none",
                    width: "100%",
                  }}
                />
                {passwordError && (
                  <p className="text-xs m-0" style={{ color: "var(--color-negative)" }}>
                    {passwordError}
                  </p>
                )}
                {passwordSuccess && (
                  <p className="text-xs m-0" style={{ color: "var(--color-positive)" }}>
                    {t("settings.passwordUpdated")}
                  </p>
                )}
                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="btn-primary"
                  style={{ padding: "8px 20px", fontSize: 13, width: "fit-content" }}>
                  {passwordLoading ? t("common.updating") : t("settings.updatePassword")}
                </button>
              </div>
            </div>
          )}

          <SettingsRow label={t("settings.activeSessions")} description={t("settings.activeSessionsDesc")}>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 border-none bg-transparent cursor-pointer text-xs font-medium"
              style={{ color: "var(--color-negative)", padding: 0 }}>
              <IconLogout />
              {t("nav.signOut")}
            </button>
          </SettingsRow>
        </SettingsSection>

        {/* ---- Privacy ---- */}
        <SettingsSection icon={<IconShield />} title={t("settings.privacy")}>
          <SettingsRow
            label={t("settings.dataRetention")}
            description={plan === "free" ? t("settings.dataRetentionFree") : t("settings.dataRetentionPaid")}>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background: plan === "free" ? "rgba(200, 200, 216, 0.08)" : "rgba(52, 211, 153, 0.12)",
                color: plan === "free" ? "var(--color-text-muted)" : "var(--color-positive)",
                border: plan === "free" ? "1px solid rgba(200, 200, 216, 0.1)" : "1px solid rgba(52, 211, 153, 0.2)",
              }}>
              {plan === "free" ? t("settings.days7") : t("settings.unlimited")}
            </span>
          </SettingsRow>

          <SettingsRow
            label={t("settings.analyticsLabel")}
            description={t("settings.analyticsDesc")}>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {t("settings.anonymized")}
            </span>
          </SettingsRow>
        </SettingsSection>

        {/* ---- Billing ---- */}
        <SettingsSection icon={<IconCreditCard />} title={t("settings.billing")}>
          <SettingsRow
            label={t("settings.currentPlan")}
            description={
              plan === "free"
                ? t("settings.planFreeDesc")
                : plan === "pro"
                ? t("settings.planProDesc")
                : t("settings.planTeamDesc")
            }>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: plan === "free" ? "rgba(200, 200, 216, 0.08)" : "rgba(52, 211, 153, 0.12)",
                color: plan === "free" ? "var(--color-text-muted)" : "var(--color-positive)",
                border: plan === "free" ? "1px solid rgba(200, 200, 216, 0.1)" : "1px solid rgba(52, 211, 153, 0.2)",
              }}>
              {plan === "free" ? t("common.free") : plan === "pro" ? t("common.pro") : t("common.team")}
            </span>
          </SettingsRow>

          {/* Renewal info */}
          {plan !== "free" && periodEnd && (
            <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: cancelAtPeriodEnd ? "rgba(248, 113, 113, 0.06)" : "rgba(52, 211, 153, 0.06)", border: cancelAtPeriodEnd ? "1px solid rgba(248, 113, 113, 0.15)" : "1px solid rgba(52, 211, 153, 0.15)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: cancelAtPeriodEnd ? "var(--color-negative)" : "var(--color-positive)" }} />
                <span className="text-xs font-semibold" style={{ color: cancelAtPeriodEnd ? "var(--color-negative)" : "var(--color-positive)" }}>
                  {cancelAtPeriodEnd ? t("settings.cancelsOn") : t("settings.autoRenewsOn")} {new Date(periodEnd).toLocaleDateString(i18n.language, { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
                {cancelAtPeriodEnd
                  ? t("settings.cancelDesc")
                  : t("settings.renewDesc")}
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-4" style={{ flexWrap: "wrap" }}>
            {plan === "free" ? (
              <a
                href="/pricing"
                className="btn-primary"
                style={{
                  padding: "8px 20px",
                  fontSize: 13,
                  textDecoration: "none",
                  display: "inline-block",
                }}>
                {t("settings.upgradePlan")}
              </a>
            ) : (
              <>
                <button
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="btn-secondary"
                  style={{ padding: "8px 20px", fontSize: 13 }}>
                  {portalLoading ? t("common.loading") : t("settings.manageSubscription")}
                </button>
                <button
                  onClick={handleCancelOrReactivate}
                  disabled={cancelLoading}
                  className="btn-secondary"
                  style={{
                    padding: "8px 20px",
                    fontSize: 13,
                    borderColor: cancelAtPeriodEnd ? "rgba(52, 211, 153, 0.3)" : "rgba(248, 113, 113, 0.3)",
                    color: cancelAtPeriodEnd ? "var(--color-positive)" : "var(--color-negative)",
                  }}>
                  {cancelLoading
                    ? t("common.loading")
                    : cancelAtPeriodEnd
                      ? t("settings.reactivateSubscription")
                      : t("settings.cancelSubscription")}
                </button>
              </>
            )}
          </div>
        </SettingsSection>

        {/* ---- Data & Privacy Rights ---- */}
        <SettingsSection icon={<IconShield />} title="Data Rights">
          <SettingsRow
            label="Request data export"
            description="Download a copy of all your personal data in a machine-readable format.">
            <a
              href={`mailto:tonvoco.pro@gmail.com?subject=Data%20Export%20Request&body=User%20ID:%20${user?.uid}`}
              className="btn-secondary text-xs no-underline"
              style={{ padding: "6px 16px", fontSize: 12 }}>
              Request Export
            </a>
          </SettingsRow>
          <SettingsRow
            label="Request data deletion"
            description="Request permanent deletion of all your personal data and session history.">
            <a
              href={`mailto:tonvoco.pro@gmail.com?subject=Data%20Deletion%20Request&body=User%20ID:%20${user?.uid}`}
              className="btn-secondary text-xs no-underline"
              style={{ padding: "6px 16px", fontSize: 12 }}>
              Request Deletion
            </a>
          </SettingsRow>
          <div
            className="flex items-center gap-4 pt-4 flex-wrap"
            style={{ borderTop: "1px solid rgba(39, 39, 42, 0.5)" }}>
            <a href="/privacy" className="text-xs no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>Privacy Policy</a>
            <a href="/terms" className="text-xs no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>Terms of Service</a>
            <a href="/cookies" className="text-xs no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>Cookie Policy</a>
            <a href="/legal" className="text-xs no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>Legal Notice</a>
          </div>
        </SettingsSection>

        {/* ---- Danger Zone ---- */}
        <div
          className="kpi-card mb-4"
          style={{
            padding: "24px",
            borderColor: "rgba(248, 113, 113, 0.15)",
          }}>
          <h2
            className="text-sm font-semibold m-0 mb-4 uppercase"
            style={{ color: "var(--color-negative)", letterSpacing: "0.04em" }}>
            {t("settings.dangerZone")}
          </h2>
          <SettingsRow
            label={t("settings.deleteAccount")}
            description={t("settings.deleteAccountDesc")}>
            <button
              className="btn-secondary text-xs"
              style={{
                padding: "6px 16px",
                fontSize: 12,
                borderColor: "rgba(248, 113, 113, 0.3)",
                color: "var(--color-negative)",
              }}
              onClick={() => alert(t("settings.deleteAccountAlert"))}>
              {t("settings.deleteAccount")}
            </button>
          </SettingsRow>
        </div>
      </div>
    </AppShell>
  );
}
