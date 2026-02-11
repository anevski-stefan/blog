"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { UploadDropzone } from "@/features/admin/lib/uploadthing"

export function FeaturedImageField(props: {
  featuredImage: string | null
  onChangeFeaturedImage: (value: string | null) => void
}) {
  const { featuredImage, onChangeFeaturedImage } = props

  return (
    <div>
      <label className="block text-xs font-mono text-[#888888] uppercase tracking-wider mb-2">
        Featured Image
      </label>
      <div
        className={`relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center transition-all ${featuredImage ? "border-none p-0 overflow-hidden" : "hover:border-[#5865F2]/50 hover:bg-[#5865F2]/5"}`}
      >
        {featuredImage ? (
          <div className="relative group">
            <Image
              src={featuredImage}
              alt="Featured"
              width={800}
              height={400}
              className="w-full h-auto rounded-xl object-cover"
              unoptimized
            />
            <button
              onClick={() => onChangeFeaturedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-[#ef4444] text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={res => {
              if (res?.[0]) {
                onChangeFeaturedImage(res[0].url)
              }
            }}
            onUploadError={(error: Error) => {
              alert(`Upload failed: ${error.message}`)
            }}
            appearance={{
              container: "border-none bg-transparent h-auto p-0",
              uploadIcon: "text-[#5865F2]",
              label: "text-[#888888] hover:text-white transition-colors",
              allowedContent: "text-[#888888]/60",
              button:
                "bg-[#5865F2] hover:bg-[#5865F2]/90 transition-all px-6 py-2 shadow-lg shadow-[#5865F2]/20 ut-ready:bg-[#5865F2] ut-uploading:bg-[#5865F2]/50",
            }}
          />
        )}
      </div>
    </div>
  )
}
