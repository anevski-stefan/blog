"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import Link from "next/link"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export function HomeContent() {
  const loaderRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const loaderText = document.querySelectorAll(".loader-text span")
      const loadingTl = gsap.timeline()

      loadingTl
        .to(loaderText, {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: "power3.out",
        })
        .to(loaderText, {
          y: -20,
          opacity: 0,
          stagger: 0.03,
          duration: 0.3,
          delay: 0.5,
        })
        .to(loaderRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
        })
        .call(() => {
          if (loaderRef.current) loaderRef.current.style.display = "none"
          animateHero()
        })

      function animateHero() {
        const heroTl = gsap.timeline()
        heroTl
          .to(".hero-line", {
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
          })
          .to(
            ".hero-eyebrow",
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.8"
          )
          .to(
            ".hero-desc",
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6"
          )
          .to(
            ".hero-cta",
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6"
          )
          .to(
            ".hero-scroll",
            {
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            },
            "-=0.4"
          )
      }

      gsap.utils.toArray(".reveal").forEach((elem: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        gsap.fromTo(
          elem,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      })

      gsap.utils.toArray(".stat-number").forEach((stat: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        const target = parseInt(stat.dataset.count)
        gsap.to(stat, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: stat,
            start: "top 80%",
          },
        })
      })

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

  const scrollToSection = (id: string) => {
    const target = document.querySelector(id)
    if (target) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: target, offsetY: 50 },
        ease: "power4.inOut",
      })
    }
    setMenuOpen(false)
  }

  return (
    <div className="text-white font-body selection:bg-home-accent selection:text-white">
      <div
        ref={loaderRef}
        id="loader"
        className="fixed inset-0 bg-home-primary z-[9999] flex items-center justify-center"
      >
        <div className="loader-text font-heading text-base md:text-xl font-light tracking-[0.5em] uppercase flex space-x-1">
          <span className="opacity-0 translate-y-4">L</span>
          <span className="opacity-0 translate-y-4">O</span>
          <span className="opacity-0 translate-y-4">A</span>
          <span className="opacity-0 translate-y-4">D</span>
          <span className="opacity-0 translate-y-4">I</span>
          <span className="opacity-0 translate-y-4">N</span>
          <span className="opacity-0 translate-y-4">G</span>
        </div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-6 md:py-8 flex justify-between items-center mix-blend-difference text-white">
        <Link
          href="/"
          className="font-heading text-lg md:text-xl font-semibold tracking-tight"
        >
          Stefan Anevski
        </Link>
        <div className="hidden md:flex gap-8 lg:gap-12">
          {["Work", "About", "Contact"].map(item => (
            <button
              key={item}
              onClick={() => scrollToSection(`#${item.toLowerCase()}`)}
              className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group cursor-none"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
            </button>
          ))}
          <Link
            href="/blog"
            className="nav-link text-sm font-normal tracking-widest uppercase relative py-2 group"
          >
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </Link>
        </div>
        <button
          id="menu-toggle"
          className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none z-[101]"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`w-7 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          ></span>
          <span
            className={`w-7 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-0.5" : ""}`}
          ></span>
        </button>
      </nav>

      <div
        className={`fixed inset-0 bg-home-primary z-40 flex flex-col justify-center items-center gap-8 transition-opacity duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {["Work", "About", "Contact"].map((item, i) => (
          <button
            key={item}
            onClick={() => scrollToSection(`#${item.toLowerCase()}`)}
            className={`mobile-link font-heading text-4xl md:text-6xl font-semibold transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            style={{ transitionDelay: `${100 + i * 100}ms` }}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 relative pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <p className="hero-eyebrow text-xs font-medium tracking-[0.3em] uppercase text-home-accent mb-6 md:mb-8 flex items-center gap-4 opacity-0 -translate-x-10">
            <span className="w-10 h-px bg-home-accent"></span>
            Software Engineer
          </p>
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold leading-[0.9] tracking-tighter mb-8 md:mb-12">
            <span className="block overflow-hidden">
              <span className="hero-line block translate-y-full">Design</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block translate-y-full text-outline">
                Build
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block translate-y-full">Scale</span>
            </span>
          </h1>
          <p className="hero-desc text-base md:text-lg lg:text-xl font-light text-home-muted max-w-md lg:max-w-lg leading-relaxed mb-8 md:mb-12 opacity-0 translate-y-10">
            I build scalable, high-performance applications that solve complex
            problems. Specialized in full-stack architecture and interactive web
            systems.
          </p>
          <button
            onClick={() => scrollToSection("#work")}
            className="hero-cta magnetic inline-flex items-center gap-4 px-8 py-4 md:px-10 md:py-5 bg-white text-home-primary font-heading text-sm font-medium tracking-widest uppercase rounded-full relative overflow-hidden transition-transform duration-500 hover:scale-105 opacity-0 translate-y-10"
          >
            View Selected Work
            <span className="arrow transition-transform duration-500">→</span>
          </button>
        </div>
        <div className="hero-scroll absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0">
          <span className="text-[10px] tracking-[0.3em] uppercase text-home-muted [writing-mode:vertical-rl]">
            Scroll
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-home-muted to-transparent relative overflow-hidden">
            <span className="absolute top-[-100%] left-0 w-full h-full bg-home-accent animate-[scrollDown_2s_ease-in-out_infinite]"></span>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 border-y border-white/5 relative bg-home-secondary/30 backdrop-blur-sm overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#5865F2 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-home-primary to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-home-primary to-transparent z-10 pointer-events-none"></div>

        <div className="flex flex-col gap-8 md:gap-10">
          {/* Section Header */}
          <div className="px-6 md:px-16 max-w-7xl mx-auto w-full mb-2">
            <p className="text-xs font-mono font-medium tracking-widest uppercase text-home-accent/80 flex items-center gap-2">
              <span className="w-2 h-2 bg-home-accent rounded-full animate-pulse"></span>
              System Proficiency
            </p>
          </div>

          {/* Row 1: Languages & Frameworks */}
          <div className="flex animate-marquee w-max group hover:[animation-play-state:paused] relative z-0">
            {/* Content Set 1 */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4 px-2">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-home-accent/30 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span>
                  <span className="font-mono text-sm text-white/90 tracking-wide">
                    React.js
                  </span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-home-accent/30 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></span>
                  <span className="font-mono text-sm text-white/90 tracking-wide">
                    TypeScript
                  </span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-home-accent/30 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></span>
                  <span className="font-mono text-sm text-white/90 tracking-wide">
                    Next.js
                  </span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-home-accent/30 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                  <span className="font-mono text-sm text-white/90 tracking-wide">
                    Node.js
                  </span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-home-accent/30 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]"></span>
                  <span className="font-mono text-sm text-white/90 tracking-wide">
                    Python
                  </span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-home-accent/30 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
                  <span className="font-mono text-sm text-white/90 tracking-wide">
                    AWS
                  </span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-home-accent/30 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.5)]"></span>
                  <span className="font-mono text-sm text-white/90 tracking-wide">
                    Docker
                  </span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-home-accent/30 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></span>
                  <span className="font-mono text-sm text-white/90 tracking-wide">
                    GraphQL
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Concepts */}
          <div className="flex animate-marquee-reverse w-max group hover:[animation-play-state:paused] relative z-0">
            {/* Content Set 1 */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4 px-2">
                {[
                  "System Architecture",
                  "Microservices",
                  "CI/CD Pipelines",
                  "RESTful APIs",
                  "Cloud Infrastructure",
                  "Database Scaling",
                  "Web Security",
                ].map(text => (
                  <div
                    key={text}
                    className="flex items-center gap-3 px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-home-accent/30 transition-colors duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-home-accent shadow-[0_0_8px_#5865F2]"></span>
                    <span className="font-mono text-sm text-white/90 tracking-wide">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section
        id="work"
        className="py-24 md:py-40 px-6 md:px-16 max-w-7xl mx-auto relative"
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 md:mb-40 reveal">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-home-accent mb-6">
              Selected Work
            </p>
            <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tighter leading-none">
              Engineered
              <br />
              Solutions
            </h2>
          </div>
          <div className="hidden md:block pb-2">
            <span className="text-home-muted text-sm tracking-widest uppercase">
              (2023 — 2024)
            </span>
          </div>
        </div>

        <div className="space-y-32 md:space-y-48">
          {/* Project 1 */}
          <article className="relative group reveal">
            {/* Large Background Image */}
            <div className="w-full md:w-[85%] aspect-[16/10] md:aspect-[16/9] relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-colors duration-700"></div>
              <Image
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80"
                alt="Nebula Dashboard"
                fill
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            {/* Floating Info Card */}
            <div className="relative mt-[-4rem] md:mt-0 md:absolute md:bottom-12 md:right-0 lg:right-12 md:w-[450px] z-20">
              <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-home-accent/5">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-home-accent tracking-widest uppercase">
                    Project 01
                  </span>
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-home-accent/50"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                  </div>
                </div>

                <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-4 text-white">
                  Nebula Analytics
                </h3>
                <p className="text-home-muted text-sm md:text-base leading-relaxed mb-8">
                  A high-performance analytics engine capable of processing
                  millions of data points in real-time. Built with a focus on
                  scalability and data visualization.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/70 border border-white/5 font-mono">
                    React
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/70 border border-white/5 font-mono">
                    Python
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/70 border border-white/5 font-mono">
                    D3.js
                  </span>
                </div>

                <Link
                  href="#"
                  className="magnetic inline-flex items-center gap-3 text-sm font-medium text-white hover:text-home-accent transition-colors group/link w-full"
                >
                  <span className="tracking-wide uppercase">
                    View Case Study
                  </span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>

          {/* Project 2 */}
          <article className="relative group reveal flex flex-col md:items-end">
            {/* Large Background Image */}
            <div className="w-full md:w-[85%] aspect-[16/10] md:aspect-[16/9] relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-colors duration-700"></div>
              <Image
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80"
                alt="Quantum Banking"
                fill
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            {/* Floating Info Card */}
            <div className="relative mt-[-4rem] md:mt-0 md:absolute md:bottom-12 md:left-0 lg:left-12 md:w-[450px] z-20 text-left">
              <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-home-accent/5">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-home-accent tracking-widest uppercase">
                    Project 02
                  </span>
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-home-accent/50"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                  </div>
                </div>

                <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-4 text-white">
                  Quantum Banking
                </h3>
                <p className="text-home-muted text-sm md:text-base leading-relaxed mb-8">
                  A secure, ISO-compliant banking interface featuring end-to-end
                  encryption and sub-millisecond transaction processing.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/70 border border-white/5 font-mono">
                    Next.js
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/70 border border-white/5 font-mono">
                    TypeScript
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/70 border border-white/5 font-mono">
                    PostgreSQL
                  </span>
                </div>

                <Link
                  href="#"
                  className="magnetic inline-flex items-center gap-3 text-sm font-medium text-white hover:text-home-accent transition-colors group/link w-full"
                >
                  <span className="tracking-wide uppercase">
                    View Case Study
                  </span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>

          {/* Project 3 */}
          <article className="relative group reveal">
            {/* Large Background Image */}
            <div className="w-full md:w-[85%] aspect-[16/10] md:aspect-[16/9] relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-colors duration-700"></div>
              <Image
                src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1600&q=80"
                alt="Prism Studios"
                fill
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            {/* Floating Info Card */}
            <div className="relative mt-[-4rem] md:mt-0 md:absolute md:bottom-12 md:right-0 lg:right-12 md:w-[450px] z-20">
              <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-home-accent/5">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-home-accent tracking-widest uppercase">
                    Project 03
                  </span>
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-home-accent/50"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                  </div>
                </div>

                <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-4 text-white">
                  Prism Design System
                </h3>
                <p className="text-home-muted text-sm md:text-base leading-relaxed mb-8">
                  An enterprise-grade component library and documentation
                  platform facilitating consistent UI implementation across 20+
                  micro-frontends.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/70 border border-white/5 font-mono">
                    Storybook
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/70 border border-white/5 font-mono">
                    React
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/70 border border-white/5 font-mono">
                    CI/CD
                  </span>
                </div>

                <Link
                  href="#"
                  className="magnetic inline-flex items-center gap-3 text-sm font-medium text-white hover:text-home-accent transition-colors group/link w-full"
                >
                  <span className="tracking-wide uppercase">
                    View Case Study
                  </span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section
        id="about"
        className="py-16 md:py-32 px-6 md:px-16 max-w-7xl mx-auto border-y border-white/5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="aspect-[4/5] bg-home-secondary rounded-lg overflow-hidden relative reveal">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
              alt="Stefan Anevski"
              fill
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-home-accent mb-4 reveal">
              About Me
            </p>
            <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-6 reveal">
              I build the digital infrastructure of tomorrow.
            </h3>
            <p className="text-base text-home-muted leading-relaxed mb-6 reveal">
              With over 8 years of experience in software engineering and
              distributed systems, I specialize in building robust, scalable web
              applications. My background spans from low-level system design to
              high-fidelity frontend interactions.
            </p>
            <p className="text-base text-home-muted leading-relaxed mb-10 reveal">
              I believe in code that is not only functional but also
              maintainable, performant, and elegant. I bridge the gap between
              complex backend logic and seamless user experiences.
            </p>

            <div className="grid grid-cols-3 gap-6 md:gap-8 reveal">
              <div>
                <div
                  className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-home-accent stat-number"
                  data-count="50"
                >
                  0
                </div>
                <div className="text-xs text-home-muted tracking-wider uppercase mt-2">
                  Projects
                </div>
              </div>
              <div>
                <div
                  className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-home-accent stat-number"
                  data-count="8"
                >
                  0
                </div>
                <div className="text-xs text-home-muted tracking-wider uppercase mt-2">
                  Years
                </div>
              </div>
              <div>
                <div
                  className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-home-accent stat-number"
                  data-count="30"
                >
                  0
                </div>
                <div className="text-xs text-home-muted tracking-wider uppercase mt-2">
                  Clients
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="text-center py-32 md:py-60 px-6 md:px-16"
      >
        <p className="text-xs font-medium tracking-[0.3em] uppercase text-home-accent mb-4 reveal">
          Get in Touch
        </p>
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold tracking-tighter mb-10 md:mb-12 reveal">
          Let&apos;s build
          <br />
          something
        </h2>
        <a
          href="mailto:hello@stefananevski.com"
          className="magnetic inline-flex items-center gap-4 text-base md:text-lg text-home-muted px-8 py-4 border border-white/20 rounded-full transition-all duration-500 hover:border-home-accent hover:text-home-accent reveal"
        >
          hello@stefananevski.com
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </section>

      <footer className="py-8 md:py-12 px-6 md:px-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-home-muted">
        <p className="text-sm">
          © {new Date().getFullYear()} Stefan Anevski. All rights reserved.
        </p>
        <div className="flex gap-6 md:gap-8">
          <Link
            href="#"
            className="text-sm hover:text-white transition-colors duration-300"
          >
            Twitter
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-white transition-colors duration-300"
          >
            LinkedIn
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-white transition-colors duration-300"
          >
            GitHub
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-white transition-colors duration-300"
          >
            Dribbble
          </Link>
        </div>
      </footer>
    </div>
  )
}
