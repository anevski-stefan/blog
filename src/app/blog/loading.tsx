/**
 * Loading skeleton for blog posts list
 * Displays while blog posts are being fetched
 */
export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="space-y-8">
        {/* Page header skeleton */}
        <div className="space-y-2">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-6 w-96 animate-pulse rounded-lg bg-muted" />
        </div>

        {/* Posts grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="space-y-4 rounded-lg border border-border p-6"
            >
              {/* Cover image skeleton */}
              <div className="aspect-video w-full animate-pulse rounded-md bg-muted" />

              {/* Title skeleton */}
              <div className="h-7 w-3/4 animate-pulse rounded-lg bg-muted" />

              {/* Excerpt skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              </div>

              {/* Metadata skeleton */}
              <div className="flex items-center gap-4">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
