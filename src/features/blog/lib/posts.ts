import { cache } from "react"
import { prisma } from "@/lib/db"
import { POSTS_PER_PAGE } from "@/lib/constants"
import type { PostWithRelations } from "@/features/blog/types/posts"
import { formatDate, calculateReadingTime } from "@/lib/utils"
import type { BlogPost } from "@/features/blog/types/blog"

/**
 * Get a single published post by slug
 * Uses React cache to prevent duplicate fetches
 */
export const getPostBySlug = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      categories: true,
      tags: true,
    },
  })

  return post as PostWithRelations | null
})

/**
 * Get paginated published posts
 */
export async function getPosts(
  page: number = 1,
  search?: string,
  options?: {
    categorySlug?: string
    tagSlug?: string
  }
) {
  const skip = (page - 1) * POSTS_PER_PAGE

  const searchFilter = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          { content: { string_contains: search } },
        ],
      }
    : undefined

  const categoryFilter = options?.categorySlug
    ? { categories: { some: { slug: options.categorySlug } } }
    : undefined

  const tagFilter = options?.tagSlug
    ? { tags: { some: { slug: options.tagSlug } } }
    : undefined

  const where = {
    published: true,
    ...searchFilter,
    ...categoryFilter,
    ...tagFilter,
  }

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      take: POSTS_PER_PAGE,
      skip,
      include: {
        categories: true,
        tags: true,
      },
    }),
    prisma.post.count({ where }),
  ])

  return {
    posts: posts as PostWithRelations[],
    totalPages: Math.ceil(totalPosts / POSTS_PER_PAGE),
    totalPosts,
  }
}

/**
 * Get all categories and tags for forms
 */
export async function getTaxonomies() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
  ])

  return { categories, tags }
}

/**
 * Get all published posts for client-side filtering/animation
 */
export async function getAllPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      categories: true,
      tags: true,
    },
  })

  return posts as PostWithRelations[]
}

export function mapPostToUi(post: PostWithRelations): BlogPost {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    image:
      post.coverImage ||
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    category: post.categories[0]?.name.toLowerCase() || "uncategorized",
    tags: post.tags.map((t: { name: string }) => t.name),
    date: post.publishedAt
      ? formatDate(post.publishedAt)
      : formatDate(post.createdAt),
    readTime: calculateReadingTime(post.content),
    featured: post.featured,
    slug: post.slug,
    authorName: post.authorName,
    authorImage: post.authorImage || undefined,
    content: post.content,
  }
}
