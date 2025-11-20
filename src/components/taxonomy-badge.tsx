"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TaxonomyBadgeProps {
  name: string
  slug: string
  type: "category" | "tag"
  className?: string
}

export function TaxonomyBadge({ name, slug, type, className }: TaxonomyBadgeProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/blog/${type}/${slug}`)
  }

  return (
    <Badge
      variant={type === "category" ? "secondary" : "outline"}
      className={cn(
        "hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      {name}
    </Badge>
  )
} 