"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"

export function GoBackButton(props: {
  className: string
  children: ReactNode
}) {
  const { className, children } = props
  const router = useRouter()

  return (
    <button onClick={() => router.back()} className={className} type="button">
      {children}
    </button>
  )
}
