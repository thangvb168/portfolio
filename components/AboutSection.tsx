"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function AnimatedStat() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0 as number, 60, {
      duration: 1.5,
      ease: EASE,
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [isInView]);

  return (
    <div ref={ref}>
      <motion.p
        animate={done ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 0.38, ease: EASE }}
        className="font-mono text-7xl font-bold text-cyan-400 leading-none tabular-nums select-none"
      >
        ~{count}%
      </motion.p>

      {/* Progress bar — fills in sync with counter */}
      <div className="mt-4 h-[2px] bg-zinc-800/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 0.6 } : { scaleX: 0 }}
          transition={{ duration: 1.5, delay: 0.08, ease: EASE }}
          style={{ originX: 0 }}
          className="h-full w-full bg-cyan-400/55 rounded-full"
        />
      </div>
    </div>
  );
}

const stackItems = [
  { label: "backend", value: "NestJS / Express.js" },
  { label: "frontend", value: "React / Next.js" },
  { label: "real-time", value: "Socket.io + Redis" },
  { label: "direction", value: "Solution Architect", accent: true },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-zinc-900 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Prose */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight"
            >
              About
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="text-lg md:text-xl text-zinc-200 font-medium leading-relaxed max-w-[55ch] border-l-2 border-cyan-400/30 pl-4"
            >
              Two years building production systems: CRM, HRM, LMS, and
              real-time applications across product and outsource environments.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="text-zinc-400 leading-relaxed text-base max-w-[65ch]"
            >
              Started on the backend side with Node.js and Express, then grew
              into fullstack with NestJS on the server and React / Next.js on
              the client. What drives me is how systems are designed: database
              schema, API contracts, data flow from UI through server to
              storage.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="text-zinc-400 leading-relaxed text-base max-w-[65ch]"
            >
              Near-term: scalable architecture design, performance optimization,
              distributed systems (caching strategy, message queues, search
              infrastructure) and contributing to core architecture decisions.
              Long-term: Solution Architect, turning business requirements into
              holistic system designs that balance performance, cost, and
              scalability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
              className="pt-2 flex items-center gap-6"
            >
              <a
                href="mailto:thangvb.dev@gmail.com"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
              >
                thangvb.dev@gmail.com
              </a>
              <span className="text-zinc-700">|</span>
              <a
                href="https://github.com/thangvb168"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
              >
                github.com/thangvb168
              </a>
            </motion.div>
          </div>

          {/* Right: Achievement + stack snapshot */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Key achievement - dominant stat */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              whileHover={{
                y: -4,
                transition: { duration: 0.25, ease: EASE },
              }}
              className="flex-1 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-7 flex flex-col justify-between cursor-default hover:border-cyan-400/35 transition-colors duration-300"
            >
              <div>
                <AnimatedStat />

                <p className="text-base text-zinc-200 mt-5 leading-relaxed">
                  reduction in CRUD form development time via AI Agent SKILL and
                  Workflow system.
                </p>
                <p className="text-sm text-zinc-500 mt-2">
                  Built at VFM Technology, 2025
                </p>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed mt-6 pt-5 border-t border-cyan-400/10">
                Standardizing the architecture across all modules showed the
                leverage of solving the system problem rather than each feature
                problem individually.
              </p>
            </motion.div>

            {/* Stack snapshot grid */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {stackItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.28 + i * 0.08,
                      ease: EASE,
                    }}
                  >
                    <p className="text-xs font-mono text-zinc-600 mb-1">
                      {item.label}
                    </p>
                    <p
                      className={`text-sm font-medium ${item.accent ? "text-cyan-400/80" : "text-zinc-300"}`}
                    >
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
