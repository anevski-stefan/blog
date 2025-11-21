import { Search } from "@/components/shared/search"
import { Pagination } from "@/components/shared/pagination"
import { PostCard } from "@/components/posts/post-card"
import { getPosts } from "@/lib/posts"
import { constructMetadata } from "@/lib/metadata"

interface BlogPageProps {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
}

export const metadata = constructMetadata({
  title: "Blog",
  description: "Read my latest thoughts and tutorials.",
})

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams.page) || 1
  const searchQuery = resolvedSearchParams.q
  const { posts, totalPages } = await getPosts(currentPage, searchQuery)

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Posts</h1>

      {/* Search */}
      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-md">
          <Search />
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No posts found</h2>
          <p className="text-muted-foreground">
            {searchQuery
              ? `No posts matching "${searchQuery}"`
              : "Check back soon for new content!"}
          </p>
        </div>
      ) : (
        <>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} showTaxonomy={true} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          )}
        </>
      )}
    </div>
  )
}
