import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
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

const headers = ['id_subsls', 'nama_assignment'] as const
type FixtureRow = Partial<Record<(typeof headers)[number], string>>

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

async function writeWorkbook(directory: string, name: string, rows: FixtureRow[]): Promise<string> {
  const sheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...rows.map(row => headers.map(header => row[header] ?? ''))
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
    database.assignments.push({ id: 'assignment-old', idSubsls: 'sls-1', namaAssignment: 'Old' })
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
      { id_subsls: 'sls-1', nama_assignment: 'Assignment A' },
      { id_subsls: 'sls-1', nama_assignment: 'Assignment A' },
      { id_subsls: 'sls-2', nama_assignment: 'Assignment B' }
    ])
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

    const invalidSlsPath = await writeWorkbook(directory, 'invalid-sls', [
      { id_subsls: 'missing-sls', nama_assignment: 'Assignment Missing' }
    ])
    const beforeInvalidSls = snapshot(database)
    const invalidSls = await importTidakDitemukanWorkbook({
      database,
      filePath: invalidSlsPath,
      apply: true
    })

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

    const firstImportedAt = new Date('2026-02-01T00:00:00.000Z')
    const firstImport = await importTidakDitemukanWorkbook({
      database,
      filePath: firstImportPath,
      apply: true,
      now: firstImportedAt
    })

    assert.equal(firstImport.applied, true)
    assert.equal(database.assignments.length, 3)
    assert.deepEqual(database.assignments.map(record => record.namaAssignment), [
      'Assignment A', 'Assignment A', 'Assignment B'
    ])
    assert.deepEqual(database.statuses, [])
    assert.equal(database.metadata.length, 1)
    assert.equal(database.metadata[0]?.namaFile, 'first-import.xlsx')
    assert.equal(database.metadata[0]?.importedAt, firstImportedAt)
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
      namaAssignment: record.namaAssignment
    })), [{ idSubsls: 'sls-2', namaAssignment: 'Replacement Assignment' }])
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
      importTidakDitemukanWorkbook({ database, filePath: firstImportPath, apply: true }),
      /Simulated metadata write failure/
    )
    assert.equal(snapshot(database), beforeFailure)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

await run()
console.log('Tidak Ditemukan import tests passed.')
