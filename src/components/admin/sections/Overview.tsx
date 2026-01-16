"use client"

import React from "react"
import Link from "next/link"
import {
  FileText,
  Eye,
  MessageSquare,
  Users,
  Plus,
  FolderOpen,
  Tag,
  Upload,
} from "lucide-react"
import { OverviewProps } from "@/types/admin"
import { StatCard } from "../ui/StatCard"
import { Card } from "../ui/Card"

export function Overview({
  setShowCategoryModal,
  setShowTagModal,
  setCurrentSection,
}: OverviewProps) {
  const stats = [
    {
      label: "Total Posts",
      value: "12",
      change: "+12%",
      trend: "up" as const,
      icon: FileText,
    },
    {
      label: "Total Views",
      value: "24.5K",
      change: "+28%",
      trend: "up" as const,
      icon: Eye,
    },
    {
      label: "Comments",
      value: "89",
      change: "-5%",
      trend: "down" as const,
      icon: MessageSquare,
    },
    {
      label: "Subscribers",
      value: "1,247",
      change: "+18%",
      trend: "up" as const,
      icon: Users,
    },
  ]

  const activities = [
    {
      icon: FileText,
      color: "text-[#22c55e]",
      bgColor: "bg-[#22c55e]/10",
      text: 'Published "Building Scalable Microservices"',
      time: "2 hours ago",
    },
    {
      icon: MessageSquare,
      color: "text-[#5865F2]",
      bgColor: "bg-[#5865F2]/10",
      text: "David Kim commented on your post",
      time: "5 hours ago",
    },
    {
      icon: Users,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      text: "3 new subscribers this week",
      time: "1 day ago",
    },
  ]

  const quickActions = [
    { label: "New Post", icon: Plus, href: "/blog/new" },
    {
      label: "Add Category",
      icon: FolderOpen,
      onClick: () => setShowCategoryModal(true),
    },
    { label: "Add Tag", icon: Tag, onClick: () => setShowTagModal(true) },
    {
      label: "Upload Media",
      icon: Upload,
      onClick: () => setCurrentSection("media"),
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card title="Recent Activity">
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}
                >
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div>
                  <p
                    className="text-sm text-white"
                    dangerouslySetInnerHTML={{ __html: activity.text }}
                  />
                  <p className="text-xs text-[#888888]">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) =>
              action.href ? (
                <Link key={i} href={action.href} className="group">
                  <div className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-[#5865F2]/10 border border-white/10 hover:border-[#5865F2]/30 rounded-xl transition-all h-full">
                    <div className="w-10 h-10 bg-[#5865F2]/20 rounded-lg flex items-center justify-center group-hover:bg-[#5865F2]/30 transition-colors">
                      <action.icon className="w-5 h-5 text-[#5865F2]" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {action.label}
                    </span>
                  </div>
                </Link>
              ) : (
                <button key={i} onClick={action.onClick} className="group">
                  <div className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-[#5865F2]/10 border border-white/10 hover:border-[#5865F2]/30 rounded-xl transition-all h-full">
                    <div className="w-10 h-10 bg-[#5865F2]/20 rounded-lg flex items-center justify-center group-hover:bg-[#5865F2]/30 transition-colors">
                      <action.icon className="w-5 h-5 text-[#5865F2]" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {action.label}
                    </span>
                  </div>
                </button>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
