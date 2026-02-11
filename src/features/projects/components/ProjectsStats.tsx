export function ProjectsStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      <div className="stat-card glass rounded-xl border border-white/10 p-5 text-center transition-all duration-300 hover:border-home-accent/30 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-home-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="font-heading text-3xl font-bold text-home-accent mb-1">
          <span className="stat-number" data-target="24">
            0
          </span>
        </div>
        <div className="text-xs text-home-muted uppercase tracking-wider">
          Total Projects
        </div>
      </div>
      <div className="stat-card glass rounded-xl border border-white/10 p-5 text-center transition-all duration-300 hover:border-home-accent/30 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-home-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="font-heading text-3xl font-bold text-green-500 mb-1">
          <span className="stat-number" data-target="18">
            0
          </span>
        </div>
        <div className="text-xs text-home-muted uppercase tracking-wider">
          Live & Active
        </div>
      </div>
      <div className="stat-card glass rounded-xl border border-white/10 p-5 text-center transition-all duration-300 hover:border-home-accent/30 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-home-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="font-heading text-3xl font-bold text-yellow-500 mb-1">
          <span className="stat-number" data-target="2">
            0
          </span>
          M+
        </div>
        <div className="text-xs text-home-muted uppercase tracking-wider">
          Users Reached
        </div>
      </div>
      <div className="stat-card glass rounded-xl border border-white/10 p-5 text-center transition-all duration-300 hover:border-home-accent/30 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-home-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="font-heading text-3xl font-bold text-pink-500 mb-1">
          <span className="stat-number" data-target="15">
            0
          </span>
        </div>
        <div className="text-xs text-home-muted uppercase tracking-wider">
          Open Source
        </div>
      </div>
    </div>
  )
}
