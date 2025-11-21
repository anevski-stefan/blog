"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ROUTES = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const

export function MainNav() {
  const pathname = usePathname()

  const routes = NAV_ROUTES.map(route => ({
    ...route,
    active: pathname === route.href,
  }))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">My Blog</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {routes.map(route => (
              <Link
                key={route.href}
                href={route.href}
                className={`transition-colors hover:text-secondary ${
                  route.active ? "text-secondary" : "text-foreground/70"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
