import { notFound } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { prisma } from "@/lib/db"
import type { Post, Tag, Category } from "@/generated/prisma"

interface TagPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

const POSTS_PER_PAGE = 6

export default async function TagPage(props: TagPageProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const currentPage = Number(searchParams.page) || 1
  const skip = (currentPage - 1) * POSTS_PER_PAGE

  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
    include: {
      _count: {
        select: { posts: { where: { published: true } } },
      },
    },
  })

  if (!tag) {
    notFound()
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      tags: {
        some: { slug: params.slug },
      },
    },
    include: {
      categories: true,
      tags: true,
    },
    orderBy: { publishedAt: "desc" },
    take: POSTS_PER_PAGE,
    skip,
  })

  const totalPages = Math.ceil(tag._count.posts / POSTS_PER_PAGE)

  return (
    <div className="w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Posts tagged with: {tag.name}
        </h1>
        <p className="text-muted-foreground">
          {tag._count.posts} {tag._count.posts === 1 ? "post" : "posts"} found
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No posts found</h2>
          <p className="text-muted-foreground">
            There are no published posts with this tag yet.
          </p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post & { categories: Category[]; tags: Tag[] }) => (
            <PostCard key={post.id} post={post} showTaxonomy={true} />
          ))}
        </div>
      )}

      {totalPages > 1 && <div className="mt-8"></div>}
    </div>
  )
}
