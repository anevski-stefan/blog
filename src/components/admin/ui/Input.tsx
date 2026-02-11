import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">{label}</label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-2.5 bg-[#111111]/80 border border-white/10 rounded-lg text-white focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] outline-none transition-all placeholder:text-[#888888]/50 ${className}`}
      />
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  )
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function TextArea({
  label,
  error,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">{label}</label>
      )}
      <textarea
        {...props}
        className={`w-full px-4 py-2.5 bg-[#111111]/80 border border-white/10 rounded-lg text-white focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] outline-none transition-all placeholder:text-[#888888]/50 resize-none ${className}`}
      />
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  )
}
