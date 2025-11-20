import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import { PostForm } from "@/components/post-form"
import { prisma } from "@/lib/db"

export interface CreatePostData {
  title: string
  content: unknown // JSON content from Tiptap
  excerpt?: string
  slug?: string
  coverImage?: string
  categoryIds?: string[]
  tagIds?: string[]
}

export default async function NewPostPage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect("/sign-in")
  }

  // Fetch categories and tags for the form
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
  ])

  async function createPost(data: CreatePostData) {
    "use server"

    try {
      if (!data.title) {
        throw new Error("Title is required")
      }

      if (!data.content) {
        throw new Error("Content is required")
      }

      // Get user again in server action to ensure fresh data
      const { userId: currentUserId } = await auth()
      if (!currentUserId) {
        throw new Error("Unauthorized")
      }

      const currentUserData = await currentUser()
      const authorName = currentUserData 
        ? `${currentUserData.firstName ?? ''} ${currentUserData.lastName ?? ''}`.trim() || 'Anonymous'
        : 'Anonymous'

      await prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt ?? null,
          coverImage: data.coverImage ?? null,
          slug: data.slug ?? data.title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-"),
          authorId: currentUserId,
          authorName,
          published: false,
          categories: data.categoryIds?.length 
            ? {
                connect: data.categoryIds.map(id => ({ id })),
              }
            : undefined,
          tags: data.tagIds?.length
            ? {
                connect: data.tagIds.map(id => ({ id })),
              }
            : undefined,
        },
      })

      redirect("/admin")
    } catch (error) {
      console.error("Failed to create post:", error)
      throw new Error("Failed to create post. Please try again.")
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <PostForm 
        onSubmit={createPost}
        categories={categories}
        tags={tags}
      />
    </div>
  )
} 