"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { togglePublish } from "@/actions/posts"
import { Loader2 } from "lucide-react"

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
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {published ? "Unpublish" : "Publish"}
    </Button>
  )
}
