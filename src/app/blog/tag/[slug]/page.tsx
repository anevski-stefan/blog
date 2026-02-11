import { notFound } from "next/navigation"
import { PostCard } from "@/features/blog/components/PostCard"
import { prisma } from "@/lib/db"
import { getPosts } from "@/features/blog/lib/posts"
import { Pagination } from "@/components/shared/pagination"

interface TagPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const currentPage = Number(searchParams.page) || 1

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

  const { posts, totalPages } = await getPosts(currentPage, undefined, {
    tagSlug: params.slug,
  })

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
        <>
          <div className="grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} showTaxonomy={true} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                basePath={`/blog/tag/${params.slug}`}
                searchParams={searchParams}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
