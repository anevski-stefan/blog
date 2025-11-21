import type { Post, Category, Tag } from "@/generated/prisma/client"

/**
 * Post with relations (categories and tags)
 */
export type PostWithRelations = Post & {
  categories: Category[]
  tags: Tag[]
}

/**
 * Post data for creation/update
 */
export interface PostData {
  title: string
  content: string
  excerpt?: string
  slug?: string
  coverImage?: string
  categoryIds?: string[]
  tagIds?: string[]
}
