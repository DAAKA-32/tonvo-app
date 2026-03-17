"use client";

import Link from "next/link";
import { TonvoLogoMark } from "@/components/Logo";

export default function CookiesPage() {
  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Cookie Policy</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          Cookie Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-text-muted)" }}>
          Last updated: March 17, 2026
        </p>

        <div className="space-y-8" style={{ color: "var(--color-text-silver)" }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>1. What Are Cookies</h2>
            <p className="text-sm leading-relaxed m-0">
              Cookies are small text files stored on your device when you visit a website. They help the website
              remember your preferences and improve your browsing experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>2. Cookies We Use</h2>
            <div className="space-y-3">
              {[
                {
                  type: "Essential Cookies",
                  required: true,
                  desc: "Required for authentication, session management, and security. These cannot be disabled.",
                  examples: "Firebase authentication tokens, session identifiers.",
                },
                {
                  type: "Preference Cookies",
                  required: false,
                  desc: "Store your preferences such as language selection and UI settings.",
                  examples: "tonvo-language (localStorage).",
                },
                {
                  type: "Analytics Cookies",
                  required: false,
                  desc: "Help us understand how you use the application to improve the service. All analytics data is anonymized.",
                  examples: "None currently. We do not use third-party analytics services.",
                },
                {
                  type: "Third-Party Cookies",
                  required: false,
                  desc: "Set by third-party services integrated into our application.",
                  examples: "Stripe (payment processing), Firebase (authentication).",
                },
              ].map((cookie) => (
                <div key={cookie.type} className="rounded-xl p-4" style={{ backgroundColor: "var(--color-surface)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold m-0" style={{ color: "var(--color-text)" }}>{cookie.type}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: cookie.required ? "rgba(52, 211, 153, 0.1)" : "rgba(200, 200, 216, 0.08)",
                        color: cookie.required ? "var(--color-positive)" : "var(--color-text-muted)",
                      }}>
                      {cookie.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed m-0 mb-1" style={{ color: "var(--color-text-muted)" }}>{cookie.desc}</p>
                  <p className="text-xs m-0" style={{ color: "var(--color-text-muted)", opacity: 0.7 }}>Examples: {cookie.examples}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>3. Local Storage</h2>
            <p className="text-sm leading-relaxed m-0">
              In addition to cookies, Tonvo uses browser localStorage to store your preferences locally on your device.
              This includes your language preference and UI settings. This data never leaves your device and is not
              transmitted to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>4. Managing Cookies</h2>
            <p className="text-sm leading-relaxed m-0">
              You can manage cookies through your browser settings. Note that disabling essential cookies may
              prevent you from using certain features of the application, including authentication.
              You can clear localStorage data through your browser&apos;s developer tools.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>5. Contact</h2>
            <p className="text-sm leading-relaxed m-0">
              For questions about our use of cookies:<br /><br />
              Email: <strong>contact@tonvo.co</strong>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>
            &larr; Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
