/**
 * Centralized configuration and environment variables
 */

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
}

export function getAppUrl(path: string = ""): string {
  const baseUrl = getBaseUrl()
  try {
    return new URL(path, baseUrl).toString()
  } catch {
    return path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`
  }
}
