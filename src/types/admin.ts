import { LucideIcon } from "lucide-react"

export interface Post {
  id: number
  title: string
  slug: string
  category: string
  status: "published" | "draft"
  views: number
  date: string
  featured: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  color?: string
  count: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  count: number
}

export interface MediaItem {
  id: number
  url: string
  name: string
  size: string
  dimensions: string
  uploadedAt: string
}

export interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  post: string
  date: string
  status: "pending" | "approved" | "spam"
}

export interface AdminStats {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
}

export interface NavItem {
  id: string
  icon: LucideIcon
  label: string
  badge: string | null
  group: string
}

export interface OverviewProps {
  setShowCategoryModal: (show: boolean) => void
  setShowTagModal: (show: boolean) => void
  setCurrentSection: (section: string) => void
}

export interface PostsListProps {
  posts: Post[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (filter: string) => void
  selectedPosts: number[]
  setSelectedPosts: React.Dispatch<React.SetStateAction<number[]>>
}

export interface CategoriesProps {
  categories: Category[]
  setShowCategoryModal: (show: boolean) => void
}

export interface TagsProps {
  tags: Tag[]
  setShowTagModal: (show: boolean) => void
}

export interface MediaLibraryProps {
  mediaItems: MediaItem[]
  mediaView: "grid" | "list"
  setMediaView: (view: "grid" | "list") => void
  setSelectedMediaItem: (item: MediaItem) => void
  setShowMediaModal: (show: boolean) => void
}

export interface CommentsProps {
  comments: Comment[]
  commentFilter: string
  setCommentFilter: (filter: string) => void
  showToast: (msg: string) => void
  setShowReplyModal: (show: boolean) => void
}

export interface SettingsProps {
  settingsTab: string
  setSettingsTab: (tab: string) => void
  showToast: (msg: string) => void
}
