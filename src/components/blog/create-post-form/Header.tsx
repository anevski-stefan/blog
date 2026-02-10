"use client"

import Link from "next/link"
import { ArrowLeft, Check, Eye, Save, Send, X } from "lucide-react"

export function CreatePostHeader(props: {
  initialPost: boolean
  status: "draft" | "published"
  saveStatus: "saving" | "saved" | "idle"
  showPreview: boolean
  onTogglePreview: () => void
  onPublish: () => void
  onSaveDraft: () => void
}) {
  const {
    initialPost,
    status,
    saveStatus,
    showPreview,
    onTogglePreview,
    onPublish,
    onSaveDraft,
  } = props

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
      <div className="px-6 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-sm">Back to Blog</span>
          </Link>
          <div className="w-px h-6 bg-white/10 hidden sm:block" />
          <h1 className="font-heading font-semibold text-lg tracking-tight">
            {initialPost ? "Edit Post" : "Create New Post"}
          </h1>
        </div>

        <div
          className={`flex items-center gap-2 text-sm text-[#888888] transition-opacity duration-300 ${
            saveStatus === "idle" ? "opacity-0" : "opacity-100"
          }`}
        >
          {saveStatus === "saving" ? (
            <>
              <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-[#22c55e]" />
              <span>Draft saved</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePreview}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#888888] hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-all"
          >
            {showPreview ? (
              <X className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {showPreview ? "Edit" : "Preview"}
            </span>
          </button>

          <button
            onClick={() =>
              status === "published" || initialPost
                ? onPublish()
                : onSaveDraft()
            }
            disabled={saveStatus === "saving"}
            className="flex items-center gap-2 px-5 py-2 text-sm bg-[#5865F2] hover:bg-[#5865F2]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg shadow-[#5865F2]/20"
          >
            {status === "published" ? (
              <>
                <Send className="w-4 h-4" />
                <span>{initialPost ? "Update Post" : "Publish"}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
