import { extname } from 'node:path'

import {
  TidakDitemukanImportFileError,
  importTidakDitemukanWorkbook,
  type TidakDitemukanImportDatabase,
  type TidakDitemukanImportResult
} from '../services/tidak-ditemukan-import'

export interface TidakDitemukanImportApiResult {
  fileName: string
  importTimestamp: Date
  applied: boolean
  valid: boolean
  counts: TidakDitemukanImportResult['counts']
  issues: TidakDitemukanImportResult['issues']
}

export interface TidakDitemukanUploadedFile {
  filename?: string
  data: Buffer
}

export class TidakDitemukanImportUploadError extends Error {}
export class TidakDitemukanImportPasswordError extends Error {}

function expectedImportPassword(): string {
  return process.env.TIDAK_DITEMUKAN_IMPORT_PASSWORD || 'password'
}

function assertApplyPassword(password: string | undefined): void {
  if (password !== expectedImportPassword()) {
    throw new TidakDitemukanImportPasswordError('Password import tidak valid.')
  }
}

function isXlsxFileName(fileName: string): boolean {
  return extname(fileName).toLowerCase() === '.xlsx'
}

function toApiResult(result: TidakDitemukanImportResult): TidakDitemukanImportApiResult {
  return {
    fileName: result.fileName,
    importTimestamp: result.importTimestamp,
    applied: result.applied,
    valid: result.valid,
    counts: result.counts,
    issues: result.issues
  }
}

export async function importTidakDitemukanUploadedFile(
  file: TidakDitemukanUploadedFile | undefined,
  apply: boolean,
  database?: TidakDitemukanImportDatabase,
  password?: string
): Promise<TidakDitemukanImportApiResult> {
  if (apply) {
    assertApplyPassword(password)
  }

  if (!file?.filename || !isXlsxFileName(file.filename) || file.data.length === 0) {
    throw new TidakDitemukanImportUploadError('Pilih satu file XLSX yang tidak kosong.')
  }

  return toApiResult(await importTidakDitemukanWorkbook({
    database: database ?? await defaultImportDatabase(),
    fileBuffer: file.data,
    fileName: file.filename,
    apply
  }))
}

async function defaultImportDatabase(): Promise<TidakDitemukanImportDatabase> {
  const { prisma } = await import('./prisma')
  return prisma as unknown as TidakDitemukanImportDatabase
}

export async function importUploadedTidakDitemukanWorkbook(
  event: Parameters<typeof readMultipartFormData>[0],
  apply: boolean
): Promise<TidakDitemukanImportApiResult> {
  const parts = await readMultipartFormData(event)
  const fileParts = parts?.filter(part => part.name === 'file') ?? []
  const file = fileParts.length === 1 ? fileParts[0] : undefined
  const passwordParts = parts?.filter(part => part.name === 'password') ?? []
  const password = passwordParts.length === 1
    ? passwordParts[0]?.data.toString('utf8')
    : undefined

  try {
    return await importTidakDitemukanUploadedFile(file, apply, undefined, password)
  } catch (error) {
    if (error instanceof TidakDitemukanImportPasswordError) {
      throw createError({ statusCode: 401, statusMessage: error.message })
    }

    if (
      error instanceof TidakDitemukanImportFileError
      || error instanceof TidakDitemukanImportUploadError
    ) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }

    throw error
  }
}
