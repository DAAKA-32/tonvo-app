"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import TonvoLogo from "@/components/Logo";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/lib/auth-context";
import { getAuthErrorKey } from "@/lib/auth-errors";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
} from "@/lib/firebase";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
function IconEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--color-negative)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="auth-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Collapse                                                           */
/* ------------------------------------------------------------------ */
function Collapse({ open, children, className }: { open: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(-4px)",
            transition: open
              ? "opacity 0.25s ease 0.05s, transform 0.25s cubic-bezier(0.23, 1, 0.32, 1) 0.05s"
              : "opacity 0.15s ease, transform 0.15s ease",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Password Strength                                                  */
/* ------------------------------------------------------------------ */
function getPasswordStrength(pw: string, t: (key: string) => string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: "", color: "transparent" };

  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-zA-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;

  if (score <= 2) return { level: 1, label: t("auth.strengthWeak"), color: "var(--color-negative)" };
  if (score <= 3) return { level: 2, label: t("auth.strengthMedium"), color: "var(--color-neutral)" };
  return { level: 3, label: t("auth.strengthStrong"), color: "var(--color-positive)" };
}

function PasswordStrengthBlock({ password, checks, t }: {
  password: string;
  checks: { minLength: boolean; hasLetter: boolean; hasNumber: boolean };
  t: (key: string) => string;
}) {
  const { level, label, color } = getPasswordStrength(password, t);

  return (
    <div className="flex flex-col gap-2 pt-1">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[3px] flex-1 rounded-full"
              style={{
                backgroundColor: i <= level ? color : "rgba(255, 255, 255, 0.06)",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </div>
        <span
          className="text-[11px] font-medium tabular-nums"
          style={{ color, transition: "color 0.3s ease", minWidth: 48 }}
        >
          {label}
        </span>
      </div>
      <div className="flex gap-4">
        {[
          { ok: checks.minLength, text: t("auth.rule8Chars") },
          { ok: checks.hasLetter, text: t("auth.rule1Letter") },
          { ok: checks.hasNumber, text: t("auth.rule1Number") },
        ].map((rule) => (
          <div key={rule.text} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: rule.ok ? "rgba(52, 211, 153, 0.12)" : "rgba(255, 255, 255, 0.04)",
                transition: "background-color 0.3s ease",
              }}
            >
              {rule.ok && <IconCheck />}
            </div>
            <span
              className="text-[11px]"
              style={{
                color: rule.ok ? "var(--color-positive)" : "var(--color-text-muted)",
                transition: "color 0.3s ease",
              }}
            >
              {rule.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Text Input                                                         */
/* ------------------------------------------------------------------ */
function AuthInput({
  id,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
  rightLabel,
}: {
  id: string;
  type?: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
  rightLabel?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="auth-label">{label}</label>
        {rightLabel}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="auth-input"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Password Input                                                     */
/* ------------------------------------------------------------------ */
function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  required,
  minLength,
  rightLabel,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
  rightLabel?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="auth-label">{label}</label>
        {rightLabel}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          autoComplete={id === "password" ? "current-password" : "new-password"}
          className="auth-input pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0.5 flex items-center rounded transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Consent Modal                                                      */
/* ------------------------------------------------------------------ */
function ConsentModal({
  open,
  onAccept,
  onCancel,
}: {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="auth-modal w-full max-w-md rounded-2xl border p-8"
        style={{
          background: "var(--color-surface)",
          borderColor: "rgba(255, 255, 255, 0.06)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.03)",
        }}
      >
        <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text)" }}>
          {t("auth.consentTitle")}
        </h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {t("auth.consentDescription")}
        </p>

        <label className="flex items-start gap-3 cursor-pointer mb-6" style={{ minHeight: 44 }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="auth-checkbox mt-0.5 shrink-0"
          />
          <span className="text-[13px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {t("auth.termsConsent")}{" "}
            <Link href="/terms" target="_blank" className="auth-link">{t("auth.termsOfService")}</Link>{" "}
            {t("auth.and")}{" "}
            <Link href="/privacy" target="_blank" className="auth-link">{t("auth.privacyPolicy")}</Link>
            {t("auth.termsConsentSuffix")}
          </span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="auth-btn-secondary flex-1 py-2.5 text-sm font-medium"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onAccept}
            disabled={!checked}
            className="auth-btn-primary flex-1 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("auth.consentAccept")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { show } = useToast();
  const { waitForUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<import("firebase/auth").UserCredential | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const passwordChecks = useMemo(() => ({
    minLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }), [password]);

  const isPasswordValid = passwordChecks.minLength && passwordChecks.hasLetter && passwordChecks.hasNumber;

  async function redirectWithFeedback(message: string) {
    setRedirecting(true);
    show(message, { type: "success", duration: 3000 });
    await waitForUser();
    await new Promise((r) => setTimeout(r, 400));
    router.push("/dashboard");
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isRegister) {
      if (!isPasswordValid) {
        setError(t("auth.passwordValidationError"));
        return;
      }
      if (password !== confirmPassword) {
        setError(t("auth.passwordsNoMatch"));
        return;
      }
    }

    setLoading(true);
    try {
      if (!auth) throw new Error("firebase-not-initialized");
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        try {
          const { supabase } = await import("@/lib/supabase");
          await supabase.from("user_consent").upsert({
            user_id: cred.user.uid,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
            privacy_accepted: true,
          });
        } catch {
          console.error("Failed to store consent");
        }
        redirectWithFeedback(t("auth.accountCreated"));
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        redirectWithFeedback(t("auth.welcomeBackToast"));
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "firebase-not-initialized") {
        setError(t("auth.firebaseNotInitialized"));
      } else {
        setError(t(getAuthErrorKey(err)));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setError("");
    try {
      if (!auth || !googleProvider) throw new Error("firebase-not-initialized");
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      const isNew = u.metadata.creationTime === u.metadata.lastSignInTime;
      if (isNew) {
        setPendingGoogleUser(result);
        setShowConsent(true);
      } else {
        redirectWithFeedback(t("auth.welcomeBackToast"));
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "firebase-not-initialized") {
        setError(t("auth.firebaseNotInitialized"));
      } else {
        setError(t(getAuthErrorKey(err)));
      }
    }
  }

  async function handleConsentAccept() {
    setShowConsent(false);
    if (pendingGoogleUser) {
      try {
        const { supabase } = await import("@/lib/supabase");
        await supabase.from("user_consent").upsert({
          user_id: pendingGoogleUser.user.uid,
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted: true,
        });
      } catch {
        console.error("Failed to store consent");
      }
    }
    setPendingGoogleUser(null);
    redirectWithFeedback(t("auth.accountCreated"));
  }

  async function handleConsentCancel() {
    setShowConsent(false);
    setPendingGoogleUser(null);
    try {
      if (auth) await firebaseSignOut(auth);
    } catch {
      // ignore
    }
  }

  const handleToggle = useCallback(() => {
    setIsRegister((prev) => !prev);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setAcceptedTerms(false);
  }, []);

  return (
    <div className="auth-page">
      {/* Background */}
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-bg-base" />
        <div className="auth-bg-glow auth-bg-glow-1" />
        <div className="auth-bg-glow auth-bg-glow-2" />
        <div className="auth-bg-glow auth-bg-glow-3" />
        <div className="auth-bg-grid" />
        <div className="auth-bg-noise" />
        <div className="auth-bg-vignette" />
      </div>

      {/* Back to home */}
      <nav className="auth-nav">
        <Link href="/" className="auth-nav-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {t("auth.backBtn")}
        </Link>
      </nav>

      {/* Main content */}
      <main
        ref={cardRef}
        className={isRegister ? "auth-container auth-container--signup" : "auth-container"}
        style={{
          opacity: mounted && !redirecting ? 1 : 0,
          transform: mounted && !redirecting ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1), transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          pointerEvents: redirecting ? "none" : "auto",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <TonvoLogo size="lg" showText={false} />
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="auth-heading">
            {isRegister ? t("auth.createAccount") : t("auth.welcomeBack")}
          </h1>
          <p className="auth-subheading">
            {isRegister ? t("auth.signUpSubtitle") : t("auth.signInSubtitle")}
          </p>
        </div>

        {/* Google Auth — placed first like Resend */}
        <button
          onClick={handleGoogleAuth}
          className="auth-btn-google"
          type="button"
        >
          <GoogleIcon />
          {t("auth.continueWithGoogle")}
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">{t("auth.or")}</span>
          <div className="auth-divider-line" />
        </div>

        {/* Error */}
        <Collapse open={!!error}>
          <div className="auth-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        </Collapse>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="auth-form">
          <AuthInput
            id="email"
            type="email"
            label={t("auth.emailLabel")}
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
          />

          {/* Password row — side by side in signup, single in login */}
          <div className={isRegister ? "grid grid-cols-2 gap-3" : ""}>
            <PasswordInput
              id="password"
              label={t("auth.passwordLabel")}
              placeholder={isRegister ? t("auth.passwordPlaceholderSignup") : t("auth.passwordPlaceholderLogin")}
              value={password}
              onChange={setPassword}
              required
              minLength={isRegister ? 8 : 6}
            />

            {isRegister && (
              <PasswordInput
                id="confirmPassword"
                label={t("auth.confirmPasswordLabel")}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                minLength={8}
              />
            )}
          </div>

          {/* Password strength (signup) */}
          <Collapse open={isRegister && password.length > 0}>
            <PasswordStrengthBlock password={password} checks={passwordChecks} t={t} />
          </Collapse>

          {/* Password match indicator (signup) */}
          <Collapse open={isRegister && confirmPassword.length > 0}>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: password === confirmPassword
                    ? "rgba(52, 211, 153, 0.12)"
                    : "rgba(248, 113, 113, 0.12)",
                  transition: "background-color 0.3s ease",
                }}
              >
                {password === confirmPassword ? <IconCheck /> : <IconX />}
              </div>
              <span
                className="text-[11px]"
                style={{
                  color: password === confirmPassword ? "var(--color-positive)" : "var(--color-negative)",
                  transition: "color 0.3s ease",
                }}
              >
                {password === confirmPassword ? t("auth.passwordsMatch") : t("auth.passwordsNoMatch")}
              </span>
            </div>
          </Collapse>

          {/* Terms consent — checkbox for signup only */}
          <Collapse open={isRegister}>
            <label className="auth-terms-label">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="auth-checkbox shrink-0"
              />
              <span className="text-[13px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {t("auth.termsConsent")}{" "}
                <Link href="/terms" target="_blank" className="auth-link">{t("auth.termsOfService")}</Link>{" "}
                {t("auth.and")}{" "}
                <Link href="/privacy" target="_blank" className="auth-link">{t("auth.privacyPolicy")}</Link>
                {t("auth.termsConsentSuffix")}
              </span>
            </label>
          </Collapse>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || (isRegister && !acceptedTerms)}
            className="auth-btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <SpinnerIcon />
                {t("common.loading")}
              </span>
            ) : (
              isRegister ? t("auth.createAccountBtn") : t("auth.signIn")
            )}
          </button>

          {/* Passive legal notice — login only */}
          {!isRegister && (
            <p className="auth-passive-consent">
              {t("auth.signingInConsent")}{" "}
              <Link href="/terms" target="_blank" className="auth-link">{t("auth.termsOfService")}</Link>{" "}
              {t("auth.and")}{" "}
              <Link href="/privacy" target="_blank" className="auth-link">{t("auth.privacyPolicy")}</Link>.
            </p>
          )}
        </form>

        {/* Toggle mode */}
        <p className="auth-toggle">
          {isRegister ? t("auth.alreadyHaveAccount") : t("auth.noAccount")}{" "}
          <button onClick={handleToggle} className="auth-toggle-btn" type="button">
            {isRegister ? t("auth.signInLink") : t("auth.signUpLink")}
          </button>
        </p>
      </main>

      {/* Consent modal */}
      <ConsentModal
        open={showConsent}
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
      />
    </div>
  );
}
