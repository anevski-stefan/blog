"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollToPlugin)

interface SiteHeaderProps {
  variant?: "transparent" | "solid"
}

export function SiteHeader({ variant = "transparent" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === "/"

  const handleNavigation = (e: React.MouseEvent, hash: string) => {
    e.preventDefault()
    setMenuOpen(false)

    if (isHome) {
      const target = document.querySelector(hash)
      if (target) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: target, offsetY: 50 },
          ease: "power4.inOut",
        })
      }
    } else {
      router.push(`/${hash}`)
    }
  }

  const navClasses =
    variant === "solid"
      ? "fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-6 md:py-8 flex justify-between items-center bg-home-primary/80 backdrop-blur-md border-b border-white/5"
      : "fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-6 md:py-8 flex justify-between items-center text-white"

  return (
    <>
      <nav className={navClasses}>
        <Link
          href="/"
          className="font-heading text-lg md:text-xl font-semibold tracking-tight"
        >
          Stefan Anevski
        </Link>
        <div className="hidden md:flex gap-8 lg:gap-12">
          <Link
            href="/blog"
            className={`nav-link text-sm font-normal tracking-widest uppercase relative py-2 group transition-colors ${pathname.startsWith("/blog") ? "text-white" : "text-home-muted hover:text-white"}`}
          >
            Blog
            <span
              className={`absolute bottom-0 left-0 h-px transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${pathname.startsWith("/blog") ? "w-full bg-home-accent" : "w-0 bg-white group-hover:w-full"}`}
            ></span>
          </Link>

          <Link
            href="/projects"
            className={`nav-link text-sm font-normal tracking-widest uppercase relative py-2 group transition-colors ${pathname.startsWith("/projects") ? "text-white" : "text-home-muted hover:text-white"}`}
          >
            Projects
            <span
              className={`absolute bottom-0 left-0 h-px transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${pathname.startsWith("/projects") ? "w-full bg-home-accent" : "w-0 bg-white group-hover:w-full"}`}
            ></span>
          </Link>

          <Link
            href="/#work"
            onClick={e => handleNavigation(e, "#work")}
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group cursor-pointer text-home-muted hover:text-white transition-colors"
          >
            Work
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </Link>

          <Link
            href="/timeline"
            className={`nav-link text-sm font-normal tracking-widest uppercase relative py-2 group transition-colors ${pathname === "/timeline" ? "text-white" : "text-home-muted hover:text-white"}`}
          >
            Timeline
            <span
              className={`absolute bottom-0 left-0 h-px transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${pathname === "/timeline" ? "w-full bg-home-accent" : "w-0 bg-white group-hover:w-full"}`}
            ></span>
          </Link>

          <Link
            href="/about"
            className={`nav-link text-sm font-normal tracking-widest uppercase relative py-2 group transition-colors ${pathname === "/about" ? "text-white" : "text-home-muted hover:text-white"}`}
          >
            About
            <span
              className={`absolute bottom-0 left-0 h-px transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${pathname === "/about" ? "w-full bg-home-accent" : "w-0 bg-white group-hover:w-full"}`}
            ></span>
          </Link>

          <Link
            href="/#contact"
            onClick={e => handleNavigation(e, "#contact")}
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group cursor-pointer text-home-muted hover:text-white transition-colors"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </Link>
        </div>
        <button
          id="menu-toggle"
          className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none z-[101]"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`w-7 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          ></span>
          <span
            className={`w-7 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-0.5" : ""}`}
          ></span>
        </button>
      </nav>

      <div
        className={`fixed inset-0 bg-home-primary z-40 flex flex-col justify-center items-center gap-8 transition-opacity duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <Link
          href="/blog"
          onClick={() => setMenuOpen(false)}
          className={`mobile-link font-heading text-4xl md:text-6xl font-semibold transition-all duration-500 ${pathname.startsWith("/blog") ? "text-home-accent" : ""} ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "100ms" }}
        >
          Blog
        </Link>
        <Link
          href="/projects"
          onClick={() => setMenuOpen(false)}
          className={`mobile-link font-heading text-4xl md:text-6xl font-semibold transition-all duration-500 ${pathname.startsWith("/projects") ? "text-home-accent" : ""} ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "150ms" }}
        >
          Projects
        </Link>

        <Link
          href="/#work"
          onClick={e => handleNavigation(e, "#work")}
          className={`mobile-link font-heading text-4xl md:text-6xl font-semibold transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "200ms" }}
        >
          Work
        </Link>

        <Link
          href="/timeline"
          onClick={() => setMenuOpen(false)}
          className={`mobile-link font-heading text-4xl md:text-6xl font-semibold transition-all duration-500 ${pathname === "/timeline" ? "text-home-accent" : ""} ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "300ms" }}
        >
          Timeline
        </Link>

        <Link
          href="/about"
          onClick={() => setMenuOpen(false)}
          className={`mobile-link font-heading text-4xl md:text-6xl font-semibold transition-all duration-500 ${pathname === "/about" ? "text-home-accent" : ""} ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "400ms" }}
        >
          About
        </Link>

        <Link
          href="/#contact"
          onClick={e => handleNavigation(e, "#contact")}
          className={`mobile-link font-heading text-4xl md:text-6xl font-semibold transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "500ms" }}
        >
          Contact
        </Link>
      </div>
    </>
  )
}
