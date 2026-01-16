import { CreatePostForm } from "@/components/blog/create-post-form"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Create New Post — Stefan Anevski",
  description: "Create a new blog post",
})

export default function NewPostPage() {
  return <CreatePostForm />
}
