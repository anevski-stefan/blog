"use client"

import React from "react"
import Link from "next/link"
import {
  FileText,
  Eye,
  Users,
  Plus,
  FolderOpen,
  Tag,
  Upload,
} from "lucide-react"
import { OverviewProps } from "@/features/admin/types/admin"
import { StatCard } from "../ui/StatCard"
import { Card } from "../ui/Card"

const iconMap = {
  FileText,
  Eye,
  Users,
}

export function Overview({
  stats,
  activities,
  setShowCategoryModal,
  setShowTagModal,
  setCurrentSection,
}: OverviewProps) {
  const quickActions = [
    { label: "New Post", icon: Plus, href: "/admin/posts/new" },
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
            {activities.map((activity, i) => {
              const ActivityIcon =
                (
                  iconMap as Record<
                    string,
                    React.ComponentType<{ className?: string }>
                  >
                )[activity.icon] || FileText
              return (
                <div key={i} className="flex gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}
                  >
                    <ActivityIcon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div>
                    <p
                      className="text-sm text-white"
                      dangerouslySetInnerHTML={{ __html: activity.text }}
                    />
                    <p className="text-xs text-[#888888]">{activity.time}</p>
                  </div>
                </div>
              )
            })}
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
