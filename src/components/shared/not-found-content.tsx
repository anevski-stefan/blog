"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import * as THREE from "three"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

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
}

export function NotFoundContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrambleRef = useRef<HTMLHeadingElement>(null)
  const [easterEggActive, setEasterEggActive] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (scrambleRef.current) {
      const el = scrambleRef.current
      const fx = new TextScramble(el)
      const phrases = [
        "Page Not Found",
        "Lost in Space",
        "Wrong Dimension",
        "Null Reference",
        "Path undefined",
        "Page Not Found",
      ]
      let counter = 0
      const next = () => {
        fx.setText(phrases[counter]).then(() => {
          setTimeout(next, 3000)
        })
        counter = (counter + 1) % phrases.length
      }
      setTimeout(next, 2000)
    }

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

    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
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

    let animationId: number
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
    })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      ctx.revert()
      brokenGeo.dispose()
      brokenMat.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative font-body bg-home-primary text-white min-h-screen overflow-hidden scanlines">
      <div className="noise"></div>
      <div className="broken-grid"></div>

      <canvas
        ref={canvasRef}
        id="webgl"
        className="fixed inset-0 -z-10"
      ></canvas>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="orbit">
            <div className="w-3 h-3 bg-home-accent/30 rounded-full blur-sm"></div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="orbit-reverse">
            <div className="w-2 h-2 bg-pink-500/30 rounded-full blur-sm"></div>
          </div>
        </div>

        <div className="absolute top-20 left-[10%] float">
          <svg
            className="w-16 h-16 text-home-accent/10"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="absolute bottom-32 right-[15%] float float-delay-2">
          <svg
            className="w-12 h-12 text-pink-500/10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-[10%] float float-delay-1">
          <div className="w-20 h-20 border border-home-accent/10 rotate-45"></div>
        </div>
        <div className="absolute bottom-1/4 left-[20%] float float-delay-3">
          <div className="w-16 h-16 border border-cyan-500/10 rounded-full"></div>
        </div>
        <div className="absolute top-1/4 left-1/3 float float-delay-4">
          <svg
            className="w-8 h-8 text-home-accent/20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="12,2 22,22 2,22" />
          </svg>
        </div>

        <div className="absolute top-16 right-[20%] font-mono text-xs text-home-accent/20 rotate-12">
          &lt;/page&gt;
        </div>
        <div className="absolute bottom-24 left-[25%] font-mono text-xs text-pink-500/20 -rotate-6">
          ERROR_404
        </div>
        <div className="absolute top-1/2 right-[5%] font-mono text-[10px] text-white/10 rotate-90">
          undefined
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 border border-home-accent/20 rounded-full pulse-ring"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-96 h-96 border border-home-accent/10 rounded-full pulse-ring"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-6 md:py-8 flex justify-between items-center">
        <Link
          href="/"
          className="font-heading text-lg md:text-xl font-semibold tracking-tight hover:text-home-accent transition-colors"
        >
          Stefan Anevski
        </Link>
        <div className="hidden md:flex gap-8 lg:gap-12">
          <Link
            href="/"
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group text-home-muted hover:text-white transition-colors"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-px bg-home-accent transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </Link>
          <Link
            href="/blog"
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group text-home-muted hover:text-white transition-colors"
          >
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-px bg-home-accent transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </Link>
          <Link
            href="/#work"
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group text-home-muted hover:text-white transition-colors"
          >
            Work
            <span className="absolute bottom-0 left-0 w-0 h-px bg-home-accent transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-4">
            <span className="inline-block font-mono text-xs tracking-[0.3em] uppercase text-home-accent/60 mb-2 ascii-border">
              Error
            </span>
            <h1
              className="glitch font-heading text-[100px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-bold leading-none tracking-tighter text-white/90"
              data-text="404"
            >
              404
            </h1>
          </div>

          <div className="mb-6">
            <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
              <span className="scramble-text" ref={scrambleRef}>
                Page Not Found
              </span>
            </h2>
            <p className="not-found-desc text-home-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
              The page you&apos;re looking for has been moved, deleted, or you
              may not have the necessary permissions to view it.
            </p>
          </div>

          <div className="terminal-window mb-6 bg-home-secondary/50 border border-white/10 rounded-xl p-4 text-left max-w-lg mx-auto backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              <span className="ml-3 text-xs text-home-muted font-mono">
                terminal
              </span>
            </div>
            <div className="font-mono text-sm space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-home-accent">$</span>
                <span className="text-white/80">fetch</span>
                <span className="text-home-muted">{pathname}</span>
              </p>
              <p className="text-red-400">→ Error: ENOENT - Page not found</p>
              <p className="text-home-muted">→ Status: 404</p>
              <p className="flex items-center gap-2">
                <span className="text-home-accent">$</span>
                <span className="text-white/60 typewriter inline-block border-r-2 border-home-accent overflow-hidden whitespace-nowrap animate-[typing_3s_steps(40,end),blink-caret_0.75s_step-end_infinite]">
                  Searching for alternatives...
                </span>
              </p>
            </div>
          </div>

          <div className="action-buttons flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/"
              className="magnetic-btn group flex items-center gap-3 px-6 py-3 bg-home-accent hover:bg-home-accent/90 text-white font-heading text-xs font-medium tracking-wider uppercase rounded-full transition-all duration-300 hover:scale-105"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Go Home
            </Link>
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-home-accent/50 text-white font-heading text-xs font-medium tracking-wider uppercase rounded-full transition-all duration-300"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              Go Back
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <span className="text-home-muted">Try these:</span>
            <Link
              href="/"
              className="link-effect text-white/80 hover:text-home-accent transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="link-effect text-white/80 hover:text-home-accent transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/#work"
              className="link-effect text-white/80 hover:text-home-accent transition-colors"
            >
              Work
            </Link>
            <Link
              href="/#about"
              className="link-effect text-white/80 hover:text-home-accent transition-colors"
            >
              About
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs text-home-muted/50 font-mono">
            Press{" "}
            <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">
              ↑ ↑ ↓ ↓ ← → ← → B A
            </kbd>{" "}
            for a surprise
          </p>
        </div>
      </main>

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
          >
            Cool, take me back
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: #5865f2;
          }
        }
      `}</style>
    </div>
  )
}
