"use client"

import Lottie from "lottie-react"
import loadingAnimation from "@/../public/animations/loading-spinner.json"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: { width: 24, height: 24 },
  md: { width: 120, height: 120 },
  lg: { width: 180, height: 180 },
}

/**
 * Reusable Lottie loading spinner component
 * Can be used for full-page loading or inline loading states
 */
export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const dimensions = sizeMap[size]

  return (
    <Lottie
      animationData={loadingAnimation}
      loop
      autoplay
      style={dimensions}
      className={cn(
        "inline-block",
        "dark:brightness-150 dark:contrast-125",
        className
      )}
      aria-label="Loading animation"
    />
  )
}
