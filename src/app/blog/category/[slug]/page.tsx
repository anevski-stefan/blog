import { notFound } from "next/navigation"
import { PostCard } from "@/components/posts/post-card"
import { prisma } from "@/lib/db"
import { getPosts } from "@/lib/posts"
import { Pagination } from "@/components/shared/pagination"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const currentPage = Number(searchParams.page) || 1

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  })

  if (!category) {
    notFound()
  }

  const { posts, totalPages } = await getPosts(currentPage, undefined, {
    categorySlug: params.slug,
  })

  return (
    <div className="w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Category: {category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No posts found</h2>
          <p className="text-muted-foreground">
            There are no published posts in this category yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} showTaxonomy={false} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
