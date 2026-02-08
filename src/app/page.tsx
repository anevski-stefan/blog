import { HomeContent } from "@/components/home/HomeContent"
import { WebGLBackground } from "@/components/home/WebGLBackground"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Stefan Anevski — Creative Developer",
  description:
    "Award-winning creative developer specializing in immersive digital experiences.",
})

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen bg-home-primary">
      <WebGLBackground />
      <div className="relative z-10">
        <HomeContent />
      </div>
    </main>
  )
}
