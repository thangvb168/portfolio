"use client";

import { motion } from "motion/react";
import { GraduationCap, Trophy } from "@phosphor-icons/react";

export function EducationSection() {
  return (
    <section id="education" className="bg-zinc-900 py-24 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as number[] }}
          className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight mb-12"
        >
          Education
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1] as number[],
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 md:p-8 rounded-xl border border-zinc-800 bg-zinc-950/40"
        >
          {/* Degree info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-start gap-3">
              <GraduationCap
                size={22}
                className="text-cyan-400 mt-0.5 shrink-0"
                weight="duotone"
              />
              <div>
                <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">
                  Thuyloi University
                </h3>
                <p className="text-sm text-zinc-400 mt-0.5">
                  B.S. Computer Science &nbsp;|&nbsp; 09/2021 - 08/2025
                </p>
              </div>
            </div>

            <div className="pl-9 space-y-3">
              <div className="flex items-center gap-3">
                <Trophy
                  size={15}
                  className="text-cyan-400/70 shrink-0"
                  weight="duotone"
                />
                <span className="text-sm text-zinc-300 font-medium">
                  GPA 3.82 / 4.0 - Excellent Student
                </span>
              </div>

              <div>
                <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-1.5">
                  Thesis
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-[60ch]">
                  Applying Integrative Compositional Zero-shot Learning for rare
                  agricultural product recognition and pathogen status
                  prediction.
                </p>
              </div>
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { value: "3.82", label: "GPA", sub: "out of 4.0" },
              { value: "4 yr", label: "Program", sub: "Computer Science" },
              { value: "640", label: "TOEIC", sub: "English proficiency" },
              { value: "2025", label: "Graduated", sub: "Excellent standing" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/60"
              >
                <p className="text-2xl font-bold text-zinc-100 font-mono tabular-nums">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-zinc-300 mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
