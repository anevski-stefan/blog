import "server-only"
import { z } from "zod"

/**
 * Environment variable schema with validation
 * Validates at build time to catch configuration errors early
 */
const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .url("DATABASE_URL must be a valid URL")
    .startsWith(
      "postgresql://",
      "DATABASE_URL must be a PostgreSQL connection string"
    ),

  DIRECT_URL: z
    .string()
    .min(1, "DIRECT_URL is required")
    .url("DIRECT_URL must be a valid URL")
    .optional(),

  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email address"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .optional(),

  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
})

/**
 * Validate and parse environment variables
 * Throws descriptive errors if validation fails
 */
function validateEnv() {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(
        issue => `  - ${issue.path.join(".")}: ${issue.message}`
      )
      throw new Error(
        `❌ Invalid environment variables:\n${issues.join("\n")}\n\nPlease check your .env file and ensure all required variables are set correctly.`
      )
    }
    throw error
  }
}

/**
 * Validated and type-safe environment variables
 * Access via: env.DATABASE_URL, env.ADMIN_SECRET, etc.
 */
export const env = validateEnv()

/**
 * Type for environment variables (useful for testing)
 */
export type Env = z.infer<typeof envSchema>
