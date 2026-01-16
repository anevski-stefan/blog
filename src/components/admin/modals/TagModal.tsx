"use client"

import React from "react"
import { X, Tag as TagIcon } from "lucide-react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"

interface TagModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (msg: string) => void
}

export function TagModal({ isOpen, onClose, onSave }: TagModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5865F2]/20 rounded-lg flex items-center justify-center">
              <TagIcon className="w-5 h-5 text-[#5865F2]" />
            </div>
            <h3 className="text-xl font-semibold text-white">New Tag</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[#888888] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <Input label="Tag Name" placeholder="e.g. Next.js" autoFocus />
            <Input label="Slug" placeholder="e.g. next-js" />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave("Tag created successfully!")}>
              Create Tag
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
