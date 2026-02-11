import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { WebGLBackground } from "@/components/shared/backgrounds/WebGLBackground"
import { DotGridBackground } from "@/components/shared/DotGridBackground"
import { timelineData, TimelineType } from "@/features/timeline/data/timeline"
import { cn } from "@/lib/utils"
import { TimelineGlobalStyles } from "@/features/timeline/components/TimelineGlobalStyles"
import { TimelineDecorations } from "@/features/timeline/components/TimelineDecorations"

export const metadata: Metadata = {
  title: "Timeline — Stefan Anevski",
  description:
    "My professional journey through the years - milestones, achievements, and growth.",
}

interface TimelinePageProps {
  searchParams: Promise<{
    type?: string
  }>
}

function getBadgeColor(type: TimelineType) {
  switch (type) {
    case "work":
      return "bg-home-accent/15 text-home-accent border-home-accent/30"
    case "education":
      return "bg-green-500/15 text-green-500 border-green-500/30"
    case "achievement":
      return "bg-amber-500/15 text-amber-500 border-amber-500/30"
    case "project":
      return "bg-pink-500/15 text-pink-500 border-pink-500/30"
    default:
      return "bg-home-accent/15 text-home-accent border-home-accent/30"
  }
}

function getIconColor(type: TimelineType) {
  switch (type) {
    case "work":
      return "bg-home-accent/20 text-home-accent"
    case "education":
      return "bg-green-500/20 text-green-500"
    case "achievement":
      return "bg-amber-500/20 text-amber-500"
    case "project":
      return "bg-pink-500/20 text-pink-500"
    default:
      return "bg-home-accent/20 text-home-accent"
  }
}

function getIcon(type: TimelineType) {
  switch (type) {
    case "work":
      return (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    case "education":
      return (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      )
    case "achievement":
      return (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    case "project":
      return (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
  }
}

function getActiveFilter(value: string | undefined): TimelineType | "all" {
  if (!value) return "all"
  if (value === "work") return "work"
  if (value === "education") return "education"
  if (value === "achievement") return "achievement"
  if (value === "project") return "project"
  return "all"
}

export default async function TimelinePage(props: TimelinePageProps) {
  const searchParams = await props.searchParams
  const filter = getActiveFilter(searchParams.type)
  const filteredItems =
    filter === "all"
      ? timelineData
      : timelineData.filter(i => i.type === filter)
  const visibleCount = filteredItems.length

  const firstYear = filteredItems[0]?.year

  return (
    <div className="relative z-0 font-body bg-home-primary text-white overflow-x-hidden min-h-screen">
      <TimelineGlobalStyles />

      <WebGLBackground />
      <DotGridBackground className="-z-5 opacity-[0.02]" />
      <TimelineDecorations />

      <SiteHeader variant="solid" />

      <section className="pt-32 md:pt-44 pb-16 md:pb-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-2 h-2 bg-home-accent rounded-full animate-pulse"></span>
                <p className="text-xs font-mono font-medium tracking-widest uppercase text-home-accent">
                  Career Journey
                </p>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter leading-[0.95] mb-6">
                8 Years of
                <br />
                <span className="bg-gradient-to-r from-home-accent via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Building
                </span>
              </h1>
              <p className="text-home-muted text-base md:text-lg max-w-lg leading-relaxed mb-8">
                From code to leadership — a snapshot of my professional growth.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#timeline"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-home-accent hover:bg-home-accent/90 text-white font-heading text-sm font-medium tracking-wider rounded-full transition-all hover:scale-105"
                >
                  Explore Timeline
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 hover:border-home-accent/50 text-white font-heading text-sm font-medium tracking-wider rounded-full transition-all hover:bg-white/5"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card glass rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-home-accent/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-home-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                </div>
                <div className="font-heading text-3xl md:text-4xl font-semibold mb-1">
                  8+
                </div>
                <div className="text-sm text-home-muted">Years Experience</div>
              </div>
              <div className="stat-card glass rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-home-accent/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-home-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                </div>
                <div className="font-heading text-3xl md:text-4xl font-semibold mb-1">
                  50+
                </div>
                <div className="text-sm text-home-muted">Projects Shipped</div>
              </div>
              <div className="stat-card glass rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-home-accent/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-home-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                </div>
                <div className="font-heading text-3xl md:text-4xl font-semibold mb-1">
                  5
                </div>
                <div className="text-sm text-home-muted">Companies</div>
              </div>
              <div className="stat-card glass rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-home-accent/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-home-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                </div>
                <div className="font-heading text-3xl md:text-4xl font-semibold mb-1">
                  2M+
                </div>
                <div className="text-sm text-home-muted">Users Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 px-6 md:px-16 sticky top-[72px] md:top-[88px] bg-home-primary/95 backdrop-blur-md z-30 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <span className="text-sm text-home-muted mr-2 hidden sm:block">
                Filter:
              </span>
              <Link
                href="/timeline"
                className={cn(
                  "filter-btn px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded-full transition-all whitespace-nowrap",
                  filter === "all"
                    ? "bg-home-accent/20 border-home-accent text-home-accent"
                    : "border-white/10 hover:border-home-accent/50"
                )}
              >
                All
              </Link>
              <Link
                href="/timeline?type=work"
                className={cn(
                  "filter-btn px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded-full transition-all whitespace-nowrap",
                  filter === "work"
                    ? "bg-home-accent/20 border-home-accent text-home-accent"
                    : "border-white/10 hover:border-home-accent/50"
                )}
              >
                <span className="hidden sm:inline mr-2">💼</span> Work
              </Link>
              <Link
                href="/timeline?type=education"
                className={cn(
                  "filter-btn px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded-full transition-all whitespace-nowrap",
                  filter === "education"
                    ? "bg-home-accent/20 border-home-accent text-home-accent"
                    : "border-white/10 hover:border-home-accent/50"
                )}
              >
                <span className="hidden sm:inline mr-2">🎓</span> Education
              </Link>
              <Link
                href="/timeline?type=achievement"
                className={cn(
                  "filter-btn px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded-full transition-all whitespace-nowrap",
                  filter === "achievement"
                    ? "bg-home-accent/20 border-home-accent text-home-accent"
                    : "border-white/10 hover:border-home-accent/50"
                )}
              >
                <span className="hidden sm:inline mr-2">🏆</span> Awards
              </Link>
              <Link
                href="/timeline?type=project"
                className={cn(
                  "filter-btn px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded-full transition-all whitespace-nowrap",
                  filter === "project"
                    ? "bg-home-accent/20 border-home-accent text-home-accent"
                    : "border-white/10 hover:border-home-accent/50"
                )}
              >
                <span className="hidden sm:inline mr-2">🚀</span> Projects
              </Link>
            </div>
            <div className="text-sm text-home-muted font-mono hidden md:block">
              {visibleCount} milestones
            </div>
          </div>
        </div>
      </section>

      <section id="timeline" className="py-16 md:py-24 px-6 md:px-16 relative">
        <div id="timeline-container" className="max-w-6xl mx-auto relative">
          <div className="timeline-line"></div>
          <div className="timeline-line-progress" id="timeline-progress"></div>

          <div className="relative">
            {firstYear && (
              <div
                className="year-marker flex justify-center mb-16 timeline-item"
                data-type="all"
              >
                <div className="glass px-6 py-3 rounded-full border border-home-accent/30 shadow-lg shadow-home-accent/10">
                  <span className="font-heading text-2xl font-semibold bg-gradient-to-r from-home-accent to-pink-500 bg-clip-text text-transparent">
                    {firstYear}
                  </span>
                </div>
              </div>
            )}

            {filteredItems.map((item, index) => {
              const isEven = index % 2 === 0

              const prev = filteredItems[index - 1]
              const showYearMarker = Boolean(prev && prev.year !== item.year)

              return (
                <div key={item.id}>
                  {showYearMarker && (
                    <div
                      className="year-marker flex justify-center mb-16 timeline-item"
                      data-type="all"
                    >
                      <div className="glass px-6 py-3 rounded-full border border-white/20">
                        <span className="font-heading text-2xl font-semibold text-white/80">
                          {item.year}
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className="timeline-item mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 relative"
                    data-type={item.type}
                  >
                    <div
                      className={`order-2 ${isEven ? "md:order-1" : ""} relative`}
                    >
                      <div
                        className={`timeline-content glass p-8 rounded-2xl border border-white/10 relative overflow-hidden ${isEven ? "md:text-right" : ""}`}
                      >
                        <div
                          className={`connector-line ${isEven ? "right" : "left"} hidden md:block`}
                        ></div>

                        {item.image && (
                          <div className="absolute inset-0 image-reveal z-0">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover opacity-20"
                            />
                          </div>
                        )}

                        <div className="relative z-10">
                          <div
                            className={`flex items-center gap-3 mb-4 ${isEven ? "md:justify-end" : ""}`}
                          >
                            <span
                              className={cn(
                                "px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full border",
                                getBadgeColor(item.type)
                              )}
                            >
                              {item.type}
                            </span>
                            <span className="text-xs text-home-muted font-mono">
                              {item.date}
                            </span>
                          </div>

                          <div
                            className={`flex items-center gap-4 mb-4 ${isEven ? "md:flex-row-reverse" : ""}`}
                          >
                            <div
                              className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                getIconColor(item.type)
                              )}
                            >
                              {getIcon(item.type)}
                            </div>
                            <div className={isEven ? "md:text-right" : ""}>
                              <h3 className="font-heading text-xl md:text-2xl font-semibold mb-1">
                                {item.title}
                              </h3>
                              <p
                                className={cn(
                                  "text-sm",
                                  item.type === "education" ||
                                    item.type === "achievement"
                                    ? "text-amber-500"
                                    : "text-home-accent"
                                )}
                              >
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          <p className="text-home-muted text-sm leading-relaxed mb-4">
                            {item.description}
                          </p>

                          {item.tags.length > 0 && (
                            <div
                              className={`flex flex-wrap gap-2 ${isEven ? "md:justify-end" : ""}`}
                            >
                              {item.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`hidden md:block order-1 ${isEven ? "md:order-2" : ""} relative`}
                    >
                      <div className="timeline-node">
                        <div
                          className={`node-dot ${index === 0 ? "active" : ""}`}
                        ></div>
                        {index === 0 && <div className="node-ring"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="flex justify-center timeline-item" data-type="all">
              <div className="glass px-8 py-4 rounded-full border border-home-accent/30 shadow-lg shadow-home-accent/10">
                <span className="font-heading text-lg font-medium text-white/80 flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-home-accent"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  The Beginning
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
            Let&apos;s Write the Next
            <br />
            <span className="bg-gradient-to-r from-home-accent to-pink-500 bg-clip-text text-transparent">
              Chapter Together
            </span>
          </h2>
          <p className="text-home-muted text-lg mb-10 max-w-2xl mx-auto">
            Looking for a passionate engineer to join your team or collaborate
            on an exciting project? Let&apos;s connect and create something
            amazing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 px-6 py-3 bg-home-accent hover:bg-home-accent/90 text-white font-heading text-sm font-medium tracking-wider rounded-full transition-all hover:scale-105"
            >
              Get in Touch
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 hover:border-home-accent/50 text-white font-heading text-sm font-medium tracking-wider rounded-full transition-all hover:bg-white/5"
            >
              See Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
