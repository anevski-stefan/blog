"use client"

import React from "react"
import Image from "next/image"
import {
  Clock,
  CheckCircle,
  Flag,
  MessageSquare,
  Check,
  Trash2,
  Reply,
} from "lucide-react"
import { CommentsProps } from "@/types/admin"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"

export function Comments({
  comments,
  commentFilter,
  setCommentFilter,
  showToast,
  setShowReplyModal,
}: CommentsProps) {
  const pendingCount = comments.filter(c => c.status === "pending").length
  const approvedCount = comments.filter(c => c.status === "approved").length
  const filteredComments =
    commentFilter === "all"
      ? comments
      : comments.filter(c => c.status === commentFilter)

  const stats = [
    {
      label: "Pending",
      count: pendingCount,
      icon: Clock,
      color: "text-[#f59e0b]",
      bgColor: "bg-[#f59e0b]/10",
    },
    {
      label: "Approved",
      count: approvedCount,
      icon: CheckCircle,
      color: "text-[#22c55e]",
      bgColor: "bg-[#22c55e]/10",
    },
    {
      label: "Spam",
      count: 0,
      icon: Flag,
      color: "text-[#ef4444]",
      bgColor: "bg-[#ef4444]/10",
    },
    {
      label: "Total",
      count: comments.length,
      icon: MessageSquare,
      color: "text-[#5865F2]",
      bgColor: "bg-[#5865F2]/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="!p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="font-heading text-xl font-semibold text-white">
                  {stat.count}
                </div>
                <div className="text-xs text-[#888888]">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 p-1 bg-[#161616] rounded-xl border border-white/5 w-fit">
        {["all", "pending", "approved", "spam"].map(filter => (
          <button
            key={filter}
            onClick={() => setCommentFilter(filter)}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${commentFilter === filter ? "bg-[#5865F2] text-white" : "text-[#888888] hover:text-white"}`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredComments.map(comment => (
          <Card key={comment.id}>
            <div className="flex gap-4">
              <Image
                src={comment.avatar}
                alt={comment.author}
                width={40}
                height={40}
                className="rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="font-medium text-white">
                      {comment.author}
                    </span>
                    <span className="text-[#888888] text-sm"> on </span>
                    <span className="text-[#5865F2] text-sm">
                      {comment.post}
                    </span>
                    <Badge
                      variant={
                        comment.status === "pending" ? "warning" : "success"
                      }
                      className="ml-2 scale-75 origin-left"
                    >
                      {comment.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-[#888888] whitespace-nowrap">
                    {comment.date}
                  </span>
                </div>
                <p className="text-sm text-[#888888] mb-4">{comment.content}</p>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Check}
                    className="text-[#22c55e] hover:bg-[#22c55e]/10"
                    onClick={() => showToast("Comment approved!")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Flag}
                    className="text-[#f59e0b] hover:bg-[#f59e0b]/10"
                  >
                    Spam
                  </Button>
                  <Button size="sm" variant="danger" icon={Trash2}>
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Reply}
                    className="ml-auto"
                    onClick={() => setShowReplyModal(true)}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
