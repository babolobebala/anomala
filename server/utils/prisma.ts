import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../../generated/prisma/client'

type PrismaGlobal = typeof globalThis & {
  anomaliPrisma?: PrismaClient
}

function requiredEnv(name: string): string {
  const value = process.env[name]

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function createPrismaClient(): PrismaClient {
  const port = Number.parseInt(requiredEnv('DB_PORT'), 10)

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('DB_PORT must be a positive integer.')
  }

  const adapter = new PrismaMariaDb({
    host: requiredEnv('DB_HOST'),
    port,
    user: requiredEnv('DB_USERNAME'),
    password: requiredEnv('DB_PASSWORD'),
    database: requiredEnv('DB_DATABASE')
  })

  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as PrismaGlobal

export const prisma = globalForPrisma.anomaliPrisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.anomaliPrisma = prisma
}
