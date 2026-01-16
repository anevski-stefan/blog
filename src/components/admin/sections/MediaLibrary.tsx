"use client"

import React from "react"
import Image from "next/image"
import {
  Image as ImageIcon,
  Grid as GridIcon,
  List,
  Upload,
} from "lucide-react"
import { MediaLibraryProps } from "@/types/admin"
import { Button } from "../ui/Button"

export function MediaLibrary({
  mediaItems,
  mediaView,
  setMediaView,
  setSelectedMediaItem,
  setShowMediaModal,
}: MediaLibraryProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-semibold text-white">
            Media Library
          </h2>
          <p className="text-sm text-[#888888]">Manage your images and files</p>
        </div>
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

      <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#5865F2]/50 transition-colors cursor-pointer group">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#5865F2]/10 transition-colors">
          <ImageIcon className="w-6 h-6 text-[#888888] group-hover:text-[#5865F2] transition-colors" />
        </div>
        <p className="text-[#888888] mb-2">
          Drag & drop images here, or{" "}
          <span className="text-[#5865F2]">browse</span>
        </p>
        <p className="text-xs text-[#888888]/70">
          Supports: JPG, PNG, GIF, WebP (max 10MB each)
        </p>
      </div>

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
    </div>
  )
}
