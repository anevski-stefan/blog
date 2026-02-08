import { LucideIcon } from "lucide-react"

export interface Post {
  id: string | number
  title: string
  slug: string
  category: string
  status: "published" | "draft"
  views: number
  date: string
  featured: boolean
}

export interface Category {
  id: string | number
  name: string
  slug: string
  color?: string
  count: number
}

export interface Tag {
  id: string | number
  name: string
  slug: string
  count: number
}

export interface MediaItem {
  id: string | number
  url: string
  name: string
  size: string
  dimensions: string
  uploadedAt: string
}

export interface Activity {
  icon: string
  color: string
  bgColor: string
  text: string
  time: string
}

export interface AdminData {
  posts: Post[]
  categories: Category[]
  tags: Tag[]
  mediaItems: MediaItem[]
}

export interface AdminStats {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: string
}

export interface NavItem {
  id: string
  icon: LucideIcon
  label: string
  badge: string | null
  group: string
}

export interface OverviewProps {
  stats: AdminStats[]
  activities: Activity[]
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
  selectedPosts: (string | number)[]
  setSelectedPosts: React.Dispatch<React.SetStateAction<(string | number)[]>>
}

export interface CategoriesProps {
  categories: Category[]
  setShowCategoryModal: (show: boolean) => void
  onDelete?: (id: string | number) => void
}

export interface TagsProps {
  tags: Tag[]
  setShowTagModal: (show: boolean) => void
  onDelete?: (id: string | number) => void
}

export interface MediaLibraryProps {
  mediaItems: MediaItem[]
  mediaView: "grid" | "list"
  setMediaView: (view: "grid" | "list") => void
  setSelectedMediaItem: (item: MediaItem) => void
  setShowMediaModal: (show: boolean) => void
}

export interface SettingsProps {
  settingsTab: string
  setSettingsTab: (tab: string) => void
  showToast: (msg: string) => void
}
