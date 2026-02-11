"use server"

import { UTApi } from "uploadthing/server"
import { MediaItem } from "@/types/admin"
import { requireAdmin } from "@/lib/auth"
import { createLogger } from "@/lib/logger"

const logger = createLogger("Actions:Media")

export async function getMediaItems(): Promise<{
  success: boolean
  data?: MediaItem[]
  error?: string
}> {
  try {
    await requireAdmin()
    const utapi = new UTApi()
    const { files } = await utapi.listFiles({ limit: 50 })

    const mediaItems = files.map(file => ({
      id: file.key,
      url: `https://utfs.io/f/${file.key}`,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      dimensions: "N/A",
      uploadedAt: new Date(file.uploadedAt).toLocaleDateString(),
    }))

    return { success: true, data: mediaItems }
  } catch (error) {
    logger.error("Failed to fetch media items", error)
    return { success: false, error: "Failed to fetch media items" }
  }
}
