import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Blog — Stefan Anevski",
  description:
    "Thoughts on software engineering, system design, and building scalable applications.",
})

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
