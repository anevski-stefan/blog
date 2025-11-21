import { clerkMiddleware } from "@clerk/nextjs/server"

// Clerk middleware handles authentication
// Public routes (blog, about, etc.) are accessible without auth
// Protected routes (admin) are handled in their respective layouts
export default clerkMiddleware()

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // all files except static files
    "/", // root
    "/(api|trpc)(.*)", // api routes
  ],
}
