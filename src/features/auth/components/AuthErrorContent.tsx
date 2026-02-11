"use client"

import { useEffect, useState } from "react"
import { gsap } from "gsap"
import { ShieldAlert, Lock, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "AuthError"
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = document.querySelectorAll(".glitch-line")
      lines.forEach(line => {
        gsap.to(line, {
          y: "100vh",
          duration: 2 + Math.random() * 2,
          repeat: -1,
          ease: "none",
          delay: Math.random() * 2,
        })
      })

      gsap.from(".error-content", {
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
      })

      const flicker = () => {
        gsap.to(".flicker-text", {
          opacity: Math.random() > 0.9 ? 0.3 : 1,
          duration: 0.1,
          onComplete: () => {
            setTimeout(flicker, Math.random() * 500)
          },
        })
      }
      flicker()
    })

    const interval = setInterval(() => setPulse(p => !p), 1000)

    return () => {
      ctx.revert()
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-900/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-full bg-gradient-to-t from-red-950/40 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 opacity-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="glitch-line absolute left-0 h-px w-full bg-red-500"
            style={{ top: `-10px` }}
          />
        ))}
      </div>

      <div className="error-content relative z-20 flex flex-col items-center text-center px-4">
        <div className="relative mb-8">
          <div
            className={`absolute inset-0 rounded-full bg-red-600/30 blur-2xl transition-all duration-1000 ${pulse ? "scale-125 opacity-100" : "scale-75 opacity-50"}`}
          />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-red-500/50 bg-red-500/10 backdrop-blur-md">
            <Lock className="h-10 w-10 text-red-500" />
            <ShieldAlert className="absolute -right-2 -top-2 h-8 w-8 text-red-600 animate-bounce" />
          </div>
        </div>

        <h1 className="flicker-text mb-2 font-heading text-5xl font-black tracking-tighter text-red-500 md:text-7xl">
          ACCESS <span className="text-white">DENIED</span>
        </h1>

        <div className="mb-8 flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
          Security Level: Restricted
        </div>

        <p className="mb-12 max-w-md font-mono text-sm leading-relaxed text-zinc-400">
          Your credentials do not have the required clearance level to access
          this sector. The attempt has been logged.
          <br />
          <span className="mt-2 block text-red-400/80">
            Error Signature: {error.toUpperCase()}
          </span>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/admin/login"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
            TRY AGAIN
          </Link>

          <Link
            href="/"
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
          >
            <Home className="h-4 w-4" />
            RETURN TO BASE
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 z-20 flex w-full items-center justify-between px-10 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        <div className="flex items-center gap-4">
          <span>IP: 127.0.0.1</span>
          <span className="hidden sm:inline">Node: Central-01</span>
        </div>
        <div className="text-red-900/40 font-bold animate-pulse">
          Unauthorized Entry Attempt
        </div>
        <div>{new Date().toLocaleTimeString()}</div>
      </div>

      <div className="noise pointer-events-none absolute inset-0 z-50 opacity-[0.03]" />

      <style jsx>{`
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3");
        }
      `}</style>
    </div>
  )
}
