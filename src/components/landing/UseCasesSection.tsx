"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
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

const useCases: UseCase[] = [
  {
    icon: <IconUsers className="w-6 h-6" />,
    title: "Sales Calls",
    desc: "Know when a prospect is engaged, hesitant, or losing interest. Adjust your pitch in the moment, not after the deal is lost.",
  },
  {
    icon: <IconMessageCircle className="w-6 h-6" />,
    title: "Customer Support",
    desc: "Detect frustration early and get suggestions to de-escalate. Turn difficult interactions into positive experiences.",
  },
  {
    icon: <IconShield className="w-6 h-6" />,
    title: "Job Interviews",
    desc: "Whether you're the interviewer or the candidate, understand the emotional dynamics and communicate more effectively.",
  },
  {
    icon: <IconZap className="w-6 h-6" />,
    title: "Team Meetings",
    desc: "Track engagement across long meetings. Identify when energy drops and get cues to re-engage your audience.",
  },
];

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Use Cases
          </motion.span>
          <AnimatedTitle variant="left" className="section-heading">
            Works wherever conversations matter.
          </AnimatedTitle>
          <motion.p
            className="text-sm mt-4 max-w-lg mx-auto"
            style={{ color: "var(--color-text-muted)" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            From sales floors to boardrooms — Tonvo adapts to your world.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              className="glass-card usecase-card p-6"
              initial={{
                opacity: 0,
                x: i % 2 === 0 ? -50 : 50,
                y: 20,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.65,
                delay: i * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 usecase-icon"
                style={{ backgroundColor: "var(--color-surface-2)", color: "var(--color-accent-light)" }}
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.15, ease: "easeOut" }}
              >
                {uc.icon}
              </motion.div>
              <motion.h3
                className="card-title mb-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              >
                {uc.title}
              </motion.h3>
              <motion.p
                className="text-sm leading-relaxed m-0"
                style={{ color: "var(--color-text-muted)" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
              >
                {uc.desc}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
