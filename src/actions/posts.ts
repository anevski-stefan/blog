"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import type { PostData } from "@/types/posts"
import type { Prisma } from "@/generated/prisma/client"

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
}

/**
 * Get author name (static for simple auth)
 */
function getAuthorName(): string {
  return "Admin"
}

/**
 * Convert content string to Prisma JSON format
 */
function parseContent(content: string): Prisma.InputJsonValue {
  try {
    return JSON.parse(content) as Prisma.InputJsonValue
  } catch {
    return content as Prisma.InputJsonValue
  }
}

/**
 * Build update data object from partial PostData
 * Functional approach - computes values first, then composes object
 */
function buildUpdateData(
  data: Partial<PostData>
): Partial<Prisma.PostUpdateInput> {
  const slug = data.slug || (data.title ? generateSlug(data.title) : undefined)
  const content = data.content ? parseContent(data.content) : undefined
  const categories = data.categoryIds?.length
    ? { set: data.categoryIds.map(id => ({ id })) }
    : undefined
  const tags = data.tagIds?.length
    ? { set: data.tagIds.map(id => ({ id })) }
    : undefined

  return {
    ...(data.title && { title: data.title }),
    ...(content && { content }),
    ...(data.excerpt !== undefined && { excerpt: data.excerpt ?? null }),
    ...(data.coverImage !== undefined && {
      coverImage: data.coverImage ?? null,
    }),
    ...(slug && { slug }),
    ...(categories && { categories }),
    ...(tags && { tags }),
  }
}

/**
 * Create a new post
 */
export async function createPost(data: PostData) {
  try {
    await requireAdmin()
    if (!data.title) throw new Error("Title is required")
    if (!data.content) throw new Error("Content is required")

    const authorName = getAuthorName()

    await prisma.post.create({
      data: {
        title: data.title,
        content: parseContent(data.content),
        excerpt: data.excerpt ?? null,
        coverImage: data.coverImage ?? null,
        slug: data.slug ?? generateSlug(data.title),
        authorId: "admin",
        authorName,
        published: false,
        ...(data.categoryIds?.length && {
          categories: { connect: data.categoryIds.map(id => ({ id })) },
        }),
        ...(data.tagIds?.length && {
          tags: { connect: data.tagIds.map(id => ({ id })) },
        }),
      },
    })

    revalidatePath("/admin/posts")
    revalidatePath("/blog")
  } catch (error) {
    console.error("Failed to create post:", error)
    throw new Error("Failed to create post. Please try again.")
  }
  redirect("/admin/posts")
}

/**
 * Update an existing post
 */
export async function updatePost(postId: string, data: Partial<PostData>) {
  try {
    await requireAdmin()
    if (data.title && !data.title.trim())
      throw new Error("Title cannot be empty")

    const authorName = getAuthorName()

    await prisma.post.update({
      where: { id: postId },
      data: {
        ...buildUpdateData(data),
        authorName,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/admin/posts")
    revalidatePath(`/blog/${postId}`)
    revalidatePath("/blog")
  } catch (error) {
    console.error("Failed to update post:", error)
    throw new Error("Failed to update post. Please try again.")
  }
  redirect("/admin/posts")
}

/**
 * Toggle post publish status
 */
export async function togglePublish(postId: string, publish: boolean) {
  try {
    await requireAdmin()

    await prisma.post.update({
      where: { id: postId },
      data: {
        published: publish,
        publishedAt: publish ? new Date() : null,
      },
    })

    revalidatePath("/admin/posts")
    revalidatePath(`/blog/${postId}`)
    revalidatePath("/blog")
  } catch (error) {
    console.error("Failed to update post status:", error)
    throw new Error("Failed to update post status. Please try again.")
  }
}
