"use client";

import Link from "next/link";
import { TonvoLogoMark } from "@/components/Logo";

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Privacy Policy</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-text-muted)" }}>
          Last updated: March 17, 2026
        </p>

        <div className="space-y-10" style={{ color: "var(--color-text-silver)" }}>
          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>1. Data Controller</h2>
            <p className="text-sm leading-relaxed m-0">
              The data controller for the Tonvo application is:<br />
              <strong>Tonvo</strong><br />
              42170 Chambles, France<br />
              SIREN 101 134 633<br />
              Contact: <strong>contact@tonvo.co</strong>
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>2. Data We Collect</h2>
            <p className="text-sm leading-relaxed mb-4">We collect the following categories of data:</p>
            <div className="space-y-3">
              {[
                { title: "Account Data", desc: "Email address, display name, authentication provider (Google or email/password), account creation date." },
                { title: "Session Data", desc: "Conversation transcriptions, tone analysis results, AI-generated suggestions, conversation scores, insights, and classification." },
                { title: "Screen Capture Data", desc: "When you share your screen, Tonvo captures frames for visual analysis. Frames are processed in real-time and are NOT permanently stored on our servers. Only the analysis results (text-based context, mood, insights) are saved." },
                { title: "Audio Data", desc: "Audio chunks are transmitted to our servers for transcription, then immediately discarded after processing. Only the resulting text transcription is stored as part of session data." },
                { title: "Subscription & Payment Data", desc: "Subscription plan, payment status, and billing period. Payment processing is handled by Stripe — we do not store credit card numbers." },
                { title: "Technical Data", desc: "Browser type, device information, IP address (for security purposes), and anonymized usage analytics." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl p-4" style={{ backgroundColor: "var(--color-surface)" }}>
                  <p className="text-sm font-semibold m-0 mb-1" style={{ color: "var(--color-text)" }}>{item.title}</p>
                  <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>3. How We Use Your Data</h2>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li>To provide conversation analysis and real-time intelligence features.</li>
              <li>To generate session summaries, scores, and actionable insights.</li>
              <li>To maintain and improve the quality of our AI models and services.</li>
              <li>To manage your account and subscription.</li>
              <li>To communicate important service updates.</li>
              <li>To ensure the security and integrity of our platform.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>4. Legal Basis for Processing (GDPR)</h2>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li><strong>Consent</strong> — Screen capture and conversation analysis are performed only when you explicitly start a session.</li>
              <li><strong>Contract</strong> — Processing necessary to provide the services you subscribed to.</li>
              <li><strong>Legitimate Interest</strong> — Security monitoring, service improvement, and anonymized analytics.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>5. Data Retention</h2>
            <div className="rounded-xl p-4" style={{ backgroundColor: "var(--color-surface)" }}>
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <th className="text-left py-2 font-medium" style={{ color: "var(--color-text-muted)" }}>Data Type</th>
                    <th className="text-left py-2 font-medium" style={{ color: "var(--color-text-muted)" }}>Retention</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Account data", "Until account deletion"],
                    ["Session data (Free plan)", "7 days"],
                    ["Session data (Pro/Team)", "Duration of subscription"],
                    ["Screen capture frames", "Not stored — processed in real-time only"],
                    ["Audio recordings", "Not stored — transcribed then deleted immediately"],
                    ["Transcriptions & analysis", "Same as session data"],
                    ["Payment data", "As required by law (managed by Stripe)"],
                  ].map(([type, retention]) => (
                    <tr key={type} style={{ borderBottom: "1px solid rgba(39,39,42,0.3)" }}>
                      <td className="py-2" style={{ color: "var(--color-text)" }}>{type}</td>
                      <td className="py-2" style={{ color: "var(--color-text-muted)" }}>{retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>6. Third-Party Services</h2>
            <p className="text-sm leading-relaxed mb-3">We use the following third-party services to operate Tonvo:</p>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li><strong>Firebase</strong> (Google) — Authentication. <em>EU (europe-west1)</em></li>
              <li><strong>Supabase</strong> — Database and session storage. <em>EU (europe-west1)</em></li>
              <li><strong>Anthropic</strong> — AI-powered conversation analysis. Data is sent for processing and not retained by Anthropic beyond the API request.</li>
              <li><strong>Stripe</strong> — Payment processing. Stripe is PCI-DSS compliant.</li>
              <li><strong>Vercel</strong> — Application hosting. <em>EU (europe-west1)</em></li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>7. International Data Transfers</h2>
            <p className="text-sm leading-relaxed m-0">
              Some of our third-party providers may process data outside the European Economic Area (EEA).
              Where this occurs, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs)
              or adequacy decisions by the European Commission. All third-party providers comply with EU-US Data Privacy Framework or have signed Standard Contractual Clauses (SCCs) approved by the European Commission.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>8. Your Rights (GDPR)</h2>
            <p className="text-sm leading-relaxed mb-3">Under the GDPR, you have the following rights:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { right: "Right of Access", desc: "Request a copy of all personal data we hold about you." },
                { right: "Right to Rectification", desc: "Request correction of inaccurate personal data." },
                { right: "Right to Erasure", desc: "Request deletion of your personal data." },
                { right: "Right to Portability", desc: "Request your data in a structured, machine-readable format." },
                { right: "Right to Object", desc: "Object to processing based on legitimate interest." },
                { right: "Right to Restrict", desc: "Request limitation of processing in certain circumstances." },
              ].map((item) => (
                <div key={item.right} className="rounded-xl p-3" style={{ backgroundColor: "var(--color-surface)" }}>
                  <p className="text-sm font-semibold m-0 mb-1" style={{ color: "var(--color-text)" }}>{item.right}</p>
                  <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm leading-relaxed mt-4 m-0">
              To exercise any of these rights, contact us at: <strong>contact@tonvo.co</strong>
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>9. Data Security</h2>
            <p className="text-sm leading-relaxed m-0">
              We implement industry-standard security measures to protect your data, including encryption in transit (TLS/SSL),
              encrypted database storage, secure authentication via Firebase, and regular security audits.
              However, no method of electronic transmission or storage is 100% secure.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>10. Children&apos;s Privacy</h2>
            <p className="text-sm leading-relaxed m-0">
              Tonvo is not intended for use by individuals under the age of 16. We do not knowingly collect
              personal data from children. If you believe a child has provided us with personal data,
              please contact us at <strong>contact@tonvo.co</strong>.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>11. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed m-0">
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the updated policy on this page and updating the &quot;Last updated&quot; date.
              Continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>12. Contact</h2>
            <p className="text-sm leading-relaxed m-0">
              For any questions regarding this Privacy Policy or your personal data:<br /><br />
              <strong>Tonvo</strong><br />
              42170 Chambles, France<br />
              Email: <strong>contact@tonvo.co</strong><br /><br />
              You also have the right to lodge a complaint with your local data protection authority
              (e.g., CNIL in France).
            </p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>
            &larr; Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
