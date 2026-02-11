import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalPages: number
  currentPage: number
  basePath: string
  searchParams?: Record<string, string | string[] | undefined>
}

function buildHref(props: {
  basePath: string
  searchParams?: Record<string, string | string[] | undefined>
  page: number
}) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(props.searchParams ?? {})) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      const last = value[value.length - 1]
      if (last !== undefined) params.set(key, last)
    } else {
      params.set(key, value)
    }
  }

  params.set("page", String(props.page))

  const query = params.toString()
  return query ? `${props.basePath}?${query}` : props.basePath
}

export function Pagination({
  totalPages,
  currentPage,
  basePath,
  searchParams,
}: PaginationProps) {
  const prevHref = buildHref({
    basePath,
    searchParams,
    page: Math.max(1, currentPage - 1),
  })
  const nextHref = buildHref({
    basePath,
    searchParams,
    page: Math.min(totalPages, currentPage + 1),
  })

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage <= 1 ? (
        <Button
          variant="outline"
          size="icon"
          disabled
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          asChild
          aria-label="Previous page"
        >
          <Link href={prevHref}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      )}

      {/* Show current page and total pages */}
      <div className="flex items-center gap-1 text-sm">
        <span className="font-medium">{currentPage}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{totalPages}</span>
      </div>

      {currentPage >= totalPages ? (
        <Button variant="outline" size="icon" disabled aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" asChild aria-label="Next page">
          <Link href={nextHref}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}
