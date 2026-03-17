"use client";

import Link from "next/link";
import { TonvoLogoMark } from "@/components/Logo";

export default function LegalPage() {
  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Legal Notice</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          Legal Notice
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-text-muted)" }}>
          Mentions l&eacute;gales / Legal Information
        </p>

        <div className="space-y-8" style={{ color: "var(--color-text-silver)" }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>Publisher</h2>
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
              <div className="space-y-2 text-sm">
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>Company:</strong> [TO COMPLETE -- COMPANY NAME]</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>Legal form:</strong> [TO COMPLETE -- SAS, SARL, etc.]</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>Address:</strong> [TO COMPLETE -- ADDRESS]</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>Registration:</strong> [TO COMPLETE -- SIRET/SIREN]</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>VAT Number:</strong> [TO COMPLETE -- VAT NUMBER]</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>Share capital:</strong> [TO COMPLETE -- CAPITAL]</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>Publication Director</h2>
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
              <p className="text-sm m-0">
                <strong style={{ color: "var(--color-text)" }}>Name:</strong> [TO COMPLETE -- DIRECTOR NAME]<br />
                <strong style={{ color: "var(--color-text)" }}>Email:</strong> [TO COMPLETE -- EMAIL]
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>Data Protection Officer</h2>
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
              <p className="text-sm m-0">
                <strong style={{ color: "var(--color-text)" }}>DPO:</strong> [TO COMPLETE -- DPO NAME OR &quot;Same as Publication Director&quot;]<br />
                <strong style={{ color: "var(--color-text)" }}>Contact:</strong> [TO COMPLETE -- DPO EMAIL]
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>Hosting</h2>
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
              <div className="space-y-2 text-sm">
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>Application hosting:</strong> [TO COMPLETE -- e.g. Vercel Inc., 340 S Lemon Ave, Walnut, CA 91789, USA]</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>Database hosting:</strong> [TO COMPLETE -- e.g. Supabase Inc., region]</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>Authentication:</strong> [TO COMPLETE -- e.g. Firebase (Google Ireland Ltd)]</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>Related Policies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: "/privacy", label: "Privacy Policy", desc: "How we handle your data" },
                { href: "/terms", label: "Terms of Service", desc: "Rules of using Tonvo" },
                { href: "/cookies", label: "Cookie Policy", desc: "How we use cookies" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl p-4 no-underline transition-all"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}>
                  <p className="text-sm font-semibold m-0 mb-1" style={{ color: "var(--color-accent-light)" }}>{link.label}</p>
                  <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>{link.desc}</p>
                </Link>
              ))}
            </div>
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
