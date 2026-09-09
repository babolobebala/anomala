import { extname } from 'node:path'

import {
  AnomaliImportFileError,
  importAnomaliWorkbook,
  type AnomaliImportDatabase,
  type AnomaliImportResult
} from '../services/anomali-import'
import { prisma } from './prisma'

const IMPORT_PASSWORD = 'password'

export interface AnomaliImportApiResult {
  applied: boolean
  valid: boolean
  counts: AnomaliImportResult['counts']
  issues: Array<Pick<AnomaliImportResult['issues'][number], 'code' | 'message'>>
}

function isXlsxFileName(fileName: string): boolean {
  return extname(fileName).toLowerCase() === '.xlsx'
}

function toApiResult(result: AnomaliImportResult): AnomaliImportApiResult {
  return {
    applied: result.applied,
    valid: result.valid,
    counts: result.counts,
    issues: result.issues.map(({ code, message }) => ({ code, message }))
  }
}

/**
 * Parses an uploaded workbook only after validating the server-only password.
 */
export async function importUploadedAnomaliWorkbook(
  event: Parameters<typeof readMultipartFormData>[0],
  apply: boolean
): Promise<AnomaliImportApiResult> {
  const parts = await readMultipartFormData(event)
  const passwordParts = parts?.filter(part => part.name === 'password') ?? []
  const password = passwordParts.length === 1
    ? passwordParts[0]?.data.toString('utf8')
    : undefined

  if (password !== IMPORT_PASSWORD) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Password import tidak valid.'
    })
  }

  const fileParts = parts?.filter(part => part.name === 'file') ?? []
  const file = fileParts.length === 1 ? fileParts[0] : undefined

  if (!file?.filename || !isXlsxFileName(file.filename) || file.data.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pilih satu file XLSX yang tidak kosong.'
    })
  }

  try {
    return toApiResult(await importAnomaliWorkbook({
      database: prisma as unknown as AnomaliImportDatabase,
      fileBuffer: file.data,
      fileName: file.filename,
      apply
    }))
  } catch (error) {
    if (error instanceof AnomaliImportFileError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      })
    }

    throw error
  }
}
