import { notFound } from "next/navigation"
import { getPostBySlug, getPosts, mapPostToUi, getAllPosts } from "@/lib/posts"
import { BlogPostClientView } from "./client-view"
import { Metadata } from "next"

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt || `Read more about ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read more about ${post.title}`,
      images: [
        {
          url:
            post.coverImage ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          width: 800,
          height: 600,
        },
      ],
      type: "article",
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Fetch recent posts for "Related" section (simulated)
  // Ideally we filter by tag/category, but for now just recent posts excluding current
  const { posts: allPosts } = await getPosts(1)
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3)
    .map(mapPostToUi)

  const uiPost = mapPostToUi(post)

  return <BlogPostClientView post={uiPost} relatedPosts={relatedPosts} />
}
