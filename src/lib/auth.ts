import { cookies } from "next/headers"

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: Admin access required") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSecret = cookieStore.get("admin_secret")?.value

  return adminSecret === process.env.ADMIN_SECRET
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
