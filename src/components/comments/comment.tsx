"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CommentForm } from "./comment-form"
import type { Comment } from "@/generated/prisma"

interface CommentProps {
  comment: Comment & {
    replies: Comment[]
  }
  onDelete?: (commentId: string) => void
}

export function Comment({ comment, onDelete }: CommentProps) {
  const { userId } = useAuth()
  const [isReplying, setIsReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const isAuthor = userId === comment.authorId
  const hasReplies = comment.replies.length > 0

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.authorName}</span>
            <span className="text-muted-foreground">•</span>
            <time className="text-sm text-muted-foreground">
              {formatDate(comment.createdAt)}
            </time>
          </div>
          {isAuthor && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(comment.id)}
              className="text-destructive hover:text-destructive/90"
            >
              Delete
            </Button>
          )}
        </div>

        {/* Comment Content */}
        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

        {/* Comment Actions */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>
          {hasReplies && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? "Hide Replies" : `Show Replies (${comment.replies.length})`}
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-4">
            <CommentForm
              postId={comment.postId}
              replyToId={comment.id}
              onSuccess={() => {
                setIsReplying(false)
                setShowReplies(true)
              }}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {hasReplies && showReplies && (
        <div className="pl-8 space-y-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={{ ...reply, replies: [] }}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
} 