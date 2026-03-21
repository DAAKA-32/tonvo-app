"use client";

import Link from "next/link";
import { TonvoLogoMark } from "@/components/Logo";

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Terms of Service</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          Terms of Service
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-text-muted)" }}>
          Last updated: March 17, 2026
        </p>

        <div className="space-y-8" style={{ color: "var(--color-text-silver)" }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed m-0">
              By accessing or using Tonvo (&quot;the Service&quot;), operated by <strong>Tonvo</strong>,
              you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>2. Description of Service</h2>
            <p className="text-sm leading-relaxed m-0">
              Tonvo is a real-time conversation intelligence platform that provides tone analysis, transcription,
              screen content analysis, AI-powered coaching, and conversation scoring. The Service is provided
              &quot;as is&quot; and may be updated or modified at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>3. Account Registration</h2>
            <p className="text-sm leading-relaxed m-0">
              You must create an account to use Tonvo. You are responsible for maintaining the confidentiality
              of your credentials and for all activities under your account. You must provide accurate and
              complete information. You must be at least 16 years old to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>4. User Responsibilities</h2>
            <p className="text-sm leading-relaxed mb-3">When using Tonvo, you agree to:</p>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li>Only analyze content you have the legal right to analyze.</li>
              <li>Obtain consent from all parties before recording or analyzing conversations involving others.</li>
              <li>Not use the Service to analyze confidential, classified, or restricted content without proper authorization.</li>
              <li>Not attempt to reverse-engineer, decompile, or extract the AI models or algorithms.</li>
              <li>Not use the Service for harassment, surveillance without consent, or any illegal purpose.</li>
              <li>Comply with all applicable local, national, and international laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>5. Screen Capture & Content Analysis</h2>
            <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "rgba(251, 191, 36, 0.06)", border: "1px solid rgba(251, 191, 36, 0.15)" }}>
              <p className="text-sm leading-relaxed m-0" style={{ color: "var(--color-neutral)" }}>
                <strong>Important:</strong> When you share your screen with Tonvo, the application captures and analyzes
                the visible content. You are solely responsible for ensuring that you have the right to share
                and analyze any content visible on your screen. This includes messages, documents, emails,
                or any other content from third-party applications.
              </p>
            </div>
            <p className="text-sm leading-relaxed m-0">
              Tonvo does not permanently store screen capture frames. Frames are processed in real-time by our AI
              and only text-based analysis results are retained as part of your session data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>6. Subscription & Payment</h2>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li><strong>Free Plan:</strong> Limited to 3 sessions per month. Session data is retained for 7 days.</li>
              <li><strong>Pro Plan:</strong> $19/month. Unlimited sessions with full history retention.</li>
              <li><strong>Team Plan:</strong> $49/user/month. Includes team collaboration features.</li>
              <li>Payments are processed securely via Stripe. You may cancel your subscription at any time through the Settings page.</li>
              <li>Refunds are handled on a case-by-case basis. Contact <strong>tonvoco.pro@gmail.com</strong> for refund requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>7. Intellectual Property</h2>
            <p className="text-sm leading-relaxed m-0">
              The Tonvo application, its design, code, AI models, and branding are the property of
              <strong> Tonvo</strong>. You retain ownership of your content
              (transcriptions, analyses). By using the Service, you grant us a limited license to process
              your content solely for the purpose of providing the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>8. AI-Generated Content</h2>
            <p className="text-sm leading-relaxed m-0">
              Tonvo uses artificial intelligence to analyze conversations, detect tone, and generate suggestions.
              AI-generated insights are provided for informational purposes only and should not be considered
              as professional advice (legal, medical, psychological, or otherwise). The accuracy of AI analysis
              may vary and should be used as a complementary tool, not a definitive assessment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>9. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed m-0">
              To the maximum extent permitted by law, <strong>Tonvo</strong> shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages resulting from
              your use of the Service. This includes but is not limited to: loss of data, loss of revenue,
              decisions made based on AI-generated analysis, or unauthorized access to your account.
              Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>10. Termination</h2>
            <p className="text-sm leading-relaxed m-0">
              We reserve the right to suspend or terminate your account if you violate these Terms.
              You may delete your account at any time by contacting support. Upon termination,
              your data will be deleted in accordance with our <Link href="/privacy" style={{ color: "var(--color-accent-light)" }}>Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>11. Modifications</h2>
            <p className="text-sm leading-relaxed m-0">
              We may update these Terms at any time. Material changes will be communicated via email or
              in-app notification. Continued use of the Service after changes constitutes acceptance
              of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>12. Governing Law</h2>
            <p className="text-sm leading-relaxed m-0">
              These Terms are governed by the laws of <strong>France</strong>.
              Any disputes shall be submitted to the competent courts of <strong>Saint-Etienne, France</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>13. Contact</h2>
            <p className="text-sm leading-relaxed m-0">
              For questions about these Terms:<br /><br />
              <strong>Tonvo</strong><br />
              42170 Chambles, France<br />
              Email: <strong>tonvoco.pro@gmail.com</strong>
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
