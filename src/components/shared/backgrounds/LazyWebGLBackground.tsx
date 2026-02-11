"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

type LazyMode = "immediate" | "idle"

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number
  cancelIdleCallback?: (handle: number) => void
}

const WebGLBackground = dynamic(
  () =>
    import("@/components/shared/backgrounds/WebGLBackground").then(
      m => m.WebGLBackground
    ),
  { ssr: false }
)

export function LazyWebGLBackground(props: { mode?: LazyMode }) {
  const { mode = "idle" } = props
  const [mounted, setMounted] = useState(mode === "immediate")

  useEffect(() => {
    if (mounted) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) return

    let cancelled = false
    const mount = () => {
      if (cancelled) return
      setMounted(true)
    }

    const onInteract = () => mount()
    window.addEventListener("pointerdown", onInteract, { once: true })
    window.addEventListener("keydown", onInteract, { once: true })
    window.addEventListener("scroll", onInteract, { once: true, passive: true })

    const w = window as IdleWindow
    const idleId =
      w.requestIdleCallback?.(mount, { timeout: 1200 }) ??
      window.setTimeout(mount, 600)

    return () => {
      cancelled = true
      window.removeEventListener("pointerdown", onInteract)
      window.removeEventListener("keydown", onInteract)
      window.removeEventListener("scroll", onInteract)
      if (w.cancelIdleCallback) {
        w.cancelIdleCallback(idleId)
      } else {
        window.clearTimeout(idleId)
      }
    }
  }, [mounted])

  if (!mounted) return null
  return <WebGLBackground />
}
