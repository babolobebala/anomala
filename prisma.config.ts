import "dotenv/config"
import { defineConfig } from "prisma/config"

function getRequiredEnv(name: string): string {
  const value = process.env[name]

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const username = encodeURIComponent(getRequiredEnv("DB_USERNAME"))
const password = encodeURIComponent(getRequiredEnv("DB_PASSWORD"))
const host = getRequiredEnv("DB_HOST")
const port = getRequiredEnv("DB_PORT")
const database = encodeURIComponent(getRequiredEnv("DB_DATABASE"))

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: `mysql://${username}:${password}@${host}:${port}/${database}`,
  },
})
