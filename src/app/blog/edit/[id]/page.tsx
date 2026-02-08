import { CreatePostForm } from "@/components/blog/create-post-form"
import { constructMetadata } from "@/lib/metadata"
import { getCurrentUser } from "@/lib/auth"
import {
  getAvailableCategories,
  getAvailableTags,
  getPostById,
} from "@/lib/admin"
import { notFound } from "next/navigation"

export const metadata = constructMetadata({
  title: "Edit Post — Stefan Anevski",
  description: "Edit existing blog post",
})

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params

  const [user, categories, tags, post] = await Promise.all([
    getCurrentUser(),
    getAvailableCategories(),
    getAvailableTags(),
    getPostById(id),
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
