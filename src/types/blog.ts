import type { JsonValue } from "@prisma/client/runtime/library"

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  category: string
  tags: string[]
  date: string
  readTime: number
  featured?: boolean
  slug: string
  authorName?: string
  authorImage?: string
  content?: JsonValue
}
