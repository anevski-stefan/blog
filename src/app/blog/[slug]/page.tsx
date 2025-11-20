import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/db"
import { constructMetadata } from "@/lib/metadata"
import { formatDate } from "@/lib/utils"
import type { Category, Tag } from "@/generated/prisma"
import { PostContent } from "@/components/post-content"
import type { Content } from "@tiptap/react"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
      published: true,
    },
    include: {
      categories: true,
      tags: true,
    },
  })

  if (!post) {
    return null
  }

  return post
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return constructMetadata()
  }

  const ogImageParams = new URLSearchParams({
    title: post.title,
    description: post.excerpt || "",
    type: "article",
  })
  const ogImageUrl = `/api/og?${ogImageParams.toString()}`

  return constructMetadata({
    title: post.title,
    description: post.excerpt || "",
    type: "article",
    image: post.coverImage || ogImageUrl,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-3xl py-12">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
            priority
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>By {post.authorName}</span>
          <span>•</span>
          <time dateTime={post.publishedAt?.toISOString()}>
            {formatDate(post.publishedAt || post.createdAt)}
          </time>
        </div>
      </header>

      {/* Content */}
      <PostContent content={post.content as Content} />

      {/* Tags and Categories */}
      <footer className="mt-8 pt-8 border-t">
        <div className="flex flex-wrap gap-4">
          {post.categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Categories:</span>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category: Category) => (
                  <a
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
          )}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: Tag) => (
                  <a
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {tag.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </footer>
    </article>
  )
}
