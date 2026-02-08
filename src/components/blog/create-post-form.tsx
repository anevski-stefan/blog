"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  X,
  Check,
  Twitter,
  Linkedin,
  Github,
  FolderOpen,
  Settings,
} from "lucide-react"
import { createPost, updatePost } from "@/actions/blog"
import { saveDraft } from "@/actions/drafts"
import { TiptapEditor } from "@/components/blog/editor"
import { User } from "@supabase/supabase-js"
import { UploadDropzone } from "@/lib/uploadthing"
import { calculateReadingTime } from "@/lib/utils"
import { PostWithRelations } from "@/types/posts"

interface CreatePostFormProps {
  user?: User | null
  categories?: { name: string; slug: string }[]
  availableTags?: { name: string; slug: string }[]
  initialDraftId?: string
  initialPost?: PostWithRelations
}

export function CreatePostForm({
  user,
  categories = [],
  availableTags = [],
  initialDraftId,
  initialPost,
}: CreatePostFormProps) {
  const router = useRouter()
  const [draftId, setDraftId] = useState<string | undefined>(initialDraftId)

  const [title, setTitle] = useState(initialPost?.title || "")
  const [slug, setSlug] = useState(initialPost?.slug || "")
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "")
  const [content, setContent] = useState<string | object>(
    (initialPost?.content as object) || ""
  )

  const [category, setCategory] = useState(
    initialPost?.categories?.[0]?.name || ""
  )

  const [tags, setTags] = useState<string[]>(
    initialPost?.tags?.map(t => t.name) || []
  )

  const [tagInput, setTagInput] = useState("")
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const filteredTags = availableTags
    .filter(
      t =>
        t.name.toLowerCase().includes(tagInput.toLowerCase()) &&
        !tags.includes(t.name)
    )
    .slice(0, 5)

  const [featuredImage, setFeaturedImage] = useState<string | null>(
    initialPost?.coverImage || null
  )
  const [isFeatured, setIsFeatured] = useState(initialPost?.featured || false)
  const [status, setStatus] = useState<"draft" | "published">(
    initialPost?.published ? "published" : "draft"
  )

  const getInitialDate = () => {
    if (initialPost?.publishedAt) {
      const date = new Date(initialPost.publishedAt)
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      return date.toISOString().slice(0, 16)
    }
    return ""
  }

  const [publishDate, setPublishDate] = useState(getInitialDate())
  const [showPreview, setShowPreview] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "idle">(
    "idle"
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!initialPost) {
      if (!publishDate) {
        const now = new Date()
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
        setPublishDate(now.toISOString().slice(0, 16))
      }

      const saved = localStorage.getItem("blog-draft")
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setDraftId(data.draftId)
          setTitle(data.title || "")
          setSlug(data.slug || "")
          setExcerpt(data.excerpt || "")
          setContent(data.content || "")
          setCategory(data.category || "")
          setTags(data.tags || [])
          setIsFeatured(data.isFeatured || false)
          setStatus(data.status || "draft")
          if (data.featuredImage && data.featuredImage.startsWith("data:")) {
            setFeaturedImage(data.featuredImage)
          }
          if (data.publishDate) setPublishDate(data.publishDate)
        } catch (e) {
          console.error("Failed to load draft", e)
        }
      }
    }
  }, [initialPost, publishDate])

  useGSAP(
    () => {
      gsap.from(".animate-in", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
      })

      gsap.from(".sidebar-animate-in > div", {
        opacity: 0,
        x: 20,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.3,
        ease: "power3.out",
      })
    },
    { scope: containerRef }
  )

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    if (!cursor || !dot) return

    let mouseX = 0,
      mouseY = 0
    let cursorX = 0,
      cursorY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dot) {
        dot.style.left = mouseX + "px"
        dot.style.top = mouseY + "px"
      }
    }

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1
      cursorY += (mouseY - cursorY) * 0.1
      if (cursor) {
        cursor.style.left = cursorX + "px"
        cursor.style.top = cursorY + "px"
      }
      requestAnimationFrame(animateCursor)
    }

    window.addEventListener("mousemove", onMouseMove)
    const animId = requestAnimationFrame(animateCursor)

    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, select"
    )
    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("w-12", "h-12", "border-accent", "bg-accent/10")
        cursor.classList.remove("w-5", "h-5", "border-white/50")
      })
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("w-12", "h-12", "border-accent", "bg-accent/10")
        cursor.classList.add("w-5", "h-5", "border-white/50")
      })
    })

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const triggerAutoSave = useCallback(() => {
    setSaveStatus("saving")
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(() => {
      const data = {
        draftId,
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        isFeatured,
        status,
        publishDate,
        featuredImage,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem("blog-draft", JSON.stringify(data))
      setSaveStatus("saved")

      setTimeout(() => setSaveStatus("idle"), 3000)
    }, 2000)
  }, [
    title,
    slug,
    excerpt,
    content,
    category,
    tags,
    isFeatured,
    status,
    publishDate,
    featuredImage,
    draftId,
  ])

  useEffect(() => {
    triggerAutoSave()
  }, [triggerAutoSave])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleSlugGen = () => {
    setSlug(generateSlug(title))
  }

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag])
        setTagInput("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handleSaveDraft = async () => {
    setSaveStatus("saving")
    try {
      const result = await saveDraft({
        id: draftId,
        title,
        slug,
        content:
          typeof content === "string" ? content : JSON.stringify(content),
        excerpt,
        coverImage: featuredImage,
        category,
        tags,
        isFeatured,
        publishDate,
      })

      if (result.success && result.draftId) {
        setDraftId(result.draftId)
        setSaveStatus("saved")
        const currentDraft = JSON.parse(
          localStorage.getItem("blog-draft") || "{}"
        )
        localStorage.setItem(
          "blog-draft",
          JSON.stringify({ ...currentDraft, draftId: result.draftId })
        )
      } else {
        console.error(result.error)
        setSaveStatus("idle")
      }
    } catch (e) {
      console.error("Failed to save draft:", e)
      setSaveStatus("idle")
    }

    setTimeout(() => setSaveStatus("idle"), 3000)
  }

  const handlePublish = async () => {
    setSaveStatus("saving")
    const formData = new FormData()
    formData.set("title", title)
    formData.set("slug", slug)
    formData.set("excerpt", excerpt)
    formData.set(
      "content",
      typeof content === "string" ? content : JSON.stringify(content)
    )
    formData.set("category", category)
    formData.set("tags", tags.join(","))
    formData.set("coverImage", featuredImage || "")
    formData.set("status", status)
    formData.set("featured", String(isFeatured))
    formData.set("publishDate", publishDate)
    if (draftId) formData.set("draftId", draftId)

    if (draftId) formData.set("draftId", draftId)

    const readingTime = calculateReadingTime(content)
    formData.set("readingTime", String(readingTime))

    formData.set("seoTitle", title)
    formData.set("seoDescription", excerpt)

    let result

    if (initialPost) {
      formData.set("postId", initialPost.id)
      result = await updatePost(formData)
    } else {
      result = await createPost(formData)
    }

    if (result?.error) {
      console.error(result.error)
      alert(`Error: ${result.error}`)
      setSaveStatus("idle")
    } else if (result?.success && result?.slug) {
      localStorage.removeItem("blog-draft")
      router.push(`/blog/${result.slug}`)
    }
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-[#5865F2]/30 selection:text-[#5865F2]"
    >
      <div
        ref={cursorRef}
        className="fixed w-5 h-5 border border-white/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out hidden md:block"
      />
      <div
        ref={cursorDotRef}
        className="fixed w-1.5 h-1.5 bg-[#5865F2] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />

      <div
        className="fixed inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(#5865F2 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

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
            className={`flex items-center gap-2 text-sm text-[#888888] transition-opacity duration-300 ${saveStatus === "idle" ? "opacity-0" : "opacity-100"}`}
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
              onClick={() => setShowPreview(!showPreview)}
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
                  ? handlePublish()
                  : handleSaveDraft()
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

      <main className="pt-24 pb-12 flex relative">
        <div
          className={`flex-1 transition-all duration-500 ${showPreview ? "hidden" : "block"}`}
        >
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="space-y-8 animate-in">
              <div>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-transparent text-3xl md:text-5xl font-heading font-bold placeholder:text-white/10 focus:outline-none border-none py-2"
                  maxLength={100}
                />
                <div className="flex justify-between mt-2 text-xs text-[#888888]">
                  <span>A compelling title helps readers find your post</span>
                  <span
                    className={`${title.length > 90 ? "text-[#ef4444]" : ""}`}
                  >
                    {title.length}/100
                  </span>
                </div>
              </div>

              <div className="group">
                <div className="flex items-center gap-2 text-sm text-[#888888] font-mono">
                  <span className="text-[#5865F2]">{">"}</span>
                  <span>/blog/</span>
                  <input
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    placeholder="post-slug"
                    className="bg-transparent border-b border-white/10 focus:border-[#5865F2] outline-none min-w-[200px] transition-colors"
                  />
                  <button
                    onClick={handleSlugGen}
                    className="px-2 py-1 text-[10px] uppercase tracking-wider border border-white/10 rounded hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#888888] uppercase tracking-wider mb-2">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Write a brief description..."
                  rows={2}
                  className="w-full bg-[#111111]/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] outline-none transition-all resize-none"
                  maxLength={300}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#888888] uppercase tracking-wider mb-2">
                  Featured Image
                </label>
                <div
                  className={`relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center transition-all ${featuredImage ? "border-none p-0 overflow-hidden" : "hover:border-[#5865F2]/50 hover:bg-[#5865F2]/5"}`}
                >
                  {featuredImage ? (
                    <div className="relative group">
                      <Image
                        src={featuredImage}
                        alt="Featured"
                        width={800}
                        height={400}
                        className="w-full h-auto rounded-xl object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() => setFeaturedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-[#ef4444] text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={res => {
                        if (res?.[0]) {
                          setFeaturedImage(res[0].url)
                        }
                      }}
                      onUploadError={(error: Error) => {
                        alert(`Upload failed: ${error.message}`)
                      }}
                      appearance={{
                        container: "border-none bg-transparent h-auto p-0",
                        uploadIcon: "text-[#5865F2]",
                        label:
                          "text-[#888888] hover:text-white transition-colors",
                        allowedContent: "text-[#888888]/60",
                        button:
                          "bg-[#5865F2] hover:bg-[#5865F2]/90 transition-all px-6 py-2 shadow-lg shadow-[#5865F2]/20 ut-ready:bg-[#5865F2] ut-uploading:bg-[#5865F2]/50",
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#888888] uppercase tracking-wider mb-2">
                  Content
                </label>
                <div className="border border-white/10 rounded-xl overflow-hidden bg-[#111111]/30 focus-within:border-[#5865F2] focus-within:ring-1 focus-within:ring-[#5865F2] transition-all">
                  <TiptapEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write your story..."
                    className="min-h-[600px] bg-transparent text-white prose-invert border-none shadow-none rounded-none focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside
          className={`hidden lg:block w-80 border-l border-white/5 bg-[#111111]/20 p-6 sidebar-animate-in ${showPreview ? "!hidden" : ""}`}
        >
          <div className="sticky top-24 space-y-6">
            <div className="bg-[#111111]/40 border border-white/5 rounded-xl p-5 space-y-4">
              <h3 className="font-heading font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#5865F2]" />
                Publish
              </h3>

              <div>
                <label className="block text-xs text-[#888888] mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-lg">
                  {(["draft", "published"] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`text-xs py-1.5 rounded capitalize transition-all ${status === s ? "bg-[#5865F2] text-white shadow-lg" : "text-[#888888] hover:text-white"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#888888] mb-2">
                  Publish Date
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={e => setPublishDate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#5865F2] outline-none appearance-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-sm">Featured Post</span>
                <button
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${isFeatured ? "bg-[#5865F2]" : "bg-white/10"}`}
                >
                  <div
                    className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isFeatured ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>

            <div className="bg-[#111111]/40 border border-white/5 rounded-xl p-5 space-y-4">
              <h3 className="font-heading font-semibold flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#5865F2]" />
                Taxonomy
              </h3>

              <div>
                <label className="block text-xs text-[#888888] mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
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
                <label className="block text-xs text-[#888888] mb-2">
                  Tags
                </label>
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
                      onBlur={() =>
                        setTimeout(() => setShowTagSuggestions(false), 200)
                      }
                      onKeyDown={handleTagAdd}
                      placeholder={tags.length === 0 ? "Add tags..." : ""}
                      className="flex-1 bg-transparent text-xs outline-none min-w-[80px] py-1"
                    />
                  </div>
                  {showTagSuggestions &&
                    tagInput &&
                    filteredTags.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-[#111111] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {filteredTags.map(tag => (
                          <button
                            key={tag.slug}
                            onMouseDown={e => {
                              e.preventDefault()
                              setTags([...tags, tag.name])
                              setTagInput("")
                              setShowTagSuggestions(false)
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-[#888888] hover:bg-[#5865F2]/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                          >
                            #{tag.name}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="bg-[#111111]/40 border border-white/5 rounded-xl p-5 space-y-3">
              <h3 className="font-heading font-semibold flex items-center gap-2">
                <SearchPreviewIcon />
                SEO Preview
              </h3>
              <div className="bg-white rounded-lg p-3 overflow-hidden">
                <div className="text-[#1a0dab] text-sm font-medium truncate hover:underline cursor-pointer">
                  {title || "Post Title"}
                </div>
                <div className="text-[#006621] text-xs flex items-center gap-1 truncate max-w-full">
                  <span className="shrink-0">anevski.xyz</span>
                  <span className="text-gray-400 shrink-0">›</span>
                  <span className="shrink-0">blog</span>
                  <span className="text-gray-400 shrink-0">›</span>
                  <span className="truncate">{slug || "post-slug"}</span>
                </div>
                <div className="text-[#545454] text-xs line-clamp-2 mt-1">
                  {excerpt || "Meta description will appear here..."}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {showPreview && (
          <div className="flex-1 w-full bg-home-primary text-white min-h-screen animate-in overflow-y-auto overflow-x-hidden">
            <header className="pt-20 md:pt-24 pb-12 px-6 md:px-16">
              <div className="max-w-4xl mx-auto">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-8 text-white">
                  {title || "Untitled Post"}
                </h1>

                {excerpt && (
                  <p className="text-lg md:text-xl text-home-muted leading-relaxed mb-10 max-w-3xl">
                    {excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between flex-wrap gap-6 pb-10 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <div className="w-full h-full rounded-full bg-home-accent/20 border border-home-accent/30 flex items-center justify-center text-home-accent text-xs font-bold overflow-hidden">
                        {user?.user_metadata?.avatar_url ||
                        user?.user_metadata?.picture ? (
                          <Image
                            src={
                              (user?.user_metadata?.avatar_url ||
                                user?.user_metadata?.picture) as string
                            }
                            alt={user?.user_metadata?.full_name || "Author"}
                            fill
                            className="object-cover rounded-full"
                            unoptimized
                            referrerPolicy="no-referrer"
                          />
                        ) : user?.user_metadata?.full_name ? (
                          (user.user_metadata.full_name as string)
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        ) : (
                          "SA"
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-heading font-medium text-white">
                        {user?.user_metadata?.full_name || "Stefan Anevski"}
                      </p>
                      <p className="text-sm text-home-muted">
                        Full Stack Software Engineer
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="p-2 bg-white/5 rounded-lg text-home-muted transition-all">
                      <Twitter className="w-4 h-4" />
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-home-muted transition-all">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-home-muted transition-all">
                      <Github className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {featuredImage && (
              <div className="px-6 md:px-16 mb-16">
                <div className="max-w-5xl mx-auto">
                  <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={featuredImage}
                      alt={title || "Featured"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-home-primary/60 via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 md:px-16 pb-32">
              <div className="max-w-4xl mx-auto">
                <article>
                  <TiptapEditor
                    content={content}
                    readOnly={true}
                    className="prose-invert max-w-none px-0"
                  />

                  {tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-home-muted mr-2">
                          Tags:
                        </span>
                        {tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function SearchPreviewIcon() {
  return (
    <svg
      className="w-4 h-4 text-[#5865F2]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}
