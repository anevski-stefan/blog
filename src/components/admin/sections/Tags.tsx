"use client"

import React from "react"
import { Plus, X } from "lucide-react"
import { TagsProps } from "@/types/admin"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"

export function Tags({ tags, setShowTagModal, onDelete }: TagsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => setShowTagModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Tag
        </Button>
      </div>

      {tags.length > 0 ? (
        <Card>
          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg group hover:border-[#5865F2]/30 transition-colors"
              >
                <span className="text-sm text-white">{tag.name}</span>
                <span className="text-xs text-[#888888]">({tag.count})</span>
                <button
                  onClick={() => onDelete?.(tag.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#ef4444] transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="text-center py-12 px-6 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed">
          <p className="text-[#888888] text-sm italic">
            No tags created yet. Start by adding your first tag!
          </p>
        </div>
      )}
    </div>
  )
}
