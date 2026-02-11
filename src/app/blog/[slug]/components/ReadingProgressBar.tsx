"use client"

import { useEffect } from "react"

export function ReadingProgressBar(props: {
  articleId: string
  barId?: string
}) {
  const { articleId, barId = "reading-progress" } = props

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

  return null
}
