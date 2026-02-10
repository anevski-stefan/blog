import "server-only"

import { z } from "zod"

function formatZodError(error: z.ZodError) {
  return error.issues
    .map(issue => {
      const path = issue.path.length ? issue.path.join(".") : "(root)"
      return `${path}: ${issue.message}`
    })
    .join("; ")
}

function parseEnv<T extends z.ZodTypeAny>(schema: T, label: string) {
  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    throw new Error(`[env] Invalid ${label}: ${formatZodError(parsed.error)}`)
  }
  return parsed.data as z.infer<T>
}

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

const adminEnvSchema = z.object({
  ADMIN_EMAIL: z.string().email(),
})

const oauthEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

let cachedSupabaseEnv: z.infer<typeof supabaseEnvSchema> | undefined
let cachedAdminEnv: z.infer<typeof adminEnvSchema> | undefined
let cachedOauthEnv: z.infer<typeof oauthEnvSchema> | undefined

export function getSupabaseEnv() {
  cachedSupabaseEnv ??= parseEnv(supabaseEnvSchema, "Supabase env")
  return cachedSupabaseEnv
}

export function getAdminEnv() {
  cachedAdminEnv ??= parseEnv(adminEnvSchema, "admin env")
  return cachedAdminEnv
}

export function getOauthEnv() {
  cachedOauthEnv ??= parseEnv(oauthEnvSchema, "OAuth env")
  return cachedOauthEnv
}
