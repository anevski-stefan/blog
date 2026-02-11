import { LazyWebGLBackground } from "@/components/shared/backgrounds/LazyWebGLBackground"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { HomeContent } from "@/features/home/components/HomeContent"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Stefan Anevski — Creative Developer",
  description:
    "Award-winning creative developer specializing in immersive digital experiences.",
})

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen bg-home-primary">
      <LazyWebGLBackground mode="immediate" />
      <div className="relative z-10">
        <SiteHeader isHome />
        <HomeContent />
      </div>
    </main>
  )
}
