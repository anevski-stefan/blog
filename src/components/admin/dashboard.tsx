"use client"

import React, { useState } from "react"
import { Sidebar } from "./Sidebar"
import { DashboardHeader } from "./DashboardHeader"
import { Overview } from "./sections/Overview"
import { PostsList } from "./sections/PostsList"
import { Categories } from "./sections/Categories"
import { Tags } from "./sections/Tags"
import { MediaLibrary } from "./sections/MediaLibrary"
import { Comments } from "./sections/Comments"
import { Settings } from "./sections/Settings"
import { CategoryModal } from "./modals/CategoryModal"
import { TagModal } from "./modals/TagModal"
import { MediaDetailsModal } from "./modals/MediaDetailsModal"
import { ReplyModal } from "./modals/ReplyModal"
import { MediaItem } from "@/types/admin"
import { User } from "@supabase/supabase-js"
import {
  MOCK_POSTS,
  MOCK_CATEGORIES,
  MOCK_TAGS,
  MOCK_MEDIA,
  MOCK_COMMENTS,
} from "@/lib/data/mock-admin-data"

interface AdminDashboardProps {
  user: User | null
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [currentSection, setCurrentSection] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])
  const [settingsTab, setSettingsTab] = useState("general")
  const [mediaView, setMediaView] = useState<"grid" | "list">("grid")
  const [commentFilter, setCommentFilter] = useState("all")
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(
    null
  )
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: "",
    show: false,
  })

  const showToast = (message: string) => {
    setToast({ message, show: true })
    setTimeout(() => setToast({ message: "", show: false }), 3000)
  }
  const renderSection = () => {
    switch (currentSection) {
      case "overview":
        return (
          <Overview
            setShowCategoryModal={setShowCategoryModal}
            setShowTagModal={setShowTagModal}
            setCurrentSection={setCurrentSection}
          />
        )
      case "posts":
        return (
          <PostsList
            posts={MOCK_POSTS}
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
            categories={MOCK_CATEGORIES}
            setShowCategoryModal={setShowCategoryModal}
          />
        )
      case "tags":
        return <Tags tags={MOCK_TAGS} setShowTagModal={setShowTagModal} />
      case "media":
        return (
          <MediaLibrary
            mediaItems={MOCK_MEDIA}
            mediaView={mediaView}
            setMediaView={setMediaView}
            setSelectedMediaItem={setSelectedMediaItem}
            setShowMediaModal={setShowMediaModal}
          />
        )
      case "comments":
        return (
          <Comments
            comments={MOCK_COMMENTS}
            commentFilter={commentFilter}
            setCommentFilter={setCommentFilter}
            showToast={showToast}
            setShowReplyModal={setShowReplyModal}
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
      />

      <main className="flex-1 min-h-screen">
        <DashboardHeader
          currentSection={currentSection}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          user={user}
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
      <ReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        onSave={(msg: string) => {
          setShowReplyModal(false)
          showToast(msg)
        }}
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
