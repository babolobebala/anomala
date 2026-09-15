import 'dotenv/config'
import { extname, resolve } from 'node:path'

import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma/client'

import {
  importTidakDitemukanWorkbook,
  TidakDitemukanImportFileError,
  type TidakDitemukanImportDatabase
} from '../server/services/tidak-ditemukan-import'

function requiredEnv(name: string): string {
  const value = process.env[name]

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function readArguments(): { filePath: string, apply: boolean } {
  const arguments_ = process.argv.slice(2)
  const apply = arguments_.includes('--apply')
  const filePath = arguments_.find(argument => argument !== '--apply')

  if (!filePath) {
    throw new TidakDitemukanImportFileError(
      'Usage: pnpm import:tidak-ditemukan -- "path/to/file.xlsx" [--apply]'
    )
  }

  if (extname(filePath).toLowerCase() !== '.xlsx') {
    throw new TidakDitemukanImportFileError('Tidak Ditemukan import only accepts .xlsx files.')
  }

  return { filePath: resolve(filePath), apply }
}

async function main(): Promise<void> {
  const { filePath, apply } = readArguments()
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
  const prisma = new PrismaClient({ adapter })

  try {
    const result = await importTidakDitemukanWorkbook({
      database: prisma as unknown as TidakDitemukanImportDatabase,
      filePath,
      apply
    })

    console.log(JSON.stringify(result, null, 2))

    if (!result.valid) {
      process.exitCode = 1
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Tidak Ditemukan import failed.'
  console.error(message)
  process.exitCode = 1
})
