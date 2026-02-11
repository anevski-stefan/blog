"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function HomeAnimations(props: { rootId?: string }) {
  const { rootId = "home-root" } = props

  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const loader = root.querySelector<HTMLElement>("#loader")
    if (reduceMotion) {
      if (loader) loader.style.display = "none"

      root
        .querySelectorAll<HTMLElement>(".hero-line.translate-y-full")
        .forEach(el => el.classList.remove("translate-y-full"))

      root
        .querySelectorAll<HTMLElement>(".hero-eyebrow")
        .forEach(el => el.classList.remove("opacity-0", "-translate-x-10"))

      root
        .querySelectorAll<HTMLElement>(".hero-desc, .hero-cta")
        .forEach(el => el.classList.remove("opacity-0", "translate-y-10"))

      root
        .querySelectorAll<HTMLElement>(".hero-scroll")
        .forEach(el => el.classList.remove("opacity-0"))

      root.querySelectorAll<HTMLElement>(".stat-number").forEach(el => {
        const target = el.dataset.count
        if (target) el.textContent = target
      })

      return
    }

    if (!loader) return

    gsap.registerPlugin(ScrollTrigger)

    const magnetics = root.querySelectorAll<HTMLElement>(".magnetic")
    const removeMagneticListeners: Array<() => void> = []

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)

      const loaderText = q(".loader-text span")
      const loadingTl = gsap.timeline()

      loadingTl
        .to(loaderText, {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: "power3.out",
        })
        .to(loaderText, {
          y: -20,
          opacity: 0,
          stagger: 0.03,
          duration: 0.3,
          delay: 0.5,
        })
        .to(loader, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
        })
        .call(() => {
          if (loader) loader.style.display = "none"
          animateHero()
        })

      function animateHero() {
        const heroTl = gsap.timeline()
        heroTl
          .to(q(".hero-line"), {
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
          })
          .to(
            q(".hero-eyebrow"),
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.8"
          )
          .to(
            q(".hero-desc"),
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6"
          )
          .to(
            q(".hero-cta"),
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6"
          )
          .to(
            q(".hero-scroll"),
            {
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            },
            "-=0.4"
          )
      }

      const reveals = q(".reveal") as HTMLElement[]
      reveals.forEach(el => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      })

      const stats = q(".stat-number") as HTMLElement[]
      stats.forEach(stat => {
        const target = Number.parseInt(stat.dataset.count ?? "0", 10)
        gsap.to(stat, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: stat,
            start: "top 80%",
          },
        })
      })

      magnetics.forEach(el => {
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
        removeMagneticListeners.push(() => {
          el.removeEventListener("mousemove", handleMouseMove)
          el.removeEventListener("mouseleave", handleMouseLeave)
        })
      })
    }, root)

    return () => {
      removeMagneticListeners.forEach(cleanup => cleanup())
      ctx.revert()
    }
  }, [rootId])

  return null
}
