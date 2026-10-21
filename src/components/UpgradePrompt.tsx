"use client";

import Link from "next/link";

interface UpgradePromptProps {
  feature: string;
  plan?: string;
  inline?: boolean;
}

/**
 * Displays a lock + upgrade CTA when a feature is not available on the current plan.
 * Use inline=true for small inline badges, false for full-width banners.
 */
export default function UpgradePrompt({ feature, plan = "Plus", inline = false }: UpgradePromptProps) {
  if (inline) {
    return (
      <Link
        href="/plans"
        className="inline-flex items-center gap-1.5 text-xs font-medium no-underline px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
        style={{
          backgroundColor: "var(--color-surface-2)",
          color: "var(--color-accent-light)",
          border: "1px solid var(--color-border)",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {plan}
      </Link>
    );
  }

  return (
    <div
      className="rounded-xl border p-5 text-center"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex justify-center mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-accent-light)" }}>
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>
      <p className="text-sm font-semibold m-0 mb-1" style={{ color: "var(--color-text)" }}>
        {feature}
      </p>
      <p className="text-xs m-0 mb-4" style={{ color: "var(--color-text-muted)" }}>
        This feature is available on the {plan} plan.
      </p>
      <Link
        href="/plans"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold no-underline transition-all hover:opacity-90"
        style={{
          background: "var(--color-text)",
          color: "var(--color-bg)",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
        }}
      >
        Upgrade to {plan}
      </Link>
    </div>
  );
}
