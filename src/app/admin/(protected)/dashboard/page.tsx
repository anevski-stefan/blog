import { AdminDashboard } from "@/components/admin/dashboard"
import { constructMetadata } from "@/lib/metadata"
import { getCurrentUser } from "@/lib/auth"

export const metadata = constructMetadata({
  title: "Dashboard — Stefan Anevski Blog",
  description: "Blog management dashboard",
})

export default async function DashboardPage() {
  const user = await getCurrentUser()

  return <AdminDashboard user={user} />
}
