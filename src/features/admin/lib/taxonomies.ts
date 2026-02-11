import { prisma } from "@/lib/db"

export async function getAvailableCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  })
}

export async function getAvailableTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
  })
}
