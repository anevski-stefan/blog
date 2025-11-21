import { Search } from "@/components/search"
import { Pagination } from "@/components/pagination"
import { PostCard } from "@/components/post-card"
import { prisma } from "@/lib/db"
import type { Post, Prisma } from "@/generated/prisma/client"

const POSTS_PER_PAGE = 6

interface BlogPageProps {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
}

async function getPosts(page: number, search?: string) {
  const skip = (page - 1) * POSTS_PER_PAGE

  // Build the where clause for search
  const where: Prisma.PostWhereInput = {
    published: true,
    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            { content: { string_contains: search } },
          ],
        }
      : {}),
  }

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      take: POSTS_PER_PAGE,
      skip,
      include: {
        categories: true,
        tags: true,
      },
    }),
    prisma.post.count({ where }),
  ])

  return {
    posts,
    totalPages: Math.ceil(totalPosts / POSTS_PER_PAGE),
  }
}

interface PostWithRelations extends Post {
  categories: { id: string; name: string; slug: string }[]
  tags: { id: string; name: string; slug: string }[]
}

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
            {posts.map((post: PostWithRelations) => (
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
