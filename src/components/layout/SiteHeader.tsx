import Link from "next/link"
import { SiteHeaderMobileMenu } from "@/components/layout/SiteHeaderMobileMenu"

interface SiteHeaderProps {
  variant?: "transparent" | "solid"
  activeKey?: "blog" | "projects" | "timeline" | "about"
  isHome?: boolean
}

export function SiteHeader({
  variant = "transparent",
  activeKey,
  isHome = false,
}: SiteHeaderProps) {
  const items = [
    {
      key: "blog",
      label: "Blog",
      href: "/blog",
    },
    {
      key: "projects",
      label: "Projects",
      href: "/projects",
    },
    {
      key: "timeline",
      label: "Timeline",
      href: "/timeline",
    },
    {
      key: "about",
      label: "About",
      href: "/about",
    },
  ] as const

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
          {items.map(item => {
            const isHashLink = item.href.startsWith("#")
            const isActive = item.key === activeKey

            const className = `nav-link text-sm font-normal tracking-widest uppercase relative py-2 group transition-colors ${
              isActive
                ? "text-white"
                : "text-home-muted hover:text-white cursor-pointer"
            }`

            const underlineClassName = `absolute bottom-0 left-0 h-px transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isActive
                ? "w-full bg-home-accent"
                : "w-0 bg-white group-hover:w-full"
            }`

            if (isHome && isHashLink) {
              return (
                <a key={item.key} href={item.href} className={className}>
                  {item.label}
                  <span className={underlineClassName}></span>
                </a>
              )
            }

            return (
              <Link key={item.key} href={item.href} className={className}>
                {item.label}
                <span className={underlineClassName}></span>
              </Link>
            )
          })}
        </div>
        <SiteHeaderMobileMenu
          items={items.map(item => ({
            key: item.key,
            label: item.label,
            href: item.href,
            isActive: item.key === activeKey,
            isHomeHashLink: item.href.startsWith("#"),
          }))}
        />
      </nav>
    </>
  )
}
