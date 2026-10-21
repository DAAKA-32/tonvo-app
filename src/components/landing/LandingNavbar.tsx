"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import TonvoLogo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import { useLocale } from "@/components/PublicProviders";
import { localePath } from "@/i18n/locales-config";

const SPRING_HOVER = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.7 };
const SPRING_LAYOUT = { type: "spring" as const, stiffness: 320, damping: 32, mass: 0.8 };
const SPRING_TAP = { type: "spring" as const, stiffness: 500, damping: 28 };

export default function LandingNavbar() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const locale = useLocale();
  const reduce = useReducedMotion();

  const [navVisible, setNavVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
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

      if (currentY <= heroThreshold) {
        setNavVisible(true);
      } else if (currentY < lastScrollY.current) {
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        setNavVisible(false);
        setMobileOpen(false);
      }

      setScrolled(currentY > 32);

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          willChange: "transform, opacity",
          backgroundColor: scrolled
            ? "rgba(9, 9, 11, 0.92)"
            : "rgba(9, 9, 11, 0.55)",
          backdropFilter: scrolled ? "blur(22px) saturate(1.5)" : "blur(12px)",
          WebkitBackdropFilter: scrolled ? "blur(22px) saturate(1.5)" : "blur(12px)",
          boxShadow: scrolled
            ? "0 1px 0 rgba(255,255,255,0.04), 0 6px 28px rgba(0,0,0,0.45)"
            : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          transition:
            "background-color 0.5s ease, backdrop-filter 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease",
        }}
        initial={false}
        animate={{
          y: navVisible ? 0 : "-100%",
          opacity: navVisible ? 1 : 0,
        }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 32, mass: 0.9 }
        }
      >
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between"
          animate={{ height: scrolled ? 56 : 64 }}
          transition={{ type: "spring", stiffness: 220, damping: 30 }}
        >
          {/* Logo */}
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={SPRING_HOVER}
          >
            <Link href={localePath("/", locale)} className="flex items-center no-underline">
              <TonvoLogo size="md" />
            </Link>
          </motion.div>

          {/* Desktop nav links — magnetic shared pill */}
          <div
            className="hidden md:flex items-center gap-1 lg:gap-2 relative"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              const isHovered = hoveredHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  className="nav-link-premium relative text-sm no-underline px-3 py-2 rounded-lg"
                  data-active={isActive ? "true" : undefined}
                >
                  {/* Magnetic ghost pill — single shared element across links */}
                  {isHovered && !reduce && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                        zIndex: 0,
                      }}
                      transition={SPRING_LAYOUT}
                    />
                  )}

                  {/* Label sits above the pill */}
                  <span className="relative z-10">{link.label}</span>

                  {/* Active underline — also shared via layoutId, slides between active sections */}
                  {isActive && !reduce && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute pointer-events-none"
                      style={{
                        bottom: 4,
                        left: 12,
                        right: 12,
                        height: 2,
                        borderRadius: 999,
                        background:
                          "linear-gradient(90deg, transparent, var(--color-accent-light), transparent)",
                        boxShadow: "0 0 8px rgba(200, 200, 216, 0.4)",
                      }}
                      transition={SPRING_LAYOUT}
                    />
                  )}
                  {isActive && reduce && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 4,
                        left: 12,
                        right: 12,
                        height: 2,
                        borderRadius: 999,
                        background: "var(--color-accent-light)",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            {user ? (
              <NavCTA href="/dashboard" reduce={!!reduce}>
                {t("landing.nav.dashboard")}
              </NavCTA>
            ) : (
              <>
                <motion.div
                  className="hidden sm:inline-flex"
                  whileHover={reduce ? undefined : { y: -1 }}
                  transition={SPRING_HOVER}
                >
                  <Link
                    href="/login"
                    className="text-sm no-underline px-4 py-2 rounded-full inline-flex items-center"
                    style={{
                      background: "rgba(255, 255, 255, 0.025)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "var(--color-text-silver)",
                      transition: "background 0.25s ease, border-color 0.25s ease, color 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                      e.currentTarget.style.color = "var(--color-text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.025)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.color = "var(--color-text-silver)";
                    }}
                  >
                    {t("landing.nav.signIn")}
                  </Link>
                </motion.div>
                <NavCTA href="/login" reduce={!!reduce}>
                  {t("landing.nav.getStarted")}
                </NavCTA>
              </>
            )}

            {/* Mobile hamburger */}
            <motion.button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              whileHover={reduce ? undefined : { backgroundColor: "rgba(255,255,255,0.06)" }}
              whileTap={reduce ? undefined : { scale: 0.92 }}
              transition={SPRING_TAP}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={t("ui.toggleMenu")}
              aria-expanded={mobileOpen}
            >
              <motion.span
                style={{
                  display: "block",
                  width: 18,
                  height: 2,
                  borderRadius: 1,
                  background: "var(--color-text-muted)",
                  transformOrigin: "center",
                }}
                animate={
                  mobileOpen
                    ? { y: 5, rotate: 45 }
                    : { y: 0, rotate: 0 }
                }
                transition={SPRING_HOVER}
              />
              <motion.span
                style={{
                  display: "block",
                  width: 18,
                  height: 2,
                  borderRadius: 1,
                  background: "var(--color-text-muted)",
                  marginTop: 4,
                }}
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.18 }}
              />
              <motion.span
                style={{
                  display: "block",
                  width: 18,
                  height: 2,
                  borderRadius: 1,
                  background: "var(--color-text-muted)",
                  marginTop: 4,
                  transformOrigin: "center",
                }}
                animate={
                  mobileOpen
                    ? { y: -5, rotate: -45 }
                    : { y: 0, rotate: 0 }
                }
                transition={SPRING_HOVER}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll accent line — gradient pulse at bottom of nav when scrolled */}
        <AnimatePresence>
          {scrolled && !reduce && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent 10%, rgba(200, 200, 216, 0.45) 50%, transparent 90%)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
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
              }}
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
            >
              <motion.div
                className="flex flex-col gap-1"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
                }}
              >
                {navLinks.map((link) => (
                  <motion.a
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
                    }}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                    }}
                    whileHover={
                      reduce
                        ? undefined
                        : { x: 4, backgroundColor: "rgba(255,255,255,0.04)" }
                    }
                    transition={SPRING_HOVER}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>

              {!user && (
                <motion.div
                  className="mt-4 pt-4"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.25, duration: 0.35 }}
                >
                  <NavCTA href="/login" reduce={!!reduce} block onClick={() => setMobileOpen(false)}>
                    {t("landing.nav.getStarted")}
                  </NavCTA>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface NavCTAProps {
  href: string;
  children: React.ReactNode;
  reduce: boolean;
  block?: boolean;
  onClick?: () => void;
}

/**
 * Premium broadcast CTA — mint glass pill with halo shadow, animated diagonal
 * shimmer sweep on hover. Matches the rest of the app's primary action style.
 */
function NavCTA({ href, children, reduce, block, onClick }: NavCTAProps) {
  return (
    <motion.div
      className={block ? "block" : "inline-block"}
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={SPRING_TAP}
    >
      <Link
        href={href}
        onClick={onClick}
        className={`relative overflow-hidden text-sm no-underline ${
          block ? "w-full justify-center flex items-center" : "inline-flex items-center"
        } px-5 py-2 rounded-full font-semibold`}
        style={{
          background:
            "linear-gradient(135deg, rgba(52, 211, 153, 0.22) 0%, rgba(52, 211, 153, 0.06) 100%)",
          border: "1px solid rgba(52, 211, 153, 0.4)",
          boxShadow:
            "0 16px 40px -18px rgba(52, 211, 153, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          color: "var(--color-text)",
        }}
      >
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute top-0 bottom-0 pointer-events-none"
            animate={{ x: ["-130%", "230%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            style={{
              width: "60%",
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.18) 50%, transparent 70%)",
              mixBlendMode: "screen",
            }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </Link>
    </motion.div>
  );
}
