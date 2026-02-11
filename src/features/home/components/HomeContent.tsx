import Link from "next/link"
import Image from "next/image"

import { HomeAnimations } from "./HomeAnimations"

export function HomeContent() {
  return (
    <div
      id="home-root"
      className="text-white font-body selection:bg-home-accent selection:text-white"
    >
      <HomeAnimations />
      <div
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
          <a
            href="#work"
            className="hero-cta magnetic inline-flex items-center gap-4 px-8 py-4 md:px-10 md:py-5 bg-white text-home-primary font-heading text-sm font-medium tracking-widest uppercase rounded-full relative overflow-hidden transition-transform duration-500 hover:scale-105 opacity-0 translate-y-10"
          >
            View Selected Work
            <span className="arrow transition-transform duration-500">→</span>
          </a>
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
              (2023 — 2026)
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-20 md:gap-32 max-w-5xl mx-auto">
          <article className="group reveal grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6 relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700 z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80"
                alt="Code Quest"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            <div className="md:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-10 h-px bg-home-accent"></span>
                <span className="font-mono text-xs text-home-accent tracking-widest uppercase">
                  2024
                </span>
              </div>

              <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-white group-hover:text-home-accent transition-colors">
                Code Quest
              </h3>

              <p className="text-home-muted text-base leading-relaxed mb-8">
                A full-stack web app for discovering and contributing to GitHub
                projects. Streamlining open-source onboarding.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["React.js", "TypeScript", "Tailwind"].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-white/60 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-3 text-sm font-medium text-white hover:text-home-accent transition-colors group/link"
              >
                <span className="uppercase tracking-wide">View Project</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 group-hover/link:bg-home-accent group-hover/link:text-white">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </article>

          <article className="group reveal grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6 md:order-1 order-2 flex flex-col justify-center md:items-end md:text-right">
              <div className="flex items-center gap-4 mb-6 md:flex-row-reverse">
                <span className="w-10 h-px bg-home-accent"></span>
                <span className="font-mono text-xs text-home-accent tracking-widest uppercase">
                  2025
                </span>
              </div>

              <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-white group-hover:text-home-accent transition-colors">
                Smart Cook
              </h3>

              <p className="text-home-muted text-base leading-relaxed mb-8">
                A sophisticated cooking assistant application with AI vision
                technology, enhancing recipe discovery by 45%.
              </p>

              <div className="flex flex-wrap gap-2 mb-8 md:justify-end">
                {["Next.js", "Google Gen AI", "TypeScript"].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-white/60 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-3 text-sm font-medium text-white hover:text-home-accent transition-colors group/link md:flex-row-reverse"
              >
                <span className="uppercase tracking-wide">View Project</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 group-hover/link:bg-home-accent group-hover/link:text-white">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>

            <div className="md:col-span-6 md:order-2 order-1 relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700 z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80"
                alt="Smart Cook"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
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
              src="/images/me.png"
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
              With over 3 years of experience in software engineering and
              distributed systems, I specialize in building robust, scalable web
              applications. My background spans from low-level system design to
              high-fidelity frontend interactions.
            </p>
            <p className="text-base text-home-muted leading-relaxed mb-6 reveal">
              I believe in code that is not only functional but also
              maintainable, performant, and elegant. I bridge the gap between
              complex backend logic and seamless user experiences.
            </p>

            <div className="mb-10 reveal">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-home-accent transition-colors group"
              >
                <span className="uppercase tracking-wide">More about me</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 md:gap-8 reveal">
              <div>
                <div
                  className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-home-accent stat-number"
                  data-count="20"
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
                  data-count="3"
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
                  data-count="5"
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
            href="https://x.com/s_anevski"
            className="text-sm hover:text-white transition-colors duration-300"
          >
            Twitter
          </Link>
          <Link
            href="https://www.linkedin.com/in/stefan-anevski/"
            className="text-sm hover:text-white transition-colors duration-300"
          >
            LinkedIn
          </Link>
          <Link
            href="https://github.com/anevski-stefan"
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
