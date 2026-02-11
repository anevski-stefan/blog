"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function AboutRevealFx() {
  useEffect(() => {
    const rootEl = document.getElementById("about-root")
    if (!rootEl) return

    const ctx = gsap.context(() => {
      gsap.from(".reveal-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      })

      gsap.from(".skill-card", {
        scale: 0.8,
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: "#skills-grid",
          start: "top 80%",
        },
      })
    }, rootEl)

    return () => ctx.revert()
  }, [])

  return null
}
