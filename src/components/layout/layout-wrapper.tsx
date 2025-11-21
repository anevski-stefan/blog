"use client"

import { usePathname } from "next/navigation"
import { MainNav } from "@/components/layout/main-nav"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  const isHome = pathname === "/"
  const showMainPadding = !isAdmin && !isHome

  return (
    <>
      {!isAdmin && <MainNav />}
      <main className={showMainPadding ? "min-h-screen py-10" : ""}>
        {children}
      </main>
    </>
  )
}
