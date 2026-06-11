"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as number[];

const projects = [
  {
    id: "vfm",
    name: "VFM Education Platform",
    category: "CRM + HRM + LMS",
    description:
      "Integrated training management platform covering CRM for lead tracking, HRM for staff management, and LMS for course delivery. Complex multi-condition form workflows, an online exam system, Monaco editor with a custom Markdown-to-React pipeline, and real-time features. Built an AI Agent SKILL system that cut form development time by 60%.",
    stack: [
      "NestJS",
      "ReactJS",
      "NextJS",
      "Socket.io",
      "PostgreSQL",
      "Zustand",
      "Monaco Editor",
    ],
    image:
      "https://picsum.photos/seed/education-platform-lms-crm-dashboard/1200/600",
    imageAlt: "Education platform dashboard",
  },
  {
    id: "kingstudy",
    name: "KingStudy",
    category: "Study-abroad consulting",
    description:
      "Designed database schema and API for lead and profile management. Full data pipeline from UI to PostgreSQL with automated email notifications for follow-ups.",
    stack: ["NestJS", "PostgreSQL", "ReactJS", "NextJS"],
    image: "https://picsum.photos/seed/study-abroad-consulting-leads/700/500",
    imageAlt: "Study abroad platform",
  },
  {
    id: "chappyt",
    name: "Chappyt",
    category: "Real-time chat",
    description:
      "End-to-end real-time chat with Socket.io for messaging, typing indicators, reactions, and file sharing. Redis-backed presence tracking for online/offline state.",
    stack: ["Socket.io", "Redis", "MongoDB", "PostgreSQL", "NextJS"],
    image: "https://picsum.photos/seed/realtime-chat-messaging-dark/700/500",
    imageAlt: "Chat application",
  },
];

export function ProjectsSection() {
  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="bg-zinc-950 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight mb-10"
        >
          Featured Work
        </motion.h2>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Large featured card - full width with image bg */}
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors duration-300 cursor-default"
          >
            <div className="relative h-72 md:h-96 overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                fill
                priority
                className="object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.02] transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 90vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/10 pointer-events-none" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
                {featured.category}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-50 tracking-tight mb-3">
                {featured.name}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-[70ch] mb-4 hidden sm:block">
                {featured.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {featured.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono text-zinc-400 bg-zinc-950/70 border border-zinc-700/60 rounded-full px-2.5 py-0.5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-950/80 border border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={14} className="text-cyan-400" weight="bold" />
            </div>
          </motion.article>

          {/* Two smaller cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                whileHover={{ y: -3 }}
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 cursor-default"
              >
                <div className="relative h-44 overflow-hidden shrink-0">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-[1.03] transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent pointer-events-none" />
                </div>

                <div className="flex flex-col justify-between gap-3 p-5 flex-1">
                  <div className="space-y-2">
                    <p className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-widest">
                      {project.category}
                    </p>
                    <h3 className="text-lg font-bold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
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

                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-zinc-950/80 border border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight
                    size={13}
                    className="text-cyan-400"
                    weight="bold"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
