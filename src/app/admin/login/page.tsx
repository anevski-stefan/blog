import { LazyWebGLBackground } from "@/components/shared/backgrounds/LazyWebGLBackground"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { Metadata } from "next"

import { isAdmin } from "@/features/admin/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Admin Login | Stefan Anevski",
  description: "Sign in to the admin dashboard.",
}

export default async function AdminLoginPage() {
  const isUserAdmin = await isAdmin()
  if (isUserAdmin) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-10 px-4 overflow-hidden bg-home-primary">
      <LazyWebGLBackground />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        <LoginForm />
      </div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-home-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  )
}
