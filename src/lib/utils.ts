import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { WORDS_PER_MINUTE } from "@/lib/constants"

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with Tailwind precedence rules applied
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-4 overrides px-2)
 * cn('text-red-500', condition && 'text-blue-500') // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a human-readable string
 * @param date - Date object or ISO date string
 * @returns Formatted date string in "Month Day, Year" format (e.g., "January 15, 2024")
 * @example
 * formatDate(new Date('2024-01-15')) // => 'January 15, 2024'
 * formatDate('2024-01-15T00:00:00Z') // => 'January 15, 2024'
 */
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Calculate estimated reading time for content
 * Recursively extracts text from TipTap JSON content and calculates reading time
 * @param content - TipTap JSON content object or any nested structure
 * @returns Estimated reading time in minutes (minimum 1 minute)
 * @example
 * const content = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello world' }] }] }
 * calculateReadingTime(content) // => 1 (minimum)
 */
export function calculateReadingTime(content: unknown): number {
  if (typeof content === "string") {
    const raw = content.trim()

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown
        if (parsed && typeof parsed === "object") {
          return calculateReadingTime(parsed)
        }
      } catch {}

      const text = raw
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .trim()

      const wordCount = text
        ? text
            .split(/\s+/)
            .map(w => w.trim())
            .filter(w => w.length > 0).length
        : 0

      const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE)
      return Math.max(1, readingTime)
    }
  }

  if (!content || typeof content !== "object") {
    return 1
  }

  let wordCount = 0

  function extractText(node: unknown): void {
    if (!node) return

    if (typeof node === "string") {
      wordCount += node
        .trim()
        .split(/\s+/)
        .filter(w => w.length > 0).length
      return
    }

    if (Array.isArray(node)) {
      node.forEach(extractText)
      return
    }

    if (typeof node === "object") {
      const nodeObj = node as Record<string, unknown>
      if ("text" in nodeObj && typeof nodeObj.text === "string") {
        wordCount += nodeObj.text
          .trim()
          .split(/\s+/)
          .filter(w => w.length > 0).length
      }

      if ("content" in nodeObj && Array.isArray(nodeObj.content)) {
        extractText(nodeObj.content)
      }
    }
  }

  extractText(content)

  const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE)
  return Math.max(1, readingTime)
}

/**
 * TipTap-compatible content type
 * Used for passing content to the TiptapEditor component
 */
export type TiptapContent = string | object | null | undefined

/**
 * Safely convert Prisma JsonValue to TipTap editor content
 * Handles the type mismatch between Prisma's JsonValue (which includes number | boolean)
 * and TipTap's expected content type (string | object | null | undefined)
 * @param value - Prisma JsonValue or any content value
 * @returns TipTap-compatible content, or undefined if the value is not valid content
 * @example
 * toEditorContent(post.content) // Safely converts for TiptapEditor
 */
export function toEditorContent(value: unknown): TiptapContent {
  if (value === null || value === undefined) {
    return value
  }
  if (typeof value === "string") {
    const raw = value.trim()
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown
        if (parsed && typeof parsed === "object") {
          return parsed
        }
      } catch {}
    }
    return value
  }
  if (typeof value === "object") {
    return value
  }
  // For number, boolean, or other primitives, return undefined
  // as they're not valid TipTap content
  return undefined
}

/**
 * Format a date to a relative time string (e.g. "2 minutes ago")
 * @param date - Date object or ISO date string
 * @returns Relative time string
 */
export function timeAgo(date: Date | string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  )

  let interval = seconds / 31536000
  if (interval > 1) {
    const years = Math.floor(interval)
    return years + (years === 1 ? " year ago" : " years ago")
  }

  interval = seconds / 2592000
  if (interval > 1) {
    const months = Math.floor(interval)
    return months + (months === 1 ? " month ago" : " months ago")
  }

  interval = seconds / 86400
  if (interval > 1) {
    const days = Math.floor(interval)
    return days + (days === 1 ? " day ago" : " days ago")
  }

  interval = seconds / 3600
  if (interval > 1) {
    const hours = Math.floor(interval)
    return hours + (hours === 1 ? " hour ago" : " hours ago")
  }

  interval = seconds / 60
  if (interval > 1) {
    const minutes = Math.floor(interval)
    return minutes + (minutes === 1 ? " minute ago" : " minutes ago")
  }

  return "just now"
}
