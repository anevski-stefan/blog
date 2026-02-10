"use client"

import React from "react"
import { Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { PostsListProps } from "@/types/admin"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Card } from "../ui/Card"

export function PostsList({
  posts,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedPosts,
  setSelectedPosts,
}: PostsListProps) {
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFilter = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#111111]/80 border border-white/10 rounded-lg text-sm text-[#888888] focus:border-[#5865F2] outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left p-4 w-10">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-[#5865F2]"
                  />
                </th>
                <th className="text-left p-4 text-xs font-mono text-[#888888] uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left p-4 text-xs font-mono text-[#888888] uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="text-left p-4 text-xs font-mono text-[#888888] uppercase tracking-wider hidden lg:table-cell">
                  Status
                </th>
                <th className="text-left p-4 text-xs font-mono text-[#888888] uppercase tracking-wider hidden lg:table-cell">
                  Views
                </th>
                <th className="text-right p-4 text-xs font-mono text-[#888888] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <tr
                    key={post.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => {
                          setSelectedPosts(prev =>
                            prev.includes(post.id)
                              ? prev.filter(p => p !== post.id)
                              : [...prev, post.id]
                          )
                        }}
                        className="w-4 h-4 rounded accent-[#5865F2]"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {post.featured && (
                          <span className="w-1 h-8 bg-[#5865F2] rounded-full" />
                        )}
                        <div>
                          <p className="font-medium text-sm text-white">
                            {post.title}
                          </p>
                          <p className="text-xs text-[#888888]">
                            /blog/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge variant="info">{post.category}</Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <Badge
                        variant={
                          post.status === "published" ? "success" : "warning"
                        }
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-[#888888]">
                        {post.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/posts/${post.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit}
                            title="Edit"
                          />
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          title="View"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          title="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-[#888888] text-sm italic border-none"
                  >
                    No posts found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
