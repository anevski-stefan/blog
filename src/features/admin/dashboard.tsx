"use client"

import React, { useState } from "react"
import { Sidebar } from "./Sidebar"
import { DashboardHeader } from "./DashboardHeader"
import { Overview } from "./sections/Overview"
import { PostsList } from "./sections/PostsList"
import { Categories } from "./sections/Categories"
import { Tags } from "./sections/Tags"
import { MediaLibrary } from "./sections/MediaLibrary"
import { Settings } from "./sections/Settings"
import { CategoryModal } from "./modals/CategoryModal"
import { TagModal } from "./modals/TagModal"
import { MediaDetailsModal } from "./modals/MediaDetailsModal"
import { NotificationModal } from "./modals/NotificationModal"
import {
  MediaItem,
  Post,
  Category,
  Tag,
  AdminStats,
  Activity,
} from "@/types/admin"
import { User } from "@supabase/supabase-js"
import { deleteCategory, deleteTag } from "@/actions/admin-taxonomy"
import { getUnreadStatus } from "@/actions/notifications"

interface AdminDashboardProps {
  user: User | null
  posts: Post[]
  categories: Category[]
  tags: Tag[]
  mediaItems: MediaItem[]
  stats: AdminStats[]
  activities: Activity[]
  counts: {
    posts: number
    categories: number
    tags: number
    media: number
  }
}

export function AdminDashboard({
  user,
  posts,
  categories,
  tags,
  mediaItems,
  stats,
  activities,
  counts,
}: AdminDashboardProps) {
  const [currentSection, setCurrentSection] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPosts, setSelectedPosts] = useState<(string | number)[]>([])
  const [settingsTab, setSettingsTab] = useState("general")
  const [mediaView, setMediaView] = useState<"grid" | "list">("grid")
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(
    null
  )
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: "",
    show: false,
  })
  const [hasUnread, setHasUnread] = useState(false)

  React.useEffect(() => {
    const checkUnread = async () => {
      const result = await getUnreadStatus()
      if (result.success) {
        setHasUnread(result.hasUnread || false)
      }
    }

    checkUnread()
    const interval = setInterval(checkUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleNotificationsRead = () => {
    getUnreadStatus().then(res => {
      if (res.success) setHasUnread(res.hasUnread || false)
    })
  }

  const showToast = (message: string) => {
    setToast({ message, show: true })
    setTimeout(() => setToast({ message: "", show: false }), 3000)
  }

  const handleDeleteCategory = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    const result = await deleteCategory(String(id))
    if (result.success) {
      showToast("Category deleted successfully")
    } else {
      showToast(result.error || "Failed to delete category")
    }
  }

  const handleDeleteTag = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this tag?")) return
    const result = await deleteTag(String(id))
    if (result.success) {
      showToast("Tag deleted successfully")
    } else {
      showToast(result.error || "Failed to delete tag")
    }
  }

  const renderSection = () => {
    switch (currentSection) {
      case "overview":
        return (
          <Overview
            stats={stats}
            activities={activities}
            setShowCategoryModal={setShowCategoryModal}
            setShowTagModal={setShowTagModal}
            setCurrentSection={setCurrentSection}
          />
        )
      case "posts":
        return (
          <PostsList
            posts={posts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            selectedPosts={selectedPosts}
            setSelectedPosts={setSelectedPosts}
          />
        )
      case "categories":
        return (
          <Categories
            categories={categories}
            setShowCategoryModal={setShowCategoryModal}
            onDelete={handleDeleteCategory}
          />
        )
      case "tags":
        return (
          <Tags
            tags={tags}
            setShowTagModal={setShowTagModal}
            onDelete={handleDeleteTag}
          />
        )
      case "media":
        return (
          <MediaLibrary
            mediaItems={mediaItems}
            mediaView={mediaView}
            setMediaView={setMediaView}
            setSelectedMediaItem={setSelectedMediaItem}
            setShowMediaModal={setShowMediaModal}
          />
        )

      case "settings":
        return (
          <Settings
            settingsTab={settingsTab}
            setSettingsTab={setSettingsTab}
            showToast={showToast}
          />
        )
      default:
        return (
          <Overview
            stats={stats}
            activities={activities}
            setShowCategoryModal={setShowCategoryModal}
            setShowTagModal={setShowTagModal}
            setCurrentSection={setCurrentSection}
          />
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        user={user}
        counts={counts}
      />

      <main className="flex-1 min-h-screen">
        <DashboardHeader
          currentSection={currentSection}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          user={user}
          onNotificationClick={() => setShowNotificationModal(true)}
          hasUnread={hasUnread}
        />

        <div className="p-4 lg:p-8">{renderSection()}</div>
      </main>

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={(msg: string) => {
          setShowCategoryModal(false)
          showToast(msg)
        }}
      />
      <TagModal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        onSave={(msg: string) => {
          setShowTagModal(false)
          showToast(msg)
        }}
      />
      <MediaDetailsModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        item={selectedMediaItem}
      />
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onUpdate={handleNotificationsRead}
      />

      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-[#161616] border border-white/10 rounded-xl px-5 py-4 shadow-2xl z-[100] animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#5865F2] rounded-full" />
            <span className="text-sm text-white">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
