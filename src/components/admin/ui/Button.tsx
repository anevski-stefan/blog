"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  icon?: LucideIcon
  isLoading?: boolean
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  isLoading,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-transparent",
    secondary: "bg-white/5 hover:bg-white/10 text-white border-white/10",
    danger:
      "bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] border-transparent",
    ghost:
      "bg-transparent hover:bg-white/5 text-[#888888] hover:text-white border-transparent",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  }

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`flex items-center justify-center gap-2 font-medium rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      )}
      {children}
    </button>
  )
}
