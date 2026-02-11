"use client"

import { useEffect } from "react"
import { gsap } from "gsap"

export function NotFoundIntroFx(props: { rootId?: string }) {
  const { rootId = "not-found-root" } = props

  useEffect(() => {
    const rootEl = document.getElementById(rootId)
    if (!rootEl) return

    const ctx = gsap.context(() => {
      gsap.from("h1", {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.2,
      })
      gsap.from("h2, .not-found-desc", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5,
      })
      gsap.from(".terminal-window", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.8,
      })
      gsap.from(".action-buttons button, .action-buttons a", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        delay: 1,
      })
      gsap.from(".float", {
        opacity: 0,
        scale: 0,
        stagger: 0.2,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.3,
      })
    }, rootEl)

    return () => ctx.revert()
  }, [rootId])

  return null
}
