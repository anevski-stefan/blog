import { prisma } from "@/lib/db"

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      categories: true,
      tags: true,
    },
  })
}
