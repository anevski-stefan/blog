"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"

/**
 * Global loading state for the application
 * Displays a professional Lottie loading spinner that works for all routes
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center">
        <LoadingSpinner size="lg" />
        <p className="-mt-8 text-base text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
