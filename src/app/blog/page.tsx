import { getAllPosts, mapPostToUi } from "@/lib/posts"
import { BlogClientPage } from "./client-page"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Thoughts & Insights",
  description:
    "Deep dives into software engineering, system architecture, and building scalable applications.",
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getAllPosts()
  const uiPosts = posts.map(mapPostToUi)

  return <BlogClientPage posts={uiPosts} />
}
