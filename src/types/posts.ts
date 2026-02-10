import type { Post, Category, Tag } from "@/generated/prisma/client"

/**
 * Post with relations (categories and tags)
 */
export type PostWithRelations = Post & {
  categories: Category[]
  tags: Tag[]
}
