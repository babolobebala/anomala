import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import XLSX from 'xlsx'

import {
  importTidakDitemukanWorkbook,
  type TidakDitemukanImportDatabase,
  type TidakDitemukanImportTransaction,
  type TidakDitemukanImportTransactionOptions,
  type TidakDitemukanSourceRecord
} from '../server/services/tidak-ditemukan-import'
import {
  TidakDitemukanImportPasswordError,
  importTidakDitemukanUploadedFile
} from '../server/utils/tidak-ditemukan-import-upload'

const headers = ['id_subsls', 'nama_assignment'] as const
const headersWithSumber = [...headers, 'SUMBER'] as const
type FixtureHeader = (typeof headersWithSumber)[number]
type FixtureRow = Partial<Record<FixtureHeader, string>>

interface StoredAssignment extends TidakDitemukanSourceRecord {
  id: string
}

interface StoredStatus {
  idSubsls: string
  isSelesai: boolean
  selesaiAt: Date | null
}

interface StoredMetadata {
  id: string
  importedAt: Date
  namaFile: string
  jumlahAssignment: number
  jumlahSls: number
}

class FakeDatabase implements TidakDitemukanImportDatabase, TidakDitemukanImportTransaction {
  readonly masterSlsValues = new Set<string>()
  readonly assignments: StoredAssignment[] = []
  readonly statuses: StoredStatus[] = []
  readonly metadata: StoredMetadata[] = []
  failOnMetadataCreate = false
  private nextId = 1

  readonly masterSls = {
    findMany: async ({ where }: { where: { idSubsls: { in: string[] } } }) => where.idSubsls.in
      .filter(value => this.masterSlsValues.has(value))
      .map(idSubsls => ({ idSubsls }))
  }

  readonly tidakDitemukanAssignment = {
    deleteMany: async () => {
      this.assignments.splice(0)
    },
    createMany: async ({ data }: { data: TidakDitemukanSourceRecord[] }) => {
      data.forEach(record => this.assignments.push({ ...record, id: `assignment-${this.nextId++}` }))
    }
  }

  readonly tidakDitemukanSlsStatus = {
    deleteMany: async () => {
      this.statuses.splice(0)
    }
  }

  readonly tidakDitemukanWaktuImport = {
    deleteMany: async () => {
      this.metadata.splice(0)
    },
    create: async ({ data }: { data: Omit<StoredMetadata, 'id'> }) => {
      if (this.failOnMetadataCreate) {
        throw new Error('Simulated metadata write failure')
      }

      this.metadata.push({ ...data, id: `metadata-${this.nextId++}` })
    }
  }

  async $transaction<T>(
    callback: (transaction: TidakDitemukanImportTransaction) => Promise<T>,
    options?: TidakDitemukanImportTransactionOptions
  ): Promise<T> {
    void options
    const assignments = this.assignments.map(record => ({ ...record }))
    const statuses = this.statuses.map(record => ({ ...record }))
    const metadata = this.metadata.map(record => ({ ...record }))
    const nextId = this.nextId

    try {
      return await callback(this)
    } catch (error) {
      this.assignments.splice(0, this.assignments.length, ...assignments)
      this.statuses.splice(0, this.statuses.length, ...statuses)
      this.metadata.splice(0, this.metadata.length, ...metadata)
      this.nextId = nextId
      throw error
    }
  }
}

async function writeWorkbook(
  directory: string,
  name: string,
  rows: FixtureRow[],
  workbookHeaders: readonly FixtureHeader[] = headers
): Promise<string> {
  const sheet = XLSX.utils.aoa_to_sheet([
    workbookHeaders,
    ...rows.map(row => workbookHeaders.map(header => row[header] ?? ''))
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Tidak Ditemukan')
  const filePath = join(directory, `${name}.xlsx`)
  XLSX.writeFile(workbook, filePath)

  return filePath
}

function snapshot(database: FakeDatabase): string {
  return JSON.stringify({
    assignments: database.assignments,
    statuses: database.statuses,
    metadata: database.metadata
  })
}

async function run(): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), 'tidak-ditemukan-import-'))

  try {
    const database = new FakeDatabase()
    database.masterSlsValues.add('sls-1')
    database.masterSlsValues.add('sls-2')
    database.assignments.push({ id: 'assignment-old', idSubsls: 'sls-1', namaAssignment: 'Old', sumber: null })
    database.statuses.push({
      idSubsls: 'sls-1',
      isSelesai: true,
      selesaiAt: new Date('2026-01-01T00:00:00.000Z')
    })
    database.metadata.push({
      id: 'metadata-old',
      importedAt: new Date('2026-01-01T00:00:00.000Z'),
      namaFile: 'old.xlsx',
      jumlahAssignment: 1,
      jumlahSls: 1
    })

    const firstImportPath = await writeWorkbook(directory, 'first-import', [
      { id_subsls: 'sls-1', nama_assignment: 'Assignment A', SUMBER: '  Sumber A  ' },
      { id_subsls: 'sls-1', nama_assignment: 'Assignment A', SUMBER: '  ' },
      { id_subsls: 'sls-2', nama_assignment: 'Assignment B', SUMBER: 'Sumber B' }
    ], headersWithSumber)
    const beforeDryRun = snapshot(database)
    const dryRun = await importTidakDitemukanWorkbook({
      database,
      filePath: firstImportPath,
      now: new Date('2026-02-01T00:00:00.000Z')
    })

    assert.equal(dryRun.valid, true)
    assert.equal(dryRun.applied, false)
    assert.deepEqual(dryRun.counts, {
      sourceRows: 3,
      jumlahAssignment: 3,
      jumlahSls: 2,
      invalidRows: 0,
      invalidMasterSls: 0
    })
    assert.equal(snapshot(database), beforeDryRun)

    const webPreview = await importTidakDitemukanUploadedFile({
      filename: 'first-import.xlsx',
      data: await readFile(firstImportPath)
    }, false, database)
    assert.equal(webPreview.valid, true)
    assert.equal(webPreview.applied, false)
    assert.equal(webPreview.fileName, 'first-import.xlsx')
    assert.deepEqual(webPreview.counts, dryRun.counts)
    assert.equal(snapshot(database), beforeDryRun)

    await assert.rejects(
      importTidakDitemukanUploadedFile({
        filename: 'first-import.xlsx',
        data: await readFile(firstImportPath)
      }, true, database),
      TidakDitemukanImportPasswordError
    )
    assert.equal(snapshot(database), beforeDryRun)

    await assert.rejects(
      importTidakDitemukanUploadedFile({
        filename: 'first-import.xlsx',
        data: await readFile(firstImportPath)
      }, true, database, 'wrong-password'),
      TidakDitemukanImportPasswordError
    )
    assert.equal(snapshot(database), beforeDryRun)

    const invalidSlsPath = await writeWorkbook(directory, 'invalid-sls', [
      { id_subsls: 'missing-sls', nama_assignment: 'Assignment Missing' }
    ])
    const beforeInvalidSls = snapshot(database)
    const invalidSls = await importTidakDitemukanUploadedFile({
      filename: 'invalid-sls.xlsx',
      data: await readFile(invalidSlsPath)
    }, true, database, 'password')

    assert.equal(invalidSls.valid, false)
    assert.equal(invalidSls.counts.invalidMasterSls, 1)
    assert.equal(snapshot(database), beforeInvalidSls)

    const emptyAssignmentPath = await writeWorkbook(directory, 'empty-assignment', [
      { id_subsls: 'sls-1', nama_assignment: '  ' }
    ])
    const emptyAssignment = await importTidakDitemukanWorkbook({
      database,
      filePath: emptyAssignmentPath,
      apply: true
    })

    assert.equal(emptyAssignment.valid, false)
    assert.equal(emptyAssignment.counts.invalidRows, 1)
    assert.ok(emptyAssignment.issues.some(issue => issue.code === 'missing-assignment-name'))
    assert.equal(snapshot(database), beforeInvalidSls)

    const firstImport = await importTidakDitemukanUploadedFile({
      filename: 'first-import.xlsx',
      data: await readFile(firstImportPath)
    }, true, database, 'password')

    assert.equal(firstImport.applied, true)
    assert.equal(database.assignments.length, 3)
    assert.deepEqual(database.assignments.map(record => ({
      namaAssignment: record.namaAssignment,
      sumber: record.sumber
    })), [
      { namaAssignment: 'Assignment A', sumber: 'Sumber A' },
      { namaAssignment: 'Assignment A', sumber: null },
      { namaAssignment: 'Assignment B', sumber: 'Sumber B' }
    ])
    assert.deepEqual(database.statuses, [])
    assert.equal(database.metadata.length, 1)
    assert.equal(database.metadata[0]?.namaFile, 'first-import.xlsx')
    assert.ok(database.metadata[0]?.importedAt instanceof Date)
    assert.equal(database.metadata[0]?.jumlahAssignment, 3)
    assert.equal(database.metadata[0]?.jumlahSls, 2)

    database.statuses.push({
      idSubsls: 'sls-1',
      isSelesai: true,
      selesaiAt: new Date('2026-02-02T00:00:00.000Z')
    })
    const secondImportPath = await writeWorkbook(directory, 'second-import', [
      { id_subsls: 'sls-2', nama_assignment: 'Replacement Assignment' }
    ])
    await importTidakDitemukanWorkbook({ database, filePath: secondImportPath, apply: true })

    assert.deepEqual(database.assignments.map(record => ({
      idSubsls: record.idSubsls,
      namaAssignment: record.namaAssignment,
      sumber: record.sumber
    })), [{ idSubsls: 'sls-2', namaAssignment: 'Replacement Assignment', sumber: null }])
    assert.deepEqual(database.statuses, [])

    database.statuses.push({
      idSubsls: 'sls-2',
      isSelesai: true,
      selesaiAt: new Date('2026-02-03T00:00:00.000Z')
    })
    await importTidakDitemukanWorkbook({ database, filePath: secondImportPath, apply: true })
    assert.deepEqual(database.statuses, [])

    database.statuses.push({
      idSubsls: 'sls-1',
      isSelesai: true,
      selesaiAt: new Date('2026-02-04T00:00:00.000Z')
    })
    const beforeFailure = snapshot(database)
    database.failOnMetadataCreate = true

    await assert.rejects(
      importTidakDitemukanUploadedFile({
        filename: 'first-import.xlsx',
        data: await readFile(firstImportPath)
      }, true, database, 'password'),
      /Simulated metadata write failure/
    )
    assert.equal(snapshot(database), beforeFailure)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

await run()
console.log('Tidak Ditemukan import tests passed.')
