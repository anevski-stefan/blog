import React from "react"
import {
  TrendingUp,
  TrendingDown,
  LucideIcon,
  FileText,
  Eye,
  Users,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Eye,
  Users,
}

interface StatCardProps {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: string
}

export function StatCard({
  label,
  value,
  change,
  trend,
  icon: iconName,
}: StatCardProps) {
  const Icon = iconMap[iconName] || FileText
  return (
    <div className="bg-[#161616] rounded-xl border border-white/5 p-5 hover:transform hover:-translate-y-1 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-[#5865F2]/10 rounded-lg">
          <Icon className="w-5 h-5 text-[#5865F2]" />
        </div>
        <span
          className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-[#22c55e]" : "text-[#ef4444]"}`}
        >
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {change}
        </span>
      </div>
      <div className="font-heading text-2xl lg:text-3xl font-semibold mb-1 text-white">
        {value}
      </div>
      <div className="text-sm text-[#888888]">{label}</div>
    </div>
  )
}
