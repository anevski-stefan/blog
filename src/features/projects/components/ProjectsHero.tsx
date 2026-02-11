export function ProjectsHero() {
  return (
    <div className="projects-hero text-center mb-12 md:mb-16">
      <div className="inline-flex items-center gap-3 mb-6">
        <span className="w-2 h-2 bg-home-accent rounded-full animate-pulse"></span>
        <span className="text-xs font-mono font-medium tracking-widest uppercase text-home-accent">
          Portfolio
        </span>
      </div>
      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
        Featured Projects
      </h1>
      <p className="text-home-muted text-lg max-w-2xl mx-auto">
        A curated collection of projects showcasing my expertise in full-stack
        development, system design, and creative problem-solving.
      </p>
    </div>
  )
}
