import { AnimatedHero } from "@/components/shared/animated-hero"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Home",
  description: "Welcome to my personal blog.",
})

export default function Home() {
  return <AnimatedHero />
}
