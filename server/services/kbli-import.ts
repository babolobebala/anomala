import { readFileSync } from 'node:fs'
import { basename, extname, resolve } from 'node:path'
import type { CellObject, WorkBook, WorkSheet } from 'xlsx'
// SheetJS does not publish declarations for its ESM subpath.
// @ts-expect-error -- typed from the package's canonical declarations below.
import * as xlsxEsm from 'xlsx/xlsx.mjs'

import { createKbliKey, normalizeKbliData } from './kbli-key'

const XLSX = xlsxEsm as Pick<typeof import('xlsx'), 'read' | 'utils'>

const SOURCE_COLUMNS = {
  assignment_id: 'assignmentId',
  id_subsls: 'idSubsls',
  anomali: 'kategori',
  status_alias: 'statusAlias',
  nama_assignment: 'namaAssignment',
  nomor_bangunan: 'nomorBangunan',
  idsbr: 'idsbr',
  link_fasih_edit: 'linkFasihEdit',
  data: 'data',
  catatan: 'catatan'
} as const

const REQUIRED_SOURCE_COLUMNS = ['assignment_id', 'id_subsls', 'anomali', 'data'] as const
const READ_BATCH_SIZE = 1000
const CREATE_BATCH_SIZE = 500
const UPDATE_BATCH_SIZE = 100
const APPLY_TRANSACTION_OPTIONS = {
  maxWait: 10_000,
  timeout: 900_000
}

type SourceColumn = keyof typeof SOURCE_COLUMNS

export interface KbliSourceRecord {
  assignmentId: string
  idSubsls: string
  kategori: string
  statusAlias: string | null
  namaAssignment: string | null
  nomorBangunan: string | null
  idsbr: string | null
  linkFasihEdit: string | null
  data: string
  catatan: string | null
}

interface ParsedKbliRecord extends KbliSourceRecord {
  kbliKey: string
  rowNumber: number
}

export interface KbliImportCounts {
  sourceRows: number
  uniqueRows: number
  duplicateRows: number
  new: number
  existing: number
  invalidMasterSls: number
  invalidMasterKategori: number
  conflictingDuplicates: number
}

export type KbliImportIssueCode
  = | 'missing-identity-field'
    | 'conflicting-duplicate'
    | 'missing-master-sls'
    | 'missing-master-kbli-temuan'

export interface KbliImportIssue {
  code: KbliImportIssueCode
  message: string
  rowNumbers?: number[]
  values?: string[]
}

export interface KbliImportResult {
  fileName: string
  importTimestamp: Date
  applied: boolean
  valid: boolean
  counts: KbliImportCounts
  issues: KbliImportIssue[]
}

interface MasterSlsDelegate {
  findMany(args: {
    where: { idSubsls: { in: string[] } }
    select: { idSubsls: true }
  }): Promise<Array<{ idSubsls: string }>>
}

interface MasterKbliTemuanDelegate {
  findMany(args: {
    where: { kode: { in: string[] } }
    select: { kode: true }
  }): Promise<Array<{ kode: string }>>
}

interface KbliDelegate {
  findMany(args: {
    where: { kbliKey: { in: string[] } }
    select: { kbliKey: true }
  }): Promise<Array<{ kbliKey: string }>>
  createMany(args: {
    data: Array<KbliSourceRecord & {
      kbliKey: string
      firstSeenAt: Date
      lastSeenAt: Date
    }>
  }): Promise<unknown>
  update(args: {
    where: { kbliKey: string }
    data: KbliSourceRecord & { lastSeenAt: Date }
  }): Promise<unknown>
}

export interface KbliImportTransaction {
  kbli: KbliDelegate
}

export interface KbliImportTransactionOptions {
  maxWait?: number
  timeout?: number
}

/**
 * Minimal database contract so the importer can be used by the CLI or a future
 * upload endpoint without coupling the service to a Prisma client singleton.
 */
export interface KbliImportDatabase {
  masterSls: MasterSlsDelegate
  masterKbliTemuan: MasterKbliTemuanDelegate
  kbli: KbliDelegate
  $transaction<T>(
    callback: (transaction: KbliImportTransaction) => Promise<T>,
    options?: KbliImportTransactionOptions
  ): Promise<T>
}

export interface KbliImportOptions {
  database: KbliImportDatabase
  filePath?: string
  fileBuffer?: Buffer
  fileName?: string
  apply?: boolean
  now?: Date
}

export class KbliImportFileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'KbliImportFileError'
  }
}

function emptyCounts(): KbliImportCounts {
  return {
    sourceRows: 0,
    uniqueRows: 0,
    duplicateRows: 0,
    new: 0,
    existing: 0,
    invalidMasterSls: 0,
    invalidMasterKategori: 0,
    conflictingDuplicates: 0
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

function optionalValue(value: unknown): string | null {
  const normalized = stringValue(value).trim()

  return normalized === '' ? null : normalized
}

function requiredValue(value: unknown): string {
  return stringValue(value).trim()
}

function sourceRecordsEqual(left: ParsedKbliRecord, right: ParsedKbliRecord): boolean {
  return left.assignmentId === right.assignmentId
    && left.idSubsls === right.idSubsls
    && left.kategori === right.kategori
    && left.statusAlias === right.statusAlias
    && left.namaAssignment === right.namaAssignment
    && left.nomorBangunan === right.nomorBangunan
    && left.idsbr === right.idsbr
    && left.linkFasihEdit === right.linkFasihEdit
    && left.data === right.data
    && left.catatan === right.catatan
}

function toSourceRecord(
  values: Partial<Record<SourceColumn, unknown>>,
  rowNumber: number
): ParsedKbliRecord | null {
  const assignmentId = requiredValue(values.assignment_id)
  const idSubsls = requiredValue(values.id_subsls)
  const kategori = requiredValue(values.anomali)
  const data = normalizeKbliData(values.data)

  if (!assignmentId || !idSubsls || !kategori || !data) {
    return null
  }

  return {
    assignmentId,
    idSubsls,
    kategori,
    statusAlias: optionalValue(values.status_alias),
    namaAssignment: optionalValue(values.nama_assignment),
    nomorBangunan: optionalValue(values.nomor_bangunan),
    idsbr: optionalValue(values.idsbr),
    linkFasihEdit: optionalValue(values.link_fasih_edit),
    data,
    catatan: optionalValue(values.catatan),
    kbliKey: createKbliKey(assignmentId, kategori, data),
    rowNumber
  }
}

function isBlankSourceRow(values: Partial<Record<SourceColumn, unknown>>): boolean {
  return Object.values(values).every(value => stringValue(value).trim() === '')
}

function readWorkbook(
  fileBuffer: Buffer,
  fileName: string,
  counts: KbliImportCounts,
  issues: KbliImportIssue[]
): ParsedKbliRecord[] {
  if (extname(fileName).toLowerCase() !== '.xlsx') {
    throw new KbliImportFileError('KBLI import only accepts .xlsx files.')
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
    throw new KbliImportFileError(message)
  }

  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    throw new KbliImportFileError('Workbook does not contain a worksheet.')
  }

  const sheet = workbook.Sheets[sheetName]
  const reference = sheet?.['!ref']

  if (!sheet || !reference) {
    throw new KbliImportFileError('The first worksheet is empty.')
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

    if (REQUIRED_SOURCE_COLUMNS.some(column => rowHeaders.has(column))) {
      headerRow = row
      rowHeaders.forEach((column, header) => headers.set(header, column))
      break
    }
  }

  if (headerRow === -1) {
    throw new KbliImportFileError('Could not find a KBLI-feed header row.')
  }

  const missingColumns = REQUIRED_SOURCE_COLUMNS.filter(column => !headers.has(column))

  if (missingColumns.length > 0) {
    throw new KbliImportFileError(`Missing required columns: ${missingColumns.join(', ')}`)
  }

  const deduplicated = new Map<string, ParsedKbliRecord>()

  for (let row = headerRow + 1; row <= range.e.r; row++) {
    const values: Partial<Record<SourceColumn, unknown>> = {}

    for (const sourceColumn of Object.keys(SOURCE_COLUMNS) as SourceColumn[]) {
      const column = headers.get(sourceColumn)
      values[sourceColumn] = column === undefined ? '' : cellValue(sheet, row, column)
    }

    if (isBlankSourceRow(values)) {
      continue
    }

    counts.sourceRows++
    const rowNumber = row + 1
    const record = toSourceRecord(values, rowNumber)

    if (!record) {
      issues.push({
        code: 'missing-identity-field',
        message: 'assignment_id, id_subsls, anomali, and DATA are required.',
        rowNumbers: [rowNumber]
      })
      continue
    }

    const existing = deduplicated.get(record.kbliKey)

    if (!existing) {
      deduplicated.set(record.kbliKey, record)
      continue
    }

    counts.duplicateRows++

    if (!sourceRecordsEqual(existing, record)) {
      counts.conflictingDuplicates++
      issues.push({
        code: 'conflicting-duplicate',
        message: `Rows ${existing.rowNumber} and ${record.rowNumber} share a kbliKey but differ in persisted source fields.`,
        rowNumbers: [existing.rowNumber, record.rowNumber]
      })
    }
  }

  return [...deduplicated.values()]
}

async function findMissingMasterSls(
  database: KbliImportDatabase,
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

async function findMissingMasterKategori(
  database: KbliImportDatabase,
  kategoriValues: string[]
): Promise<Set<string>> {
  const found = new Set<string>()

  for (const values of chunk(kategoriValues, READ_BATCH_SIZE)) {
    const rows = await database.masterKbliTemuan.findMany({
      where: { kode: { in: values } },
      select: { kode: true }
    })

    rows.forEach(row => found.add(row.kode))
  }

  return new Set(kategoriValues.filter(value => !found.has(value)))
}

async function findExistingKbli(
  database: KbliImportDatabase,
  kbliKeys: string[]
): Promise<Set<string>> {
  const existing = new Set<string>()

  for (const keys of chunk(kbliKeys, READ_BATCH_SIZE)) {
    const rows = await database.kbli.findMany({
      where: { kbliKey: { in: keys } },
      select: { kbliKey: true }
    })

    rows.forEach(row => existing.add(row.kbliKey))
  }

  return existing
}

function addMasterIssues(
  records: ParsedKbliRecord[],
  missingSls: Set<string>,
  missingKategori: Set<string>,
  counts: KbliImportCounts,
  issues: KbliImportIssue[]
): void {
  counts.invalidMasterSls = records.filter(record => missingSls.has(record.idSubsls)).length
  counts.invalidMasterKategori = records.filter(record => missingKategori.has(record.kategori)).length

  if (missingSls.size > 0) {
    issues.push({
      code: 'missing-master-sls',
      message: `${counts.invalidMasterSls} unique KBLI row(s) reference missing master_sls values.`,
      values: [...missingSls].slice(0, 20)
    })
  }

  if (missingKategori.size > 0) {
    issues.push({
      code: 'missing-master-kbli-temuan',
      message: `${counts.invalidMasterKategori} unique KBLI row(s) reference missing master_kbli_temuan values.`,
      values: [...missingKategori].slice(0, 20)
    })
  }
}

function createData(record: ParsedKbliRecord, timestamp: Date): KbliSourceRecord & {
  kbliKey: string
  firstSeenAt: Date
  lastSeenAt: Date
} {
  return {
    assignmentId: record.assignmentId,
    idSubsls: record.idSubsls,
    kategori: record.kategori,
    statusAlias: record.statusAlias,
    namaAssignment: record.namaAssignment,
    nomorBangunan: record.nomorBangunan,
    idsbr: record.idsbr,
    linkFasihEdit: record.linkFasihEdit,
    data: record.data,
    catatan: record.catatan,
    kbliKey: record.kbliKey,
    firstSeenAt: timestamp,
    lastSeenAt: timestamp
  }
}

function updateData(record: ParsedKbliRecord, timestamp: Date): KbliSourceRecord & { lastSeenAt: Date } {
  return {
    assignmentId: record.assignmentId,
    idSubsls: record.idSubsls,
    kategori: record.kategori,
    statusAlias: record.statusAlias,
    namaAssignment: record.namaAssignment,
    nomorBangunan: record.nomorBangunan,
    idsbr: record.idsbr,
    linkFasihEdit: record.linkFasihEdit,
    data: record.data,
    catatan: record.catatan,
    lastSeenAt: timestamp
  }
}

async function applyCumulativeImport(
  database: KbliImportDatabase,
  records: ParsedKbliRecord[],
  existingKeys: Set<string>,
  timestamp: Date
): Promise<void> {
  const newRecords = records.filter(record => !existingKeys.has(record.kbliKey))
  const existingRecords = records.filter(record => existingKeys.has(record.kbliKey))

  await database.$transaction(async (transaction) => {
    for (const recordsBatch of chunk(newRecords, CREATE_BATCH_SIZE)) {
      await transaction.kbli.createMany({
        data: recordsBatch.map(record => createData(record, timestamp))
      })
    }

    for (const recordsBatch of chunk(existingRecords, UPDATE_BATCH_SIZE)) {
      await Promise.all(recordsBatch.map(record => transaction.kbli.update({
        where: { kbliKey: record.kbliKey },
        data: updateData(record, timestamp)
      })))
    }
  }, APPLY_TRANSACTION_OPTIONS)
}

export async function importKbliWorkbook(options: KbliImportOptions): Promise<KbliImportResult> {
  if (options.filePath && options.fileBuffer) {
    throw new KbliImportFileError('Provide either a workbook path or buffer, not both.')
  }

  if (!options.filePath && !options.fileBuffer) {
    throw new KbliImportFileError('A workbook path or buffer is required.')
  }

  const filePath = options.filePath ? resolve(options.filePath) : undefined
  const fileName = options.fileName ?? (filePath ? basename(filePath) : 'upload.xlsx')
  const counts = emptyCounts()
  const issues: KbliImportIssue[] = []
  const timestamp = options.now ?? new Date()
  let fileBuffer: Buffer

  try {
    fileBuffer = options.fileBuffer ?? readFileSync(filePath!)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to read workbook.'
    throw new KbliImportFileError(message)
  }

  const records = readWorkbook(fileBuffer, fileName, counts, issues)

  counts.uniqueRows = records.length

  const missingSls = await findMissingMasterSls(
    options.database,
    [...new Set(records.map(record => record.idSubsls))]
  )
  const missingKategori = await findMissingMasterKategori(
    options.database,
    [...new Set(records.map(record => record.kategori))]
  )

  addMasterIssues(records, missingSls, missingKategori, counts, issues)

  if (issues.length > 0) {
    return {
      fileName,
      importTimestamp: timestamp,
      applied: false,
      valid: false,
      counts,
      issues
    }
  }

  const existingKeys = await findExistingKbli(
    options.database,
    records.map(record => record.kbliKey)
  )

  records.forEach((record) => {
    if (existingKeys.has(record.kbliKey)) {
      counts.existing++
    } else {
      counts.new++
    }
  })

  if (options.apply) {
    await applyCumulativeImport(options.database, records, existingKeys, timestamp)
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
