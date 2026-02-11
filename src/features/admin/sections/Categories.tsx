"use client"

import React from "react"
import { FolderOpen, Plus, Edit, Trash2 } from "lucide-react"
import { CategoriesProps } from "@/types/admin"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"

export function Categories({
  categories,
  setShowCategoryModal,
  onDelete,
}: CategoriesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => setShowCategoryModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Card
              key={cat.id}
              className="hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#5865F2]/20 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-[#5865F2]" />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    className="!p-1.5"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    className="!p-1.5 text-[#ef4444]"
                    onClick={() => onDelete?.(cat.id)}
                  />
                </div>
              </div>
              <h4 className="font-heading font-semibold mb-1 text-white">
                {cat.name}
              </h4>
              <Badge variant="neutral">{cat.count} posts</Badge>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed">
          <p className="text-[#888888] text-sm italic">
            No categories found. Create one to organize your posts!
          </p>
        </div>
      )}
    </div>
  )
}
