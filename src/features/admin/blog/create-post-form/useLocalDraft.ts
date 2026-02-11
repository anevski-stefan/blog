"use client"

import { useCallback, useEffect, useRef } from "react"

type SaveStatus = "saving" | "saved" | "idle"

export function useLocalDraft(options: {
  initialPost?: unknown
  draftId: string | undefined
  title: string
  slug: string
  excerpt: string
  content: string | object
  category: string
  tags: string[]
  isFeatured: boolean
  status: "draft" | "published"
  publishDate: string
  featuredImage: string | null
  setDraftId: (value: string | undefined) => void
  setTitle: (value: string) => void
  setSlug: (value: string) => void
  setExcerpt: (value: string) => void
  setContent: (value: string | object) => void
  setCategory: (value: string) => void
  setTags: (value: string[]) => void
  setIsFeatured: (value: boolean) => void
  setStatus: (value: "draft" | "published") => void
  setPublishDate: (value: string) => void
  setFeaturedImage: (value: string | null) => void
  setSaveStatus: (value: SaveStatus) => void
}) {
  const {
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
  } = options

  useEffect(() => {
    if (initialPost) return

    if (!publishDate) {
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      setPublishDate(now.toISOString().slice(0, 16))
    }

    const saved = localStorage.getItem("blog-draft")
    if (!saved) return

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
    } catch (error) {
      console.error("Failed to load draft", error)
    }
  }, [
    initialPost,
    publishDate,
    setCategory,
    setContent,
    setDraftId,
    setExcerpt,
    setFeaturedImage,
    setIsFeatured,
    setPublishDate,
    setSlug,
    setStatus,
    setTags,
    setTitle,
  ])

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  const triggerAutoSave = useCallback(() => {
    setSaveStatus("saving")
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)

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

      idleTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 3000)
    }, 2000)
  }, [
    category,
    content,
    draftId,
    excerpt,
    featuredImage,
    isFeatured,
    publishDate,
    setSaveStatus,
    slug,
    status,
    tags,
    title,
  ])

  useEffect(() => {
    triggerAutoSave()
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
    }
  }, [triggerAutoSave])
}
