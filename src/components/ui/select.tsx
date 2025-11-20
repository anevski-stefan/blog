import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "value"
  > {
  multiple?: boolean
  value?: string | string[]
  onChange?: (value: string | string[]) => void
}

export function Select({
  className,
  multiple,
  value,
  onChange,
  ...props
}: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onChange) return

    if (multiple) {
      const values = Array.from(e.target.selectedOptions).map(
        option => option.value
      )
      onChange(values)
    } else {
      onChange(e.target.value)
    }
  }

  return (
    <select
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        multiple && "min-h-[80px]",
        className
      )}
      multiple={multiple}
      value={value}
      onChange={handleChange}
      {...props}
    />
  )
}
