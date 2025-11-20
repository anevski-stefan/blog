import "dotenv/config"
import path from "node:path"
import { defineConfig, env } from "prisma/config"

type Env = {
  DATABASE_URL: string
  DIRECT_URL?: string
}

export default defineConfig({
  engine: "classic",
  datasource: {
    url: env<Env>("DATABASE_URL"),
    ...(process.env.DIRECT_URL && { directUrl: env<Env>("DIRECT_URL") }),
  },
  schema: path.join("prisma", "schema.prisma"),
} as Parameters<typeof defineConfig>[0])

