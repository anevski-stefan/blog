"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"

import type { Project } from "@/features/projects/data/projects"
import { ProjectDetailsModal } from "@/features/projects/components/ProjectDetailsModal"
import { ProjectsFilterBar } from "@/features/projects/components/ProjectsFilterBar"
import { ProjectsStatusSummary } from "@/features/projects/components/ProjectsStatusSummary"
import { ProjectsCardGrid } from "@/features/projects/components/ProjectsCardGrid"

export function ProjectsInteractive(props: { projects: Project[] }) {
  const { projects } = props

  const [currentFilter, setCurrentFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [visibleCount, setVisibleCount] = useState(9)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const prevFilterState = useRef({
    currentFilter,
    searchQuery,
    sortBy,
    viewMode,
  })

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setVisibleCount(prev => prev + 6)
    setIsLoadingMore(false)
  }

  const filteredProjects = useMemo(() => {
    let filtered = [...projects]

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
  }, [currentFilter, projects, searchQuery, sortBy])

  const displayedProjects = filteredProjects.slice(0, visibleCount)

  useEffect(() => {
    const rootEl = document.getElementById("projects-root")
    if (!rootEl) return

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
    }, rootEl)

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

  useEffect(() => {
    if (!cardsContainerRef.current) return

    const ctx = gsap.context(() => {
      const isFilterChange =
        prevFilterState.current.currentFilter !== currentFilter ||
        prevFilterState.current.searchQuery !== searchQuery ||
        prevFilterState.current.sortBy !== sortBy ||
        prevFilterState.current.viewMode !== viewMode

      prevFilterState.current = { currentFilter, searchQuery, sortBy, viewMode }

      const allCards =
        cardsContainerRef.current!.querySelectorAll(".project-card")

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
    }, cardsContainerRef)

    return () => ctx.revert()
  }, [displayedProjects, currentFilter, searchQuery, sortBy, viewMode])

  return (
    <>
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
          ref={cardsContainerRef}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              : "flex flex-col gap-4 mb-12"
          }
        >
          <ProjectsCardGrid
            projects={displayedProjects}
            viewMode={viewMode}
            onSelectProject={setSelectedProject}
          />
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
            type="button"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </button>
        </div>
      )}

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}
