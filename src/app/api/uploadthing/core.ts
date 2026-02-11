import { createUploadthing, type FileRouter } from "uploadthing/next"
import { isAdmin } from "@/features/admin/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const admin = await isAdmin()
      if (!admin) throw new Error("Unauthorized")
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
