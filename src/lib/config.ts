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
