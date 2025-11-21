import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { constructMetadata } from "@/lib/metadata"
import { formatDate, calculateReadingTime } from "@/lib/utils"
import { getPostBySlug } from "@/lib/posts"
import { getAppUrl } from "@/lib/config"
import { PostContent } from "@/components/posts/post-content"
import { StructuredData } from "@/components/shared/structured-data"
import { SocialShare } from "@/components/shared/social-share"
import type { Content } from "@tiptap/react"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return constructMetadata()
  }

  const baseUrl = getAppUrl()
  const postUrl = getAppUrl(`/blog/${post.slug}`)

  let ogImageUrl = post.coverImage
  if (!ogImageUrl) {
    const ogImageParams = new URLSearchParams({
      title: post.title,
      description: post.excerpt || "",
      type: "article",
    })
    ogImageUrl = `${baseUrl}/api/og?${ogImageParams.toString()}`
  } else if (!ogImageUrl.startsWith("http")) {
    ogImageUrl = ogImageUrl.startsWith("/")
      ? `${baseUrl}${ogImageUrl}`
      : `${baseUrl}/${ogImageUrl}`
  }

  const description = post.excerpt || post.title || "Read this article"

  return constructMetadata({
    title: post.title,
    description: description,
    type: "article",
    image: ogImageUrl,
    url: postUrl,
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    authors: [post.authorName || "Unknown"],
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const baseUrl = getAppUrl()
  const postUrl = getAppUrl(`/blog/${post.slug}`)
  const readingTime = calculateReadingTime(post.content)

  return (
    <>
      <StructuredData post={post} baseUrl={baseUrl} />
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
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span>By {post.authorName}</span>
            <span>•</span>
            <time dateTime={post.publishedAt?.toISOString()}>
              {formatDate(post.publishedAt || post.createdAt)}
            </time>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        {/* Content */}
        <PostContent content={post.content as Content} />

        {/* Tags and Categories */}
        <footer className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-4 mb-4">
            {post.categories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map(category => (
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
                  {post.tags.map(tag => (
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
          <div className="flex justify-end">
            <SocialShare
              title={post.title}
              url={postUrl}
              description={post.excerpt || undefined}
            />
          </div>
        </footer>
      </article>
    </>
  )
}
