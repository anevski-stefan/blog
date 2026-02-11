"use client"

import Image from "next/image"
import { Github, Linkedin, Twitter } from "lucide-react"
import { User } from "@supabase/supabase-js"
import { TiptapRenderer } from "@/components/tiptap/Renderer"
import type { TiptapContent } from "@/lib/utils"

export function CreatePostPreview(props: {
  user?: User | null
  title: string
  excerpt: string
  featuredImage: string | null
  content: TiptapContent
  tags: string[]
}) {
  const { user, title, excerpt, featuredImage, content, tags } = props

  return (
    <div className="flex-1 w-full bg-home-primary text-white min-h-screen animate-in overflow-y-auto overflow-x-hidden">
      <header className="pt-20 md:pt-24 pb-12 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-8 text-white">
            {title || "Untitled Post"}
          </h1>

          {excerpt && (
            <p className="text-lg md:text-xl text-home-muted leading-relaxed mb-10 max-w-3xl">
              {excerpt}
            </p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-6 pb-10 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="w-full h-full rounded-full bg-home-accent/20 border border-home-accent/30 flex items-center justify-center text-home-accent text-xs font-bold overflow-hidden">
                  {user?.user_metadata?.avatar_url ||
                  user?.user_metadata?.picture ? (
                    <Image
                      src={
                        (user?.user_metadata?.avatar_url ||
                          user?.user_metadata?.picture) as string
                      }
                      alt={user?.user_metadata?.full_name || "Author"}
                      fill
                      className="object-cover rounded-full"
                      unoptimized
                      referrerPolicy="no-referrer"
                    />
                  ) : user?.user_metadata?.full_name ? (
                    (user.user_metadata.full_name as string)
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  ) : (
                    "SA"
                  )}
                </div>
              </div>
              <div>
                <p className="font-heading font-medium text-white">
                  {user?.user_metadata?.full_name || "Stefan Anevski"}
                </p>
                <p className="text-sm text-home-muted">
                  Full Stack Software Engineer
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-home-muted transition-all">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="p-2 bg-white/5 rounded-lg text-home-muted transition-all">
                <Linkedin className="w-4 h-4" />
              </div>
              <div className="p-2 bg-white/5 rounded-lg text-home-muted transition-all">
                <Github className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {featuredImage && (
        <div className="px-6 md:px-16 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={featuredImage}
                alt={title || "Featured"}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-home-primary/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 md:px-16 pb-32">
        <div className="max-w-4xl mx-auto">
          <article>
            <TiptapRenderer
              content={content}
              className="prose-invert max-w-none px-0"
            />

            {tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-home-muted mr-2">Tags:</span>
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  )
}
