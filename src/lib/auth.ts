import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import "server-only"

/**
 * Custom error class for unauthorized access attempts
 */
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: Admin access required") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

/**
 * Check if the current user has admin privileges
 * @returns Promise resolving to true if user is authenticated as admin, false otherwise
 * @example
 * const hasAccess = await isAdmin()
 * if (hasAccess) {
 *   // Show admin UI
 * }
 */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  const payload = await decrypt(session)

  return !!payload
}

/**
 * Require admin authentication or throw an error
 * @throws {UnauthorizedError} If the user is not authenticated as admin
 * @example
 * export async function deletePost(id: string) {
 *   await requireAdmin() // Throws if not admin
 *   // ... delete logic
 * }
 */
export async function requireAdmin(): Promise<void> {
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    throw new UnauthorizedError()
  }
}

/**
 * Get the current user's ID
 * @returns Promise resolving to null (no user IDs in simple auth system)
 * @deprecated This function always returns null as the current auth system doesn't track user IDs
 */
export async function getCurrentUserId(): Promise<string | null> {
  // No user IDs without authentication system
  return null
}
