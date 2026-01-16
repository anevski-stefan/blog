import { Post, Category, Tag, MediaItem, Comment } from "@/types/admin"

export const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: "Building Scalable Microservices with Node.js",
    slug: "building-scalable-microservices",
    category: "Architecture",
    status: "published",
    views: 2400,
    date: "Dec 15, 2024",
    featured: true,
  },
  {
    id: 2,
    title: "Advanced React Patterns You Should Know",
    slug: "advanced-react-patterns",
    category: "React",
    status: "published",
    views: 1800,
    date: "Dec 10, 2024",
    featured: false,
  },
  {
    id: 3,
    title: "Zero-Downtime Deployments with Docker & K8s",
    slug: "zero-downtime-deployments",
    category: "DevOps",
    status: "published",
    views: 1500,
    date: "Dec 5, 2024",
    featured: false,
  },
  {
    id: 4,
    title: "TypeScript 5.0: What's New",
    slug: "typescript-5-whats-new",
    category: "TypeScript",
    status: "published",
    views: 1200,
    date: "Nov 28, 2024",
    featured: false,
  },
  {
    id: 5,
    title: "Building Real-Time Dashboards",
    slug: "real-time-dashboards",
    category: "Tutorials",
    status: "draft",
    views: 0,
    date: "Nov 20, 2024",
    featured: false,
  },
]

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Architecture",
    slug: "architecture",
    color: "blue",
    count: 3,
  },
  { id: 2, name: "React", slug: "react", color: "cyan", count: 3 },
  { id: 3, name: "DevOps", slug: "devops", color: "green", count: 2 },
  { id: 4, name: "TypeScript", slug: "typescript", color: "blue", count: 2 },
]

export const MOCK_TAGS: Tag[] = [
  { id: 1, name: "Node.js", slug: "nodejs", count: 5 },
  { id: 2, name: "React", slug: "react", count: 4 },
  { id: 3, name: "TypeScript", slug: "typescript", count: 4 },
  { id: 4, name: "Docker", slug: "docker", count: 3 },
]

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
    name: "microservices.jpg",
    size: "1.2 MB",
    dimensions: "1600x900",
    uploadedAt: "Dec 15, 2024",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    name: "react-patterns.jpg",
    size: "890 KB",
    dimensions: "1600x900",
    uploadedAt: "Dec 10, 2024",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400",
    name: "docker.jpg",
    size: "1.5 MB",
    dimensions: "1600x900",
    uploadedAt: "Dec 5, 2024",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
    name: "typescript.jpg",
    size: "980 KB",
    dimensions: "1600x900",
    uploadedAt: "Nov 28, 2024",
  },
]

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    author: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100",
    content:
      "Great article! The circuit breaker pattern explanation was very helpful.",
    post: "Building Scalable Microservices",
    date: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    author: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    content: "How do you handle distributed transactions?",
    post: "Building Scalable Microservices",
    date: "5 hours ago",
    status: "pending",
  },
  {
    id: 3,
    author: "Emily Zhang",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    content:
      "The compound components pattern completely changed how I structure my React applications.",
    post: "Advanced React Patterns",
    date: "2 days ago",
    status: "approved",
  },
]
