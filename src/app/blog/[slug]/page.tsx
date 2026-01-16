import { notFound } from "next/navigation"
import { getPostBySlug, blogPosts } from "@/lib/blog-data"
import { BlogPostClientView } from "./client-view"
import { Metadata } from "next"

export async function generateStaticParams() {
  return blogPosts.map(post => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.image,
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
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3)

  return <BlogPostClientView post={post} relatedPosts={relatedPosts} />
}
