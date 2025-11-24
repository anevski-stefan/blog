"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, Loader2, Save, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ImageUpload } from "@/components/shared/image-upload"
import { MultiSelect } from "@/components/ui/multi-select"
import { Editor } from "@/components/editor"
import { Separator } from "@/components/ui/separator"

import type { Category, Post, Tag } from "@/generated/prisma/client"
import type { PostData } from "@/types/posts"

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.any(),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  coverImage: z.string().optional(),
  categoryIds: z.array(z.string()),
  tagIds: z.array(z.string()),
})

type PostFormValues = z.infer<typeof postFormSchema>

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
  const [isPublishing, setIsPublishing] = useState(false)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
      excerpt: post?.excerpt ?? "",
      slug: post?.slug ?? "",
      coverImage: post?.coverImage ?? undefined,
      categoryIds: post?.categories?.map(c => c.id) ?? [],
      tagIds: post?.tags?.map(t => t.id) ?? [],
    },
  })

  const { isSubmitting } = form.formState

  async function handleSubmit(data: PostFormValues) {
    try {
      // Ensure content is a string
      let contentAsString = ""
      if (typeof data.content === "object" && data.content !== null) {
        contentAsString = JSON.stringify(data.content)
      } else {
        contentAsString = String(data.content)
      }

      // Auto-generate excerpt if empty
      if (!data.excerpt && contentAsString) {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = contentAsString
        data.excerpt = (tempDiv.textContent?.slice(0, 200) ?? "") + "..."
      }

      // Auto-generate slug if empty (handled by server usually, but good to have)
      if (!data.slug && data.title) {
        data.slug = data.title
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, "-")
      }

      await onSubmit({
        ...data,
        content: contentAsString,
      })
    } catch (error) {
      console.error("Error submitting post:", error)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter post title"
                          className="text-lg font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Editor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Write your post content here..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO & Meta</CardTitle>
                <CardDescription>
                  Optimize your post for search engines.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="post-url-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        The URL-friendly version of the name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief summary of the post..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Used in blog lists and SEO meta descriptions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8">
            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Status:</span>
                  <span className="font-medium text-foreground">
                    {post?.published ? "Published" : "Draft"}
                  </span>
                </div>
                <Separator />
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>

                  {post && onPublish && (
                    <Button
                      type="button"
                      variant={post.published ? "outline" : "default"}
                      onClick={handlePublish}
                      disabled={isPublishing || isSubmitting}
                      className="w-full"
                    >
                      {isPublishing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Send className="mr-2 h-4 w-4" />
                      {post.published ? "Unpublish" : "Publish"}
                    </Button>
                  )}

                  {post && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => window.open(`/blog/${post.id}`, "_blank")}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organization Card */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={categories.map(c => ({
                            label: c.name,
                            value: c.id,
                          }))}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select categories..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={tags.map(t => ({
                            label: t.name,
                            value: t.id,
                          }))}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select tags..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Featured Image Card */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
