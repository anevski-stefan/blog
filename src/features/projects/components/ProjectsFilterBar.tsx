interface ProjectsFilterBarProps {
  currentFilter: string
  setCurrentFilter: (filter: string) => void
  setVisibleCount: (count: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
}

export function ProjectsFilterBar({
  currentFilter,
  setCurrentFilter,
  setVisibleCount,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}: ProjectsFilterBarProps) {
  return (
    <div className="filter-bar flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 p-4 glass rounded-xl border border-white/10">
      <div className="flex flex-wrap gap-2">
        {["all", "web-app", "api", "design-system", "open-source"].map(cat => (
          <button
            key={cat}
            onClick={() => {
              setCurrentFilter(cat)
              setVisibleCount(9)
            }}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border border-white/10 rounded-lg bg-white/5 transition-all duration-300 ${currentFilter === cat ? "bg-home-accent/20 border-home-accent text-home-accent" : "hover:bg-home-accent/20 hover:text-home-accent hover:border-home-accent"}`}
          >
            {cat === "all" ? "All Projects" : cat.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-home-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setVisibleCount(9)
            }}
            className="w-40 md:w-48 bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-home-accent/50 transition-colors text-white placeholder-home-muted"
          />
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-home-accent/50 transition-colors text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">By Name</option>
        </select>

        <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-home-accent/20 text-home-accent" : "text-white hover:text-home-accent"}`}
            title="Grid View"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-home-accent/20 text-home-accent" : "text-white hover:text-home-accent"}`}
            title="List View"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
