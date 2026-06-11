"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Envelope, Phone, GithubLogo } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as number[];

const contactItems = [
  {
    Icon: Envelope,
    label: "Email",
    value: "thangvb.dev@gmail.com",
    href: "mailto:thangvb.dev@gmail.com",
  },
  {
    Icon: Phone,
    label: "Phone",
    value: "+84 378 481 575",
    href: "tel:+84378481575",
  },
  {
    Icon: GithubLogo,
    label: "GitHub",
    value: "github.com/thangvb168",
    href: "https://github.com/thangvb168",
  },
];

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sent");
  };

  const inputBase =
    "w-full bg-transparent border-0 border-b border-zinc-800 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-400/60 transition-colors font-mono";

  return (
    <section
      id="contact"
      className="bg-zinc-950 py-24 md:py-32 border-t border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight mb-12"
        >
          Get in Touch
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {status === "sent" ? (
              <div className="flex flex-col gap-4 py-8">
                <div className="w-10 h-10 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-lg">&#10003;</span>
                </div>
                <p className="text-zinc-200 font-semibold text-lg">
                  Message sent.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-[42ch]">
                  Thanks for reaching out. I typically respond within a day or
                  two.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-mono mt-2 text-left"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputBase}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputBase}
                  />
                </div>
                <div>
                  <textarea
                    placeholder="What are you working on?"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className={`${inputBase} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center text-sm font-semibold text-zinc-950 bg-cyan-400 px-6 py-2.5 rounded-md hover:bg-cyan-300 transition-colors active:scale-[0.98] active:translate-y-px"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Right: Contact info */}
          <div className="space-y-4 lg:pt-2">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="text-zinc-400 leading-relaxed text-sm max-w-[44ch] mb-6"
            >
              Open to backend and fullstack roles where architecture decisions
              matter. Especially interested in teams building systems at scale.
            </motion.p>

            {contactItems.map(({ Icon, label, value, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all group"
              >
                <div className="w-9 h-9 rounded-md bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center shrink-0 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/5 transition-colors">
                  <Icon
                    size={16}
                    className="text-zinc-400 group-hover:text-cyan-400 transition-colors"
                    weight="bold"
                  />
                </div>
                <div>
                  <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                    {label}
                  </p>
                  <p className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors mt-0.5">
                    {value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-sm font-bold text-zinc-600 tracking-wider">
            thangvb
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/thangvb168"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
              aria-label="GitHub"
            >
              <GithubLogo size={18} weight="bold" />
            </a>
            <p className="text-xs font-mono text-zinc-800">
              Built with Next.js + Tailwind v4
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
