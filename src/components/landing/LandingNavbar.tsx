"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import TonvoLogo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";

export default function LandingNavbar() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [navVisible, setNavVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const navLinks = [
    { href: "#features", label: t("landing.nav.features") },
    { href: "#demo", label: t("landing.nav.product") },
    { href: "#use-cases", label: t("landing.nav.useCases") },
    { href: "#pricing", label: t("landing.nav.pricing") },
  ];

  // --- Scroll: hide/show + scrolled state + active section ---
  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.4;

      // Visibility
      if (currentY <= heroThreshold) {
        setNavVisible(true);
      } else if (currentY < lastScrollY.current) {
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        setNavVisible(false);
        setMobileOpen(false);
      }

      // Scrolled state (triggers visual change)
      setScrolled(currentY > 32);

      // Active section detection
      const sections = ["pricing", "use-cases", "demo", "features"];
      let found = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            found = `#${id}`;
            break;
          }
        }
      }
      setActiveSection(found);

      lastScrollY.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: navVisible ? 1 : 0,
          transition:
            "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease, background-color 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
          willChange: "transform, opacity",
          backgroundColor: scrolled
            ? "rgba(9, 9, 11, 0.95)"
            : "rgba(9, 9, 11, 0.6)",
          backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "blur(12px)",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "blur(12px)",
          boxShadow: scrolled
            ? "0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)"
            : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between"
          style={{
            height: scrolled ? 56 : 64,
            transition: "height 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center no-underline"
            style={{
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <TonvoLogo size="md" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link-premium relative text-sm no-underline px-3 py-2 rounded-lg"
                  data-active={isActive ? "true" : undefined}
                >
                  {link.label}
                  {/* Animated underline indicator */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 4,
                      left: 12,
                      right: 12,
                      height: 2,
                      borderRadius: 1,
                      background: "var(--color-accent-light)",
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                      transformOrigin: "center",
                    }}
                  />
                </a>
              );
            })}
          </div>

          {/* Right side: language, auth, mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            {user ? (
              <Link
                href="/dashboard"
                className="nav-cta-btn text-sm no-underline px-5 py-2 rounded-lg font-medium text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent) 0%, #6e6e82 100%)",
                }}
              >
                {t("landing.nav.dashboard")}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-signin-link hidden sm:inline-flex text-sm no-underline px-4 py-2 rounded-lg"
                >
                  {t("landing.nav.signIn")}
                </Link>
                <Link
                  href="/login"
                  className="nav-cta-btn text-sm no-underline px-5 py-2 rounded-lg font-medium text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-accent) 0%, #6e6e82 100%)",
                  }}
                >
                  {t("landing.nav.getStarted")}
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "background-color 0.2s ease",
              }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 18,
                  height: 2,
                  borderRadius: 1,
                  background: "var(--color-text-muted)",
                  transition: "transform 0.3s ease, opacity 0.2s ease",
                  transform: mobileOpen
                    ? "translateY(3px) rotate(45deg)"
                    : "translateY(-3px) rotate(0deg)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 18,
                  height: 2,
                  borderRadius: 1,
                  background: "var(--color-text-muted)",
                  transition: "opacity 0.2s ease",
                  opacity: mobileOpen ? 0 : 1,
                  marginTop: 4,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 18,
                  height: 2,
                  borderRadius: 1,
                  background: "var(--color-text-muted)",
                  transition: "transform 0.3s ease, opacity 0.2s ease",
                  transform: mobileOpen
                    ? "translateY(-3px) rotate(-45deg)"
                    : "translateY(3px) rotate(0deg)",
                  marginTop: mobileOpen ? 0 : 4,
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        className="md:hidden fixed inset-0 z-40"
        style={{
          pointerEvents: mobileOpen ? "auto" : "none",
          opacity: mobileOpen ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setMobileOpen(false)}
        />
        {/* Menu panel */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            paddingTop: "calc(env(safe-area-inset-top) + 72px)",
            paddingBottom: 32,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: "rgba(9, 9, 11, 0.98)",
            borderBottom: "1px solid var(--color-border)",
            transform: mobileOpen ? "translateY(0)" : "translateY(-16px)",
            transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base no-underline py-3 px-4 rounded-lg"
                style={{
                  color:
                    activeSection === link.href
                      ? "var(--color-text)"
                      : "var(--color-text-muted)",
                  backgroundColor:
                    activeSection === link.href
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                  transition: "color 0.2s ease, background-color 0.2s ease",
                  animationDelay: `${i * 40}ms`,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {!user && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center text-sm no-underline w-full px-5 py-3 rounded-lg font-medium text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent) 0%, #6e6e82 100%)",
                }}
              >
                {t("landing.nav.getStarted")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
