"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { Prisma } from "@/generated/prisma/client"

function parseJsonValue(value: string): Prisma.InputJsonValue {
  try {
    const parsed = JSON.parse(value) as unknown
    if (parsed === null) return value as Prisma.InputJsonValue
    return parsed as Prisma.InputJsonValue
  } catch {
    return value as Prisma.InputJsonValue
  }
}

export async function saveDraft(data: {
  id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string | null
  category: string
  tags: string[]
  isFeatured: boolean
  publishDate: string
}) {
  await requireAdmin()

  const {
    id,
    title,
    slug,
    content,
    excerpt,
    coverImage,
    category,
    tags,
    isFeatured,
    publishDate,
  } = data
  const contentJson = content ? parseJsonValue(content) : Prisma.DbNull

  try {
    if (id) {
      const draft = await prisma.draft.update({
        where: { id },
        data: {
          title,
          slug,
          content: contentJson,
          excerpt,
          coverImage,
          category,
          tags: tags.join(","),
          isFeatured,
          publishDate,
        },
      })
      revalidatePath("/admin/dashboard")
      return { success: true, draftId: draft.id }
    } else {
      const draft = await prisma.draft.create({
        data: {
          title,
          slug,
          content: contentJson,
          excerpt,
          coverImage,
          category,
          tags: tags.join(","),
          isFeatured,
          publishDate,
        },
      })
      revalidatePath("/admin/dashboard")
      return { success: true, draftId: draft.id }
    }
  } catch (error) {
    console.error("Failed to save draft:", error)
    return { error: "Failed to save draft to database." }
  }
}
