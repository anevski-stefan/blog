import { NotFoundContent } from "@/components/shared/not-found-content"

export const metadata = {
  title: "404 — Page Not Found | Stefan Anevski",
  description: "The page you're looking for doesn't exist.",
}

export default function NotFound() {
  return <NotFoundContent />
}
