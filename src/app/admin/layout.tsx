import Link from "next/link"
import { requireAdmin } from "@/lib/auth"
import { SignOutButtonWrapper } from "@/components/shared/sign-out-button-wrapper"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-xl font-bold">
                Admin Dashboard
              </Link>
              <nav className="flex items-center space-x-4 text-sm">
                <Link
                  href="/admin/posts"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Posts
                </Link>
                <Link
                  href="/admin/categories"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Categories
                </Link>
                <Link
                  href="/admin/tags"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Tags
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View Site
              </Link>
              <SignOutButtonWrapper />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
