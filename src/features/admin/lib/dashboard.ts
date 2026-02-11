import { prisma } from "@/lib/db"
import type {
  AdminStats,
  Activity,
  Category,
  MediaItem,
  Post,
  Tag,
} from "@/features/admin/types/admin"
import { unstable_noStore as noStore } from "next/cache"

export async function getAdminDashboardData() {
  noStore()

  const [postsCount, categoriesCount, tagsCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.tag.count(),
  ])

  const postsWithViews = await prisma.post.findMany({
    select: { views: true },
  })

  const totalViews = postsWithViews.reduce(
    (sum, post) => sum + (post.views || 0),
    0
  )

  const formatValue = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const stats: AdminStats[] = [
    {
      label: "Total Posts",
      value: postsCount.toString(),
      change: "+0%",
      trend: "up",
      icon: "FileText",
    },
    {
      label: "Total Views",
      value: formatValue(totalViews),
      change: "+0%",
      trend: "up",
      icon: "Eye",
    },
    {
      label: "Categories",
      value: categoriesCount.toString(),
      change: "Stable",
      trend: "up",
      icon: "FileText",
    },
    {
      label: "Tags",
      value: tagsCount.toString(),
      change: "Stable",
      trend: "up",
      icon: "Users",
    },
  ]

  const dbPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const activities: Activity[] = dbPosts.slice(0, 5).map(post => ({
    icon: "FileText",
    color: "text-[#22c55e]",
    bgColor: "bg-[#22c55e]/10",
    text: `${post.published ? "Published" : "Draft"} "${post.title}"`,
    time: "Recently",
  }))

  const posts: Post[] = dbPosts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: "General",
    status: post.published ? "published" : "draft",
    views: post.views || 0,
    date: post.createdAt.toLocaleDateString(),
    featured: post.featured || false,
  }))

  const dbCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  const categories: Category[] = dbCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: cat._count.posts,
  }))

  const dbTags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  const tags: Tag[] = dbTags.map(tag => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    count: tag._count.posts,
  }))

  const mediaItems: MediaItem[] = []
  const mediaCount = 0

  return {
    posts,
    categories,
    tags,
    mediaItems,
    stats,
    activities,
    counts: {
      posts: postsCount,
      categories: categoriesCount,
      tags: tagsCount,
      media: mediaCount,
    },
  }
}
