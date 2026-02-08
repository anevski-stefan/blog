"use client"

import { useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { Newsletter } from "@/components/blog/newsletter"
import { SearchX } from "lucide-react"
import type { BlogPost } from "@/types/blog"

gsap.registerPlugin(ScrollTrigger)

interface BlogClientPageProps {
  posts: BlogPost[]
}

export function BlogClientPage({ posts }: BlogClientPageProps) {
  const [currentCategory, setCurrentCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  const categories = ["all", ...Array.from(new Set(posts.map(p => p.category)))]

  const filteredPosts = posts.filter(post => {
    const matchesCategory =
      currentCategory === "all" || post.category === currentCategory
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesCategory && matchesSearch
  })

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [currentCategory, searchQuery])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".blog-header-content", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        clearProps: "all",
      })
    })

    const magneticElements = document.querySelectorAll(".magnetic")
    const cleanups: (() => void)[] = []

    magneticElements.forEach(elem => {
      const el = elem as HTMLElement
      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        gsap.to(el, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: "power2.out",
        })
      }
      const handleMouseLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)",
        })
      }

      el.addEventListener("mousemove", handleMouseMove)
      el.addEventListener("mouseleave", handleMouseLeave)

      cleanups.push(() => {
        el.removeEventListener("mousemove", handleMouseMove)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    })

    return () => {
      ctx.revert()
      cleanups.forEach(cleanup => cleanup())
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 400, behavior: "smooth" })
  }

  const handlePageChange = (page: number | "prev" | "next") => {
    if (page === "prev") {
      setCurrentPage(prev => Math.max(1, prev - 1))
    } else if (page === "next") {
      setCurrentPage(prev => Math.min(totalPages, prev + 1))
    } else {
      setCurrentPage(page as number)
    }
    scrollToTop()
  }

  const getReadTimeColor = (minutes: number) => {
    if (minutes <= 5) return "bg-green-500/20 text-green-400"
    if (minutes <= 10) return "bg-yellow-500/20 text-yellow-400"
    return "bg-orange-500/20 text-orange-400"
  }

  return (
    <div className="font-body bg-home-primary text-white overflow-x-hidden min-h-screen">
      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#5865F2 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <SiteHeader variant="solid" />

      <section className="pt-32 md:pt-44 pb-12 md:pb-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="blog-header-content flex items-center gap-4 mb-6">
            <span className="w-2 h-2 bg-home-accent rounded-full animate-pulse"></span>
            <p className="text-xs font-mono font-medium tracking-widest uppercase text-home-accent">
              Developer Blog
            </p>
          </div>
          <h1 className="blog-header-content font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter mb-6">
            Thoughts & <span className="text-home-accent">Insights</span>
          </h1>
          <p className="blog-header-content text-home-muted text-base md:text-lg max-w-2xl leading-relaxed">
            Deep dives into software engineering, system architecture, and the
            art of building scalable applications. Code snippets, tutorials, and
            lessons learned.
          </p>
        </div>
      </section>

      <section className="py-8 px-6 md:px-16 border-y border-white/5 sticky top-[72px] md:top-[88px] bg-home-primary/95 backdrop-blur-md z-30 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div className="relative w-full lg:w-96">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-home-muted"
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-home-secondary/50 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white placeholder:text-home-muted focus:outline-none focus:border-home-accent/50 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-home-muted hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setCurrentCategory(category)}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded-full transition-all duration-300 ${
                    currentCategory === category
                      ? "bg-home-accent border-home-accent text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-home-accent/30"
                  }`}
                >
                  {category === "all"
                    ? "All Posts"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-home-muted font-mono">
            Showing <span className="text-white">{filteredPosts.length}</span>{" "}
            articles
          </p>
        </div>
      </section>

      <section className="py-8 px-6 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map(post => (
                <article key={post.id} className="group relative">
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5">
                      <div className="absolute inset-0 bg-gradient-to-t from-home-primary/80 via-transparent to-transparent z-10"></div>
                      {post.featured && (
                        <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-home-accent text-white text-[10px] font-mono uppercase tracking-wider rounded-full">
                          Featured
                        </span>
                      )}
                      <span
                        className={`absolute bottom-4 right-4 z-20 px-3 py-1 ${getReadTimeColor(post.readTime)} text-[10px] font-mono rounded-full flex items-center gap-1.5`}
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {post.readTime} min read
                      </span>
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono text-home-accent uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                      <span className="text-xs text-home-muted">
                        {post.date}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg md:text-xl font-semibold mb-3 group-hover:text-home-accent transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-home-muted text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/60 uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 px-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-home-accent/20 blur-2xl rounded-full"></div>
                <SearchX
                  className="relative w-16 h-16 text-home-accent/60 mx-auto"
                  strokeWidth={1}
                />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-3 text-white">
                No articles found
              </h3>
              <p className="text-home-muted text-sm max-w-xs mx-auto leading-relaxed">
                We couldn&apos;t find any articles matching your search or
                filters. Try using different keywords or resetting the filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setCurrentCategory("all")
                }}
                className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center border border-white/10 rounded-full transition-all duration-300 ${currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:border-home-accent/50 hover:bg-home-accent/10"}`}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (totalPages > 5) {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="text-home-muted px-2">
                        ...
                      </span>
                    )
                  } else {
                    return null
                  }
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-300 font-mono text-sm ${
                      currentPage === page
                        ? "border-home-accent bg-home-accent text-white"
                        : "border-white/10 hover:border-home-accent/50 hover:bg-home-accent/10"
                    }`}
                  >
                    {page}
                  </button>
                )
              })}

              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center border border-white/10 rounded-full transition-all duration-300 ${currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:border-home-accent/50 hover:bg-home-accent/10"}`}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      <Newsletter />

      <footer className="py-8 md:py-12 px-6 md:px-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-home-muted">
          © {new Date().getFullYear()} Stefan Anevski. All rights reserved.
        </p>
        <div className="flex gap-6 md:gap-8">
          <Link
            href="#"
            className="text-sm text-home-muted hover:text-white transition-colors duration-300"
          >
            Twitter
          </Link>
          <Link
            href="#"
            className="text-sm text-home-muted hover:text-white transition-colors duration-300"
          >
            LinkedIn
          </Link>
          <Link
            href="#"
            className="text-sm text-home-muted hover:text-white transition-colors duration-300"
          >
            GitHub
          </Link>
          <Link
            href="#"
            className="text-sm text-home-muted hover:text-white transition-colors duration-300"
          >
            Dribbble
          </Link>
        </div>
      </footer>
    </div>
  )
}
