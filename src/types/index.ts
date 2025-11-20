export interface Post {
  id: string
  title: string
  slug: string
  content: unknown
  excerpt: string | null
  coverImage: string | null
  published: boolean
  featured: boolean
  views: number
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  authorId: string
  authorName: string
  categories?: string[] // Array of category IDs
  tags?: string[] // Array of tag IDs
} 