import type { Project } from "@/features/projects/data/projects"

interface ProjectStatusBadgeProps {
  status: Project["status"]
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  switch (status) {
    case "live":
      return (
        <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-500 text-[10px] font-mono rounded uppercase">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </span>
      )
    case "development":
      return (
        <span className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-mono rounded uppercase">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>In Dev
        </span>
      )
    case "archived":
      return (
        <span className="flex items-center gap-1.5 px-2 py-1 bg-home-muted/20 text-home-muted text-[10px] font-mono rounded uppercase">
          Archived
        </span>
      )
    default:
      return null
  }
}
