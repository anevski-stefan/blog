"use client"

import { useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function SignOutButtonWrapper() {
  const { signOut } = useClerk()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  )
}
