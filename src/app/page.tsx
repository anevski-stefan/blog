import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to My Blog
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Exploring technology, development, and everything in between.
                Join me on this journey of discovery and learning.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/blog">
                  Read Blog Posts
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">
                  About Me
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Featured Posts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* We'll populate this with actual posts later */}
            <div className="group relative rounded-lg border p-6 hover:shadow-lg transition-shadow">
              <h3 className="mb-2 text-xl font-bold">Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Exciting content is on its way. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
