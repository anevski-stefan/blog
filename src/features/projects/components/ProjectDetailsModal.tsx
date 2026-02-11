import Image from "next/image"
import Link from "next/link"

import type { Project } from "@/features/projects/data/projects"
import { ProjectStatusBadge } from "./ProjectStatusBadge"

interface ProjectDetailsModalProps {
  project: Project
  onClose: () => void
}

export function ProjectDetailsModal({
  project,
  onClose,
}: ProjectDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="glass rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="relative">
          <div className="w-full aspect-video relative">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-home-primary via-transparent to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors text-white"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute top-4 left-4">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>

        <div className="p-6 md:p-8 text-white overflow-y-auto max-h-[calc(90vh-300px)]">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono text-home-accent uppercase tracking-wider mb-2 block">
                {project.category.replace("-", " ")}
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold">
                {project.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-home-accent hover:bg-home-accent/90 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Live Demo
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Source
                </Link>
              )}
            </div>
          </div>

          <p className="text-home-muted leading-relaxed mb-6">
            {project.longDescription}
          </p>

          <div className="mb-6">
            <h4 className="text-sm font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-home-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Key Features
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {project.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-home-muted"
                >
                  <svg
                    className="w-4 h-4 text-green-500 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-home-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map(t => (
                <span
                  key={t}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
            <div className="text-center">
              <div className="font-heading text-xl font-semibold text-home-accent">
                {project.stats.users}
              </div>
              <div className="text-xs text-home-muted">Users</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="font-heading text-xl font-semibold text-home-accent">
                {project.stats.stars}
              </div>
              <div className="text-xs text-home-muted">Stars</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-xl font-semibold text-home-accent">
                {project.stats.duration}
              </div>
              <div className="text-xs text-home-muted">Duration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
