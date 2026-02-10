"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getAdminEnv, getOauthEnv } from "@/lib/env"

export async function login(formData: FormData) {
  const supabase = await createClient()
  const { ADMIN_EMAIL } = getAdminEnv()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (email !== ADMIN_EMAIL) {
    return { error: "Access denied. Only the administrator can sign in." }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/admin")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function loginWithProvider(provider: "google") {
  const supabase = await createClient()
  const { NEXT_PUBLIC_APP_URL } = getOauthEnv()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}
