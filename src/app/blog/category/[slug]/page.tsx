import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/generated/prisma/client"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

const POSTS_PER_PAGE = 6

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const currentPage = Number(searchParams.page) || 1
  const skip = (currentPage - 1) * POSTS_PER_PAGE

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      _count: {
        select: { posts: { where: { published: true } } },
      },
    },
  })

  if (!category) {
    notFound()
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      categories: {
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

  const totalPages = Math.ceil(category._count.posts / POSTS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-lg border p-6 hover:shadow-lg transition-shadow"
            >
              {post.coverImage && (
                <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {post.publishedAt && formatDate(post.publishedAt)}
                  </span>
                  <span>By {post.authorName || "Unknown"}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">{/* We'll add pagination here later */}</div>
      )}
    </div>
  )
}
