"use server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/features/admin/lib/auth"
import { revalidatePath } from "next/cache"
import { createLogger } from "@/lib/logger"

const logger = createLogger("Actions:Notifications")

export async function getNotifications() {
  try {
    await requireAdmin()
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    })
    return { success: true, data: notifications }
  } catch (error) {
    logger.error("Failed to fetch notifications", error)
    return { success: false, error: "Failed to fetch notifications" }
  }
}

export async function markAllAsRead() {
  try {
    await requireAdmin()
    await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    })
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    logger.error("Failed to mark all notifications as read", error)
    return { success: false, error: "Failed to update notifications" }
  }
}

export async function markAsRead(id: string) {
  try {
    await requireAdmin()
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    })
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    logger.error("Failed to mark notification as read", error, { id })
    return { success: false, error: "Failed to update notification" }
  }
}

export async function getUnreadStatus() {
  try {
    await requireAdmin()
    const count = await prisma.notification.count({
      where: { read: false },
    })
    return { success: true, hasUnread: count > 0 }
  } catch (error) {
    logger.error("Failed to check unread status", error)
    return { success: false, hasUnread: false }
  }
}
