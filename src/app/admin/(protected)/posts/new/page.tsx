import { CreatePostForm } from "@/features/admin/blog/create-post-form"
import { getCurrentUser } from "@/lib/auth"
import { getAvailableCategories, getAvailableTags } from "@/features/admin/lib"

export default async function NewPostPage() {
  const [user, categories, tags] = await Promise.all([
    getCurrentUser(),
    getAvailableCategories(),
    getAvailableTags(),
  ])

  return (
    <CreatePostForm user={user} categories={categories} availableTags={tags} />
  )
}
