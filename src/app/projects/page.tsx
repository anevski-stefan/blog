import { ProjectsClientView } from "./client-view"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Projects — Stefan Anevski",
  description:
    "Explore my portfolio of software engineering projects, from web applications to system architecture.",
})

export default function ProjectsPage() {
  return <ProjectsClientView />
}
