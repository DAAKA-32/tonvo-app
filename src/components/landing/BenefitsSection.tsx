"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function BenefitsSection() {
  const { t } = useTranslation();

  const benefits = [
    { value: t("landing.benefits.realtime"), label: t("landing.benefits.realtimeDesc") },
    { value: t("landing.benefits.threeClicks"), label: t("landing.benefits.threeClicksDesc") },
    { value: t("landing.benefits.actionable"), label: t("landing.benefits.actionableDesc") },
    { value: t("landing.benefits.private"), label: t("landing.benefits.privateDesc") },
  ];

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">{t("landing.benefits.label")}</span>
          <AnimatedTitle variant="soft" className="section-heading">
            {t("landing.benefits.heading")}
          </AnimatedTitle>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.value}
              className="glass-card benefit-card p-4 sm:p-6 text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="text-xl sm:text-2xl md:text-3xl mb-2 metric-text">{b.value}</div>
              <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>{b.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
