import { PrismaClient } from "@/generated/prisma"
import "server-only"

declare global {
  var prisma: PrismaClient | undefined
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const needsRefresh =
  globalForPrisma.prisma && !("notification" in globalForPrisma.prisma)

export const prisma =
  globalForPrisma.prisma && !needsRefresh
    ? globalForPrisma.prisma
    : new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
      })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
