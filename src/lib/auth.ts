import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import "server-only"

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: Admin access required") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  const payload = await decrypt(session)

  return !!payload
}

export async function requireAdmin(): Promise<void> {
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    throw new UnauthorizedError()
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  // No user IDs without authentication system
  return null
}
