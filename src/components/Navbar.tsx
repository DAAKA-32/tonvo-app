"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { auth, firebaseSignOut } from "@/lib/firebase";
import TonvoLogo from "@/components/Logo";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center no-underline">
          <TonvoLogo size="md" />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard"
                className="text-sm no-underline px-3 py-1.5 rounded-md transition-colors hover:opacity-80"
                style={{ color: "var(--color-text-muted)" }}>
                Dashboard
              </Link>
              <Link href="/history"
                className="text-sm no-underline px-3 py-1.5 rounded-md transition-colors hover:opacity-80"
                style={{ color: "var(--color-text-muted)" }}>
                History
              </Link>
              <button
                onClick={() => auth && firebaseSignOut(auth)}
                className="text-sm px-4 py-1.5 rounded-md border cursor-pointer transition-colors hover:opacity-80"
                style={{
                  color: "var(--color-text-muted)",
                  borderColor: "var(--color-border)",
                  backgroundColor: "transparent",
                }}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login"
              className="text-sm no-underline px-4 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--color-accent)" }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
