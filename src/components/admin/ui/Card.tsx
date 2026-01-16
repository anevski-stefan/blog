"use client"

import React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  action?: React.ReactNode
}

export function Card({ children, className = "", title, action }: CardProps) {
  return (
    <div
      className={`bg-[#161616] rounded-xl border border-white/5 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between p-6 pb-0 mb-4">
          {title && (
            <h3 className="font-heading font-semibold text-white">{title}</h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
    </div>
  )
}
