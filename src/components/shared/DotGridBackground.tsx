import { cn } from "@/lib/utils"

interface DotGridBackgroundProps {
  className?: string
  dotColor?: string
  dotSizePx?: number
}

export function DotGridBackground({
  className,
  dotColor = "#5865F2",
  dotSizePx = 32,
}: DotGridBackgroundProps) {
  return (
    <div
      className={cn("fixed inset-0 -z-10 opacity-[0.03]", className)}
      style={{
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        backgroundSize: `${dotSizePx}px ${dotSizePx}px`,
      }}
    />
  )
}
