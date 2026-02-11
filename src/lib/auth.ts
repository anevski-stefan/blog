import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import "server-only"
import { getAdminEnv } from "@/lib/env"

/**
 * Check if the current user has admin privileges
 * Since there's only one user (the admin), any authenticated user is the admin.
 * @returns Promise resolving to true if user is authenticated, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { ADMIN_EMAIL } = getAdminEnv()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return false
  }

  return user.email === ADMIN_EMAIL
}

/**
 * Require admin authentication or trigger 404
 */
export async function requireAdmin(): Promise<void> {
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    notFound()
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
