import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"

export default async function AdminDashboard() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
        <Button asChild>
          <Link href="/admin/posts/new">Create Post</Link>
        </Button>
      </div>
      <div className="divide-y rounded-md border">
        {posts.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No posts yet. Create your first post!
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4"
            >
              <div className="space-y-1">
                <h3 className="font-medium leading-none">{post.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {post.published ? "Published" : "Draft"} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/posts/${post.id}`}>Edit</Link>
                </Button>
                <Button
                  variant={post.published ? "outline" : "default"}
                  size="sm"
                >
                  {post.published ? "Unpublish" : "Publish"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
