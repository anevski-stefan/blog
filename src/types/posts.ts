import type { Category, Post, Tag } from "@prisma/client"

/**
 * Post with relations (categories and tags)
 */
export type PostWithRelations = Post & {
  categories: Category[]
  tags: Tag[]
}
