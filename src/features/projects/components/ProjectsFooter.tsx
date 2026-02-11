export function ProjectsFooter() {
  return (
    <footer className="py-8 md:py-12 px-6 md:px-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-sm text-home-muted">
        © {new Date().getFullYear()} Stefan Anevski. All rights reserved.
      </p>
      <div className="flex gap-6 md:gap-8">
        <a
          href="#"
          className="text-sm text-home-muted hover:text-white transition-colors duration-300"
        >
          Twitter
        </a>
        <a
          href="#"
          className="text-sm text-home-muted hover:text-white transition-colors duration-300"
        >
          LinkedIn
        </a>
        <a
          href="#"
          className="text-sm text-home-muted hover:text-white transition-colors duration-300"
        >
          GitHub
        </a>
        <a
          href="#"
          className="text-sm text-home-muted hover:text-white transition-colors duration-300"
        >
          Dribbble
        </a>
      </div>
    </footer>
  )
}
