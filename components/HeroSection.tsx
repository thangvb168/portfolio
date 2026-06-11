"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { GithubLogo } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as number[];

// Three.js is client-only — never run during SSR
const HeroScene3D = dynamic(
  () => import("@/components/HeroScene3D").then((m) => m.HeroScene3D),
  { ssr: false },
);

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center pt-16"
    >
      {/* Grid texture fades in slowly behind the text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, ease: "linear" }}
        className="absolute inset-0 hero-grid-bg pointer-events-none"
      />

      {/* Bottom gradient bleeds grid into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          {/* ── Left: text ──────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            {/* Headline: curtain reveal */}
            <div className="overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <motion.h1
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.07, ease: EASE }}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-zinc-50 tracking-tight leading-[1.06]"
              >
                Architecting Scalable
                <br />
                Backend Systems
              </motion.h1>
            </div>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
              className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-[52ch]"
            >
              Hi, I&apos;m thangvb. I build production infrastructure with
              NestJS, PostgreSQL, and distributed systems designed around OOP
              &amp; SOLID principles.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
              className="flex flex-wrap gap-3"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.14, ease: EASE }}
                className="inline-flex items-center gap-2 bg-cyan-400 text-zinc-950 px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-cyan-300 transition-colors"
              >
                Explore My Work
              </motion.a>
              <motion.a
                href="https://github.com/thangvb168"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.14, ease: EASE }}
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 px-5 py-2.5 rounded-md font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
              >
                <GithubLogo size={16} weight="bold" />
                GitHub
              </motion.a>
            </motion.div>
          </div>

          {/* ── Right: 3D scene (desktop only) ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.55, ease: EASE }}
            className="hidden lg:block lg:col-span-5 h-[500px] rounded-2xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden shadow-[0_0_60px_-12px_rgba(0,0,0,0.8)]"
          >
            <HeroScene3D />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
