import { Search } from "@/components/search"
import { Pagination } from "@/components/pagination"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/db"
import type { Post, Prisma } from "@/generated/prisma/client"
import { TaxonomyBadge } from "@/components/taxonomy-badge"

const POSTS_PER_PAGE = 6

interface BlogPageProps {
  searchParams: {
    q?: string
    page?: string
  }
}

async function getPosts(page: number, search?: string) {
  const skip = (page - 1) * POSTS_PER_PAGE

  // Build the where clause for search
  const where: Prisma.PostWhereInput = {
    published: true,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
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
  categories: any[]
  tags: any[]
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams.page) || 1
  const searchQuery = searchParams.q
  const { posts, totalPages } = await getPosts(currentPage, searchQuery)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Posts</h1>
      
      {/* Search */}
      <div className="mb-8 flex justify-center">
        <Search />
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: PostWithRelations) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-lg border p-6 hover:shadow-lg transition-shadow"
              >
                {post.coverImage && (
                  <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <article>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  {/* Categories and Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map((category) => (
                      <TaxonomyBadge
                        key={category.id}
                        name={category.name}
                        slug={category.slug}
                        type="category"
                      />
                    ))}
                    {post.tags.map((tag) => (
                      <TaxonomyBadge
                        key={tag.id}
                        name={tag.name}
                        slug={tag.slug}
                        type="tag"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {post.publishedAt && formatDate(post.publishedAt)}
                    </span>
                    <span>
                      By {post.authorName || "Unknown"}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
            />
          )}
        </>
      )}
    </div>
  )
} 