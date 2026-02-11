"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { z } from "zod"
import { createLogger } from "@/lib/logger"

const logger = createLogger("Actions:Taxonomy")

const TaxonomySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
})

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
}) {
  await requireAdmin()

  const validatedData = TaxonomySchema.safeParse(data)
  if (!validatedData.success) {
    return {
      error:
        validatedData.error.flatten().fieldErrors.name?.[0] || "Invalid data",
    }
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: validatedData.data.name,
        slug: validatedData.data.slug,
        description: validatedData.data.description,
      },
    })
    revalidatePath("/admin/dashboard")
    return { success: true, category }
  } catch (error) {
    logger.error("Failed to create category", error, {
      slug: validatedData.data.slug,
    })
    return { error: "Failed to create category. Name or slug might be taken." }
  }
}

export async function createTag(data: { name: string; slug: string }) {
  await requireAdmin()

  const validatedData = TaxonomySchema.pick({
    name: true,
    slug: true,
  }).safeParse(data)
  if (!validatedData.success) {
    return {
      error:
        validatedData.error.flatten().fieldErrors.name?.[0] || "Invalid data",
    }
  }

  try {
    const tag = await prisma.tag.create({
      data: {
        name: validatedData.data.name,
        slug: validatedData.data.slug,
      },
    })
    revalidatePath("/admin/dashboard")
    return { success: true, tag }
  } catch (error) {
    logger.error("Failed to create tag", error, {
      slug: validatedData.data.slug,
    })
    return { error: "Failed to create tag. Name or slug might be taken." }
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch {
    return { error: "Failed to delete category" }
  }
}

export async function deleteTag(id: string) {
  await requireAdmin()
  try {
    await prisma.tag.delete({ where: { id } })
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch {
    return { error: "Failed to delete tag" }
  }
}
