import { auth } from "@clerk/nextjs/server"

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: Admin access required") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  return userId === process.env.ADMIN_USER_ID
}

export async function requireAdmin(): Promise<void> {
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    throw new UnauthorizedError()
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}
