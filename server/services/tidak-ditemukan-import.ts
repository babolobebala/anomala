import { readFileSync } from 'node:fs'
import { basename, extname, resolve } from 'node:path'
import type { CellObject, WorkBook, WorkSheet } from 'xlsx'
// SheetJS does not publish declarations for its ESM subpath.
// @ts-expect-error -- typed from the package's canonical declarations below.
import * as xlsxEsm from 'xlsx/xlsx.mjs'

const XLSX = xlsxEsm as Pick<typeof import('xlsx'), 'read' | 'utils'>

const SOURCE_COLUMNS = {
  id_subsls: 'idSubsls',
  nama_assignment: 'namaAssignment'
} as const

const READ_BATCH_SIZE = 1000
const CREATE_BATCH_SIZE = 500
const APPLY_TRANSACTION_OPTIONS = {
  maxWait: 10_000,
  timeout: 900_000
}

type SourceColumn = keyof typeof SOURCE_COLUMNS

export interface TidakDitemukanSourceRecord {
  idSubsls: string
  namaAssignment: string
}

interface ParsedTidakDitemukanRecord extends TidakDitemukanSourceRecord {
  rowNumber: number
}

export interface TidakDitemukanImportCounts {
  sourceRows: number
  jumlahAssignment: number
  jumlahSls: number
  invalidRows: number
  invalidMasterSls: number
}

export type TidakDitemukanImportIssueCode
  = | 'missing-sls-value'
    | 'missing-assignment-name'
    | 'missing-master-sls'

export interface TidakDitemukanImportIssue {
  code: TidakDitemukanImportIssueCode
  message: string
  rowNumbers?: number[]
  values?: string[]
}

export interface TidakDitemukanImportResult {
  fileName: string
  importTimestamp: Date
  applied: boolean
  valid: boolean
  counts: TidakDitemukanImportCounts
  issues: TidakDitemukanImportIssue[]
}

interface MasterSlsDelegate {
  findMany(args: {
    where: { idSubsls: { in: string[] } }
    select: { idSubsls: true }
  }): Promise<Array<{ idSubsls: string }>>
}

interface TidakDitemukanAssignmentDelegate {
  deleteMany(args?: Record<string, never>): Promise<unknown>
  createMany(args: { data: TidakDitemukanSourceRecord[] }): Promise<unknown>
}

interface TidakDitemukanSlsStatusDelegate {
  deleteMany(args?: Record<string, never>): Promise<unknown>
}

interface TidakDitemukanWaktuImportDelegate {
  deleteMany(args?: Record<string, never>): Promise<unknown>
  create(args: {
    data: {
      importedAt: Date
      namaFile: string
      jumlahAssignment: number
      jumlahSls: number
    }
  }): Promise<unknown>
}

export interface TidakDitemukanImportTransaction {
  tidakDitemukanAssignment: TidakDitemukanAssignmentDelegate
  tidakDitemukanSlsStatus: TidakDitemukanSlsStatusDelegate
  tidakDitemukanWaktuImport: TidakDitemukanWaktuImportDelegate
}

export interface TidakDitemukanImportTransactionOptions {
  maxWait?: number
  timeout?: number
}

/** Minimal database contract shared by the CLI and a future upload endpoint. */
export interface TidakDitemukanImportDatabase {
  masterSls: MasterSlsDelegate
  $transaction<T>(
    callback: (transaction: TidakDitemukanImportTransaction) => Promise<T>,
    options?: TidakDitemukanImportTransactionOptions
  ): Promise<T>
}

export interface TidakDitemukanImportOptions {
  database: TidakDitemukanImportDatabase
  filePath?: string
  fileBuffer?: Buffer
  fileName?: string
  apply?: boolean
  now?: Date
}

export class TidakDitemukanImportFileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TidakDitemukanImportFileError'
  }
}

function emptyCounts(): TidakDitemukanImportCounts {
  return {
    sourceRows: 0,
    jumlahAssignment: 0,
    jumlahSls: 0,
    invalidRows: 0,
    invalidMasterSls: 0
  }
}

function chunk<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = []

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size))
  }

  return chunks
}

function cellValue(sheet: WorkSheet, row: number, column: number): unknown {
  const denseSheet = sheet as unknown as CellObject[][]
  const sparseSheet = sheet as unknown as Record<string, CellObject | undefined>
  const cell = denseSheet[row]?.[column]
    ?? sparseSheet[XLSX.utils.encode_cell({ r: row, c: column })]

  if (!cell) {
    return ''
  }

  return typeof cell.w === 'string' ? cell.w : cell.v
}

function stringValue(value: unknown): string {
  return String(value ?? '')
}

function requiredValue(value: unknown): string {
  return stringValue(value).trim()
}

function readWorkbook(
  fileBuffer: Buffer,
  fileName: string,
  counts: TidakDitemukanImportCounts,
  issues: TidakDitemukanImportIssue[]
): ParsedTidakDitemukanRecord[] {
  if (extname(fileName).toLowerCase() !== '.xlsx') {
    throw new TidakDitemukanImportFileError('Tidak Ditemukan import only accepts .xlsx files.')
  }

  let workbook: WorkBook

  try {
    workbook = XLSX.read(fileBuffer, {
      cellDates: false,
      cellFormula: false,
      cellHTML: false,
      cellNF: false,
      cellStyles: false,
      cellText: true,
      dense: true
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to read workbook.'
    throw new TidakDitemukanImportFileError(message)
  }

  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    throw new TidakDitemukanImportFileError('Workbook does not contain a worksheet.')
  }

  const sheet = workbook.Sheets[sheetName]
  const reference = sheet?.['!ref']

  if (!sheet || !reference) {
    throw new TidakDitemukanImportFileError('The first worksheet is empty.')
  }

  const range = XLSX.utils.decode_range(reference)
  let headerRow = -1
  const headers = new Map<string, number>()

  for (let row = range.s.r; row <= range.e.r; row++) {
    const rowHeaders = new Map<string, number>()

    for (let column = range.s.c; column <= range.e.c; column++) {
      const header = stringValue(cellValue(sheet, row, column)).trim().toLowerCase()

      if (header) {
        rowHeaders.set(header, column)
      }
    }

    if (Object.keys(SOURCE_COLUMNS).some(column => rowHeaders.has(column))) {
      headerRow = row
      rowHeaders.forEach((column, header) => headers.set(header, column))
      break
    }
  }

  if (headerRow === -1) {
    throw new TidakDitemukanImportFileError('Could not find a Tidak Ditemukan header row.')
  }

  const missingColumns = Object.keys(SOURCE_COLUMNS).filter(column => !headers.has(column))

  if (missingColumns.length > 0) {
    throw new TidakDitemukanImportFileError(`Missing required columns: ${missingColumns.join(', ')}`)
  }

  const records: ParsedTidakDitemukanRecord[] = []

  for (let row = headerRow + 1; row <= range.e.r; row++) {
    const idSubsls = requiredValue(cellValue(sheet, row, headers.get('id_subsls')!))
    const namaAssignment = requiredValue(cellValue(sheet, row, headers.get('nama_assignment')!))

    if (!idSubsls && !namaAssignment) {
      continue
    }

    counts.sourceRows++
    const rowNumber = row + 1

    if (!idSubsls) {
      counts.invalidRows++
      issues.push({
        code: 'missing-sls-value',
        message: 'id_subsls is required.',
        rowNumbers: [rowNumber]
      })
      continue
    }

    if (!namaAssignment) {
      counts.invalidRows++
      issues.push({
        code: 'missing-assignment-name',
        message: 'nama_assignment is required.',
        rowNumbers: [rowNumber]
      })
      continue
    }

    records.push({ idSubsls, namaAssignment, rowNumber })
  }

  return records
}

async function findMissingMasterSls(
  database: TidakDitemukanImportDatabase,
  idSubslsValues: string[]
): Promise<Set<string>> {
  const found = new Set<string>()

  for (const values of chunk(idSubslsValues, READ_BATCH_SIZE)) {
    const rows = await database.masterSls.findMany({
      where: { idSubsls: { in: values } },
      select: { idSubsls: true }
    })

    rows.forEach(row => found.add(row.idSubsls))
  }

  return new Set(idSubslsValues.filter(value => !found.has(value)))
}

async function applyFreshImport(
  database: TidakDitemukanImportDatabase,
  records: ParsedTidakDitemukanRecord[],
  fileName: string,
  timestamp: Date,
  counts: TidakDitemukanImportCounts
): Promise<void> {
  await database.$transaction(async (transaction) => {
    await transaction.tidakDitemukanSlsStatus.deleteMany()
    await transaction.tidakDitemukanAssignment.deleteMany()
    await transaction.tidakDitemukanWaktuImport.deleteMany()

    for (const recordsBatch of chunk(records, CREATE_BATCH_SIZE)) {
      await transaction.tidakDitemukanAssignment.createMany({
        data: recordsBatch.map(({ idSubsls, namaAssignment }) => ({ idSubsls, namaAssignment }))
      })
    }

    await transaction.tidakDitemukanWaktuImport.create({
      data: {
        importedAt: timestamp,
        namaFile: fileName,
        jumlahAssignment: counts.jumlahAssignment,
        jumlahSls: counts.jumlahSls
      }
    })
  }, APPLY_TRANSACTION_OPTIONS)
}

export async function importTidakDitemukanWorkbook(
  options: TidakDitemukanImportOptions
): Promise<TidakDitemukanImportResult> {
  if (options.filePath && options.fileBuffer) {
    throw new TidakDitemukanImportFileError('Provide either a workbook path or buffer, not both.')
  }

  if (!options.filePath && !options.fileBuffer) {
    throw new TidakDitemukanImportFileError('A workbook path or buffer is required.')
  }

  const filePath = options.filePath ? resolve(options.filePath) : undefined
  const fileName = options.fileName ?? (filePath ? basename(filePath) : 'upload.xlsx')
  const timestamp = options.now ?? new Date()
  const counts = emptyCounts()
  const issues: TidakDitemukanImportIssue[] = []
  let fileBuffer: Buffer

  try {
    fileBuffer = options.fileBuffer ?? readFileSync(filePath!)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to read workbook.'
    throw new TidakDitemukanImportFileError(message)
  }

  const records = readWorkbook(fileBuffer, fileName, counts, issues)
  counts.jumlahAssignment = records.length
  counts.jumlahSls = new Set(records.map(record => record.idSubsls)).size

  const missingSls = await findMissingMasterSls(
    options.database,
    [...new Set(records.map(record => record.idSubsls))]
  )
  counts.invalidMasterSls = records.filter(record => missingSls.has(record.idSubsls)).length

  if (missingSls.size > 0) {
    issues.push({
      code: 'missing-master-sls',
      message: `${counts.invalidMasterSls} Tidak Ditemukan row(s) reference missing master_sls values.`,
      values: [...missingSls].slice(0, 20)
    })
  }

  if (issues.length > 0) {
    return { fileName, importTimestamp: timestamp, applied: false, valid: false, counts, issues }
  }

  if (options.apply) {
    await applyFreshImport(options.database, records, fileName, timestamp, counts)
  }

  return {
    fileName,
    importTimestamp: timestamp,
    applied: options.apply === true,
    valid: true,
    counts,
    issues
  }
}
