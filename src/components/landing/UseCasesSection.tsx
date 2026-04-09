"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AnimatedTitle from "@/components/AnimatedTitle";

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconMessageCircle({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconZap({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

interface UseCase {
  icon: ReactNode;
  title: string;
  desc: string;
}

export default function UseCasesSection() {
  const { t } = useTranslation();

  const useCases: UseCase[] = [
    { icon: <IconUsers className="w-6 h-6" />, title: t("landing.useCases.salesTitle"), desc: t("landing.useCases.salesDesc") },
    { icon: <IconMessageCircle className="w-6 h-6" />, title: t("landing.useCases.supportTitle"), desc: t("landing.useCases.supportDesc") },
    { icon: <IconShield className="w-6 h-6" />, title: t("landing.useCases.interviewsTitle"), desc: t("landing.useCases.interviewsDesc") },
    { icon: <IconZap className="w-6 h-6" />, title: t("landing.useCases.meetingsTitle"), desc: t("landing.useCases.meetingsDesc") },
  ];

  return (
    <section id="use-cases" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">{t("landing.useCases.label")}</span>
          <AnimatedTitle variant="left" className="section-heading">
            {t("landing.useCases.heading")}
          </AnimatedTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              className="glass-card usecase-card p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 usecase-icon"
                style={{ backgroundColor: "var(--color-surface-2)", color: "var(--color-accent-light)" }}
              >
                {uc.icon}
              </div>
              <h3 className="card-title mb-2">{uc.title}</h3>
              <p className="text-sm leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
                {uc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
