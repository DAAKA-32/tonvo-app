"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import TonvoLogo from "@/components/Logo";
import { useToast } from "@/components/Toast";
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
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

/* ------------------------------------------------------------------ */
/*  Collapsible wrapper — animates height via grid trick              */
/* ------------------------------------------------------------------ */
function Collapse({ open, children, className }: { open: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(-6px)",
            transition: open
              ? "opacity 0.3s ease 0.08s, transform 0.3s cubic-bezier(0.23, 1, 0.32, 1) 0.08s"
              : "opacity 0.2s ease, transform 0.2s ease",
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
    <div className="flex flex-col gap-2.5 pt-1 pb-1">
      {/* Strength bars */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{
                backgroundColor: i <= level ? color : "var(--color-surface-3)",
                transition: "background-color 0.4s ease",
              }}
            />
          ))}
        </div>
        <span
          className="text-xs font-medium"
          style={{ color, transition: "color 0.3s ease", minWidth: 48 }}
        >
          {label}
        </span>
      </div>

      {/* Criteria */}
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
                backgroundColor: rule.ok ? "rgba(52, 211, 153, 0.15)" : "rgba(255, 255, 255, 0.04)",
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
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          className="login-input w-full rounded-lg border px-4 py-3 pr-11 text-sm outline-none transition-all"
          style={{
            backgroundColor: "rgba(26, 26, 30, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.06)",
            color: "var(--color-text)",
          }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0 flex items-center"
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
/*  Consent Modal for Google OAuth new users                          */
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
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-8"
        style={{
          background: "rgba(17, 17, 20, 0.92)",
          backdropFilter: "blur(24px)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
          animation: "fadeScaleIn 0.2s ease-out",
        }}
      >
        <h2
          className="text-lg font-bold mb-2"
          style={{ color: "var(--color-text)" }}
        >
          {t("auth.consentTitle")}
        </h2>
        <p
          className="text-sm mb-6 leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t("auth.consentDescription")}
        </p>

        <label className="flex items-start gap-3 cursor-pointer mb-6" style={{ minHeight: 44 }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 shrink-0 cursor-pointer"
            style={{ width: 16, height: 16, accentColor: "var(--color-accent-light)" }}
          />
          <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {t("auth.termsConsent")}{" "}
            <Link href="/terms" target="_blank" style={{ color: "var(--color-accent-light)", textDecoration: "underline", textUnderlineOffset: 2 }}>
              {t("auth.termsOfService")}
            </Link>{" "}
            {t("auth.and")}{" "}
            <Link href="/privacy" target="_blank" style={{ color: "var(--color-accent-light)", textDecoration: "underline", textUnderlineOffset: 2 }}>
              {t("auth.privacyPolicy")}
            </Link>
            {t("auth.termsConsentSuffix")}
          </span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-lg py-3 text-sm font-medium border transition-all"
            style={{
              backgroundColor: "transparent",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "var(--color-text-muted)",
            }}
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onAccept}
            disabled={!checked}
            className="flex-1 cursor-pointer rounded-lg py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: checked
                ? "linear-gradient(135deg, #5c5c6e 0%, #6e6e82 100%)"
                : "rgba(92, 92, 110, 0.3)",
              boxShadow: checked ? "0 4px 14px rgba(92, 92, 110, 0.35)" : "none",
            }}
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
  const [headingFade, setHeadingFade] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const passwordChecks = useMemo(() => ({
    minLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }), [password]);

  const isPasswordValid = passwordChecks.minLength && passwordChecks.hasLetter && passwordChecks.hasNumber;

  /** Show success toast, fade out card, then redirect */
  function redirectWithFeedback(message: string) {
    setRedirecting(true);
    show(message, { type: "success", duration: 3000 });
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
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
        // Store consent for email signup
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
      // Detect new user: creationTime === lastSignInTime means just created
      const isNew =
        u.metadata.creationTime === u.metadata.lastSignInTime;
      if (isNew) {
        // New user -> show consent modal before proceeding
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
    // Store consent in Supabase
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
        // Non-blocking: consent storage failure shouldn't prevent account creation
        console.error("Failed to store consent");
      }
    }
    setPendingGoogleUser(null);
    redirectWithFeedback(t("auth.accountCreated"));
  }

  async function handleConsentCancel() {
    // User refused terms -> sign them out and reset
    setShowConsent(false);
    setPendingGoogleUser(null);
    try {
      if (auth) await firebaseSignOut(auth);
    } catch {
      // ignore
    }
  }

  const handleToggle = useCallback(() => {
    setHeadingFade(true);
    setTimeout(() => {
      setIsRegister((prev) => !prev);
      setError("");
      setPassword("");
      setConfirmPassword("");
      setHeadingFade(false);
    }, 150);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-8">
      {/* Background ambient blurs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute top-[-20%] left-[-10%] h-150 w-150 rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(200, 200, 216, 0.6) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] h-125 w-125 rounded-full opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(184, 184, 200, 0.6) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[40%] right-[20%] h-75 w-75 rounded-full opacity-10 blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(200, 200, 216, 0.6) 0%, transparent 70%)" }}
        />
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-20 flex items-center gap-2 text-sm font-medium no-underline rounded-lg px-3 py-2 transition-all"
        style={{
          color: "var(--color-text-muted)",
          background: "rgba(17, 17, 20, 0.4)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.04)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-text)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--color-text-muted)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.04)";
        }}
      >
        <IconArrowLeft />
        {t("auth.backBtn")}
      </Link>

      {/* Glass card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-105 rounded-2xl border p-6 sm:p-8 md:p-10 mx-4 sm:mx-0"
        style={{
          background: "rgba(17, 17, 20, 0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: "rgba(255, 255, 255, 0.06)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
          opacity: redirecting ? 0 : 1,
          transform: redirecting ? "scale(0.97) translateY(-8px)" : "scale(1) translateY(0)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          pointerEvents: redirecting ? "none" : "auto",
        }}
      >
        {/* Logo + Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-5">
            <TonvoLogo size="lg" showText={false} />
          </div>
          <h1
            className="text-xl sm:text-[26px] font-bold tracking-tight"
            style={{
              color: "var(--color-text)",
              opacity: headingFade ? 0 : 1,
              transform: headingFade ? "translateY(4px)" : "translateY(0)",
              transition: "opacity 0.15s ease, transform 0.15s ease",
            }}
          >
            {isRegister ? t("auth.createAccount") : t("auth.welcomeBack")}
          </h1>
          <p
            className="mt-2 text-sm"
            style={{
              color: "var(--color-text-muted)",
              opacity: headingFade ? 0 : 1,
              transform: headingFade ? "translateY(4px)" : "translateY(0)",
              transition: "opacity 0.15s ease, transform 0.15s ease",
            }}
          >
            {isRegister ? t("auth.signUpSubtitle") : t("auth.signInSubtitle")}
          </p>
        </div>

        {/* Error — animated */}
        <Collapse open={!!error}>
          <div
            className="mb-5 rounded-lg px-4 py-3 text-sm"
            style={{
              backgroundColor: "rgba(255, 71, 87, 0.08)",
              border: "1px solid rgba(255, 71, 87, 0.15)",
              color: "var(--color-negative)",
            }}
          >
            {error}
          </div>
        </Collapse>

        {/* Form — single persistent form, no remount */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("auth.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all"
              style={{
                backgroundColor: "rgba(26, 26, 30, 0.6)",
                borderColor: "rgba(255, 255, 255, 0.06)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <PasswordInput
            id="password"
            label={t("auth.passwordLabel")}
            placeholder={isRegister ? t("auth.passwordPlaceholderSignup") : t("auth.passwordPlaceholderLogin")}
            value={password}
            onChange={setPassword}
            required
            minLength={isRegister ? 8 : 6}
          />

          {/* Password strength + criteria — collapse animated (signup only) */}
          <Collapse open={isRegister && password.length > 0}>
            <PasswordStrengthBlock password={password} checks={passwordChecks} t={t} />
          </Collapse>

          {/* Confirm password — collapse animated (signup only) */}
          <Collapse open={isRegister}>
            <div className="pt-0 pb-0">
              <PasswordInput
                id="confirmPassword"
                label={t("auth.confirmPasswordLabel")}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={setConfirmPassword}
                required={isRegister}
                minLength={8}
              />

              {/* Match indicator */}
              <Collapse open={isRegister && confirmPassword.length > 0}>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="w-3 h-3 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: password === confirmPassword
                        ? "rgba(52, 211, 153, 0.15)"
                        : "rgba(248, 113, 113, 0.15)",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    {password === confirmPassword ? <IconCheck /> : <IconX />}
                  </div>
                  <span
                    className="text-[11px]"
                    style={{
                      color: password === confirmPassword
                        ? "var(--color-positive)"
                        : "var(--color-negative)",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {password === confirmPassword ? t("auth.passwordsMatch") : t("auth.passwordsNoMatch")}
                  </span>
                </div>
              </Collapse>
            </div>
          </Collapse>

          {/* Terms consent — collapse animated (signup only) */}
          <Collapse open={isRegister}>
            <label className="flex items-start gap-3 cursor-pointer mt-1" style={{ minHeight: 44 }}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 shrink-0 cursor-pointer"
                style={{ width: 16, height: 16, accentColor: "var(--color-accent-light)" }}
              />
              <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {t("auth.termsConsent")}{" "}
                <Link href="/terms" target="_blank" style={{ color: "var(--color-accent-light)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                  {t("auth.termsOfService")}
                </Link>{" "}
                {t("auth.and")}{" "}
                <Link href="/privacy" target="_blank" style={{ color: "var(--color-accent-light)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                  {t("auth.privacyPolicy")}
                </Link>
                {t("auth.termsConsentSuffix")}
              </span>
            </label>
          </Collapse>

          <button
            type="submit"
            disabled={loading || (isRegister && !acceptedTerms)}
            className="login-btn-primary mt-1 w-full cursor-pointer rounded-lg py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #5c5c6e 0%, #6e6e82 100%)",
              boxShadow: "0 4px 14px rgba(92, 92, 110, 0.35)",
            }}
          >
            {loading
              ? t("common.loading")
              : isRegister
                ? t("auth.createAccountBtn")
                : t("auth.signIn")}
          </button>
        </form>

        {/* Separator */}
        <div className="my-6 flex items-center gap-4">
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }}
          />
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("auth.or")}
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }}
          />
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleAuth}
          className="login-btn-google flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border py-3 text-sm font-medium transition-all"
          style={{
            backgroundColor: "rgba(26, 26, 30, 0.5)",
            borderColor: "rgba(255, 255, 255, 0.06)",
            color: "var(--color-text)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          {t("auth.continueWithGoogle")}
        </button>

        {/* Toggle register/login */}
        <p
          className="mt-8 text-center text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          {isRegister ? t("auth.alreadyHaveAccount") : t("auth.noAccount")}{" "}
          <button
            onClick={handleToggle}
            className="cursor-pointer border-none bg-transparent font-semibold transition-colors"
            style={{ color: "var(--color-accent-light)" }}
          >
            {isRegister ? t("auth.signInLink") : t("auth.signUpLink")}
          </button>
        </p>
      </div>

      {/* Consent modal for new Google users */}
      <ConsentModal
        open={showConsent}
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
      />
    </div>
  );
}
