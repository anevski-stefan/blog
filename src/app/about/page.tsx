import type { Metadata } from "next"
import { constructMetadata } from "@/lib/metadata"

export const metadata: Metadata = constructMetadata({
  title: "About",
  description:
    "Learn more about me, my background, and what this blog is all about.",
})

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>
      <div className="prose dark:prose-invert">
        <p className="text-lg mb-4">
          Welcome to my corner of the internet! I&apos;m passionate about
          technology, development, and sharing knowledge with others.
        </p>
        <p className="text-lg mb-4">
          This blog is built with modern technologies like Next.js, Tailwind
          CSS, Prisma, and Clerk, allowing me to create and share content
          efficiently.
        </p>
        <p className="text-lg">
          Feel free to explore my posts and reach out if you&apos;d like to
          connect!
        </p>
      </div>
    </div>
  )
}
