"use server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

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
    console.error("Failed to fetch notifications:", error)
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
    console.error("Failed to mark notifications as read:", error)
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
    console.error("Failed to mark notification as read:", error)
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
    console.error("Failed to check unread status:", error)
    return { success: false, hasUnread: false }
  }
}
