import { requireAdmin } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#5865F2]/30">
      <main>{children}</main>
    </div>
  )
}
