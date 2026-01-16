"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current

    if (!cursor || !cursorDot) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      cursorDot.style.left = mouseX + "px"
      cursorDot.style.top = mouseY + "px"
    }

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1
      cursorY += (mouseY - cursorY) * 0.1

      cursor.style.left = cursorX + "px"
      cursor.style.top = cursorY + "px"

      requestAnimationFrame(animateCursor)
    }

    window.addEventListener("mousemove", onMouseMove)
    const animationId = requestAnimationFrame(animateCursor)

    const handleMouseEnter = () => {
      cursor.classList.add(
        "scale-[3]",
        "border-home-accent",
        "bg-home-accent/10"
      )
      cursor.classList.remove("border-white/50")
    }
    const handleMouseLeave = () => {
      cursor.classList.remove(
        "scale-[3]",
        "border-home-accent",
        "bg-home-accent/10"
      )
      cursor.classList.add("border-white/50")
    }

    const handleElementEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches("a, button, .magnetic, .magnetic *")) {
        handleMouseEnter()
      }
    }
    const handleElementLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches("a, button, .magnetic, .magnetic *")) {
        handleMouseLeave()
      }
    }

    document.addEventListener("mouseover", handleElementEnter)
    document.addEventListener("mouseout", handleElementLeave)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseover", handleElementEnter)
      document.removeEventListener("mouseout", handleElementLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        id="cursor"
        className="fixed w-5 h-5 border border-white/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
      ></div>
      <div
        ref={cursorDotRef}
        id="cursor-dot"
        className="fixed w-1.5 h-1.5 bg-home-accent rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      ></div>
    </>
  )
}
