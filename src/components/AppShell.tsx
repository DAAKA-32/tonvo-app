"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useSwipe } from "@/hooks/useSwipe";
import Sidebar from "./Sidebar";
import { TonvoLogoMark } from "@/components/Logo";

interface AppShellProps {
  children: React.ReactNode;
  /** When true, render the shell even without an authenticated user (used by
   *  the public scripted demo at /session?demo=1). Defaults to false so every
   *  other authenticated page keeps its normal login gate. */
  allowAnonymous?: boolean;
}

export default function AppShell({ children, allowAnonymous = false }: AppShellProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Swipe left→right from edge opens sidebar, right→left closes it
  useSwipe({
    onSwipeRight: openSidebar,
    onSwipeLeft: sidebarOpen ? closeSidebar : undefined,
  });

  useEffect(() => {
    if (!loading && !user && !allowAnonymous) {
      router.push("/login")
    }
  }, [user, loading, router, allowAnonymous]);

  if (loading && !allowAnonymous) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <TonvoLogoMark size="lg" />
      </div>
    );
  }

  if (!user && !allowAnonymous) return null;

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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            className="page-enter"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
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
