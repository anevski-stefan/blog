import { getTaxonomies } from "@/lib/posts"
import Link from "next/link"

export default async function CategoriesPage() {
  const { categories } = await getTaxonomies()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Manage your blog categories</p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <div className="space-y-4">
            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No categories found. Categories are created automatically when
                you assign them to posts.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="rounded-lg border p-4 hover:border-primary transition-colors block"
                  >
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.slug}
                    </p>
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
