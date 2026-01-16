"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  X,
  Image as ImageIcon,
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Braces,
  Link as LinkIcon,
  Minus,
  Check,
  Clock,
  Calendar,
  Tag,
  FolderOpen,
  Settings,
} from "lucide-react"

export function CreatePostForm() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [publishDate, setPublishDate] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "idle">(
    "idle"
  )

  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [linkData, setLinkData] = useState({ text: "", url: "" })
  const [imageData, setImageData] = useState({ alt: "", url: "" })

  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    setPublishDate(now.toISOString().slice(0, 16))
    const saved = localStorage.getItem("blog-draft")
    if (saved) {
      try {
        const data = JSON.parse(saved)
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
  }, [])

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

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent
  ) => {
    e.preventDefault()
    let file: File | undefined

    if ("files" in e.target && e.target.files) {
      file = e.target.files[0]
    } else if ("dataTransfer" in e && e.dataTransfer.files) {
      file = e.dataTransfer.files[0]
    }

    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onload = ev => {
        setFeaturedImage(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const insertText = (before: string, after: string = "") => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)

    const insertion = `${before}${selected}${after}`
    const newValue = text.substring(0, start) + insertion + text.substring(end)

    setContent(newValue)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos =
        start + before.length + selected.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter(w => w).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

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
              Create New Post
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
              onClick={() => {
                setStatus("draft")
                triggerAutoSave()
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2 text-sm bg-[#5865F2] hover:bg-[#5865F2]/90 text-white font-medium rounded-lg transition-all shadow-lg shadow-[#5865F2]/20">
              <Send className="w-4 h-4" />
              <span>Publish</span>
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
                  ref={titleRef}
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
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleImageUpload}
                >
                  {featuredImage ? (
                    <div className="relative group">
                      <Image
                        src={featuredImage}
                        alt="Featured"
                        width={800}
                        height={400}
                        className="w-full h-auto rounded-xl object-cover"
                      />
                      <button
                        onClick={() => setFeaturedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-[#ef4444] text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-6 h-6 text-[#888888]" />
                      </div>
                      <p className="text-[#888888] mb-2">
                        Drag & drop an image, or{" "}
                        <label className="text-[#5865F2] cursor-pointer hover:underline">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </p>
                      <p className="text-xs text-[#888888]/60">
                        Recommended: 1600×900px, max 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#888888] uppercase tracking-wider mb-2">
                  Content
                </label>
                <div className="border border-white/10 rounded-xl overflow-hidden bg-[#111111]/30 focus-within:border-[#5865F2] focus-within:ring-1 focus-within:ring-[#5865F2] transition-all">
                  <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-[#111111]/50 sticky top-0 z-10">
                    {[
                      {
                        icon: Bold,
                        action: () => insertText("**", "**"),
                        title: "Bold",
                      },
                      {
                        icon: Italic,
                        action: () => insertText("*", "*"),
                        title: "Italic",
                      },
                      {
                        icon: Strikethrough,
                        action: () => insertText("~~", "~~"),
                        title: "Strike",
                      },
                      { separator: true },
                      {
                        icon: Heading2,
                        action: () => insertText("\n## "),
                        title: "H2",
                      },
                      {
                        icon: Heading3,
                        action: () => insertText("\n### "),
                        title: "H3",
                      },
                      { separator: true },
                      {
                        icon: List,
                        action: () => insertText("\n- "),
                        title: "List",
                      },
                      {
                        icon: ListOrdered,
                        action: () => insertText("\n1. "),
                        title: "Ordered List",
                      },
                      {
                        icon: Quote,
                        action: () => insertText("\n> "),
                        title: "Quote",
                      },
                      { separator: true },
                      {
                        icon: Code,
                        action: () => insertText("`", "`"),
                        title: "Code",
                      },
                      {
                        icon: Braces,
                        action: () =>
                          insertText("\n```javascript\n", "\n```\n"),
                        title: "Code Block",
                      },
                      { separator: true },
                      {
                        icon: LinkIcon,
                        action: () => setShowLinkModal(true),
                        title: "Link",
                      },
                      {
                        icon: ImageIcon,
                        action: () => setShowImageModal(true),
                        title: "Image",
                      },
                      { separator: true },
                      {
                        icon: Minus,
                        action: () => insertText("\n---\n"),
                        title: "Divider",
                      },
                    ].map((item, i) =>
                      item.separator ? (
                        <div key={i} className="w-px h-5 bg-white/10 mx-1" />
                      ) : (
                        item.icon && (
                          <button
                            key={i}
                            onClick={item.action}
                            className="p-1.5 text-[#888888] hover:text-[#5865F2] hover:bg-[#5865F2]/10 rounded transition-colors"
                            title={item.title}
                          >
                            <item.icon className="w-4 h-4" />
                          </button>
                        )
                      )
                    )}
                    <div className="flex-1" />
                    <span className="text-xs font-mono text-[#888888] px-2">
                      {wordCount} words
                    </span>
                  </div>

                  <textarea
                    ref={contentRef}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Write your story..."
                    className="w-full h-[600px] bg-transparent p-6 outline-none font-mono text-sm leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside
          ref={sidebarRef}
          className={`hidden lg:block w-80 border-l border-white/5 bg-[#111111]/20 p-6 sidebar-animate-in ${showPreview ? "hidden" : "block"}`}
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
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={e => setPublishDate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 pl-10 pr-3 text-xs focus:border-[#5865F2] outline-none"
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
                  <option value="architecture">Architecture</option>
                  <option value="react">React</option>
                  <option value="devops">DevOps</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#888888] mb-2">
                  Tags
                </label>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#5865F2]/20 text-[#5865F2] text-[10px] rounded hover:bg-[#5865F2]/30 transition-colors"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagAdd}
                    placeholder="Add tag..."
                    className="w-full bg-transparent text-xs outline-none"
                  />
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
                <div className="text-[#006621] text-xs flex items-center gap-1">
                  alexchen.dev <span className="text-gray-400">›</span> blog{" "}
                  <span className="text-gray-400">›</span> {slug || "post-slug"}
                </div>
                <div className="text-[#545454] text-xs line-clamp-2 mt-1">
                  {excerpt || "Meta description will appear here..."}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {showPreview && (
          <div className="flex-1 max-w-4xl mx-auto px-6 py-8 animate-in">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="mb-8 not-prose">
                {category && (
                  <span className="text-[#5865F2] font-mono text-xs uppercase tracking-wider mb-4 block">
                    {category}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
                  {title || "Untitled"}
                </h1>
                <div className="flex items-center gap-4 text-[#888888] text-sm border-b border-white/10 pb-8">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />{" "}
                    {new Date(publishDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {readingTime} min read
                  </span>
                  {tags.length > 0 && (
                    <div className="flex items-center gap-2 ml-auto">
                      <Tag className="w-4 h-4" />
                      {tags.join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {featuredImage && (
                <div className="mb-10 rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={featuredImage}
                    alt="Featured"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="text-[#d1d5db] font-light leading-loose whitespace-pre-wrap">
                {content || (
                  <span className="italic text-[#888888]">
                    Start writing to see the preview...
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {showLinkModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-heading font-bold text-lg">Insert Link</h3>
            <div>
              <label className="text-xs text-[#888888]">Text</label>
              <input
                className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-sm focus:border-[#5865F2] outline-none"
                value={linkData.text}
                onChange={e =>
                  setLinkData({ ...linkData, text: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-[#888888]">URL</label>
              <input
                className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-sm focus:border-[#5865F2] outline-none"
                value={linkData.url}
                onChange={e =>
                  setLinkData({ ...linkData, url: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-sm text-[#888888] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  insertText(`[${linkData.text}](${linkData.url})`)
                  setLinkData({ text: "", url: "" })
                  setShowLinkModal(false)
                }}
                className="px-4 py-2 bg-[#5865F2] text-white text-sm rounded hover:bg-[#5865F2]/90"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-heading font-bold text-lg">Insert Image URL</h3>
            <div>
              <label className="text-xs text-[#888888]">Alt Text</label>
              <input
                className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-sm focus:border-[#5865F2] outline-none"
                value={imageData.alt}
                onChange={e =>
                  setImageData({ ...imageData, alt: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-[#888888]">Image URL</label>
              <input
                className="w-full bg-[#0a0a0a] border border-white/10 rounded p-2 text-sm focus:border-[#5865F2] outline-none"
                value={imageData.url}
                onChange={e =>
                  setImageData({ ...imageData, url: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-sm text-[#888888] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  insertText(`![${imageData.alt}](${imageData.url})`)
                  setImageData({ alt: "", url: "" })
                  setShowImageModal(false)
                }}
                className="px-4 py-2 bg-[#5865F2] text-white text-sm rounded hover:bg-[#5865F2]/90"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
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
