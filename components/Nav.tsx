'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useScroll, useMotionValueEvent } from 'motion/react'
import { GithubLogo } from '@phosphor-icons/react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 24)
  })

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-15 flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex items-center justify-between">
        {/* Logo with avatar */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group"
          aria-label="Vu Ba Thang - back to top"
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
          <span className="font-mono text-sm font-semibold text-cyan-400 tracking-wider group-hover:text-cyan-300 transition-colors">
            vbt.
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
          href="https://github.com/thangvb168"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="GitHub profile"
        >
          <GithubLogo size={16} weight="bold" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  )
}
