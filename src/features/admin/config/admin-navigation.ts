import {
  LayoutGrid,
  FileText,
  FolderOpen,
  Tag,
  Image as ImageIcon,
} from "lucide-react"

export const ADMIN_NAV_ITEMS = [
  {
    id: "overview",
    icon: LayoutGrid,
    label: "Overview",
    badge: null,
    group: "Main",
  },
  { id: "posts", icon: FileText, label: "Posts", badge: null, group: "Main" },
  {
    id: "categories",
    icon: FolderOpen,
    label: "Categories",
    badge: null,
    group: "Main",
  },
  { id: "tags", icon: Tag, label: "Tags", badge: null, group: "Main" },
  {
    id: "media",
    icon: ImageIcon,
    label: "Media",
    badge: null,
    group: "Content",
  },
]
