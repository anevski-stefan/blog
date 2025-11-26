"use server"

import { revalidatePath } from "next/cache"
import { redirect, unstable_rethrow } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createLogger } from "@/lib/logger"
import type { PostData } from "@/types/posts"
import type { Prisma } from "@/generated/prisma/client"
import { postSchema } from "@/lib/validations/post"

const logger = createLogger("PostActions")

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

    const validatedFields = postSchema.safeParse(data)

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.errors[0].message)
    }

    const {
      title,
      content,
      excerpt,
      coverImage,
      slug: providedSlug,
      categoryIds,
      tagIds,
    } = validatedFields.data

    const authorName = getAuthorName()
    const slug = providedSlug ?? generateSlug(title)

    logger.info("Creating new post", { title: data.title, slug })

    await prisma.post.create({
      data: {
        title,
        content: parseContent(content),
        excerpt: excerpt ?? null,
        coverImage: coverImage ?? null,
        slug,
        authorId: "admin",
        authorName,
        published: false,
        ...(categoryIds?.length && {
          categories: { connect: categoryIds.map(id => ({ id })) },
        }),
        ...(tagIds?.length && {
          tags: { connect: tagIds.map(id => ({ id })) },
        }),
      },
    })

    logger.info("Post created successfully", { slug })

    revalidatePath("/admin/posts")
    revalidatePath("/blog")
  } catch (error) {
    unstable_rethrow(error)
    logger.error("Failed to create post", error, { title: data.title })
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

    const validatedFields = postSchema.partial().safeParse(data)

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.errors[0].message)
    }

    if (data.title && !data.title.trim())
      throw new Error("Title cannot be empty")

    const authorName = getAuthorName()

    logger.info("Updating post", { postId, fields: Object.keys(data) })

    await prisma.post.update({
      where: { id: postId },
      data: {
        ...buildUpdateData(data),
        authorName,
        updatedAt: new Date(),
      },
    })

    logger.info("Post updated successfully", { postId })

    revalidatePath("/admin/posts")
    revalidatePath(`/blog/${postId}`)
    revalidatePath("/blog")
  } catch (error) {
    unstable_rethrow(error)
    logger.error("Failed to update post", error, { postId })
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

    logger.info("Toggling post publish status", { postId, publish })

    await prisma.post.update({
      where: { id: postId },
      data: {
        published: publish,
        publishedAt: publish ? new Date() : null,
      },
    })

    logger.info("Post publish status updated", { postId, published: publish })

    revalidatePath("/admin/posts")
    revalidatePath(`/blog/${postId}`)
    revalidatePath("/blog")
  } catch (error) {
    unstable_rethrow(error)
    logger.error("Failed to update post status", error, { postId, publish })
    throw new Error("Failed to update post status. Please try again.")
  }
}
