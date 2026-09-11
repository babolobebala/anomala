import { readFileSync } from 'node:fs'
import { basename, extname, resolve } from 'node:path'
import type { CellObject, WorkBook, WorkSheet } from 'xlsx'
// SheetJS does not publish declarations for its ESM subpath.
// @ts-expect-error -- typed from the package's canonical declarations below.
import * as xlsxEsm from 'xlsx/xlsx.mjs'

import { createAnomalyKey, normalizeAnomalyData } from './anomali-key'

const XLSX = xlsxEsm as Pick<typeof import('xlsx'), 'read' | 'utils'>

const SOURCE_COLUMNS = {
  assignment_id: 'assignmentId',
  id_subsls: 'idSubsls',
  anomali: 'kodeAnomali',
  status_alias: 'statusAlias',
  nama_assignment: 'namaAssignment',
  nomor_bangunan: 'nomorBangunan',
  idsbr: 'idsbr',
  link_fasih_edit: 'linkFasihEdit',
  data: 'data',
  catatan: 'catatan'
} as const

const READ_BATCH_SIZE = 1000
const CREATE_BATCH_SIZE = 500
const UPDATE_BATCH_SIZE = 100
const DEACTIVATE_BATCH_SIZE = 1000
const APPLY_TRANSACTION_OPTIONS = {
  maxWait: 10_000,
  timeout: 900_000
}

type SourceColumn = keyof typeof SOURCE_COLUMNS

export interface AnomaliSourceRecord {
  assignmentId: string
  idSubsls: string
  kodeAnomali: string
  statusAlias: string | null
  namaAssignment: string | null
  nomorBangunan: string | null
  idsbr: string | null
  linkFasihEdit: string | null
  data: string
  catatan: string | null
}

interface ParsedAnomaliRecord extends AnomaliSourceRecord {
  anomalyKey: string
  rowNumber: number
}

interface ExistingAnomali {
  id?: string
  anomalyKey: string
  isActive: boolean
  isHandled: boolean
  handledAt: Date | null
  isSesuaiLapangan: boolean
  sesuaiLapanganAt: Date | null
}

export interface AnomaliImportCounts {
  sourceRows: number
  uniqueRows: number
  duplicateRows: number
  new: number
  existing: number
  reappeared: number
  disappeared: number
  invalidMasterSls: number
  invalidMasterAnomali: number
  conflictingDuplicates: number
}

export type AnomaliImportIssueCode
  = | 'missing-identity-field'
    | 'conflicting-duplicate'
    | 'conflicting-assignment-sls'
    | 'missing-master-sls'
    | 'missing-master-anomali'

export interface AnomaliImportIssue {
  code: AnomaliImportIssueCode
  message: string
  rowNumbers?: number[]
  values?: string[]
}

export interface AnomaliImportResult {
  fileName: string
  importTimestamp: Date
  applied: boolean
  valid: boolean
  counts: AnomaliImportCounts
  issues: AnomaliImportIssue[]
}

interface MasterSlsDelegate {
  findMany(args: {
    where: { idSubsls: { in: string[] } }
    select: { idSubsls: true }
  }): Promise<Array<{ idSubsls: string }>>
}

interface MasterAnomaliDelegate {
  findMany(args: {
    where: { kodeAnomali: { in: string[] } }
    select: { kodeAnomali: true }
  }): Promise<Array<{ kodeAnomali: string }>>
}

interface AnomaliDelegate {
  findMany(args: {
    where: {
      anomalyKey?: { in: string[] }
      isActive?: boolean
    }
    select: {
      id?: true
      anomalyKey: true
      isActive: true
      isHandled: true
      handledAt: true
      isSesuaiLapangan: true
      sesuaiLapanganAt: true
    }
  }): Promise<ExistingAnomali[]>
  createMany(args: {
    data: Array<AnomaliSourceRecord & {
      anomalyKey: string
      isActive: boolean
      isHandled: boolean
      isSesuaiLapangan: boolean
      sesuaiLapanganAt: Date | null
      firstSeenAt: Date
      lastSeenAt: Date
    }>
  }): Promise<unknown>
  update(args: {
    where: { anomalyKey: string }
    data: AnomaliSourceRecord & {
      isActive: boolean
      lastSeenAt: Date
      isHandled?: boolean
      handledAt?: Date | null
    }
  }): Promise<unknown>
  updateMany(args: {
    where: { id: { in: string[] } }
    data: {
      isActive: boolean
      isHandled?: boolean
      handledAt?: Date | null
    }
  }): Promise<unknown>
}

export interface AnomaliImportTransaction {
  anomali: AnomaliDelegate
}

export interface AnomaliImportTransactionOptions {
  maxWait?: number
  timeout?: number
}

/**
 * Minimal database contract so the importer can be used by the CLI or a future
 * upload endpoint without coupling the service to a Prisma client singleton.
 */
export interface AnomaliImportDatabase {
  masterSls: MasterSlsDelegate
  masterAnomali: MasterAnomaliDelegate
  anomali: AnomaliDelegate
  $transaction<T>(
    callback: (transaction: AnomaliImportTransaction) => Promise<T>,
    options?: AnomaliImportTransactionOptions
  ): Promise<T>
}

export interface AnomaliImportOptions {
  database: AnomaliImportDatabase
  filePath?: string
  fileBuffer?: Buffer
  fileName?: string
  apply?: boolean
  now?: Date
}

export class AnomaliImportFileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AnomaliImportFileError'
  }
}

function emptyCounts(): AnomaliImportCounts {
  return {
    sourceRows: 0,
    uniqueRows: 0,
    duplicateRows: 0,
    new: 0,
    existing: 0,
    reappeared: 0,
    disappeared: 0,
    invalidMasterSls: 0,
    invalidMasterAnomali: 0,
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

function sourceRecordsEqual(left: ParsedAnomaliRecord, right: ParsedAnomaliRecord): boolean {
  return left.assignmentId === right.assignmentId
    && left.idSubsls === right.idSubsls
    && left.kodeAnomali === right.kodeAnomali
    && left.statusAlias === right.statusAlias
    && left.namaAssignment === right.namaAssignment
    && left.nomorBangunan === right.nomorBangunan
    && left.idsbr === right.idsbr
    && left.linkFasihEdit === right.linkFasihEdit
    && left.data === right.data
    && left.catatan === right.catatan
}

function toSourceRecord(values: Partial<Record<SourceColumn, unknown>>, rowNumber: number): ParsedAnomaliRecord | null {
  const assignmentId = requiredValue(values.assignment_id)
  const idSubsls = requiredValue(values.id_subsls)
  const kodeAnomali = requiredValue(values.anomali)

  if (!assignmentId || !idSubsls || !kodeAnomali) {
    return null
  }

  const data = normalizeAnomalyData(values.data)

  return {
    assignmentId,
    idSubsls,
    kodeAnomali,
    statusAlias: optionalValue(values.status_alias),
    namaAssignment: optionalValue(values.nama_assignment),
    nomorBangunan: optionalValue(values.nomor_bangunan),
    idsbr: optionalValue(values.idsbr),
    linkFasihEdit: optionalValue(values.link_fasih_edit),
    data,
    catatan: optionalValue(values.catatan),
    anomalyKey: createAnomalyKey(assignmentId, kodeAnomali, data),
    rowNumber
  }
}

function isBlankSourceRow(values: Partial<Record<SourceColumn, unknown>>): boolean {
  return Object.values(values).every(value => stringValue(value).trim() === '')
}

function readWorkbook(
  fileBuffer: Buffer,
  fileName: string,
  counts: AnomaliImportCounts,
  issues: AnomaliImportIssue[]
): ParsedAnomaliRecord[] {
  if (extname(fileName).toLowerCase() !== '.xlsx') {
    throw new AnomaliImportFileError('Anomaly import only accepts .xlsx files.')
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
    throw new AnomaliImportFileError(message)
  }

  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    throw new AnomaliImportFileError('Workbook does not contain a worksheet.')
  }

  const sheet = workbook.Sheets[sheetName]
  const reference = sheet?.['!ref']

  if (!sheet || !reference) {
    throw new AnomaliImportFileError('The first worksheet is empty.')
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
    throw new AnomaliImportFileError('Could not find an anomaly-feed header row.')
  }

  const missingColumns = Object.keys(SOURCE_COLUMNS).filter(column => !headers.has(column))

  if (missingColumns.length > 0) {
    throw new AnomaliImportFileError(`Missing required columns: ${missingColumns.join(', ')}`)
  }

  const deduplicated = new Map<string, ParsedAnomaliRecord>()
  const assignmentSls = new Map<string, string>()
  const assignmentConflicts = new Set<string>()

  for (let row = headerRow + 1; row <= range.e.r; row++) {
    const values: Partial<Record<SourceColumn, unknown>> = {}

    for (const sourceColumn of Object.keys(SOURCE_COLUMNS) as SourceColumn[]) {
      values[sourceColumn] = cellValue(sheet, row, headers.get(sourceColumn)!)
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
        message: 'assignment_id, id_subsls, and anomali are required.',
        rowNumbers: [rowNumber]
      })
      continue
    }

    const assignedSls = assignmentSls.get(record.assignmentId)

    if (assignedSls && assignedSls !== record.idSubsls) {
      const conflictKey = `${record.assignmentId}\u0000${assignedSls}\u0000${record.idSubsls}`

      if (!assignmentConflicts.has(conflictKey)) {
        assignmentConflicts.add(conflictKey)
        issues.push({
          code: 'conflicting-assignment-sls',
          message: `assignment_id ${record.assignmentId} resolves to multiple id_subsls values.`,
          rowNumbers: [rowNumber],
          values: [assignedSls, record.idSubsls]
        })
      }
    } else {
      assignmentSls.set(record.assignmentId, record.idSubsls)
    }

    const existing = deduplicated.get(record.anomalyKey)

    if (!existing) {
      deduplicated.set(record.anomalyKey, record)
      continue
    }

    counts.duplicateRows++

    if (!sourceRecordsEqual(existing, record)) {
      counts.conflictingDuplicates++
      issues.push({
        code: 'conflicting-duplicate',
        message: `Rows ${existing.rowNumber} and ${record.rowNumber} share an anomalyKey but differ in persisted source fields.`,
        rowNumbers: [existing.rowNumber, record.rowNumber]
      })
    }
  }

  return [...deduplicated.values()]
}

async function findMissingMasterSls(database: AnomaliImportDatabase, idSubslsValues: string[]): Promise<Set<string>> {
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

async function findMissingMasterAnomali(database: AnomaliImportDatabase, kodeAnomaliValues: string[]): Promise<Set<string>> {
  const found = new Set<string>()

  for (const values of chunk(kodeAnomaliValues, READ_BATCH_SIZE)) {
    const rows = await database.masterAnomali.findMany({
      where: { kodeAnomali: { in: values } },
      select: { kodeAnomali: true }
    })

    rows.forEach(row => found.add(row.kodeAnomali))
  }

  return new Set(kodeAnomaliValues.filter(value => !found.has(value)))
}

async function findExistingAnomali(database: AnomaliImportDatabase, anomalyKeys: string[]): Promise<Map<string, ExistingAnomali>> {
  const existing = new Map<string, ExistingAnomali>()

  for (const keys of chunk(anomalyKeys, READ_BATCH_SIZE)) {
    const rows = await database.anomali.findMany({
      where: { anomalyKey: { in: keys } },
      select: {
        anomalyKey: true,
        isActive: true,
        isHandled: true,
        handledAt: true,
        isSesuaiLapangan: true,
        sesuaiLapanganAt: true
      }
    })

    rows.forEach(row => existing.set(row.anomalyKey, row))
  }

  return existing
}

function addMasterIssues(
  records: ParsedAnomaliRecord[],
  missingSls: Set<string>,
  missingAnomali: Set<string>,
  counts: AnomaliImportCounts,
  issues: AnomaliImportIssue[]
): void {
  counts.invalidMasterSls = records.filter(record => missingSls.has(record.idSubsls)).length
  counts.invalidMasterAnomali = records.filter(record => missingAnomali.has(record.kodeAnomali)).length

  if (missingSls.size > 0) {
    issues.push({
      code: 'missing-master-sls',
      message: `${counts.invalidMasterSls} unique anomaly row(s) reference missing master_sls values.`,
      values: [...missingSls].slice(0, 20)
    })
  }

  if (missingAnomali.size > 0) {
    issues.push({
      code: 'missing-master-anomali',
      message: `${counts.invalidMasterAnomali} unique anomaly row(s) reference missing master_anomali values.`,
      values: [...missingAnomali].slice(0, 20)
    })
  }
}

function createData(record: ParsedAnomaliRecord, timestamp: Date): AnomaliSourceRecord & {
  anomalyKey: string
  isActive: boolean
  isHandled: boolean
  isSesuaiLapangan: boolean
  sesuaiLapanganAt: Date | null
  firstSeenAt: Date
  lastSeenAt: Date
} {
  return {
    assignmentId: record.assignmentId,
    idSubsls: record.idSubsls,
    kodeAnomali: record.kodeAnomali,
    statusAlias: record.statusAlias,
    namaAssignment: record.namaAssignment,
    nomorBangunan: record.nomorBangunan,
    idsbr: record.idsbr,
    linkFasihEdit: record.linkFasihEdit,
    data: record.data,
    catatan: record.catatan,
    anomalyKey: record.anomalyKey,
    isActive: true,
    isHandled: false,
    isSesuaiLapangan: false,
    sesuaiLapanganAt: null,
    firstSeenAt: timestamp,
    lastSeenAt: timestamp
  }
}

function updateData(
  record: ParsedAnomaliRecord,
  existing: ExistingAnomali,
  timestamp: Date
): AnomaliSourceRecord & {
  isActive: boolean
  lastSeenAt: Date
  isHandled?: boolean
  handledAt?: Date | null
} {
  return {
    assignmentId: record.assignmentId,
    idSubsls: record.idSubsls,
    kodeAnomali: record.kodeAnomali,
    statusAlias: record.statusAlias,
    namaAssignment: record.namaAssignment,
    nomorBangunan: record.nomorBangunan,
    idsbr: record.idsbr,
    linkFasihEdit: record.linkFasihEdit,
    data: record.data,
    catatan: record.catatan,
    isActive: true,
    lastSeenAt: timestamp,
    ...(!existing.isActive
      ? {
          isHandled: false,
          handledAt: null
        }
      : {})
  }
}

async function applyReconciliation(
  database: AnomaliImportDatabase,
  records: ParsedAnomaliRecord[],
  existingByKey: Map<string, ExistingAnomali>,
  disappearedUnhandledIds: string[],
  disappearedHandledIds: string[],
  timestamp: Date
): Promise<void> {
  const newRecords = records.filter(record => !existingByKey.has(record.anomalyKey))
  const existingRecords = records.filter(record => existingByKey.has(record.anomalyKey))

  await database.$transaction(async (transaction) => {
    for (const recordsBatch of chunk(newRecords, CREATE_BATCH_SIZE)) {
      await transaction.anomali.createMany({
        data: recordsBatch.map(record => createData(record, timestamp))
      })
    }

    for (const recordsBatch of chunk(existingRecords, UPDATE_BATCH_SIZE)) {
      await Promise.all(recordsBatch.map(record => transaction.anomali.update({
        where: { anomalyKey: record.anomalyKey },
        data: updateData(record, existingByKey.get(record.anomalyKey)!, timestamp)
      })))
    }

    for (const ids of chunk(disappearedUnhandledIds, DEACTIVATE_BATCH_SIZE)) {
      await transaction.anomali.updateMany({
        where: { id: { in: ids } },
        data: {
          isActive: false,
          isHandled: true,
          handledAt: timestamp
        }
      })
    }

    for (const ids of chunk(disappearedHandledIds, DEACTIVATE_BATCH_SIZE)) {
      await transaction.anomali.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false }
      })
    }
  }, APPLY_TRANSACTION_OPTIONS)
}

export async function importAnomaliWorkbook(options: AnomaliImportOptions): Promise<AnomaliImportResult> {
  if (options.filePath && options.fileBuffer) {
    throw new AnomaliImportFileError('Provide either a workbook path or buffer, not both.')
  }

  if (!options.filePath && !options.fileBuffer) {
    throw new AnomaliImportFileError('A workbook path or buffer is required.')
  }

  const filePath = options.filePath ? resolve(options.filePath) : undefined
  const fileName = options.fileName ?? (filePath ? basename(filePath) : 'upload.xlsx')
  const counts = emptyCounts()
  const issues: AnomaliImportIssue[] = []
  const timestamp = options.now ?? new Date()
  let fileBuffer: Buffer

  try {
    fileBuffer = options.fileBuffer ?? readFileSync(filePath!)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to read workbook.'
    throw new AnomaliImportFileError(message)
  }

  const records = readWorkbook(fileBuffer, fileName, counts, issues)

  counts.uniqueRows = records.length

  const missingSls = await findMissingMasterSls(
    options.database,
    [...new Set(records.map(record => record.idSubsls))]
  )
  const missingAnomali = await findMissingMasterAnomali(
    options.database,
    [...new Set(records.map(record => record.kodeAnomali))]
  )

  addMasterIssues(records, missingSls, missingAnomali, counts, issues)

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

  const sourceKeys = records.map(record => record.anomalyKey)
  const sourceKeySet = new Set(sourceKeys)
  const existingByKey = await findExistingAnomali(options.database, sourceKeys)
  const activeRows = await options.database.anomali.findMany({
    where: { isActive: true },
    select: {
      id: true,
      anomalyKey: true,
      isActive: true,
      isHandled: true,
      handledAt: true,
      isSesuaiLapangan: true,
      sesuaiLapanganAt: true
    }
  })
  const disappearedRows = activeRows.filter(row => !sourceKeySet.has(row.anomalyKey))
  const disappearedUnhandledIds = disappearedRows
    .filter(row => !row.isHandled)
    .map(row => row.id)
    .filter((id): id is string => Boolean(id))
  const disappearedHandledIds = disappearedRows
    .filter(row => row.isHandled)
    .map(row => row.id)
    .filter((id): id is string => Boolean(id))

  records.forEach((record) => {
    const existing = existingByKey.get(record.anomalyKey)

    if (!existing) {
      counts.new++
    } else if (existing.isActive) {
      counts.existing++
    } else {
      counts.reappeared++
    }
  })
  counts.disappeared = disappearedRows.length

  if (options.apply) {
    await applyReconciliation(
      options.database,
      records,
      existingByKey,
      disappearedUnhandledIds,
      disappearedHandledIds,
      timestamp
    )
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
