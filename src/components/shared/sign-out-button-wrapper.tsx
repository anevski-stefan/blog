import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

async function logout() {
  "use server"
  const cookieStore = await cookies()
  cookieStore.delete("admin_secret")
  redirect("/")
}

export function SignOutButtonWrapper() {
  return (
    <form action={logout}>
      <Button type="submit" variant="outline" size="sm">
        Logout
      </Button>
    </form>
  )
}
