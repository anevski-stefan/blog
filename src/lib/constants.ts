/**
 * Application-wide constants
 */

export const POSTS_PER_PAGE = 10
export const WORDS_PER_MINUTE = 200
const DEFAULT_DEV_PORT = 3001
export const DEFAULT_DEV_URL = `http://localhost:${DEFAULT_DEV_PORT}`

export const DEFAULT_METADATA = {
  title: "My Blog",
  description: "A personal blog built with Next.js",
  siteName: "My Blog",
} as const
