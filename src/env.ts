import "server-only"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env")
}

if (!process.env.ADMIN_SECRET) {
  throw new Error("ADMIN_SECRET is not defined in .env")
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
} as const
