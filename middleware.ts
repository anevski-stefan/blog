import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value
    const payload = await decrypt(session)

    if (!payload) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
