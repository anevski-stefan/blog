"use client"

import { useState } from "react"
import Link from "next/link"

type NavKey = "blog" | "projects" | "work" | "timeline" | "about" | "contact"

interface SiteHeaderMobileMenuItem {
  key: NavKey
  label: string
  href: string
  isActive: boolean
  isHomeHashLink: boolean
}

export function SiteHeaderMobileMenu(props: {
  items: SiteHeaderMobileMenuItem[]
}) {
  const { items } = props
  const [menuOpen, setMenuOpen] = useState(false)
  const delays = [100, 150, 200, 300, 400, 500]

  return (
    <>
      <button
        id="menu-toggle"
        className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none z-[101]"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
        type="button"
      >
        <span
          className={`w-7 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
        ></span>
        <span
          className={`w-7 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-0.5" : ""}`}
        ></span>
      </button>

      <div
        className={`fixed inset-0 bg-home-primary z-40 flex flex-col justify-center items-center gap-8 transition-opacity duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {items.map((item, index) =>
          item.href.startsWith("#") ? (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`mobile-link font-heading text-4xl md:text-6xl font-semibold transition-all duration-500 ${item.isActive ? "text-home-accent" : ""} ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{
                transitionDelay: `${delays[index] ?? 100 + index * 50}ms`,
              }}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`mobile-link font-heading text-4xl md:text-6xl font-semibold transition-all duration-500 ${item.isActive ? "text-home-accent" : ""} ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{
                transitionDelay: `${delays[index] ?? 100 + index * 50}ms`,
              }}
            >
              {item.label}
            </Link>
          )
        )}
      </div>
    </>
  )
}
