"use client"

import React from "react"
import { X, Trash2, Edit } from "lucide-react"
import Image from "next/image"
import { MediaItem } from "@/types/admin"
import { Button } from "../ui/Button"

interface MediaDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  item: MediaItem | null
}

export function MediaDetailsModal({
  isOpen,
  onClose,
  item,
}: MediaDetailsModalProps) {
  if (!isOpen || !item) return null

  const details = [
    { label: "File Name", value: item.name },
    { label: "File Size", value: item.size },
    { label: "Dimensions", value: item.dimensions },
    { label: "Uploaded At", value: item.uploadedAt },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#161616] rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-xl font-semibold text-white">Media Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[#888888] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="aspect-square bg-[#0a0a0a] rounded-xl overflow-hidden relative ring-1 ring-white/5">
            <Image
              src={item.url}
              alt={item.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              {details.map((detail, i) => (
                <div key={i}>
                  <label className="block text-[10px] text-[#888888] uppercase tracking-[0.2em] font-bold mb-1">
                    {detail.label}
                  </label>
                  <p className="font-medium text-white break-all">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-8 mt-auto border-t border-white/5 flex gap-3">
              <Button variant="secondary" icon={Edit} className="flex-1">
                Edit Metadata
              </Button>
              <Button variant="danger" icon={Trash2} className="px-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
