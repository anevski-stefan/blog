"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TaxonomyBadgeProps {
  name: string
  slug: string
  type: "category" | "tag"
  className?: string
}

export function TaxonomyBadge({ name, slug, type, className }: TaxonomyBadgeProps) {
  return (
    <Link href={`/blog/${type}/${slug}`}>
      <Badge 
        variant={type === "category" ? "secondary" : "outline"}
        className={cn(
          "hover:bg-primary hover:text-primary-foreground transition-colors",
          className
        )}
      >
        {name}
      </Badge>
    </Link>
  )
} 