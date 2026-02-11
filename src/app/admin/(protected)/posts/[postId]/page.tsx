import { notFound } from "next/navigation"
import { CreatePostForm } from "@/features/admin/blog/create-post-form"
import { getCurrentUser } from "@/features/admin/lib/auth"
import {
  getAvailableCategories,
  getAvailableTags,
  getPostById,
} from "@/features/admin/lib"

interface EditPostPageProps {
  params: Promise<{
    postId: string
  }>
}

export default async function EditPostPage(props: EditPostPageProps) {
  const params = await props.params
  const postId = params.postId

  const [user, categories, tags, post] = await Promise.all([
    getCurrentUser(),
    getAvailableCategories(),
    getAvailableTags(),
    getPostById(postId),
  ])

  if (!post) {
    notFound()
  }

  return (
    <CreatePostForm
      user={user}
      categories={categories}
      availableTags={tags}
      initialPost={post}
    />
  )
}
