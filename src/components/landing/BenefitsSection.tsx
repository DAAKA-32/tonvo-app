"use client";

import { motion } from "framer-motion";
import AnimatedTitle from "@/components/AnimatedTitle";

const benefits = [
  { value: "Real-time", label: "Feedback during live conversations" },
  { value: "3 clicks", label: "To start analyzing any conversation" },
  { value: "Actionable", label: "Suggestions you can use immediately" },
  { value: "Private", label: "Audio processed locally, never stored" },
];

export default function BenefitsSection() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Benefits
          </motion.span>
          <AnimatedTitle variant="soft" className="section-heading">
            Built for people who talk to people.
          </AnimatedTitle>
          <motion.div
            className="benefits-accent-line mx-auto mt-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.value}
              className="glass-card benefit-card p-4 sm:p-6 text-center"
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <motion.div
                className="text-xl sm:text-2xl md:text-3xl mb-2 metric-text"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: "easeOut" }}
              >
                {b.value}
              </motion.div>
              <motion.p
                className="text-sm m-0"
                style={{ color: "var(--color-text-muted)" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.12 }}
              >
                {b.label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
