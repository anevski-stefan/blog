import { signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"

export function SignOutButtonWrapper() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline" size="sm">
        Logout
      </Button>
    </form>
  )
}
