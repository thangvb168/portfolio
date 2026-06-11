'use client'

import { motion } from 'motion/react'

const layers = [
  {
    label: 'Frontend',
    tags: ['ReactJS', 'NextJS', 'TailwindCSS', 'Ant Design', 'Zustand', 'React Hook Form', 'Zod'],
  },
  {
    label: 'Backend',
    tags: ['NestJS', 'Express.js', 'Node.js', 'RESTful API design', 'JWT'],
  },
  {
    label: 'Database + Cache',
    tags: ['PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    label: 'Real-time + Messaging',
    tags: ['Socket.io', 'RabbitMQ', 'Firebase'],
  },
  {
    label: 'Search + Infra',
    tags: ['Elasticsearch', 'Docker', 'Git', 'Cloudinary'],
  },
  {
    label: 'Languages',
    tags: ['TypeScript', 'JavaScript'],
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="bg-zinc-950 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as number[] }}
          className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight mb-14"
        >
          Technical Stack
        </motion.h2>

        {/* Architecture layer visualization */}
        <div className="space-y-px">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1] as number[],
              }}
              className="group grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3 sm:gap-6 items-start py-4 sm:py-3 border-b border-zinc-800/60 last:border-b-0"
            >
              <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest pt-0.5 shrink-0">
                {layer.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {layer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-zinc-300 bg-zinc-900/60 border border-zinc-800 rounded-full px-3 py-1 hover:border-zinc-600 hover:text-zinc-100 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Language note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 pt-6 border-t border-zinc-800/60"
        >
          <p className="text-sm text-zinc-500">
            English: TOEIC 640 - comfortable reading technical documentation and communicating in engineering contexts.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
