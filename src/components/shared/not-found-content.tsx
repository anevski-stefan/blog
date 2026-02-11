import Link from "next/link"
import { GoBackButton } from "./not-found/GoBackButton"
import { KonamiEasterEgg } from "./not-found/KonamiEasterEgg"
import { NotFoundIntroFx } from "./not-found/NotFoundIntroFx"
import { NotFoundPathname } from "./not-found/NotFoundPathname"
import { NotFoundThreeCanvas } from "./not-found/NotFoundThreeCanvas"
import { ScrambleText } from "./not-found/ScrambleText"

export function NotFoundContent() {
  return (
    <div
      id="not-found-root"
      className="relative font-body bg-home-primary text-white min-h-screen overflow-hidden scanlines"
    >
      <NotFoundIntroFx />
      <div className="noise"></div>
      <div className="broken-grid"></div>

      <NotFoundThreeCanvas />

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
              <ScrambleText className="scramble-text" />
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
                <NotFoundPathname className="text-home-muted" />
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
            <GoBackButton className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-home-accent/50 text-white font-heading text-xs font-medium tracking-wider uppercase rounded-full transition-all duration-300">
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
            </GoBackButton>
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

      <KonamiEasterEgg />

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
