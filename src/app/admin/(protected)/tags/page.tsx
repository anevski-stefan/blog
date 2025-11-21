import { getTaxonomies } from "@/lib/posts"

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
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <div
                    key={tag.id}
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{tag.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
