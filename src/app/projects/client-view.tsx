"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { projectsData, Project } from "@/lib/data/projects"

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

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "live":
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-500 text-[10px] font-mono rounded uppercase">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Live
          </span>
        )
      case "development":
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-mono rounded uppercase">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>In
            Dev
          </span>
        )
      case "archived":
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-home-muted/20 text-home-muted text-[10px] font-mono rounded uppercase">
            Archived
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="font-body bg-home-primary text-white overflow-x-hidden min-h-screen">
      <div
        className="fixed inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(#5865F2 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <SiteHeader variant="solid" />

      <main className="pt-28 md:pt-36 pb-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="projects-hero text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-home-accent rounded-full animate-pulse"></span>
              <span className="text-xs font-mono font-medium tracking-widest uppercase text-home-accent">
                Portfolio
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
              Featured Projects
            </h1>
            <p className="text-home-muted text-lg max-w-2xl mx-auto">
              A curated collection of projects showcasing my expertise in
              full-stack development, system design, and creative
              problem-solving.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="stat-card glass rounded-xl border border-white/10 p-5 text-center transition-all duration-300 hover:border-home-accent/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-home-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="font-heading text-3xl font-bold text-home-accent mb-1">
                <span className="stat-number" data-target="24">
                  0
                </span>
              </div>
              <div className="text-xs text-home-muted uppercase tracking-wider">
                Total Projects
              </div>
            </div>
            <div className="stat-card glass rounded-xl border border-white/10 p-5 text-center transition-all duration-300 hover:border-home-accent/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-home-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="font-heading text-3xl font-bold text-green-500 mb-1">
                <span className="stat-number" data-target="18">
                  0
                </span>
              </div>
              <div className="text-xs text-home-muted uppercase tracking-wider">
                Live & Active
              </div>
            </div>
            <div className="stat-card glass rounded-xl border border-white/10 p-5 text-center transition-all duration-300 hover:border-home-accent/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-home-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="font-heading text-3xl font-bold text-yellow-500 mb-1">
                <span className="stat-number" data-target="2">
                  0
                </span>
                M+
              </div>
              <div className="text-xs text-home-muted uppercase tracking-wider">
                Users Reached
              </div>
            </div>
            <div className="stat-card glass rounded-xl border border-white/10 p-5 text-center transition-all duration-300 hover:border-home-accent/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-home-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="font-heading text-3xl font-bold text-pink-500 mb-1">
                <span className="stat-number" data-target="15">
                  0
                </span>
              </div>
              <div className="text-xs text-home-muted uppercase tracking-wider">
                Open Source
              </div>
            </div>
          </div>

          <div className="filter-bar flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 p-4 glass rounded-xl border border-white/10">
            <div className="flex flex-wrap gap-2">
              {["all", "web-app", "api", "design-system", "open-source"].map(
                cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCurrentFilter(cat)
                      setVisibleCount(9)
                    }}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border border-white/10 rounded-lg bg-white/5 transition-all duration-300 ${currentFilter === cat ? "bg-home-accent/20 border-home-accent text-home-accent" : "hover:bg-home-accent/20 hover:text-home-accent hover:border-home-accent"}`}
                  >
                    {cat === "all" ? "All Projects" : cat.replace("-", " ")}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-home-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value)
                    setVisibleCount(9)
                  }}
                  className="w-40 md:w-48 bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-home-accent/50 transition-colors text-white placeholder-home-muted"
                />
              </div>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-home-accent/50 transition-colors text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
              </select>

              <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-home-accent/20 text-home-accent" : "text-white hover:text-home-accent"}`}
                  title="Grid View"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-home-accent/20 text-home-accent" : "text-white hover:text-home-accent"}`}
                  title="List View"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-home-muted">
              Showing{" "}
              <span className="text-white font-medium">
                {filteredProjects.length}
              </span>{" "}
              projects
            </p>
            <div className="flex items-center gap-2 text-xs text-home-muted">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Live
              <span className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>{" "}
              In Development
              <span className="w-2 h-2 bg-home-muted rounded-full ml-2"></span>{" "}
              Archived
            </div>
          </div>

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
                      {getStatusBadge(project.status)}
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

          <section className="py-20 border-t border-white/5 mt-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                Have a project in mind?
              </h2>
              <p className="text-home-muted mb-8 max-w-lg mx-auto">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:hello@stefananevski.com"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-home-accent hover:bg-home-accent/90 text-white font-heading text-sm font-medium tracking-wider rounded-full transition-all hover:scale-105"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Start a Conversation
                </a>
                <a
                  href="https://github.com/alexchen"
                  target="_blank"
                  className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 hover:border-home-accent/50 text-white font-heading text-sm font-medium tracking-wider rounded-full transition-all hover:bg-white/5"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View GitHub
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-8 md:py-12 px-6 md:px-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-home-muted">
          © {new Date().getFullYear()} Stefan Anevski. All rights reserved.
        </p>
        <div className="flex gap-6 md:gap-8">
          <a
            href="#"
            className="text-sm text-home-muted hover:text-white transition-colors duration-300"
          >
            Twitter
          </a>
          <a
            href="#"
            className="text-sm text-home-muted hover:text-white transition-colors duration-300"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="text-sm text-home-muted hover:text-white transition-colors duration-300"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-sm text-home-muted hover:text-white transition-colors duration-300"
          >
            Dribbble
          </a>
        </div>
      </footer>

      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={e => {
            if (e.target === e.currentTarget) setSelectedProject(null)
          }}
        >
          <div className="glass rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="relative">
              <div className="w-full aspect-video relative">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-home-primary via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedProject(null)}
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
                {getStatusBadge(selectedProject.status)}
              </div>
            </div>

            <div className="p-6 md:p-8 text-white overflow-y-auto max-h-[calc(90vh-300px)]">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-mono text-home-accent uppercase tracking-wider mb-2 block">
                    {selectedProject.category.replace("-", " ")}
                  </span>
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold">
                    {selectedProject.title}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {selectedProject.liveUrl && (
                    <Link
                      href={selectedProject.liveUrl}
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
                  {selectedProject.githubUrl && (
                    <Link
                      href={selectedProject.githubUrl}
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
                {selectedProject.longDescription}
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
                  {selectedProject.features.map((feature, i) => (
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
                  {selectedProject.tech.map(t => (
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
                    {selectedProject.stats.users}
                  </div>
                  <div className="text-xs text-home-muted">Users</div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="font-heading text-xl font-semibold text-home-accent">
                    {selectedProject.stats.stars}
                  </div>
                  <div className="text-xs text-home-muted">Stars</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-xl font-semibold text-home-accent">
                    {selectedProject.stats.duration}
                  </div>
                  <div className="text-xs text-home-muted">Duration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
