"use client"

import { usePathname } from "next/navigation"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAbout = pathname === "/about"
  const showMainPadding = isAbout

  return (
    <main className={showMainPadding ? "min-h-screen py-10" : ""}>
      {children}
    </main>
  )
}
