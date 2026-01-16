"use client"

import { useState } from "react"
import Link from "next/link"

export function BlogNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-6 md:py-8 flex justify-between items-center bg-home-primary/80 backdrop-blur-md border-b border-white/5">
        <Link
          href="/"
          className="font-heading text-lg md:text-xl font-semibold tracking-tight"
        >
          Stefan Anevski
        </Link>
        <div className="hidden md:flex gap-8 lg:gap-12">
          <Link
            href="/"
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group text-home-muted hover:text-white transition-colors"
          >
            Work
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </Link>
          <Link
            href="/#about"
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group text-home-muted hover:text-white transition-colors"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </Link>
          <Link
            href="/blog"
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group text-white"
          >
            Blog
            <span className="absolute bottom-0 left-0 w-full h-px bg-home-accent"></span>
          </Link>
          <Link
            href="/#contact"
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group text-home-muted hover:text-white transition-colors"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </Link>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none z-[101]"
          aria-label="Toggle menu"
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
          href="/"
          onClick={() => setMenuOpen(false)}
          className={`mobile-link font-heading text-4xl font-semibold transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "100ms" }}
        >
          Work
        </Link>
        <Link
          href="/#about"
          onClick={() => setMenuOpen(false)}
          className={`mobile-link font-heading text-4xl font-semibold transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "200ms" }}
        >
          About
        </Link>
        <Link
          href="/blog"
          onClick={() => setMenuOpen(false)}
          className={`mobile-link font-heading text-4xl font-semibold transition-all duration-500 text-home-accent ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "300ms" }}
        >
          Blog
        </Link>
        <Link
          href="/#contact"
          onClick={() => setMenuOpen(false)}
          className={`mobile-link font-heading text-4xl font-semibold transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "400ms" }}
        >
          Contact
        </Link>
      </div>
    </>
  )
}
