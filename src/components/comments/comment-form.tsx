"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface CommentFormProps {
  postId: string
  replyToId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function CommentForm({ postId, replyToId, onSuccess, onCancel }: CommentFormProps) {
  const { isSignedIn } = useAuth()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isSignedIn) {
      toast.error("You must be signed in to comment")
      return
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content,
          replyToId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit comment")
      }

      setContent("")
      toast.success(replyToId ? "Reply submitted" : "Comment submitted")
      onSuccess?.()
    } catch {
      toast.error("Failed to submit comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-2">
          Please sign in to leave a comment
        </p>
        <Button variant="outline" onClick={() => window.location.href = "/sign-in"}>
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={replyToId ? "Write a reply..." : "Write a comment..."}
        className="min-h-[100px]"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : replyToId ? "Reply" : "Comment"}
        </Button>
      </div>
    </form>
  )
} 