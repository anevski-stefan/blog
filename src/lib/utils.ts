import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { WORDS_PER_MINUTE } from "@/lib/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

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
