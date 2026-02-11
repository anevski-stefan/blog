export interface ProjectStats {
  users: string
  stars: string
  duration: string
}

export interface Project {
  id: number
  title: string
  category: string
  description: string
  longDescription: string
  image: string
  tech: string[]
  features: string[]
  status: "live" | "development" | "archived"
  featured: boolean
  year: number
  liveUrl: string | null
  githubUrl: string | null
  stats: ProjectStats
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Code Quest",
    category: "web-app",
    description:
      "A full-stack web app for discovering and contributing to GitHub projects.",
    longDescription:
      "Designed and built a full-stack web app for discovering and contributing to GitHub projects, integrating OAuth2 login, contributor analytics, and smart issue filtering, streamlining open-source onboarding by 30% and boosting API performance by 40% through caching, ETag validation, and rate-limiting.",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80",
    tech: [
      "React.js",
      "TypeScript",
      "Redux",
      "Tailwind Css",
      "React Query",
      "Node.js",
      "Express.js",
      "Supabase",
      "PostgreSQL",
      "OAuth",
      "Vite",
    ],
    features: [
      "GitHub OAuth",
      "Contributor Analytics",
      "Issue Filtering",
      "Caching",
      "Rate Limiting",
    ],
    status: "live",
    featured: true,
    year: 2025,
    liveUrl: "https://codequest.demo",
    githubUrl: "https://github.com/stefananevski/code-quest",
    stats: { users: "Active", stars: "TBD", duration: "1 month" },
  },
  {
    id: 2,
    title: "Smart Cook",
    category: "web-app",
    description:
      "A sophisticated cooking assistant application with AI vision technology.",
    longDescription:
      "Developed a sophisticated cooking assistant application that enhanced recipe discovery by 45% through implementing Google Generative AI vision technology for ingredient recognition, resulting in a 40% improvement in meal preparation efficiency and enabling users to follow step-by-step cooking instructions with real-time feedback.",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80",
    tech: [
      "Next.js",
      "React.js",
      "TypeScript",
      "Material UI",
      "Tailwind Css",
      "Redux",
      "Supabase",
      "PostgreSQL",
      "Google Generative AI",
    ],
    features: [
      "Ingredient Recognition",
      "Recipe Discovery",
      "Real-time Feedback",
      "Step-by-step Instructions",
    ],
    status: "live",
    featured: true,
    year: 2023,
    liveUrl: "https://smartcook.demo",
    githubUrl: "https://github.com/stefananevski/smart-cook",
    stats: { users: "Active", stars: "TBD", duration: "Ongoing" },
  },
]
