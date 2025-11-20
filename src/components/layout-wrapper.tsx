"use client"

import { usePathname } from "next/navigation"
import { MainNav } from "@/components/nav"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  const isHome = pathname === "/"

  return (
    <>
      {!isAdmin && <MainNav />}
      <main className={!isAdmin && !isHome ? "min-h-screen py-10" : ""}>
        {children}
      </main>
    </>
  )
}
