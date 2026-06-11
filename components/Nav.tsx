"use client";

import { useState } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent } from "motion/react";
const links = [
  { href: "#projects", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24);
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex items-center justify-between">
        <a
          href="#hero"
          className="flex items-center gap-2.5 group"
          aria-label="thangvb - back to top"
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-zinc-700 group-hover:border-zinc-500 transition-colors shrink-0">
            <Image
              src="/assets/avatar.jpg"
              alt=""
              fill
              sizes="28px"
              className="object-cover object-top"
            />
          </div>
          <span className="font-mono text-sm font-bold text-zinc-50 tracking-wider group-hover:text-cyan-400 transition-colors">
            thangvb
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden sm:inline-flex items-center text-sm font-semibold text-zinc-950 bg-cyan-400 px-4 py-2 rounded-md hover:bg-cyan-300 transition-colors active:scale-[0.98]"
        >
          Let&apos;s Talk
        </a>
      </div>
    </header>
  );
}
