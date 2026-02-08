import { Metadata } from "next"
import { TimelineClientView } from "./client-view"

export const metadata: Metadata = {
  title: "Timeline — Stefan Anevski",
  description:
    "My professional journey through the years - milestones, achievements, and growth.",
}

export default function TimelinePage() {
  return <TimelineClientView />
}
