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
}: CategoriesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-white">
            Categories
          </h2>
          <p className="text-sm text-[#888888]">Organize your content</p>
        </div>
        <Button onClick={() => setShowCategoryModal(true)} icon={Plus}>
          Add Category
        </Button>
      </div>

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
    </div>
  )
}
