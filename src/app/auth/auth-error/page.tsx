import { AuthErrorContent } from "@/components/auth/AuthErrorContent"
import { constructMetadata } from "@/lib/metadata"
import { Suspense } from "react"

export const metadata = constructMetadata({
  title: "Access Denied — Stefan Anevski Blog",
  description: "Unauthorized access attempt detected.",
})

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AuthErrorContent />
    </Suspense>
  )
}
