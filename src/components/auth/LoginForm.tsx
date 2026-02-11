"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Chrome,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { login, loginWithProvider } from "@/actions/auth"
import { toast } from "@/components/ui/use-toast"

function showError(message: string) {
  toast({
    variant: "destructive",
    title: "Sign in failed",
    description: message,
  })
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
        }
      )

      gsap.fromTo(
        ".form-item",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.4,
        }
      )

      const magneticElements = document.querySelectorAll(".magnetic")
      magneticElements.forEach(elem => {
        const el = elem as HTMLElement
        const handleMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: "power2.out",
          })
        }
        const handleMouseLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)",
          })
        }

        el.addEventListener("mousemove", handleMouseMove)
        el.addEventListener("mouseleave", handleMouseLeave)
      })
    })

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const result = await login(formData)
      if (result?.error) {
        showError(result.error)
      }
    } catch {
      showError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google") => {
    setSocialLoading(provider)
    try {
      const result = await loginWithProvider(provider)
      if (result?.error) {
        showError(result.error)
      }
    } catch {
      showError("Failed to connect with provider")
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md mx-auto cursor-none opacity-0"
    >
      <div className="glass-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-home-accent/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />

        <div className="relative z-10">
          <div className="form-item text-center mb-6 opacity-0">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-home-accent/10 mb-4 group transition-all duration-500 hover:scale-110">
              <ShieldCheck className="h-6 w-6 text-home-accent transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
              Welcome Back
            </h1>
            <p className="text-home-muted text-xs">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-item space-y-2 opacity-0">
              <label
                htmlFor="email"
                className="text-sm font-medium text-white/70 ml-1"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Mail className="h-5 w-5 text-white/30 group-focus-within:text-home-accent transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-home-accent/50 focus:border-home-accent transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="form-item space-y-2 opacity-0">
              <div className="flex justify-between items-center px-1">
                <label
                  htmlFor="password"
                  term-content="Password"
                  className="text-sm font-medium text-white/70"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-home-accent hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Lock className="h-5 w-5 text-white/30 group-focus-within:text-home-accent transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-home-accent/50 focus:border-home-accent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-item flex items-center space-x-2 px-1 opacity-0">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-home-accent focus:ring-home-accent focus:ring-offset-0"
              />
              <label
                htmlFor="remember"
                className="text-sm text-white/50 cursor-pointer select-none"
              >
                Remember me for 30 days
              </label>
            </div>

            <div className="form-item pt-2 opacity-0">
              <button
                type="submit"
                disabled={isLoading}
                className="magnetic group relative w-full bg-home-accent hover:bg-home-accent/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-home-accent/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In{" "}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </form>

          <div className="form-item mt-6 opacity-0">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-transparent px-4 text-white/30">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={!!socialLoading}
                className="magnetic w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-medium text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
              >
                {socialLoading === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="h-4 w-4" />
                )}
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-white/20 text-[10px] uppercase tracking-widest">
        <span>Secure Login</span>
        <span className="h-1 w-1 rounded-full bg-white/20"></span>
        <span>256-bit SSL</span>
      </div>
    </div>
  )
}
