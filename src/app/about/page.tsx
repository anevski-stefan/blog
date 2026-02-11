import { Metadata } from "next"
import { LazyWebGLBackground } from "@/components/shared/backgrounds/LazyWebGLBackground"
import { SiteHeader } from "@/components/layout/SiteHeader"
import Link from "next/link"
import { SkillsInspector } from "./components/SkillsInspector"

export const metadata: Metadata = {
  title: "About Me | Stefan Anevski",
  description:
    "Learn more about Stefan Anevski, a software engineer specializing in scalable web applications and distributed systems.",
}

export default function AboutPage() {
  return (
    <div className="relative z-0 min-h-screen w-full bg-home-primary overflow-x-hidden selection:bg-home-accent/30 selection:text-white">
      <LazyWebGLBackground />
      <div
        id="about-root"
        className="relative z-10 text-white font-body min-h-screen"
      >
        <SiteHeader activeKey="about" />

        <main className="pt-32 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
          <header className="mb-32 md:mb-48 relative">
            <p className="reveal-text text-sm font-mono text-home-accent tracking-widest uppercase mb-6"></p>
            <h1 className="reveal-text font-heading text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight mb-8 leading-[0.9]">
              DIGITAL
              <br />
              CRAFTSMAN
            </h1>
            <div className="reveal-text max-w-2xl text-lg md:text-xl text-home-muted leading-relaxed space-y-6">
              <p>
                I bridge the gap between complex system architecture and elegant
                user experience. Code is my medium, and the browser is my
                canvas.
              </p>
              <p>
                Originally from Skopje, I&apos;ve spent the last 5+ years
                mastering the art of scaling web applications. My philosophy is
                simple: Build it robust, make it beautiful.
              </p>
            </div>

            <div className="absolute right-0 top-0 w-64 h-64 bg-home-accent/10 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
          </header>

          <SkillsInspector />

          <section className="mt-32 md:mt-48 pt-16 border-t border-white/5 text-center">
            <p className="text-home-muted mb-8">
              Ready to build something extraordinary?
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold tracking-wide hover:bg-home-accent hover:text-white transition-all duration-300"
            >
              Start a Conversation
            </Link>
          </section>
        </main>
      </div>
    </div>
  )
}
