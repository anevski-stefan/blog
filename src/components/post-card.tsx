import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { TaxonomyBadge } from "@/components/taxonomy-badge"
import type { Post } from "@/generated/prisma"

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface PostCardProps {
  post: Post & {
    categories?: Category[]
    tags?: Tag[]
  }
  showTaxonomy?: boolean
}

export function PostCard({ post, showTaxonomy = true }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card p-5 transition-shadow hover:shadow-lg"
    >
      {post.coverImage && (
        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <article className="flex flex-1 flex-col">
        <h2 className="mb-2 text-xl font-bold transition-colors group-hover:text-secondary">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mb-4 line-clamp-2 text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        {showTaxonomy && (post.categories?.length || post.tags?.length) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.categories?.map(category => (
              <TaxonomyBadge
                key={category.id}
                name={category.name}
                slug={category.slug}
                type="category"
              />
            ))}
            {post.tags?.map(tag => (
              <TaxonomyBadge
                key={tag.id}
                name={tag.name}
                slug={tag.slug}
                type="tag"
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt
              ? formatDate(post.publishedAt)
              : formatDate(post.createdAt)}
          </time>
          <span>By {post.authorName || "Unknown"}</span>
        </div>
      </article>
    </Link>
  )
}
