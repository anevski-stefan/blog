import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
      const words = node
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
      wordCount += words.length
    } else if (Array.isArray(node)) {
      node.forEach(extractText)
    } else if (node && typeof node === "object") {
      if ("text" in node && typeof node.text === "string") {
        const words = node.text
          .trim()
          .split(/\s+/)
          .filter(word => word.length > 0)
        wordCount += words.length
      }
      if ("content" in node) {
        extractText(node.content)
      }
      Object.values(node).forEach(extractText)
    }
  }

  extractText(content)

  const readingTime = Math.ceil(wordCount / 200)
  return Math.max(1, readingTime)
}
