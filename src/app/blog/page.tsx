import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getAllPosts, mapPostToUi } from "@/features/blog/lib/posts"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { LazyWebGLBackground } from "@/components/shared/backgrounds/LazyWebGLBackground"
import { DotGridBackground } from "@/components/shared/DotGridBackground"
import { Newsletter } from "@/features/blog/components/Newsletter"
import { SearchX } from "lucide-react"
import { Pagination } from "@/components/shared/pagination"

export const metadata: Metadata = {
  title: "Blog | Thoughts & Insights",
  description:
    "Deep dives into software engineering, system architecture, and building scalable applications.",
}

export const revalidate = 60

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
    q?: string
    category?: string
  }>
}

function getReadTimeColor(minutes: number) {
  if (minutes <= 5) return "bg-green-500/20 text-green-400"
  if (minutes <= 10) return "bg-yellow-500/20 text-yellow-400"
  return "bg-orange-500/20 text-orange-400"
}

function buildSearchParamsHref(
  searchParams: Record<string, string | string[] | undefined>,
  updates: Record<string, string | undefined>
) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      const last = value[value.length - 1]
      if (last !== undefined) params.set(key, last)
    } else {
      params.set(key, value)
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  }

  params.delete("page")

  const query = params.toString()
  return query ? `/blog?${query}` : "/blog"
}

export default async function BlogPage(props: BlogPageProps) {
  const searchParams = await props.searchParams
  const q = (searchParams.q ?? "").trim()
  const categoryParam = (searchParams.category ?? "all").trim() || "all"
  const currentPageRaw = Number(searchParams.page)
  const currentPage = Number.isFinite(currentPageRaw) ? currentPageRaw : 1

  const posts = await getAllPosts()
  const uiPosts = posts.map(mapPostToUi)

  const categories = [
    "all",
    ...Array.from(new Set(uiPosts.map(p => p.category))),
  ]

  const filteredPosts = uiPosts.filter(post => {
    const matchesCategory =
      categoryParam === "all" || post.category === categoryParam

    const matchesSearch =
      q === "" ||
      post.title.toLowerCase().includes(q.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(q.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  const postsPerPage = 6
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safePage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  )

  const hasActiveFilters = q !== "" || categoryParam !== "all"
  const clearHref = "/blog"

  return (
    <div className="relative z-0 font-body bg-home-primary text-white overflow-x-hidden min-h-screen">
      <LazyWebGLBackground />
      <DotGridBackground />

      <SiteHeader variant="solid" activeKey="blog" />

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
            <form
              className="relative w-full lg:w-96"
              action="/blog"
              method="GET"
            >
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
                name="q"
                placeholder="Search articles..."
                defaultValue={q}
                className="w-full bg-home-secondary/50 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white placeholder:text-home-muted focus:outline-none focus:border-home-accent/50 transition-all duration-300"
              />
              {categoryParam !== "all" && (
                <input type="hidden" name="category" value={categoryParam} />
              )}
            </form>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const href = buildSearchParamsHref(searchParams, {
                  category: category === "all" ? undefined : category,
                })

                return (
                  <Link
                    key={category}
                    href={href}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded-full transition-all duration-300 ${
                      categoryParam === category
                        ? "bg-home-accent border-home-accent text-white"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-home-accent/30"
                    }`}
                  >
                    {category === "all"
                      ? "All Posts"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </Link>
                )
              })}
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
            <>
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
                          className={`absolute bottom-4 right-4 z-20 px-3 py-1 ${getReadTimeColor(
                            post.readTime
                          )} text-[10px] font-mono rounded-full flex items-center gap-1.5`}
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
                        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                        <span className="text-xs text-home-muted font-mono">
                          {post.date}
                        </span>
                      </div>

                      <h2 className="font-heading text-xl md:text-2xl font-semibold tracking-tight mb-3 group-hover:text-home-accent transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-home-muted text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/60"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 text-[10px] font-mono text-white/40">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={safePage}
                  basePath="/blog"
                  searchParams={searchParams}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border border-white/10 bg-white/5">
              <SearchX className="w-10 h-10 text-home-muted mb-4" />
              <h2 className="font-heading text-2xl font-semibold mb-2">
                No results
              </h2>
              <p className="text-home-muted max-w-md">
                We couldn&apos;t find any articles matching your search or
                filters.
              </p>

              {hasActiveFilters && (
                <Link
                  href={clearHref}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-home-accent hover:bg-home-accent/90 text-white font-heading text-sm font-medium tracking-wider rounded-full transition-all hover:scale-105"
                >
                  Clear filters
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <Newsletter />
    </div>
  )
}
