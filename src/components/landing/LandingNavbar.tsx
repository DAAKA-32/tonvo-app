"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import TonvoLogo from "@/components/Logo";

export default function LandingNavbar() {
  const { user } = useAuth();

  // --- Smart navbar scroll behavior ---
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.4;

      if (currentY <= heroThreshold) {
        // Always show in hero section
        setNavVisible(true);
      } else if (currentY < lastScrollY.current) {
        // Scrolling up -> show
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        // Scrolling down (with 5px dead zone to prevent flicker) -> hide
        setNavVisible(false);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  // --- End smart navbar ---

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(9, 9, 11, 0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--color-border)",
        paddingTop: "env(safe-area-inset-top)",
        transform: navVisible ? "translateY(0)" : "translateY(-100%)",
        opacity: navVisible ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s ease",
        willChange: "transform, opacity",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center no-underline">
          <TonvoLogo size="md" />
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <a href="#features" className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>Features</a>
          <a href="#demo" className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>Product</a>
          <a href="#use-cases" className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>Use Cases</a>
          <a href="#pricing" className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="text-sm no-underline px-5 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm no-underline px-4 py-2 rounded-lg transition-colors hover:opacity-80"
                style={{ color: "var(--color-text-muted)" }}
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="text-sm no-underline px-5 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
