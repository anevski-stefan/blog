import Link from "next/link"
import Image from "next/image"

import type { BlogPost } from "@/features/blog/types/blog"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { WebGLBackground } from "@/components/shared/backgrounds/WebGLBackground"
import { DotGridBackground } from "@/components/shared/DotGridBackground"
import { Newsletter } from "@/features/blog/components/Newsletter"
import { TiptapRenderer } from "@/components/tiptap/Renderer"
import { toEditorContent, calculateReadingTime } from "@/lib/utils"
import { Twitter, Linkedin, Github, Globe } from "lucide-react"
import { ReadingProgressBar } from "./components/ReadingProgressBar"
import { PostShareButtons } from "./components/PostShareButtons"

export function BlogPostView(props: {
  post: BlogPost
  relatedPosts: BlogPost[]
}) {
  const { post, relatedPosts } = props
  const editorContent = toEditorContent(post.content)

  return (
    <div className="relative z-0 font-body bg-home-primary text-white overflow-x-hidden min-h-screen">
      <WebGLBackground />
      <ReadingProgressBar articleId="post-article" />

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
      />

      <DotGridBackground className="opacity-[0.02]" />

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

            <PostShareButtons title={post.title} />
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
            <div className="absolute inset-0 bg-gradient-to-t from-home-primary/60 via-transparent to-transparent" />
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
                      className="toc-link block py-2 pl-4 text-sm border-l-2 hover:text-white text-home-muted border-white/10"
                    >
                      Introduction
                    </a>
                  </nav>
                </div>
              </div>
            </aside>

            <article
              id="post-article"
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
            {relatedPosts.map(relatedPost => (
              <article key={relatedPost.id} className="group">
                <Link href={`/blog/${relatedPost.slug}`}>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5">
                    <div className="absolute inset-0 bg-gradient-to-t from-home-primary/80 via-transparent to-transparent z-10" />
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-home-accent uppercase">
                      {relatedPost.category}
                    </span>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <span className="text-xs text-home-muted">
                      {relatedPost.readTime} min read
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-semibold group-hover:text-home-accent transition-colors line-clamp-2">
                    {relatedPost.title}
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
