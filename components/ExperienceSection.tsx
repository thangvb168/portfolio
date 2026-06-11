"use client";

import { motion } from "motion/react";

const experiences = [
  {
    company: "VFM Technology",
    role: "Fullstack Developer",
    period: "04/2025 - 04/2026",
    current: true,
    projects: [
      {
        name: "VFM Education Platform",
        subtitle: "CRM + HRM + LMS",
        highlights: [
          "Complex multi-condition form workflows for HRM, CRM, and LMS modules",
          "Online exam system: question editor and exam-taking interface",
          "Monaco-based editor with custom syntax highlighting and Markdown to React pipeline",
          "Real-time chat and notifications via Socket.io",
          "Built AI Agent SKILL and Workflow - reduced CRUD form development time by ~60%",
        ],
        stack: [
          "ReactJS",
          "NextJS",
          "TailwindCSS",
          "Ant Design",
          "Zustand",
          "React Hook Form",
          "Zod",
          "Socket.io",
          "Monaco Editor",
        ],
        highlight: true,
      },
      {
        name: "KingStudy",
        subtitle: "Study-abroad consulting platform",
        highlights: [
          "Designed schema and API for lead and profile management flows",
          "Full data flow: UI to API to PostgreSQL",
          "Automated email notifications",
        ],
        stack: ["NestJS", "PostgreSQL", "ReactJS", "NextJS"],
        highlight: false,
      },
    ],
  },
  {
    company: "FPT Software",
    role: "Fullstack Intern",
    period: "07/2024 - 03/2025",
    current: false,
    projects: [
      {
        name: "Chappyt",
        subtitle: "Real-time chat application",
        highlights: [
          "End-to-end real-time: messaging, typing indicators, reactions, file sharing via Socket.io",
          "Online/offline presence tracking with Redis",
        ],
        stack: [
          "Socket.io",
          "MongoDB",
          "PostgreSQL",
          "Redis",
          "NextJS",
          "TailwindCSS",
        ],
        highlight: false,
      },
      {
        name: "Happy Board",
        subtitle: "Idea sharing platform (Backend)",
        highlights: [
          "RESTful API with Google JWT auth and Redis caching",
          "Elasticsearch full-text search",
          "Real-time notifications via Firebase and RabbitMQ; Cloudinary image upload",
        ],
        stack: [
          "Express.js",
          "PostgreSQL",
          "Sequelize",
          "Redis",
          "Elasticsearch",
          "Firebase",
          "RabbitMQ",
        ],
        highlight: false,
      },
    ],
  },
  {
    company: "ZENTSOFT",
    role: "Backend Intern",
    period: "11/2023 - 07/2024",
    current: false,
    projects: [
      {
        name: "Book Store API",
        subtitle: "E-commerce backend",
        highlights: [
          "Auth, RBAC, book and cart management",
          "Source: github.com/thangvb168/bookstore-api",
        ],
        stack: ["Node.js", "Express.js", "MongoDB", "JWT", "Cloudinary"],
        highlight: false,
      },
    ],
  },
];

const coreValues = [
  {
    title: "Clean Code",
    description:
      "Strict adherence to SOLID principles. Every abstraction earns its place through clarity, not cleverness.",
  },
  {
    title: "Scalability",
    description:
      "PostgreSQL schema design, Redis caching strategies, and event-driven queues built to grow without rewrites.",
  },
  {
    title: "Security First",
    description:
      "JWT auth, session hygiene, and secure data pipelines are non-negotiable defaults, not afterthoughts.",
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="bg-zinc-900 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Core Values */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as number[] }}
          className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight mb-8"
        >
          Engineering Values
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {coreValues.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1] as number[],
              }}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 transition-colors"
            >
              <div className="w-1 h-8 bg-cyan-400/50 rounded-full mb-4" />
              <h3 className="text-base font-semibold text-zinc-100 mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {v.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as number[] }}
          className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight mb-16"
        >
          Experience
        </motion.h2>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[11px] top-2 bottom-8 w-px bg-zinc-800" />

          <div className="space-y-0">
            {experiences.map((exp, ei) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.6,
                  delay: ei * 0.08,
                  ease: [0.16, 1, 0.3, 1] as number[],
                }}
                className="relative pl-10 pb-14 last:pb-0"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10
                    ${
                      exp.current
                        ? "border-cyan-400 bg-zinc-950"
                        : "border-zinc-700 bg-zinc-950"
                    }`}
                >
                  {exp.current && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  )}
                </div>

                {/* Company header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-7">
                  <div>
                    <h3
                      className={`text-xl font-semibold tracking-tight ${
                        exp.current ? "text-zinc-50" : "text-zinc-200"
                      }`}
                    >
                      {exp.company}
                    </h3>
                    <p className="text-sm font-mono text-zinc-500 mt-0.5">
                      {exp.role}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono shrink-0 ${
                      exp.current ? "text-cyan-400/80" : "text-zinc-600"
                    }`}
                  >
                    {exp.period}
                  </span>
                </div>

                {/* Projects */}
                <div className="space-y-6">
                  {exp.projects.map((proj) => (
                    <div
                      key={proj.name}
                      className="pl-5 border-l border-zinc-800"
                    >
                      <div className="flex items-baseline gap-3 mb-2.5">
                        <h4 className="text-sm font-semibold text-zinc-200">
                          {proj.name}
                        </h4>
                        <span className="text-xs text-zinc-600 font-mono">
                          {proj.subtitle}
                        </span>
                      </div>

                      <ul className="space-y-1.5 mb-3">
                        {proj.highlights.map((h, hi) => (
                          <li key={hi} className="flex gap-2 text-sm">
                            <span className="text-zinc-700 mt-0.5 shrink-0 select-none">
                              -
                            </span>
                            <span
                              className={
                                proj.highlight &&
                                hi === proj.highlights.length - 1
                                  ? "text-zinc-300 font-medium"
                                  : "text-zinc-400"
                              }
                            >
                              {h}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5">
                        {proj.stack.map((s) => (
                          <span
                            key={s}
                            className="text-xs font-mono text-zinc-600 bg-zinc-900/80 border border-zinc-800/80 rounded-full px-2 py-0.5"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
