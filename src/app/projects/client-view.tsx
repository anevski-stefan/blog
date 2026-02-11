"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { WebGLBackground } from "@/components/home/WebGLBackground"
import { DotGridBackground } from "@/components/shared/DotGridBackground"
import { projectsData, Project } from "@/lib/data/projects"
import { ProjectDetailsModal } from "@/features/projects/components/ProjectDetailsModal"
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge"
import { ProjectsCtaSection } from "@/features/projects/components/ProjectsCtaSection"
import { ProjectsFilterBar } from "@/features/projects/components/ProjectsFilterBar"
import { ProjectsFooter } from "@/features/projects/components/ProjectsFooter"
import { ProjectsHero } from "@/features/projects/components/ProjectsHero"
import { ProjectsStats } from "@/features/projects/components/ProjectsStats"
import { ProjectsStatusSummary } from "@/features/projects/components/ProjectsStatusSummary"

gsap.registerPlugin(ScrollTrigger)

export function ProjectsClientView() {
  const [currentFilter, setCurrentFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [visibleCount, setVisibleCount] = useState(9)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setVisibleCount(prev => prev + 6)
    setIsLoadingMore(false)
  }

  const filteredProjects = useMemo(() => {
    let filtered = [...projectsData]

    if (currentFilter !== "all") {
      filtered = filtered.filter(p => p.category === currentFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tech.some(t => t.toLowerCase().includes(query))
      )
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.year - a.year)
        break
      case "oldest":
        filtered.sort((a, b) => a.year - b.year)
        break
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

    return filtered
  }, [currentFilter, searchQuery, sortBy])

  const displayedProjects = filteredProjects.slice(0, visibleCount)

  const prevFilterState = useRef({
    currentFilter,
    searchQuery,
    sortBy,
    viewMode,
  })

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const isFilterChange =
        prevFilterState.current.currentFilter !== currentFilter ||
        prevFilterState.current.searchQuery !== searchQuery ||
        prevFilterState.current.sortBy !== sortBy ||
        prevFilterState.current.viewMode !== viewMode

      prevFilterState.current = { currentFilter, searchQuery, sortBy, viewMode }

      const allCards = containerRef.current!.querySelectorAll(".project-card")

      if (isFilterChange) {
        if (allCards.length > 0) {
          gsap.fromTo(
            allCards,
            { opacity: 0, y: 20, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: "power2.out",
              clearProps: "all",
              onComplete: () => {
                allCards.forEach(card =>
                  card.setAttribute("data-animated", "true")
                )
              },
            }
          )
        }
      } else {
        const newCards = Array.from(allCards).filter(
          card => !card.hasAttribute("data-animated")
        )

        if (newCards.length > 0) {
          const isInitialLoad = newCards.length === allCards.length

          gsap.fromTo(
            newCards,
            { opacity: 0, y: 35, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.05,
              ease: "power2.out",
              delay: isInitialLoad ? 0.7 : 0,
              clearProps: "all",
              onComplete: () => {
                newCards.forEach(card =>
                  card.setAttribute("data-animated", "true")
                )
              },
            }
          )
        }
      }
    }, containerRef)

    return () => ctx.revert()
  }, [displayedProjects, currentFilter, searchQuery, sortBy, viewMode])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.fromTo(
        ".projects-hero > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "all",
        }
      )

      tl.fromTo(
        ".stat-card",
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.5,
          ease: "back.out(1.5)",
          onComplete: () => {
            const statNumbers = document.querySelectorAll(".stat-number")
            statNumbers.forEach(num => {
              const targetValue = parseInt(
                num.getAttribute("data-target") || "0"
              )
              const obj = { value: 0 }
              gsap.to(obj, {
                value: targetValue,
                duration: 1.2,
                ease: "power2.out",
                onUpdate: () => {
                  num.textContent = Math.floor(obj.value).toString()
                },
              })
            })
          },
        },
        "-=0.4"
      )

      tl.fromTo(
        ".filter-bar",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
          clearProps: "all",
        },
        "-=0.3"
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedProject])

  return (
    <div className="relative z-0 font-body bg-home-primary text-white overflow-x-hidden min-h-screen">
      <WebGLBackground />
      <DotGridBackground className="opacity-[0.02]" />

      <SiteHeader variant="solid" />

      <main className="pt-28 md:pt-36 pb-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <ProjectsHero />
          <ProjectsStats />
          <ProjectsFilterBar
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            setVisibleCount={setVisibleCount}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <ProjectsStatusSummary total={filteredProjects.length} />

          {displayedProjects.length > 0 ? (
            <div
              ref={containerRef}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                  : "flex flex-col gap-4 mb-12"
              }
            >
              {displayedProjects.map(project => (
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

                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4`}
                    >
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
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full transition-colors"
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

                  <div
                    className={`${viewMode === "list" ? "p-0" : "p-5"} flex-1`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-home-accent uppercase tracking-wider">
                        {project.category.replace("-", " ")}
                      </span>
                      <span className="text-xs text-home-muted">
                        {project.year}
                      </span>
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
                      onClick={() => setSelectedProject(project)}
                      className="text-sm text-home-accent hover:text-white transition-colors flex items-center gap-2 group/btn"
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
            </div>
          ) : (
            <div className="text-center py-20">
              <svg
                className="w-16 h-16 text-home-muted/50 mx-auto mb-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h3 className="font-heading text-xl font-medium mb-2">
                No projects found
              </h3>
              <p className="text-home-muted text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {filteredProjects.length > visibleCount && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className={`group relative px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-home-accent/30 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden ${isLoadingMore ? "pl-10 pr-10 cursor-wait opacity-80" : "hover:scale-105 active:scale-95"}`}
              >
                <span
                  className={`flex items-center gap-2 transition-transform duration-300 ${isLoadingMore ? "translate-y-8 opacity-0 absolute" : "translate-y-0 opacity-100"}`}
                >
                  Load More Projects
                </span>
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isLoadingMore ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}
                >
                  <svg
                    className="w-5 h-5 animate-spin text-home-accent"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          )}

          <ProjectsCtaSection />
        </div>
      </main>

      <ProjectsFooter />

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  )
}
