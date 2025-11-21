/**
 * Centralized configuration and environment variables
 */

import { DEFAULT_DEV_URL } from "@/lib/constants"

/**
 * Get the base URL for the application
 * @returns The base URL from environment variable or default development URL
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || DEFAULT_DEV_URL
}

/**
 * Get a full URL for a given path
 * @param path - The path to append to the base URL (with or without leading slash)
 * @returns The complete URL as a string
 * @example
 * getAppUrl('/blog/my-post') // => 'http://localhost:3001/blog/my-post'
 * getAppUrl('about') // => 'http://localhost:3001/about'
 */
export function getAppUrl(path: string = ""): string {
  const baseUrl = getBaseUrl()
  try {
    return new URL(path, baseUrl).toString()
  } catch {
    return path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`
  }
}
