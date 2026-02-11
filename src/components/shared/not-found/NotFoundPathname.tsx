"use client"

import { usePathname } from "next/navigation"

export function NotFoundPathname(props: { className?: string }) {
  const { className } = props
  const pathname = usePathname()
  return <span className={className}>{pathname}</span>
}
