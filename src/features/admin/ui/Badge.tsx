import React from "react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "danger" | "info" | "neutral"
  className?: string
}

export function Badge({
  children,
  variant = "info",
  className = "",
}: BadgeProps) {
  const variants = {
    success: "bg-[#22c55e]/15 text-[#22c55e]",
    warning: "bg-[#f59e0b]/15 text-[#f59e0b]",
    danger: "bg-[#ef4444]/15 text-[#ef4444]",
    info: "bg-[#5865F2]/15 text-[#5865F2]",
    neutral: "bg-white/5 text-[#888888]",
  }

  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
