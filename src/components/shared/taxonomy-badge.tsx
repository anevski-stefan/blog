import Link from "next/link"
import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TaxonomyBadgeProps {
  name: string
  slug: string
  type: "category" | "tag"
  className?: string
}

export function TaxonomyBadge({
  name,
  slug,
  type,
  className,
}: TaxonomyBadgeProps) {
  const href = `/blog/${type}/${slug}`
  return (
    <Link
      href={href}
      className={cn(
        badgeVariants({ variant: "secondary" }),
        "transition-colors",
        className
      )}
    >
      {name}
    </Link>
  )
}
