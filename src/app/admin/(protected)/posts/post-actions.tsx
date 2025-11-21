"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { togglePublish } from "@/actions/posts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface PostActionsProps {
  id: string
  published: boolean
}

export function PostActions({ id, published }: PostActionsProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant={published ? "outline" : "default"}
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await togglePublish(id, !published)
        })
      }}
    >
      {isPending ? <LoadingSpinner size="sm" className="mr-2" /> : null}
      {published ? "Unpublish" : "Publish"}
    </Button>
  )
}
