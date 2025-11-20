import type { Post } from "@/generated/prisma/client"
import type { Category, Tag } from "@/generated/prisma"

interface StructuredDataProps {
  post: Post & {
    categories: Category[]
    tags: Tag[]
  }
  baseUrl: string
}

export function StructuredData({ post, baseUrl }: StructuredDataProps) {
  const postUrl = `${baseUrl}/blog/${post.slug}`
  const imageUrl = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${baseUrl}${post.coverImage}`
    : `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.excerpt || "")}&type=article`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    image: imageUrl ? [imageUrl] : undefined,
    datePublished:
      post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName || "Unknown",
    },
    publisher: {
      "@type": "Organization",
      name: "My Blog",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    ...(post.categories.length > 0 && {
      articleSection: post.categories.map(cat => cat.name).join(", "),
    }),
    ...(post.tags.length > 0 && {
      keywords: post.tags.map(tag => tag.name).join(", "),
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
