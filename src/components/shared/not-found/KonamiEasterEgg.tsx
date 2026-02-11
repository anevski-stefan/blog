"use client"

import { useEffect, useState } from "react"

export function KonamiEasterEgg() {
  const [easterEggActive, setEasterEggActive] = useState(false)

  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ]
    let konamiIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          setEasterEggActive(true)
          konamiIndex = 0
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div
      id="easter-egg"
      className={`fixed inset-0 z-[100] bg-home-primary flex items-center justify-center transition-opacity duration-500 ${easterEggActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div className="text-center">
        <div className="text-8xl mb-6 animate-bounce">🎮</div>
        <h3 className="font-heading text-2xl font-semibold mb-2">
          Konami Code Activated!
        </h3>
        <p className="text-home-muted mb-6">
          You found the secret! Here&apos;s a virtual high-five 🙌
        </p>
        <button
          onClick={() => setEasterEggActive(false)}
          className="px-6 py-3 bg-home-accent text-white rounded-full text-sm font-medium hover:bg-home-accent/90 transition-colors"
          type="button"
        >
          Cool, take me back
        </button>
      </div>
    </div>
  )
}
