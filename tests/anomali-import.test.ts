import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import XLSX from 'xlsx'

import {
  importAnomaliWorkbook,
  type AnomaliImportDatabase,
  type AnomaliImportTransaction,
  type AnomaliImportTransactionOptions,
  type AnomaliSourceRecord
} from '../server/services/anomali-import'
import { createAnomalyKey } from '../server/services/anomali-key'

const headers = [
  'assignment_id',
  'id_subsls',
  'anomali',
  'status_alias',
  'nama_assignment',
  'nomor_bangunan',
  'idsbr',
  'link_fasih_edit',
  'DATA',
  'catatan'
] as const

type FixtureRow = Partial<Record<(typeof headers)[number], string>>

interface StoredAnomali extends AnomaliSourceRecord {
  id: string
  anomalyKey: string
  isActive: boolean
  isHandled: boolean
  handledAt: Date | null
  isSesuaiLapangan: boolean
  sesuaiLapanganAt: Date | null
  handledBy: string | null
  handlingNote: string | null
  firstSeenAt: Date
  lastSeenAt: Date
}

class FakeDatabase implements AnomaliImportDatabase {
  readonly masterSlsValues = new Set<string>()
  readonly masterAnomaliValues = new Set<string>()
  readonly anomalies = new Map<string, StoredAnomali>()
  failOnDeactivate = false
  private nextId = 1

  readonly masterSls = {
    findMany: async ({ where }: { where: { idSubsls: { in: string[] } } }) => where.idSubsls.in
      .filter(value => this.masterSlsValues.has(value))
      .map(idSubsls => ({ idSubsls }))
  }

  readonly masterAnomali = {
    findMany: async ({ where }: { where: { kodeAnomali: { in: string[] } } }) => where.kodeAnomali.in
      .filter(value => this.masterAnomaliValues.has(value))
      .map(kodeAnomali => ({ kodeAnomali }))
  }

  readonly anomali = {
    findMany: async ({ where }: {
      where: { anomalyKey?: { in: string[] }, isActive?: boolean }
    }) => [...this.anomalies.values()].filter((record) => {
      const matchesKey = !where.anomalyKey || where.anomalyKey.in.includes(record.anomalyKey)
      const matchesActive = where.isActive === undefined || record.isActive === where.isActive

      return matchesKey && matchesActive
    }),
    createMany: async ({ data }: { data: Array<AnomaliSourceRecord & {
      anomalyKey: string
      isActive: boolean
      isHandled: boolean
      isSesuaiLapangan: boolean
      sesuaiLapanganAt: Date | null
      firstSeenAt: Date
      lastSeenAt: Date
    }> }) => {
      data.forEach((record) => {
        this.anomalies.set(record.anomalyKey, {
          ...record,
          id: `anomali-${this.nextId++}`,
          handledAt: null,
          sesuaiLapanganAt: null,
          handledBy: null,
          handlingNote: null
        })
      })
    },
    update: async ({ where, data }: {
      where: { anomalyKey: string }
      data: AnomaliSourceRecord & {
        isActive: boolean
        lastSeenAt: Date
        isHandled?: boolean
        handledAt?: Date | null
      }
    }) => {
      const existing = this.anomalies.get(where.anomalyKey)

      if (!existing) {
        throw new Error(`Missing anomaly ${where.anomalyKey}`)
      }

      Object.assign(existing, data)
    },
    updateMany: async ({ where, data }: {
      where: { id: { in: string[] } }
      data: {
        isActive: boolean
        isHandled?: boolean
        handledAt?: Date | null
      }
    }) => {
      if (this.failOnDeactivate) {
        throw new Error('Simulated deactivation failure')
      }

      this.anomalies.forEach((record) => {
        if (where.id.in.includes(record.id)) {
          Object.assign(record, data)
        }
      })
    }
  }

  async $transaction<T>(
    callback: (transaction: AnomaliImportTransaction) => Promise<T>,
    options?: AnomaliImportTransactionOptions
  ): Promise<T> {
    void options
    const snapshot = new Map(
      [...this.anomalies.entries()].map(([key, value]) => [key, { ...value }])
    )
    const nextId = this.nextId

    try {
      return await callback(this)
    } catch (error) {
      this.anomalies.clear()
      snapshot.forEach((value, key) => this.anomalies.set(key, value))
      this.nextId = nextId
      throw error
    }
  }

  addAnomaly(record: Omit<StoredAnomali, 'id'>): StoredAnomali {
    const stored = { ...record, id: `anomali-${this.nextId++}` }
    this.anomalies.set(stored.anomalyKey, stored)

    return stored
  }
}

function sourceRow(overrides: FixtureRow = {}): FixtureRow {
  return {
    assignment_id: 'assignment-1',
    id_subsls: 'sls-1',
    anomali: 'A-1',
    status_alias: 'Open',
    nama_assignment: 'Assignment One',
    nomor_bangunan: '1',
    idsbr: 'sbr-1',
    link_fasih_edit: 'https://example.test/edit',
    DATA: 'Example data',
    catatan: 'Example note',
    ...overrides
  }
}

async function writeWorkbook(directory: string, name: string, rows: FixtureRow[]): Promise<string> {
  const sheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...rows.map(row => headers.map(header => row[header] ?? ''))
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Anomali')
  const filePath = join(directory, `${name}.xlsx`)

  XLSX.writeFile(workbook, filePath)

  return filePath
}

function storedAnomaly(
  assignmentId: string,
  kodeAnomali: string,
  data: string,
  overrides: Partial<StoredAnomali> = {}
): Omit<StoredAnomali, 'id'> {
  const now = new Date('2026-01-01T00:00:00.000Z')

  return {
    assignmentId,
    idSubsls: 'sls-1',
    kodeAnomali,
    statusAlias: 'Open',
    namaAssignment: 'Assignment One',
    nomorBangunan: '1',
    idsbr: 'sbr-1',
    linkFasihEdit: 'https://example.test/edit',
    data,
    catatan: 'Example note',
    anomalyKey: createAnomalyKey(assignmentId, kodeAnomali, data),
    isActive: true,
    isHandled: false,
    handledAt: null,
    isSesuaiLapangan: false,
    sesuaiLapanganAt: null,
    handledBy: null,
    handlingNote: null,
    firstSeenAt: now,
    lastSeenAt: now,
    ...overrides
  }
}

async function run(): Promise<void> {
  assert.equal(
    createAnomalyKey('assignment', 'A-1', 'line one\r\nline two  '),
    createAnomalyKey('assignment', 'A-1', 'line one\nline two')
  )

  const directory = await mkdtemp(join(tmpdir(), 'anomali-import-'))

  try {
    const database = new FakeDatabase()
    database.masterSlsValues.add('sls-1')
    database.masterSlsValues.add('sls-2')
    ;['A-1', 'A-2', 'A-3', 'A-4', 'A-5'].forEach(code => database.masterAnomaliValues.add(code))

    const existingHandledAt = new Date('2026-01-02T00:00:00.000Z')
    const existingSesuaiLapanganAt = new Date('2026-01-03T00:00:00.000Z')
    const existing = database.addAnomaly(storedAnomaly('assignment-2', 'A-2', 'Existing data', {
      isHandled: true,
      handledAt: existingHandledAt,
      isSesuaiLapangan: true,
      sesuaiLapanganAt: existingSesuaiLapanganAt
    }))
    const missingSesuaiLapanganAt = new Date('2026-01-04T00:00:00.000Z')
    const missing = database.addAnomaly(storedAnomaly('assignment-3', 'A-3', 'Missing data', {
      isSesuaiLapangan: true,
      sesuaiLapanganAt: missingSesuaiLapanganAt
    }))
    const manuallyHandledMissingAt = new Date('2026-01-03T00:00:00.000Z')
    const manuallyHandledMissing = database.addAnomaly(storedAnomaly('assignment-5', 'A-5', 'Handled missing data', {
      isHandled: true,
      handledAt: manuallyHandledMissingAt
    }))
    const reappeared = database.addAnomaly(storedAnomaly('assignment-4', 'A-4', 'Reappeared data', {
      isActive: false,
      isHandled: true,
      handledAt: new Date('2026-01-02T00:00:00.000Z'),
      isSesuaiLapangan: true,
      sesuaiLapanganAt: new Date('2026-01-03T00:00:00.000Z'),
      handledBy: 'tester',
      handlingNote: 'Keep this handling state'
    }))
    const reappearedFirstSeenAt = reappeared.firstSeenAt
    const snapshotPath = await writeWorkbook(directory, 'snapshot', [
      sourceRow({ assignment_id: 'assignment-1', anomali: 'A-1', DATA: 'New data' }),
      sourceRow({ assignment_id: 'assignment-2', anomali: 'A-2', DATA: 'Existing data' }),
      sourceRow({ assignment_id: 'assignment-4', anomali: 'A-4', DATA: 'Reappeared data' }),
      sourceRow({ assignment_id: 'assignment-1', anomali: 'A-1', DATA: 'New data' })
    ])

    const preview = await importAnomaliWorkbook({
      database,
      filePath: snapshotPath,
      now: new Date('2026-02-01T00:00:00.000Z')
    })

    assert.equal(preview.valid, true)
    assert.equal(preview.applied, false)
    assert.deepEqual(preview.counts, {
      sourceRows: 4,
      uniqueRows: 3,
      duplicateRows: 1,
      new: 1,
      existing: 1,
      reappeared: 1,
      disappeared: 2,
      invalidMasterSls: 0,
      invalidMasterAnomali: 0,
      conflictingDuplicates: 0
    })
    assert.equal(database.anomalies.size, 4)
    assert.equal(missing.isActive, true)

    const bufferPreview = await importAnomaliWorkbook({
      database,
      fileBuffer: await readFile(snapshotPath),
      fileName: 'snapshot.xlsx',
      now: new Date('2026-02-01T00:00:00.000Z')
    })

    assert.equal(bufferPreview.valid, true)
    assert.equal(bufferPreview.applied, false)
    assert.deepEqual(bufferPreview.counts, preview.counts)
    assert.equal(database.anomalies.size, 4)
    assert.equal(missing.isActive, true)

    const applied = await importAnomaliWorkbook({
      database,
      filePath: snapshotPath,
      apply: true,
      now: new Date('2026-02-01T00:00:00.000Z')
    })
    const created = database.anomalies.get(createAnomalyKey('assignment-1', 'A-1', 'New data'))

    assert.equal(applied.applied, true)
    assert.ok(created)
    assert.equal(created.isSesuaiLapangan, false)
    assert.equal(created.sesuaiLapanganAt, null)
    assert.equal(existing.isActive, true)
    assert.equal(existing.isHandled, true)
    assert.equal(existing.handledAt, existingHandledAt)
    assert.equal(existing.isSesuaiLapangan, true)
    assert.equal(existing.sesuaiLapanganAt, existingSesuaiLapanganAt)
    assert.equal(missing.isActive, false)
    assert.equal(missing.isHandled, true)
    assert.equal(missing.handledAt?.toISOString(), '2026-02-01T00:00:00.000Z')
    assert.equal(missing.isSesuaiLapangan, true)
    assert.equal(missing.sesuaiLapanganAt, missingSesuaiLapanganAt)
    assert.equal(manuallyHandledMissing.isActive, false)
    assert.equal(manuallyHandledMissing.isHandled, true)
    assert.equal(manuallyHandledMissing.handledAt, manuallyHandledMissingAt)
    assert.equal(reappeared.isActive, true)
    assert.equal(reappeared.isHandled, false)
    assert.equal(reappeared.firstSeenAt, reappearedFirstSeenAt)
    assert.equal(reappeared.handledAt, null)
    assert.equal(reappeared.isSesuaiLapangan, true)
    assert.equal(reappeared.sesuaiLapanganAt?.toISOString(), '2026-01-03T00:00:00.000Z')
    assert.equal(reappeared.handledBy, 'tester')
    assert.equal(reappeared.handlingNote, 'Keep this handling state')

    const failingDatabase = new FakeDatabase()
    failingDatabase.masterSlsValues.add('sls-1')
    ;['A-1', 'A-2', 'A-3', 'A-4', 'A-5'].forEach(code => failingDatabase.masterAnomaliValues.add(code))
    failingDatabase.addAnomaly(storedAnomaly('assignment-2', 'A-2', 'Existing data'))
    failingDatabase.addAnomaly(storedAnomaly('assignment-3', 'A-3', 'Missing data'))
    failingDatabase.addAnomaly(storedAnomaly('assignment-4', 'A-4', 'Reappeared data', {
      isActive: false,
      isHandled: true,
      handledAt: new Date('2026-01-02T00:00:00.000Z'),
      handledBy: 'tester',
      handlingNote: 'Keep this handling state'
    }))
    failingDatabase.failOnDeactivate = true
    const beforeFailure = JSON.stringify([...failingDatabase.anomalies.values()])

    await assert.rejects(
      importAnomaliWorkbook({
        database: failingDatabase,
        filePath: snapshotPath,
        apply: true,
        now: new Date('2026-02-01T00:00:00.000Z')
      }),
      /Simulated deactivation failure/
    )
    assert.equal(JSON.stringify([...failingDatabase.anomalies.values()]), beforeFailure)

    const conflictingPath = await writeWorkbook(directory, 'conflicting', [
      sourceRow({ DATA: 'same key', catatan: 'first' }),
      sourceRow({ DATA: 'same key', catatan: 'second' })
    ])
    const beforeConflict = JSON.stringify([...database.anomalies.values()])
    const conflicting = await importAnomaliWorkbook({ database, filePath: conflictingPath, apply: true })

    assert.equal(conflicting.valid, false)
    assert.equal(conflicting.counts.conflictingDuplicates, 1)
    assert.equal(JSON.stringify([...database.anomalies.values()]), beforeConflict)

    const invalidMasterPath = await writeWorkbook(directory, 'invalid-masters', [
      sourceRow({ assignment_id: 'assignment-5', id_subsls: 'missing-sls', anomali: 'A-1' }),
      sourceRow({ assignment_id: 'assignment-6', id_subsls: 'sls-1', anomali: 'missing-anomali' })
    ])
    const invalidMasters = await importAnomaliWorkbook({ database, filePath: invalidMasterPath })

    assert.equal(invalidMasters.valid, false)
    assert.equal(invalidMasters.counts.invalidMasterSls, 1)
    assert.equal(invalidMasters.counts.invalidMasterAnomali, 1)

    const assignmentConflictPath = await writeWorkbook(directory, 'assignment-conflict', [
      sourceRow({ assignment_id: 'assignment-7', id_subsls: 'sls-1', anomali: 'A-1' }),
      sourceRow({ assignment_id: 'assignment-7', id_subsls: 'sls-2', anomali: 'A-2' })
    ])
    const assignmentConflict = await importAnomaliWorkbook({ database, filePath: assignmentConflictPath })

    assert.equal(assignmentConflict.valid, false)
    assert.ok(assignmentConflict.issues.some(issue => issue.code === 'conflicting-assignment-sls'))
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

await run()
console.log('Anomali import tests passed.')
