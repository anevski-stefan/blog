interface ProjectsStatusSummaryProps {
  total: number
}

export function ProjectsStatusSummary({ total }: ProjectsStatusSummaryProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-home-muted">
        Showing <span className="text-white font-medium">{total}</span> projects
      </p>
      <div className="flex items-center gap-2 text-xs text-home-muted">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Live
        <span className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></span> In
        Development
        <span className="w-2 h-2 bg-home-muted rounded-full ml-2"></span>{" "}
        Archived
      </div>
    </div>
  )
}
