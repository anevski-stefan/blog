import { CreatePostForm } from "@/components/blog/create-post-form"
import { constructMetadata } from "@/lib/metadata"
import { getCurrentUser } from "@/lib/auth"
import { getAvailableCategories, getAvailableTags } from "@/lib/admin"

export const metadata = constructMetadata({
  title: "Create New Post — Stefan Anevski",
  description: "Create a new blog post",
})

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
