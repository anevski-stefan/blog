import { AdminDashboard } from "@/components/admin/dashboard"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Dashboard — Stefan Anevski Blog",
  description: "Blog management dashboard",
})

export default function DashboardPage() {
  return <AdminDashboard />
}
