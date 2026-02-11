"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db"
import { requireAdmin, getCurrentUser } from "@/lib/auth"
import { z } from "zod"
import type { Prisma } from "@prisma/client"
import { createLogger } from "@/lib/logger"

const logger = createLogger("Actions:Blog")

function parseJsonValue(value: string): Prisma.InputJsonValue {
  try {
    const parsed = JSON.parse(value) as unknown
    if (parsed === null) return value as Prisma.InputJsonValue
    return parsed as Prisma.InputJsonValue
  } catch {
    return value as Prisma.InputJsonValue
  }
}

const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]),
  excerpt: z.string().optional(),
  coverImage: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  featured: z.string().optional(),
  publishDate: z.string().optional(),
  readingTime: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  draftId: z.string().optional(),
})

export async function createPost(formData: FormData) {
  await requireAdmin()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    status: formData.get("status"),
    excerpt: formData.get("excerpt"),
    coverImage: formData.get("coverImage"),
    category: formData.get("category"),
    tags: formData.get("tags"),
    featured: formData.get("featured"),
    publishDate: formData.get("publishDate"),
    readingTime: formData.get("readingTime"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    draftId: formData.get("draftId"),
  }

  const validatedData = CreatePostSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      error: "Invalid input data",
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  const {
    title,
    slug,
    content,
    status,
    excerpt,
    coverImage,
    category,
    tags,
    featured,
    publishDate,
    readingTime,
    seoTitle,
    seoDescription,
    draftId,
  } = validatedData.data
  const contentJson = parseJsonValue(content)

  const existingPost = await prisma.post.findUnique({
    where: { slug },
  })

  if (existingPost) {
    return {
      error: "Post slug is already taken",
    }
  }

  const tagList = tags
    ? tags
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0)
    : []

  const tagsToConnect: { id: string }[] = []
  const tagsToCreate: { name: string; slug: string }[] = []

  for (const tagName of tagList) {
    const tagSlug = tagName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: { equals: tagName, mode: "insensitive" } },
          { slug: tagSlug },
        ],
      },
    })

    if (existingTag) {
      tagsToConnect.push({ id: existingTag.id })
    } else {
      tagsToCreate.push({ name: tagName, slug: tagSlug })
    }
  }

  const categoryslug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  let categoryToConnect: { id: string } | undefined
  let categoryToCreate: { name: string; slug: string } | undefined

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { name: { equals: category, mode: "insensitive" } },
        { slug: categoryslug },
      ],
    },
  })

  if (existingCategory) {
    categoryToConnect = { id: existingCategory.id }
  } else {
    categoryToCreate = { name: category, slug: categoryslug }
  }

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        content: contentJson,
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        published: status === "published",
        featured: featured === "true",
        authorId: user.id || "admin",
        authorName:
          (user.user_metadata?.full_name as string) || "Stefan Anevski",
        authorImage:
          (user.user_metadata?.avatar_url as string) ||
          (user.user_metadata?.picture as string) ||
          null,
        publishedAt:
          status === "published"
            ? publishDate
              ? new Date(publishDate)
              : new Date()
            : null,
        readingTime: readingTime ? parseInt(readingTime) : 0,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        categories: {
          connect: categoryToConnect ? [categoryToConnect] : undefined,
          create: categoryToCreate ? [categoryToCreate] : undefined,
        },
        tags: {
          connect: tagsToConnect,
          create: tagsToCreate,
        },
      },
    })

    if (draftId) {
      await prisma.draft
        .delete({
          where: { id: draftId },
        })
        .catch(e => logger.error("Failed to delete draft after publishing", e))
    }
  } catch (error) {
    logger.error("Failed to create post", error)
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create post. Slug might be taken.",
    }
  }

  revalidatePath("/blog")
  return {
    success: true,
    slug,
  }
}

export async function updatePost(formData: FormData) {
  await requireAdmin()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const postId = formData.get("postId") as string
  if (!postId) {
    return { error: "Post ID is required for update" }
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    status: formData.get("status"),
    excerpt: formData.get("excerpt"),
    coverImage: formData.get("coverImage"),
    category: formData.get("category"),
    tags: formData.get("tags"),
    featured: formData.get("featured"),
    publishDate: formData.get("publishDate"),
    readingTime: formData.get("readingTime"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  }

  const validatedData = CreatePostSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      error: "Invalid input data",
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  const {
    title,
    slug,
    content,
    status,
    excerpt,
    coverImage,
    category,
    tags,
    featured,
    publishDate,
    readingTime,
    seoTitle,
    seoDescription,
  } = validatedData.data
  const contentJson = parseJsonValue(content)

  const existingPost = await prisma.post.findFirst({
    where: {
      slug,
      NOT: { id: postId },
    },
  })

  if (existingPost) {
    return {
      error: "Post slug is already taken",
    }
  }

  const tagList = tags
    ? tags
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0)
    : []

  const tagsToConnect: { id: string }[] = []
  const tagsToCreate: { name: string; slug: string }[] = []

  for (const tagName of tagList) {
    const tagSlug = tagName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: { equals: tagName, mode: "insensitive" } },
          { slug: tagSlug },
        ],
      },
    })

    if (existingTag) {
      tagsToConnect.push({ id: existingTag.id })
    } else {
      tagsToCreate.push({ name: tagName, slug: tagSlug })
    }
  }

  const categoryslug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  let categoryToConnect: { id: string } | undefined
  let categoryToCreate: { name: string; slug: string } | undefined

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { name: { equals: category, mode: "insensitive" } },
        { slug: categoryslug },
      ],
    },
  })

  if (existingCategory) {
    categoryToConnect = { id: existingCategory.id }
  } else {
    categoryToCreate = { name: category, slug: categoryslug }
  }

  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug,
        content: contentJson,
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        published: status === "published",
        featured: featured === "true",
        publishedAt:
          status === "published"
            ? publishDate
              ? new Date(publishDate)
              : new Date()
            : null,
        readingTime: readingTime ? parseInt(readingTime) : 0,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        categories: {
          set: [],
          connect: categoryToConnect ? [categoryToConnect] : undefined,
          create: categoryToCreate ? [categoryToCreate] : undefined,
        },
        tags: {
          set: [],
          connect: tagsToConnect,
          create: tagsToCreate,
        },
      },
    })
  } catch (error) {
    logger.error("Failed to update post", error, { postId, slug })
    return {
      error: error instanceof Error ? error.message : "Failed to update post.",
    }
  }

  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
  return {
    success: true,
    slug,
  }
}
