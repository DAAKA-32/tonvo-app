"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import AppShell from "@/components/AppShell";

const PLANS = ["free", "pro", "team"] as const;

export default function AdminPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>("team");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message?: string; error?: string } | null>(null);

  async function handleAssign() {
    if (!user) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/assign-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: user.email,
          targetUserId: user.uid,
          plan: selectedPlan,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  }

  if (!user || user.email !== "emilien.nepveu@gmail.com") {
    return (
      <AppShell>
        <div style={{ maxWidth: 500, textAlign: "center", paddingTop: 80 }}>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--color-text)" }}>404</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>This page could not be found.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 500 }}>
        <h1 className="section-heading mb-2">Admin</h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Assign a plan to your account for testing.
        </p>

        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div className="mb-4">
            <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Logged in as</p>
            <p className="text-sm font-medium m-0" style={{ color: "var(--color-text)" }}>
              {user.email}
            </p>
            <p className="text-xs m-0 mt-1 font-mono" style={{ color: "var(--color-text-muted)" }}>
              UID: {user.uid}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>Select plan</p>
            <div className="flex gap-2">
              {PLANS.map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-all"
                  style={{
                    background: selectedPlan === plan ? "rgba(200, 200, 216, 0.12)" : "transparent",
                    borderColor: selectedPlan === plan ? "rgba(200, 200, 216, 0.25)" : "var(--color-border)",
                    color: selectedPlan === plan ? "var(--color-text)" : "var(--color-text-muted)",
                  }}
                >
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAssign}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer border-none transition-all hover:opacity-90 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #5c5c6e, #6e6e82)",
              color: "white",
            }}
          >
            {loading ? "Updating..." : `Assign ${selectedPlan.toUpperCase()} plan`}
          </button>

          {result && (
            <div
              className="mt-4 p-3 rounded-lg text-sm"
              style={{
                background: result.error ? "rgba(239, 68, 68, 0.08)" : "rgba(52, 211, 153, 0.08)",
                color: result.error ? "var(--color-negative)" : "var(--color-positive)",
                border: result.error ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(52, 211, 153, 0.2)",
              }}
            >
              {result.message || result.error}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
