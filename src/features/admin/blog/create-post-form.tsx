"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { createPost, updatePost } from "@/actions/blog"
import { saveDraft } from "@/actions/drafts"
import { TiptapEditor } from "./editor"
import { CreatePostHeader } from "./create-post-form/Header"
import { CreatePostPreview } from "./create-post-form/Preview"
import { FeaturedImageField } from "./create-post-form/FeaturedImageField"
import { PublishCard } from "./create-post-form/PublishCard"
import { TaxonomyCard } from "./create-post-form/TaxonomyCard"
import { SeoPreviewCard } from "./create-post-form/SeoPreviewCard"
import { useLocalDraft } from "./create-post-form/useLocalDraft"
import { User } from "@supabase/supabase-js"
import { calculateReadingTime } from "@/lib/utils"
import { PostWithRelations } from "@/types/posts"
import { serializeEditorContent } from "@/lib/tiptap/serialize"

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

  useLocalDraft({
    initialPost,
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
    setDraftId,
    setTitle,
    setSlug,
    setExcerpt,
    setContent,
    setCategory,
    setTags,
    setIsFeatured,
    setStatus,
    setPublishDate,
    setFeaturedImage,
    setSaveStatus,
  })

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

  const handleSaveDraft = async () => {
    setSaveStatus("saving")
    try {
      const serializedContent = serializeEditorContent(content)
      const result = await saveDraft({
        id: draftId,
        title,
        slug,
        content: serializedContent,
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
    formData.set("content", serializeEditorContent(content))
    formData.set("category", category)
    formData.set("tags", tags.join(","))
    formData.set("coverImage", featuredImage || "")
    formData.set("status", status)
    formData.set("featured", String(isFeatured))
    formData.set("publishDate", publishDate)
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
        className="fixed inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(#5865F2 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <CreatePostHeader
        initialPost={Boolean(initialPost)}
        status={status}
        saveStatus={saveStatus}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
      />

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
                <FeaturedImageField
                  featuredImage={featuredImage}
                  onChangeFeaturedImage={setFeaturedImage}
                />
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
            <PublishCard
              status={status}
              onChangeStatus={setStatus}
              publishDate={publishDate}
              onChangePublishDate={setPublishDate}
              isFeatured={isFeatured}
              onToggleFeatured={() => setIsFeatured(!isFeatured)}
            />

            <TaxonomyCard
              categories={categories}
              category={category}
              onChangeCategory={setCategory}
              availableTags={availableTags}
              tags={tags}
              onChangeTags={setTags}
            />

            <SeoPreviewCard title={title} slug={slug} excerpt={excerpt} />
          </div>
        </aside>

        {showPreview && (
          <CreatePostPreview
            user={user}
            title={title}
            excerpt={excerpt}
            featuredImage={featuredImage}
            content={content}
            tags={tags}
          />
        )}
      </main>
    </div>
  )
}
