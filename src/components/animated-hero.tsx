"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

export function AnimatedHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create master timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Split title into characters for animation
      if (titleRef.current) {
        const titleText = titleRef.current.textContent || ""
        titleRef.current.innerHTML = titleText
          .split("")
          .map((char) => 
            char === " " 
              ? '<span class="inline-block">&nbsp;</span>' 
              : `<span class="inline-block">${char}</span>`
          )
          .join("")

        const chars = titleRef.current.querySelectorAll("span")

        // Animate title characters
        tl.fromTo(
          chars,
          {
            y: 100,
            opacity: 0,
            rotationX: -90,
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            stagger: {
              amount: 0.8,
              from: "start",
            },
            ease: "back.out(1.7)",
          },
          0.2
        )
      }

      // Animate description
      tl.fromTo(
        descriptionRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
        },
        "-=0.4"
      )

      // Animate buttons
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.querySelectorAll("a")
        tl.fromTo(
          buttons,
          {
            y: 40,
            opacity: 0,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
          },
          "-=0.6"
        )
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="flex flex-col items-center justify-center space-y-12">
      {/* Hero Section */}
      <section className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-5xl mx-auto">
            <div className="space-y-2">
              <h1
                ref={titleRef}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                style={{ perspective: "400px" }}
              >
                Welcome to My Blog
              </h1>
              <p
                ref={descriptionRef}
                className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
              >
                Exploring technology, development, and everything in between.
                Join me on this journey of discovery and learning.
              </p>
            </div>
            <div ref={buttonsRef} className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/blog">Read Blog Posts</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">About Me</Link>
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

