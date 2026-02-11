"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { BlogPost } from "@/types/blog"

import { SiteHeader } from "@/components/layout/SiteHeader"
import { WebGLBackground } from "@/components/home/WebGLBackground"
import { Newsletter } from "@/components/blog/newsletter"
import { TiptapRenderer } from "@/components/tiptap/Renderer"
import { Github, Twitter, Linkedin, Globe } from "lucide-react"
import { toEditorContent, calculateReadingTime } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

interface BlogPostClientViewProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export function BlogPostClientView({
  post,
  relatedPosts,
}: BlogPostClientViewProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const [copyState, setCopyState] = useState<"default" | "copied">("default")
  const articleRef = useRef<HTMLElement>(null)
  const editorContent = toEditorContent(post.content)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("#reading-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: articleRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      })

      gsap.utils.toArray(".prose h2, .prose h3").forEach(elem => {
        const el = elem as HTMLElement
        gsap.from(el, {
          opacity: 0,
          x: -20,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        })
      })

      gsap.utils.toArray(".comment-item").forEach((node, i) => {
        const el = node as HTMLElement
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        })
      })
    })

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh()
    })

    if (articleRef.current) {
      resizeObserver.observe(articleRef.current)
    }

    return () => {
      ctx.revert()
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("h2[id], h3[id]")
      let current = ""
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top
        if (sectionTop < 150) {
          current = section.getAttribute("id") || ""
        }
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const shareTwitter = () => {
    const text = encodeURIComponent(post.title)
    const url = encodeURIComponent(window.location.href)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "width=550,height=420"
    )
  }

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "width=550,height=420"
    )
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyState("copied")
      setTimeout(() => setCopyState("default"), 2000)
    })
  }

  return (
    <div className="relative z-0 font-body bg-home-primary text-white overflow-x-hidden min-h-screen">
      <WebGLBackground />
      <style jsx global>{`
        .prose {
          max-width: 65ch;
        }
        .prose p {
          margin-bottom: 1.5em;
          line-height: 1.8;
          color: #d1d5db;
        }
        .prose h2 {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 600;
          margin-top: 3rem;
          margin-bottom: 1rem;
          scroll-margin-top: 100px;
          color: #ffffff;
        }
        .prose h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          scroll-margin-top: 100px;
          color: #ffffff;
        }
        .prose a {
          color: #5865f2;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.3s;
        }
        .prose a:hover {
          color: #7983f5;
        }
        .prose strong {
          color: #ffffff;
          font-weight: 600;
        }
        .prose ul,
        .prose ol {
          margin: 1.5em 0;
          padding-left: 1.5em;
          color: #d1d5db;
        }
        .prose li {
          margin: 0.5em 0;
          line-height: 1.7;
        }
        .prose ul li::marker {
          color: #5865f2;
        }
        .prose ol li::marker {
          color: #5865f2;
          font-weight: 600;
        }
        .prose blockquote {
          border-left: 3px solid #5865f2;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #9ca3af;
        }
        .prose code:not([class*="language-"]) {
          background: rgba(88, 101, 242, 0.15);
          color: #5865f2;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.875em;
          font-family: var(--font-space-mono);
        }
        .prose pre {
          margin: 2rem 0;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #1a1a1a;
          padding: 1em;
          overflow-x: auto;
        }
        .prose pre code {
          font-size: 0.875rem;
          font-family: var(--font-space-mono);
          color: #e5e5e5;
        }
        .prose img {
          border-radius: 12px;
          margin: 2rem 0;
        }
        .prose hr {
          border-color: rgba(255, 255, 255, 0.1);
          margin: 3rem 0;
        }

        .toc-link {
          transition: all 0.3s ease;
        }
        .toc-link.active {
          color: #5865f2;
          border-left-color: #5865f2;
        }
        .toc-link:hover {
          color: #5865f2;
        }

        #reading-progress {
          transform-origin: left;
          transform: scaleX(0);
        }
        .share-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .share-btn:hover {
          transform: translateY(-2px);
        }
        .copy-btn {
          transition: all 0.3s ease;
        }
        .copy-btn:hover {
          background: rgba(88, 101, 242, 0.3);
        }
        .copy-btn.copied {
          background: rgba(34, 197, 94, 0.3);
        }

        .callout {
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin: 2rem 0;
        }
        .callout-info {
          background: rgba(88, 101, 242, 0.1);
          border: 1px solid rgba(88, 101, 242, 0.3);
        }
        .callout-warning {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .callout-tip {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        html {
          scroll-padding-top: 100px;
        }
      `}</style>

      <div
        id="reading-progress"
        className="fixed top-0 left-0 right-0 h-1 bg-home-accent z-[100]"
      ></div>

      <div
        className="fixed inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(#5865F2 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <SiteHeader variant="solid" />

      <header className="pt-32 md:pt-40 pb-12 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-home-muted mb-8">
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-home-accent">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-home-accent/20 text-home-accent text-xs font-mono uppercase tracking-wider rounded-full">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-sm text-home-muted">
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {calculateReadingTime(post.content)} min read
              </span>
            </div>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-8">
            {post.title}
          </h1>
          <p className="text-lg md:text-xl text-home-muted leading-relaxed mb-10 max-w-3xl">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-6 pb-10 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <Image
                  src={
                    post.authorImage ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                  }
                  alt={post.authorName || "Author"}
                  fill
                  className="rounded-full object-cover border-2 border-home-accent/30"
                />
              </div>
              <div>
                <p className="font-heading font-medium">
                  {post.authorName || "Stefan Anevski"}
                </p>
                <p className="text-sm text-home-muted">
                  Full Stack Software Engineer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-home-muted mr-2">Share:</span>
              <button
                onClick={shareTwitter}
                className="share-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-home-accent/50 hover:bg-home-accent/10 transition-all"
                title="Share on Twitter"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={shareLinkedIn}
                className="share-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-home-accent/50 hover:bg-home-accent/10 transition-all"
                title="Share on LinkedIn"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button
                onClick={copyLink}
                className={`copy-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-home-accent/50 hover:bg-home-accent/10 transition-all ${copyState === "copied" ? "copied" : ""}`}
                title="Copy link"
              >
                {copyState === "copied" ? (
                  <svg
                    className="w-4 h-4 text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-16 mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
            <Image
              src={post.image.replace("w=800", "w=1600")}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-home-primary/60 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <div className="lg:sticky lg:top-28">
                <div className="hidden lg:block bg-home-secondary/50 rounded-xl border border-white/5 p-6">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-home-muted mb-4 flex items-center gap-2">
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
                    On this page
                  </h4>
                  <nav id="toc" className="space-y-1">
                    <a
                      href="#introduction"
                      className={`toc-link block py-2 pl-4 text-sm border-l-2 hover:text-white ${activeSection === "introduction" ? "active text-home-accent border-home-accent" : "text-home-muted border-white/10"}`}
                    >
                      Introduction
                    </a>
                  </nav>
                </div>
              </div>
            </aside>

            <article
              ref={articleRef}
              className="lg:col-span-9 order-1 lg:order-2"
            >
              {typeof editorContent === "string" ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: editorContent || "<p>Content coming soon...</p>",
                  }}
                />
              ) : (
                <TiptapRenderer
                  content={editorContent}
                  className="prose-invert max-w-none px-0"
                />
              )}

              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-home-muted mr-2">Tags:</span>
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${tag}`}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/70 hover:border-home-accent/50 hover:bg-home-accent/10 transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 md:p-8 bg-home-secondary/50 rounded-2xl border border-white/10">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={
                        post.authorImage ||
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
                      }
                      alt={post.authorName || "Author"}
                      fill
                      className="rounded-full object-cover border-2 border-home-accent/30"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-semibold mb-1">
                      Written by {post.authorName || "Stefan Anevski"}
                    </h4>
                    <p className="text-sm text-home-muted mb-4">
                      {!post.authorName || post.authorName === "Stefan Anevski"
                        ? "Full Stack Software Engineer bridging the gap between design and development. Passionate about building premium web experiences and AI-native applications."
                        : `Contributor at ${post.authorName}'s blog. Passionate about software development and sharing knowledge with the community.`}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href="#"
                        className="p-2 bg-white/5 rounded-lg text-home-muted hover:text-home-accent hover:bg-home-accent/10 transition-all"
                      >
                        <Twitter className="w-4 h-4" />
                      </Link>
                      <Link
                        href="#"
                        className="p-2 bg-white/5 rounded-lg text-home-muted hover:text-home-accent hover:bg-home-accent/10 transition-all"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Link>
                      <Link
                        href="#"
                        className="p-2 bg-white/5 rounded-lg text-home-muted hover:text-home-accent hover:bg-home-accent/10 transition-all"
                      >
                        <Github className="w-4 h-4" />
                      </Link>
                      <Link
                        href="#"
                        className="p-2 bg-white/5 rounded-lg text-home-muted hover:text-home-accent hover:bg-home-accent/10 transition-all"
                      >
                        <Globe className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="#"
                  className="group p-6 bg-home-secondary/30 rounded-xl border border-white/5 hover:border-home-accent/30 transition-all"
                >
                  <span className="text-xs text-home-muted uppercase tracking-wider flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Previous Post
                  </span>
                  <span className="font-heading font-medium group-hover:text-home-accent transition-colors line-clamp-2">
                    Previous Post Title
                  </span>
                </Link>
                <Link
                  href="#"
                  className="group p-6 bg-home-secondary/30 rounded-xl border border-white/5 hover:border-home-accent/30 transition-all text-right"
                >
                  <span className="text-xs text-home-muted uppercase tracking-wider flex items-center gap-2 justify-end mb-2">
                    Next Post
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="font-heading font-medium group-hover:text-home-accent transition-colors line-clamp-2">
                    Next Post Title
                  </span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>

      <section className="py-20 px-6 md:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs font-mono text-home-accent uppercase tracking-widest mb-2">
                Continue Reading
              </p>
              <h3 className="font-heading text-2xl md:text-3xl font-semibold">
                Related Articles
              </h3>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 text-sm text-home-muted hover:text-home-accent transition-colors"
            >
              View all posts
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(post => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5">
                    <div className="absolute inset-0 bg-gradient-to-t from-home-primary/80 via-transparent to-transparent z-10"></div>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-home-accent uppercase">
                      {post.category}
                    </span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span className="text-xs text-home-muted">
                      {post.readTime} min read
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-semibold group-hover:text-home-accent transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                </Link>
              </article>
            ))}
          </div>
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
