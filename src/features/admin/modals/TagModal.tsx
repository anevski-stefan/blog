import React, { useState, useEffect } from "react"
import { X, Tag as TagIcon, Loader2 } from "lucide-react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { createTag } from "@/features/admin/actions/taxonomy"

interface TagModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (msg: string) => void
}

export function TagModal({ isOpen, onClose, onSave }: TagModalProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [isManualSlug, setIsManualSlug] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!isManualSlug && name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      )
    }
  }, [name, isManualSlug])

  if (!isOpen) return null

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required")
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const result = await createTag({ name, slug })
      if (result.success) {
        onSave("Tag created successfully!")
        setName("")
        setSlug("")
      } else {
        setError(result.error || "Failed to create tag")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

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
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <Input
              label="Tag Name"
              placeholder="e.g. Next.js"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              error={error}
            />
            <Input
              label="Slug"
              placeholder="e.g. next-js"
              value={slug}
              onChange={e => {
                setSlug(e.target.value)
                setIsManualSlug(true)
              }}
            />
            {error && <p className="text-xs text-[#ef4444] mt-1">{error}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Tag"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
