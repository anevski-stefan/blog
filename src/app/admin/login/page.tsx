import { redirect } from "next/navigation"
import { createSession } from "@/lib/session"

async function login(formData: FormData) {
  "use server"

  const secret = formData.get("secret") as string

  if (secret === process.env.ADMIN_SECRET) {
    await createSession()
    redirect("/admin")
  }

  redirect("/admin/login?error=1")
}

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === "1"

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your admin secret to continue
          </p>
        </div>

        <form action={login} className="space-y-6">
          <div>
            <label
              htmlFor="secret"
              className="block text-sm font-medium text-foreground"
            >
              Admin Secret
            </label>
            <input
              type="password"
              name="secret"
              id="secret"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter your secret"
              required
              autoFocus
            />
          </div>

          {hasError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              Invalid admin secret. Please try again.
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
