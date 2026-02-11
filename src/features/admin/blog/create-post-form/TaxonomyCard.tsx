"use client"

import React, { useMemo, useState } from "react"
import { FolderOpen, X } from "lucide-react"

export function TaxonomyCard(props: {
  categories: { name: string; slug: string }[]
  category: string
  onChangeCategory: (value: string) => void
  availableTags: { name: string; slug: string }[]
  tags: string[]
  onChangeTags: (value: string[]) => void
}) {
  const {
    categories,
    category,
    onChangeCategory,
    availableTags,
    tags,
    onChangeTags,
  } = props

  const [tagInput, setTagInput] = useState("")
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)

  const filteredTags = useMemo(() => {
    return availableTags
      .filter(
        t =>
          t.name.toLowerCase().includes(tagInput.toLowerCase()) &&
          !tags.includes(t.name)
      )
      .slice(0, 5)
  }, [availableTags, tagInput, tags])

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        onChangeTags([...tags, newTag])
        setTagInput("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChangeTags(tags.filter(t => t !== tagToRemove))
  }

  return (
    <div className="bg-[#111111]/40 border border-white/5 rounded-xl p-5 space-y-4">
      <h3 className="font-heading font-semibold flex items-center gap-2">
        <FolderOpen className="w-4 h-4 text-[#5865F2]" />
        Taxonomy
      </h3>

      <div>
        <label className="block text-xs text-[#888888] mb-2">Category</label>
        <select
          value={category}
          onChange={e => onChangeCategory(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-[#5865F2] outline-none appearance-none"
        >
          <option value="">Select category...</option>
          {categories.map(cat => (
            <option key={cat.slug} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-[#888888] mb-2">Tags</label>
        <div className="relative">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2 flex flex-wrap gap-2 items-center min-h-[42px] focus-within:border-[#5865F2] transition-colors">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#5865F2]/20 text-[#5865F2] text-[10px] font-medium rounded hover:bg-[#5865F2]/30 transition-colors"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-white transition-colors"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={e => {
                setTagInput(e.target.value)
                setShowTagSuggestions(true)
              }}
              onFocus={() => setShowTagSuggestions(true)}
              onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
              onKeyDown={handleTagAdd}
              placeholder={tags.length === 0 ? "Add tags..." : ""}
              className="flex-1 bg-transparent text-xs outline-none min-w-[80px] py-1"
            />
          </div>
          {showTagSuggestions && tagInput && filteredTags.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#111111] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {filteredTags.map(tag => (
                <button
                  key={tag.slug}
                  onMouseDown={e => {
                    e.preventDefault()
                    onChangeTags([...tags, tag.name])
                    setTagInput("")
                    setShowTagSuggestions(false)
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#888888] hover:bg-[#5865F2]/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                  type="button"
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
