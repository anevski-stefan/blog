import { getTaxonomies } from "@/lib/posts"
import Link from "next/link"

export default async function TagsPage() {
  const { tags } = await getTaxonomies()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tags</h1>
        <p className="text-muted-foreground">Manage your blog tags</p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <div className="space-y-4">
            {tags.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tags found. Tags are created automatically when you assign
                them to posts.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 items-start justify-start">
                {tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 hover:border-primary transition-colors"
                  >
                    <span className="font-medium">{tag.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
