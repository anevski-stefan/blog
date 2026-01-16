"use client"

import React from "react"
import { Plus, X } from "lucide-react"
import { TagsProps } from "@/types/admin"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"

export function Tags({ tags, setShowTagModal }: TagsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-white">
            Tags
          </h2>
          <p className="text-sm text-[#888888]">Manage post tags</p>
        </div>
        <Button onClick={() => setShowTagModal(true)} icon={Plus}>
          Add Tag
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          {tags.map(tag => (
            <div
              key={tag.id}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg group hover:border-[#5865F2]/30 transition-colors"
            >
              <span className="text-sm text-white">{tag.name}</span>
              <span className="text-xs text-[#888888]">({tag.count})</span>
              <button className="opacity-0 group-hover:opacity-100 text-[#ef4444] transition-opacity">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
