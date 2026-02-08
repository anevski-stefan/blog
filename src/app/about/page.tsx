import { Metadata } from "next"
import { AboutClientView } from "./client-view"
import { WebGLBackground } from "@/components/home/WebGLBackground"

export const metadata: Metadata = {
  title: "About Me | Stefan Anevski",
  description:
    "Learn more about Stefan Anevski, a software engineer specializing in scalable web applications and distributed systems.",
}

export default function AboutPage() {
  return (
    <div className="relative z-0 min-h-screen w-full bg-home-primary overflow-x-hidden selection:bg-home-accent/30 selection:text-white">
      <WebGLBackground />
      <div className="relative z-10">
        <AboutClientView />
      </div>
    </div>
  )
}
