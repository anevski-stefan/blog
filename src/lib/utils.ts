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
  if (!content || typeof content !== "object") {
    return 1
  }

  let wordCount = 0

  function extractText(node: unknown): void {
    if (typeof node === "string") {
      wordCount += node
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0).length
      return
    }

    if (Array.isArray(node)) {
      node.forEach(extractText)
      return
    }

    if (!node || typeof node !== "object") {
      return
    }

    if ("text" in node && typeof node.text === "string") {
      wordCount += node.text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0).length
    }

    if ("content" in node) {
      extractText(node.content)
    }

    Object.values(node).forEach(extractText)
  }

  extractText(content)

  const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE)
  return Math.max(1, readingTime)
}
