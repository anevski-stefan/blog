/**
 * Loading skeleton for individual blog post
 * Displays while a blog post is being fetched
 */
export default function PostLoading() {
  return (
    <article className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Post header skeleton */}
        <div className="space-y-4">
          {/* Title skeleton */}
          <div className="h-12 w-3/4 animate-pulse rounded-lg bg-muted" />

          {/* Metadata skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Cover image skeleton */}
        <div className="aspect-video w-full animate-pulse rounded-lg bg-muted" />

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />

          <div className="py-4" />

          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-16 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
      </div>
    </article>
  )
}
