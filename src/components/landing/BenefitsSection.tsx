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
    <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">Benefits</span>
          <AnimatedTitle variant="soft" className="section-heading">
            Built for people who talk to people.
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
