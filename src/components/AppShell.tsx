"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useSwipe } from "@/hooks/useSwipe";
import Sidebar from "./Sidebar";
import { TonvoLogoMark } from "@/components/Logo";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Swipe left→right from edge opens sidebar, right→left closes it
  useSwipe({
    onSwipeRight: openSidebar,
    onSwipeLeft: sidebarOpen ? closeSidebar : undefined,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <TonvoLogoMark size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="app-content">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="mb-4 p-2.5 rounded-xl border cursor-pointer"
          style={{
            backgroundColor: "var(--color-surface)",
            backdropFilter: "blur(12px)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
            display: "none",
          }}
          aria-label="Open menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="page-enter">
          {children}
        </div>
      </main>

      {/* Mobile menu button style override */}
      <style>{`
        @media (max-width: 768px) {
          .app-content > button[aria-label="Open menu"] {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
