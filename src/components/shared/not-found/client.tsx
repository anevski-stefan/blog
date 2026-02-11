"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { gsap } from "gsap"

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

export function NotFoundIntroFx(props: { rootId?: string }) {
  const { rootId = "not-found-root" } = props

  useEffect(() => {
    const rootEl = document.getElementById(rootId)
    if (!rootEl) return

    const ctx = gsap.context(() => {
      gsap.from("h1", {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.2,
      })
      gsap.from("h2, .not-found-desc", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5,
      })
      gsap.from(".terminal-window", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.8,
      })
      gsap.from(".action-buttons button, .action-buttons a", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        delay: 1,
      })
      gsap.from(".float", {
        opacity: 0,
        scale: 0,
        stagger: 0.2,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.3,
      })
    }, rootEl)

    return () => ctx.revert()
  }, [rootId])

  return null
}

export function NotFoundPathname(props: { className?: string }) {
  const { className } = props
  const pathname = usePathname()
  return <span className={className}>{pathname}</span>
}

export function NotFoundThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let cleanupThreeInner = () => {}

    void (async () => {
      const THREE = await import("three")
      if (cancelled) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 50

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const brokenGeo = new THREE.IcosahedronGeometry(20, 1)
      const brokenMat = new THREE.MeshBasicMaterial({
        color: 0x5865f2,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      })
      const brokenMesh = new THREE.Mesh(brokenGeo, brokenMat)
      scene.add(brokenMesh)

      const particlesGeometry = new THREE.BufferGeometry()
      const particleCount = 300
      const posArray = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100
      }
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArray, 3)
      )
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        color: 0x5865f2,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      })
      const particles = new THREE.Points(particlesGeometry, particlesMaterial)
      scene.add(particles)

      let targetX = 0,
        targetY = 0
      let currentX = 0,
        currentY = 0
      const handleMouseMove = (e: MouseEvent) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2
        targetY = (e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener("mousemove", handleMouseMove)

      let animationId = 0
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        currentX += (targetX - currentX) * 0.02
        currentY += (targetY - currentY) * 0.02

        brokenMesh.rotation.x += 0.001
        brokenMesh.rotation.y += 0.002
        brokenMesh.rotation.x += currentY * 0.01
        brokenMesh.rotation.y += currentX * 0.01

        particles.rotation.y = currentX * 0.2
        particles.rotation.x = currentY * 0.2
        particles.rotation.z += 0.0003
        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      cleanupThreeInner = () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("resize", handleResize)
        cancelAnimationFrame(animationId)
        brokenGeo.dispose()
        brokenMat.dispose()
        particlesGeometry.dispose()
        particlesMaterial.dispose()
        renderer.dispose()
      }
    })()

    return () => {
      cancelled = true
      cleanupThreeInner()
    }
  }, [])

  return <canvas ref={canvasRef} id="webgl" className="fixed inset-0 -z-10" />
}

interface ScrambleItem {
  from: string
  to: string
  start: number
  end: number
  char: string
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: ScrambleItem[]
  frame: number
  frameRequest: number
  resolve: (value?: unknown) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = "!<>-_\\/[]{}—=+*^?#________"
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise(resolve => (this.resolve = resolve))
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ""
      const to = newText[i] || ""
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end, char: "" })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ""
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i]
      let { char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="text-home-accent font-bold">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      if (this.resolve) this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }

  destroy() {
    cancelAnimationFrame(this.frameRequest)
  }
}

export function ScrambleText(props: {
  className?: string
  phrases?: string[]
  initialText?: string
}) {
  const {
    className,
    initialText = "Page Not Found",
    phrases = [
      "Page Not Found",
      "Lost in Space",
      "Wrong Dimension",
      "Null Reference",
      "Path undefined",
      "Page Not Found",
    ],
  } = props

  const elRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const fx = new TextScramble(el)
    let counter = 0
    let timeoutId: number | undefined
    let cancelled = false

    const next = () => {
      if (cancelled) return
      void fx.setText(phrases[counter]).then(() => {
        if (cancelled) return
        timeoutId = window.setTimeout(next, 3000)
      })
      counter = (counter + 1) % phrases.length
    }

    timeoutId = window.setTimeout(next, 2000)

    return () => {
      cancelled = true
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      fx.destroy()
    }
  }, [phrases])

  return (
    <span ref={elRef} className={className}>
      {initialText}
    </span>
  )
}
