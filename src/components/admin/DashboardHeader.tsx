"use client"

import React from "react"
import Link from "next/link"
import { Search, Bell, Plus, Menu } from "lucide-react"

import { User } from "@supabase/supabase-js"

interface DashboardHeaderProps {
  currentSection: string
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  user: User | null
  onNotificationClick?: () => void
  hasUnread?: boolean
}

export function DashboardHeader({
  currentSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
  onNotificationClick,
  hasUnread = false,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="font-heading text-xl font-semibold capitalize text-white">
              {currentSection}
            </h1>
            <p className="text-sm text-[#888888]">
              {currentSection === "overview"
                ? `Welcome back, ${user?.user_metadata?.full_name?.split(" ")[0] || "Admin"}`
                : `Manage your ${currentSection}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-[#111111]/80 border border-white/10 rounded-lg text-sm text-white focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] outline-none transition-all"
            />
          </div>

          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-[#888888]" />
            {hasUnread && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full animate-pulse" />
            )}
          </button>

          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
