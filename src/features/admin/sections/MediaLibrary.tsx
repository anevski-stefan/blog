"use client"

import React from "react"
import Image from "next/image"
import { Grid as GridIcon, List, Upload } from "lucide-react"
import { MediaLibraryProps, MediaItem } from "@/features/admin/types/admin"
import { Button } from "../ui/Button"
import { UploadDropzone } from "@/features/admin/lib/uploadthing"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getMediaItems } from "@/features/admin/actions/media"

export function MediaLibrary({
  mediaItems: initialMediaItems,
  mediaView,
  setMediaView,
  setSelectedMediaItem,
  setShowMediaModal,
}: MediaLibraryProps) {
  const router = useRouter()
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMedia = async () => {
    setIsLoading(true)
    const result = await getMediaItems()
    if (result.success && result.data) {
      setMediaItems(result.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={mediaView === "grid" ? GridIcon : List}
            onClick={() => setMediaView(mediaView === "grid" ? "list" : "grid")}
            className="bg-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2]/30"
          />
          <Button icon={Upload}>Upload</Button>
        </div>
      </div>

      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={() => {
          fetchMedia()
          router.refresh()
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`)
        }}
        appearance={{
          container:
            "border-2 border-dashed border-white/10 rounded-xl p-0 bg-transparent hover:border-[#5865F2]/50 transition-colors cursor-pointer flex flex-col justify-center items-center min-h-[200px]",
          label: "text-[#888888] hover:text-[#5865F2] transition-colors mt-2",
          allowedContent: "text-xs text-[#888888]/70",
          button:
            "bg-[#5865F2] text-white hover:bg-[#5865F2]/90 ut-uploading:cursor-not-allowed text-sm px-4 py-1 mt-2",
        }}
      />

      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaItems.map(item => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-[#111111] cursor-pointer ring-1 ring-white/5 hover:ring-[#5865F2]/50 transition-all"
              onClick={() => {
                setSelectedMediaItem(item)
                setShowMediaModal(true)
              }}
            >
              <Image
                src={item.url}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="w-full">
                  <p className="text-xs font-medium truncate text-white">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-[#888888]">{item.size}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#5865F2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#888888] text-sm">Loading media...</p>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-[#888888] text-sm italic">
            Your media library is empty.
          </p>
        </div>
      )}
    </div>
  )
}
