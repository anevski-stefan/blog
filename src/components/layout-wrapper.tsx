"use client"

import { usePathname } from "next/navigation"
import { MainNav } from "@/components/nav"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  return (
    <>
      {!isAdmin && <MainNav />}
      <main className={!isAdmin ? "container min-h-screen py-10" : ""}>
        {children}
      </main>
    </>
  )
} 