import { AdminDashboard } from "@/features/admin/dashboard"
import { constructMetadata } from "@/lib/metadata"
import { getCurrentUser } from "@/features/admin/lib/auth"
import { getAdminDashboardData } from "@/features/admin/lib"
import { createLogger } from "@/lib/logger"

const logger = createLogger("AdminDashboardPage")

export const metadata = constructMetadata({
  title: "Dashboard",
  description: "Blog management dashboard",
})

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardPage() {
  const user = await getCurrentUser()

  let data
  try {
    data = await getAdminDashboardData()
  } catch (error) {
    logger.error("Failed to fetch dashboard data", error)
    data = {
      posts: [],
      categories: [],
      tags: [],
      mediaItems: [],
      stats: [
        {
          label: "Posts",
          value: "0",
          change: "Error",
          trend: "down" as const,
          icon: "FileText",
        },
        {
          label: "Views",
          value: "0",
          change: "Error",
          trend: "down" as const,
          icon: "Eye",
        },
        {
          label: "Categories",
          value: "0",
          change: "Error",
          trend: "up" as const,
          icon: "FileText",
        },
        {
          label: "Tags",
          value: "0",
          change: "Error",
          trend: "up" as const,
          icon: "Users",
        },
      ],
      activities: [],
      counts: {
        posts: 0,
        categories: 0,
        tags: 0,
        media: 0,
      },
    }
  }

  return <AdminDashboard user={user} {...data} />
}
