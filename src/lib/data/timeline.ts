export type TimelineType = "work" | "education" | "achievement" | "project"

export interface TimelineItem {
  id: string
  type: TimelineType
  year: string
  date: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  icon: "work" | "education" | "achievement" | "project"
  image?: string
}

export const timelineData: TimelineItem[] = [
  {
    id: "work-1",
    type: "work",
    year: "2025",
    date: "Jun 2025 - Present",
    title: "Freelance Consultant",
    subtitle: "Full-Stack Software Engineer (Remote)",
    description:
      "Implemented an internationalization system and configured Cloudflare with a video editor for a course platform, reducing localization and upload times by 35% and ensuring global accessibility with optimized playback. Established access controls and built key platform pages while resolving file issues, strengthening security by 100% and cutting potential errors by 30% for a reliable launch.",
    tags: ["Cloudflare", "Internationalization", "Security"],
    icon: "work",
  },
  {
    id: "work-2",
    type: "work",
    year: "2023",
    date: "Jul 2023 - Present",
    title: "Software Engineer",
    subtitle: "VASS Company (Skopje, North Macedonia)",
    description:
      "Migrated critical forms from vanilla JavaScript to Solid.js, enhancing front-end performance by 30%, resulting in a faster and more responsive user experience for over 1,000 active users. Managed and executed front-end and back-end releases by coordinating with cross-functional teams and aligning with sprint deliverables, resulting in reliable deployments with zero downtime and improved team delivery flow.",
    tags: ["Solid.js", "JavaScript", "Front-end Performance"],
    icon: "work",
  },
  {
    id: "achievement-1",
    type: "achievement",
    year: "2025",
    date: "Mar 2025",
    title: "Software Engineer, Team Lead - Mega Hackathon 2025",
    subtitle: "Mega Hackathon 2025",
    description:
      "Led the full-stack development of Smart Cook in a 2-person team, owning ideation, architecture, and implementation of LLM-powered features. Increased app performance by 10% through module optimization.",
    tags: ["Vite", "React.js", "Spring Boot", "PostgreSQL"],
    icon: "achievement",
  },
  {
    id: "education-1",
    type: "education",
    year: "2024",
    date: "Feb 2024 – Present",
    title: "Software Engineer",
    subtitle: "Zero To Mastery Academy",
    description:
      "Software Engineer training focused on modern web technologies.",
    tags: [],
    icon: "education",
  },
  {
    id: "education-2",
    type: "education",
    year: "2019",
    date: "Oct 2019 – Oct 2024",
    title:
      "Bachelor of Engineering in Information Sciences and Computer Engineering",
    subtitle: "Faculty of Computer Science and Engineering",
    description:
      "Focused on computer science fundamentals and software engineering principles.",
    tags: [],
    icon: "education",
  },
]
