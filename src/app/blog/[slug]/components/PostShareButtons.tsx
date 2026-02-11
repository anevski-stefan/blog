"use client"

import { useEffect, useState } from "react"

export function PostShareButtons(props: {
  title: string
  articleId: string
  barId?: string
}) {
  const { title, articleId, barId = "reading-progress" } = props
  const [copyState, setCopyState] = useState<"default" | "copied">("default")

  useEffect(() => {
    const article = document.getElementById(articleId)
    const bar = document.getElementById(barId)

    if (!article || !bar) return

    const update = () => {
      const rect = article.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      const totalScrollable = rect.height - viewportHeight
      const scrolled = -rect.top

      const progress =
        totalScrollable <= 0
          ? 1
          : Math.min(1, Math.max(0, scrolled / totalScrollable))

      bar.style.transform = `scaleX(${progress})`
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [articleId, barId])

  const shareTwitter = () => {
    const text = encodeURIComponent(title)
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
    <div className="flex items-center gap-3">
      <span className="text-sm text-home-muted mr-2">Share:</span>
      <button
        onClick={shareTwitter}
        className="share-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-home-accent/50 hover:bg-home-accent/10 transition-all"
        title="Share on Twitter"
        type="button"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        onClick={shareLinkedIn}
        className="share-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-home-accent/50 hover:bg-home-accent/10 transition-all"
        title="Share on LinkedIn"
        type="button"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>
      <button
        onClick={copyLink}
        className={`copy-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-home-accent/50 hover:bg-home-accent/10 transition-all ${copyState === "copied" ? "copied" : ""}`}
        title="Copy link"
        type="button"
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
  )
}
