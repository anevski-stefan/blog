import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import { PostForm } from "@/components/post-form"
import { prisma } from "@/lib/db"
import type { Post } from "@/types"

interface EditPostPageProps {
  params: Promise<{
    postId: string
  }>
}

export default async function EditPostPage(props: EditPostPageProps) {
  const params = await props.params
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect("/sign-in")
  }

  const postId = params.postId

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      categories: true,
      tags: true,
    },
  })

  if (!post) {
    redirect("/admin")
  }

  // Fetch all categories and tags for the form
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
  ])

  async function updatePost(data: Partial<Post>) {
    "use server"

    try {
      if (!data.title) {
        throw new Error("Title is required")
      }

      if (!data.content) {
        throw new Error("Content is required")
      }

      const currentUserData = await currentUser()
      const authorName = currentUserData 
        ? `${currentUserData.firstName ?? ''} ${currentUserData.lastName ?? ''}`.trim() || 'Anonymous'
        : 'Anonymous'

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt ?? null,
          coverImage: data.coverImage ?? null,
          slug: data.slug ?? data.title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-"),
          authorName,
          updatedAt: new Date(),
          categories: {
            set: data.categories?.map(id => ({ id })) ?? [],
          },
          tags: {
            set: data.tags?.map(id => ({ id })) ?? [],
          },
        },
      })

      redirect("/admin")
    } catch (error) {
      console.error("Failed to update post:", error)
      throw new Error("Failed to update post. Please try again.")
    }
  }

  async function togglePublish(postId: string, publish: boolean) {
    "use server"

    try {
      await prisma.post.update({
        where: { id: postId },
        data: {
          published: publish,
          publishedAt: publish ? new Date() : null,
        },
      })

      redirect("/admin")
    } catch (error) {
      console.error("Failed to update post status:", error)
      throw new Error("Failed to update post status. Please try again.")
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostForm 
        post={post} 
        categories={categories}
        tags={tags}
        onSubmit={updatePost}
        onPublish={togglePublish}
      />
    </div>
  )
} 