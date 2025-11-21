"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/shared/image-upload"
import type { Category, Post, Tag } from "@/generated/prisma/client"
import type { PostData } from "@/types/posts"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Editor } from "@/components/editor"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface PostFormProps {
  post?: Post & {
    categories?: Category[]
    tags?: Tag[]
  }
  categories: Category[]
  tags: Tag[]
  onSubmit: (data: PostData) => Promise<void>
  onPublish?: (postId: string, publish: boolean) => Promise<void>
}

export function PostForm({
  post,
  categories,
  tags,
  onSubmit,
  onPublish,
}: PostFormProps) {
  const [title, setTitle] = useState(post?.title ?? "")
  const [content, setContent] = useState(post?.content?.toString() ?? "")
  const [coverImage, setCoverImage] = useState<string | undefined>(
    post?.coverImage ?? undefined
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories?.map(c => c.id) ?? []
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags?.map(t => t.id) ?? []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  function generateExcerpt(html: string): string {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html
    return (tempDiv.textContent?.slice(0, 200) ?? "") + "..."
  }

  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        title,
        content,
        excerpt: generateExcerpt(content),
        coverImage,
        slug: generateSlug(title),
        categoryIds: selectedCategories,
        tagIds: selectedTags,
      })
    } catch (error) {
      console.error("Error submitting post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePublish() {
    if (!post?.id || !onPublish) return

    setIsPublishing(true)
    try {
      await onPublish(post.id, !post.published)
    } catch (error) {
      console.error("Error publishing post:", error)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <input
          id="title"
          type="text"
          placeholder="Post title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full rounded-md border p-2"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <ImageUpload value={coverImage} onChange={setCoverImage} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categories">Categories</Label>
        <Select
          id="categories"
          multiple
          value={selectedCategories}
          onChange={values => setSelectedCategories(values as string[])}
          className="w-full"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Select
          id="tags"
          multiple
          value={selectedTags}
          onChange={values => setSelectedTags(values as string[])}
          className="w-full"
        >
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Editor
          content={content}
          onChange={setContent}
          placeholder="Write your post content here..."
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        {post && onPublish && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing && <LoadingSpinner size="sm" className="mr-2" />}
            {isPublishing
              ? "Processing..."
              : post.published
                ? "Unpublish"
                : "Publish"}
          </Button>
        )}
      </div>
    </form>
  )
}
