'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { ArrowUpRight } from '@phosphor-icons/react'

const projects = [
  {
    id: 'vfm',
    name: 'VFM Education Platform',
    category: 'CRM + HRM + LMS',
    description:
      'Integrated training management platform built at VFM Technology. Covers CRM for lead tracking, HRM for staff management, and LMS for course delivery. Complex multi-condition form workflows, an online exam system, Monaco editor with a custom Markdown-to-React pipeline, and real-time features. Also built the AI Agent SKILL and Workflow system that reduced form development time by 60%.',
    stack: ['ReactJS', 'NextJS', 'Ant Design', 'Zustand', 'Socket.io', 'Monaco Editor', 'Zod'],
    image: 'https://picsum.photos/seed/education-platform-lms-crm-dashboard/900/500',
    imageAlt: 'Education platform dashboard placeholder',
    featured: true,
  },
  {
    id: 'kingstudy',
    name: 'KingStudy',
    category: 'Study-abroad consulting',
    description:
      'Full-stack consulting platform for study-abroad services. Designed the database schema and API for lead and profile management. Built the complete data pipeline: UI to API to PostgreSQL, with automated email notifications for lead follow-ups.',
    stack: ['NestJS', 'PostgreSQL', 'ReactJS', 'NextJS'],
    image: 'https://picsum.photos/seed/study-abroad-consulting-leads/700/420',
    imageAlt: 'Study abroad platform placeholder',
    featured: false,
  },
  {
    id: 'chappyt',
    name: 'Chappyt',
    category: 'Real-time chat',
    description:
      'End-to-end real-time chat application. Socket.io for messaging, typing indicators, reactions, and file sharing. Redis-backed presence tracking for online/offline state.',
    stack: ['Socket.io', 'Redis', 'MongoDB', 'PostgreSQL', 'NextJS'],
    image: 'https://picsum.photos/seed/realtime-chat-messaging-app/700/420',
    imageAlt: 'Chat application placeholder',
    featured: false,
  },
]

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0]
  index: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1] as number[],
      }}
      whileHover={{ y: -3 }}
      className={`group relative flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/40
        hover:border-zinc-700 transition-colors duration-300
        ${project.featured ? 'lg:flex-row lg:min-h-[320px]' : ''}`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden shrink-0
          ${project.featured
            ? 'h-52 lg:h-auto lg:w-[45%]'
            : 'h-44'
          }`}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover opacity-70 group-hover:opacity-85 group-hover:scale-[1.03] transition-all duration-500"
          sizes={project.featured ? '(max-width: 1024px) 100vw, 45vw' : '(max-width: 768px) 100vw, 50vw'}
        />
        {/* Gradient overlay */}
        {project.featured ? (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/60 lg:to-zinc-900/80 pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-between gap-4 p-6 ${project.featured ? 'lg:p-8' : ''}`}>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-mono text-cyan-400/80 mb-1 uppercase tracking-widest">
              {project.category}
            </p>
            <h3
              className={`font-bold text-zinc-100 tracking-tight group-hover:text-white transition-colors ${
                project.featured ? 'text-2xl' : 'text-lg'
              }`}
            >
              {project.name}
            </h3>
          </div>

          <p
            className={`text-zinc-400 leading-relaxed ${
              project.featured ? 'text-sm max-w-[62ch]' : 'text-sm line-clamp-3'
            }`}
          >
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="text-xs font-mono text-zinc-500 bg-zinc-950/60 border border-zinc-800 rounded-full px-2.5 py-0.5"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Top-right arrow indicator */}
      <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-950/70 border border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={13} className="text-cyan-400" weight="bold" />
      </div>
    </motion.article>
  )
}

export function ProjectsSection() {
  const [featured, ...rest] = projects

  return (
    <section id="projects" className="bg-zinc-900 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as number[] }}
          >
            <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-2">
              Selected Work
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight">
              Projects
            </h2>
          </motion.div>
        </div>

        <div className="space-y-5">
          {/* Featured project */}
          <ProjectCard project={featured} index={0} />

          {/* Two smaller projects side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rest.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
