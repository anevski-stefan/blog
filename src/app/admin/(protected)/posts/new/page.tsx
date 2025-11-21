import { PostForm } from "@/components/posts/post-form"
import { getTaxonomies } from "@/lib/posts"
import { createPost } from "@/actions/posts"

export default async function NewPostPage() {
  const { categories, tags } = await getTaxonomies()

  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <PostForm onSubmit={createPost} categories={categories} tags={tags} />
    </div>
  )
}
