"use client";

import { motion } from "motion/react";
import { Cpu, BracketsCurly, Cube, Globe } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as number[];

const stats = [
  {
    Icon: Cpu,
    title: "Backend / System Design",
    desc: "Core engineering specialization",
  },
  {
    Icon: BracketsCurly,
    title: "OOP & SOLID",
    desc: "Principled architecture by default",
  },
  {
    Icon: Cube,
    title: "Docker · Redis · Elasticsearch",
    desc: "Infrastructure stack",
  },
  {
    Icon: Globe,
    title: "TOEIC 640",
    desc: "Technical English proficiency",
  },
];

export function StatsBarSection() {
  return (
    <section className="bg-zinc-900 py-10 border-t border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              className="flex items-start gap-3 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                <Icon size={16} className="text-cyan-400" weight="duotone" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 leading-snug">
                  {title}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
