"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

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
  const contentJson = content ? JSON.parse(content) : null

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

export async function deleteDraft(id: string) {
  await requireAdmin()
  try {
    await prisma.draft.delete({ where: { id } })
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete draft:", error)
    return { error: "Failed to delete draft." }
  }
}

export async function getDrafts() {
  await requireAdmin()
  try {
    return prisma.draft.findMany({
      orderBy: { updatedAt: "desc" },
    })
  } catch (error) {
    console.error("Failed to fetch drafts:", error)
    return []
  }
}
