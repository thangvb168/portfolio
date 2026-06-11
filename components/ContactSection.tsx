'use client'

import { motion } from 'motion/react'
import { Envelope, Phone, GithubLogo } from '@phosphor-icons/react'

const contactItems = [
  {
    icon: Envelope,
    label: 'Email',
    value: 'thangvb.dev@gmail.com',
    href: 'mailto:thangvb.dev@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+84 378 481 575',
    href: 'tel:+84378481575',
  },
  {
    icon: GithubLogo,
    label: 'GitHub',
    value: 'github.com/thangvb168',
    href: 'https://github.com/thangvb168',
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="bg-zinc-950 py-24 md:py-32 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left: Heading and message */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as number[] }}
            className="lg:col-span-6 space-y-5"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight">
              Let&apos;s connect
            </h2>
            <p className="text-zinc-400 leading-relaxed max-w-[50ch]">
              Open to fullstack and backend roles where architecture decisions matter.
              Especially interested in teams working on systems at scale.
            </p>
          </motion.div>

          {/* Right: Contact links */}
          <div className="lg:col-span-6 space-y-3">
            {contactItems.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1] as number[],
                  }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all group"
                >
                  <div className="w-9 h-9 rounded-md bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center shrink-0 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/5 transition-colors">
                    <Icon size={16} className="text-zinc-400 group-hover:text-cyan-400 transition-colors" weight="bold" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                      {item.label}
                    </p>
                    <p className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              )
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs font-mono text-zinc-700">
            Vu Ba Thang &nbsp;|&nbsp; Hanoi, Vietnam &nbsp;|&nbsp; 2025
          </p>
          <p className="text-xs font-mono text-zinc-700">
            Built with Next.js and Tailwind v4
          </p>
        </div>
      </div>
    </section>
  )
}
