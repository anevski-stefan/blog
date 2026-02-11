import Image from "next/image"
import Link from "next/link"

import type { Project } from "@/features/projects/data/projects"
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge"

export function ProjectsCardGrid(props: {
  projects: Project[]
  viewMode: "grid" | "list"
  onSelectProject: (project: Project) => void
}) {
  const { projects, viewMode, onSelectProject } = props

  return (
    <>
      {projects.map(project => (
        <article
          key={project.id}
          className={`project-card glass rounded-xl border border-white/10 overflow-hidden group hover:-translate-y-2 hover:border-home-accent/30 transition-[transform,border-color] duration-500 ${viewMode === "list" ? "flex flex-col md:grid md:grid-cols-[280px_1fr_auto] gap-8 items-center p-4" : ""}`}
        >
          <div
            className={`relative overflow-hidden ${viewMode === "list" ? "w-full h-[200px] md:h-[180px] rounded-xl" : "aspect-[16/10]"}`}
          >
            {project.featured && (
              <div className="absolute top-3 left-3 z-20 px-2 py-1 text-[10px] font-mono text-white rounded uppercase bg-gradient-to-r from-home-accent via-purple-500 to-home-accent bg-[length:200%_100%] animate-shimmer">
                Featured
              </div>
            )}
            <div className="absolute top-3 right-3 z-20">
              <ProjectStatusBadge status={project.status} />
            </div>
            <div className="w-full h-full relative">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <div className="flex gap-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-home-accent hover:bg-home-accent/90 text-white text-xs font-medium rounded-full transition-colors whitespace-nowrap"
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full transition-colors whitespace-nowrap"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Code
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className={`${viewMode === "list" ? "p-0" : "p-5"} flex-1`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-home-accent uppercase tracking-wider">
                {project.category.replace("-", " ")}
              </span>
              <span className="text-xs text-home-muted">{project.year}</span>
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-home-accent transition-colors">
              {project.title}
            </h3>
            <p className="text-home-muted text-sm leading-relaxed mb-4 line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech.slice(0, 4).map(t => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/60 hover:bg-home-accent/30 hover:border-home-accent hover:text-home-accent transition-all duration-300"
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/60">
                  +{project.tech.length - 4}
                </span>
              )}
            </div>
            <button
              onClick={() => onSelectProject(project)}
              className="text-sm text-home-accent hover:text-white transition-colors flex items-center gap-2 group/btn"
              type="button"
            >
              View Details
              <svg
                className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </article>
      ))}
    </>
  )
}
