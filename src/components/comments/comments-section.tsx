"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { Comment } from "./comment"
import { CommentForm } from "./comment-form"
import type { Comment as CommentType } from "@/generated/prisma"

interface CommentsSectionProps {
  postId: string
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { userId } = useAuth()
  const [comments, setComments] = useState<CommentType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = await response.json()
      setComments(data)
    } catch {
      toast.error("Failed to load comments")
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  async function handleDelete(commentId: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete comment")

      setComments((prev) =>
        prev.filter((comment) => {
          // Remove the comment and its replies
          if (comment.id === commentId) return false
          if (comment.replyToId === commentId) return false
          return true
        })
      )

      toast.success("Comment deleted")
    } catch {
      toast.error("Failed to delete comment")
    }
  }

  // Group comments by parent/child relationship
  const rootComments = comments.filter((comment) => !comment.replyToId)
  const commentReplies = comments.filter((comment) => comment.replyToId)

  // Add replies to their parent comments
  const commentsWithReplies = rootComments.map((comment) => ({
    ...comment,
    replies: commentReplies.filter((reply) => reply.replyToId === comment.id),
  }))

  if (isLoading) {
    return <div className="text-center py-8">Loading comments...</div>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">
        Comments ({comments.length})
      </h2>

      {/* New Comment Form */}
      <div className="mb-8">
        <CommentForm
          postId={postId}
          onSuccess={fetchComments}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {commentsWithReplies.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onDelete={userId === comment.authorId ? handleDelete : undefined}
          />
        ))}
        {commentsWithReplies.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  )
} 