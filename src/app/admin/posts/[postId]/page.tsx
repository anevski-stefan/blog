import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { PostForm } from "@/components/posts/post-form"
import { prisma } from "@/lib/db"
import { getTaxonomies } from "@/lib/posts"
import { updatePost, togglePublish } from "@/lib/actions/posts"

interface EditPostPageProps {
  params: Promise<{
    postId: string
  }>
}

export default async function EditPostPage(props: EditPostPageProps) {
  const params = await props.params
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const postId = params.postId

  const [post, { categories, tags }] = await Promise.all([
    prisma.post.findUnique({
      where: { id: postId },
      include: {
        categories: true,
        tags: true,
      },
    }),
    getTaxonomies(),
  ])

  if (!post) {
    redirect("/admin")
  }

  const handleUpdate = async (data: {
    title: string
    content: string
    excerpt?: string
    slug?: string
    coverImage?: string
    categoryIds?: string[]
    tagIds?: string[]
  }) => {
    "use server"
    await updatePost(postId, data)
  }

  const handleTogglePublish = async (_postId: string, publish: boolean) => {
    "use server"
    await togglePublish(postId, publish)
  }

  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostForm
        post={post}
        categories={categories}
        tags={tags}
        onSubmit={handleUpdate}
        onPublish={handleTogglePublish}
      />
    </div>
  )
}
