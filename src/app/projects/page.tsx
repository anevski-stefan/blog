import { constructMetadata } from "@/lib/metadata"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { WebGLBackground } from "@/components/shared/backgrounds/WebGLBackground"
import { DotGridBackground } from "@/components/shared/DotGridBackground"
import { projectsData } from "@/features/projects/data/projects"
import { ProjectsHero } from "@/features/projects/components/ProjectsHero"
import { ProjectsStats } from "@/features/projects/components/ProjectsStats"
import { ProjectsInteractive } from "@/features/projects/components/ProjectsInteractive"
import { ProjectsCtaSection } from "@/features/projects/components/ProjectsCtaSection"
import { ProjectsFooter } from "@/features/projects/components/ProjectsFooter"

export const metadata = constructMetadata({
  title: "Projects — Stefan Anevski",
  description:
    "Explore my portfolio of software engineering projects, from web applications to system architecture.",
})

export default function ProjectsPage() {
  return (
    <div className="relative z-0 font-body bg-home-primary text-white overflow-x-hidden min-h-screen">
      <WebGLBackground />
      <DotGridBackground className="opacity-[0.02]" />

      <SiteHeader variant="solid" />

      <main id="projects-root" className="pt-28 md:pt-36 pb-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <ProjectsHero />
          <ProjectsStats />
          <ProjectsInteractive projects={projectsData} />
          <ProjectsCtaSection />
        </div>
      </main>

      <ProjectsFooter />
    </div>
  )
}
