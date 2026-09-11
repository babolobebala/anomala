import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import XLSX from 'xlsx'

import {
  importKbliWorkbook,
  type KbliImportDatabase,
  type KbliImportTransaction,
  type KbliImportTransactionOptions,
  type KbliSourceRecord
} from '../server/services/kbli-import'
import { createKbliKey } from '../server/services/kbli-key'

const headers = [
  'assignment_id',
  'status_alias',
  'id_subsls',
  'nama_assignment',
  'nomor_bangunan',
  'idsbr',
  'anomali',
  'desk_anomali',
  'DATA',
  'catatan',
  'link_fasih_edit'
] as const

type FixtureRow = Partial<Record<(typeof headers)[number], string>>

interface StoredKbli extends KbliSourceRecord {
  id: string
  kbliKey: string
  firstSeenAt: Date
  lastSeenAt: Date
}

class FakeDatabase implements KbliImportDatabase {
  readonly masterSlsValues = new Set<string>()
  readonly masterKategoriValues = new Set<string>()
  readonly kbliRows = new Map<string, StoredKbli>()
  failOnUpdate = false
  private nextId = 1

  readonly masterSls = {
    findMany: async ({ where }: { where: { idSubsls: { in: string[] } } }) => where.idSubsls.in
      .filter(value => this.masterSlsValues.has(value))
      .map(idSubsls => ({ idSubsls }))
  }

  readonly masterKbliTemuan = {
    findMany: async ({ where }: { where: { kode: { in: string[] } } }) => where.kode.in
      .filter(value => this.masterKategoriValues.has(value))
      .map(kode => ({ kode }))
  }

  readonly kbli = {
    findMany: async ({ where }: { where: { kbliKey: { in: string[] } } }) => [...this.kbliRows.values()]
      .filter(record => where.kbliKey.in.includes(record.kbliKey))
      .map(record => ({ kbliKey: record.kbliKey })),
    createMany: async ({ data }: { data: Array<KbliSourceRecord & {
      kbliKey: string
      firstSeenAt: Date
      lastSeenAt: Date
    }> }) => {
      data.forEach((record) => {
        this.kbliRows.set(record.kbliKey, {
          ...record,
          id: `kbli-${this.nextId++}`
        })
      })
    },
    update: async ({ where, data }: {
      where: { kbliKey: string }
      data: KbliSourceRecord & { lastSeenAt: Date }
    }) => {
      if (this.failOnUpdate) {
        throw new Error('Simulated KBLI update failure')
      }

      const existing = this.kbliRows.get(where.kbliKey)

      if (!existing) {
        throw new Error(`Missing KBLI row ${where.kbliKey}`)
      }

      Object.assign(existing, data)
    }
  }

  async $transaction<T>(
    callback: (transaction: KbliImportTransaction) => Promise<T>,
    options?: KbliImportTransactionOptions
  ): Promise<T> {
    void options
    const snapshot = new Map(
      [...this.kbliRows.entries()].map(([key, value]) => [key, { ...value }])
    )
    const nextId = this.nextId

    try {
      return await callback(this)
    } catch (error) {
      this.kbliRows.clear()
      snapshot.forEach((value, key) => this.kbliRows.set(key, value))
      this.nextId = nextId
      throw error
    }
  }

  addKbli(record: Omit<StoredKbli, 'id'>): StoredKbli {
    const stored = { ...record, id: `kbli-${this.nextId++}` }
    this.kbliRows.set(stored.kbliKey, stored)

    return stored
  }
}

function sourceRow(overrides: FixtureRow = {}): FixtureRow {
  return {
    assignment_id: 'assignment-1',
    status_alias: 'Open',
    id_subsls: 'sls-1',
    nama_assignment: 'Assignment One',
    nomor_bangunan: '1',
    idsbr: 'sbr-1',
    anomali: 'KBLI-01',
    desk_anomali: 'Imported but not persisted',
    DATA: 'Example data',
    catatan: 'Example note',
    link_fasih_edit: 'https://example.test/edit',
    ...overrides
  }
}

async function writeWorkbook(directory: string, name: string, rows: FixtureRow[]): Promise<string> {
  const sheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...rows.map(row => headers.map(header => row[header] ?? ''))
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'KBLI')
  const filePath = join(directory, `${name}.xlsx`)

  XLSX.writeFile(workbook, filePath)

  return filePath
}

function storedKbli(
  assignmentId: string,
  kategori: string,
  data: string,
  overrides: Partial<StoredKbli> = {}
): Omit<StoredKbli, 'id'> {
  const timestamp = new Date('2026-01-01T00:00:00.000Z')

  return {
    assignmentId,
    idSubsls: 'sls-1',
    kategori,
    statusAlias: 'Open',
    namaAssignment: 'Assignment One',
    nomorBangunan: '1',
    idsbr: 'sbr-1',
    linkFasihEdit: 'https://example.test/edit',
    data,
    catatan: 'Example note',
    kbliKey: createKbliKey(assignmentId, kategori, data),
    firstSeenAt: timestamp,
    lastSeenAt: timestamp,
    ...overrides
  }
}

function prepareMasters(database: FakeDatabase): void {
  database.masterSlsValues.add('sls-1')
  ;['KBLI-01', 'KBLI-02', 'KBLI-03'].forEach(kode => database.masterKategoriValues.add(kode))
}

async function run(): Promise<void> {
  assert.equal(
    createKbliKey('assignment', 'KBLI-01', 'line one\r\nline two  '),
    createKbliKey('assignment', 'KBLI-01', 'line one\nline two')
  )
  assert.notEqual(
    createKbliKey('assignment', 'KBLI-01', 'first data'),
    createKbliKey('assignment', 'KBLI-01', 'second data')
  )

  const directory = await mkdtemp(join(tmpdir(), 'kbli-import-'))

  try {
    const database = new FakeDatabase()
    prepareMasters(database)
    const firstImportAt = new Date('2026-02-01T00:00:00.000Z')
    const initialPath = await writeWorkbook(directory, 'initial', [
      sourceRow({ anomali: 'KBLI-01', DATA: 'Alpha data', catatan: 'Alpha note' }),
      sourceRow({ anomali: 'KBLI-01', DATA: 'Alpha data', catatan: 'Alpha note' }),
      sourceRow({ anomali: 'KBLI-02', DATA: 'Beta data', catatan: 'Beta note' })
    ])

    const preview = await importKbliWorkbook({
      database,
      filePath: initialPath,
      now: firstImportAt
    })

    assert.equal(preview.valid, true)
    assert.equal(preview.applied, false)
    assert.deepEqual(preview.counts, {
      sourceRows: 3,
      uniqueRows: 2,
      duplicateRows: 1,
      new: 2,
      existing: 0,
      invalidMasterSls: 0,
      invalidMasterKategori: 0,
      conflictingDuplicates: 0
    })
    assert.equal(database.kbliRows.size, 0)

    const initialApply = await importKbliWorkbook({
      database,
      filePath: initialPath,
      apply: true,
      now: firstImportAt
    })
    const alphaKey = createKbliKey('assignment-1', 'KBLI-01', 'Alpha data')
    const betaKey = createKbliKey('assignment-1', 'KBLI-02', 'Beta data')
    const alpha = database.kbliRows.get(alphaKey)
    const beta = database.kbliRows.get(betaKey)

    assert.equal(initialApply.applied, true)
    assert.ok(alpha)
    assert.ok(beta)
    assert.equal(alpha.firstSeenAt.toISOString(), firstImportAt.toISOString())
    assert.equal(alpha.lastSeenAt.toISOString(), firstImportAt.toISOString())
    const betaBeforeOmission = JSON.stringify(beta)

    const refreshAt = new Date('2026-02-02T00:00:00.000Z')
    const refreshPath = await writeWorkbook(directory, 'refresh', [
      sourceRow({
        anomali: 'KBLI-01',
        DATA: 'Alpha data',
        status_alias: 'Closed',
        catatan: 'Alpha updated note'
      })
    ])
    const refresh = await importKbliWorkbook({
      database,
      filePath: refreshPath,
      apply: true,
      now: refreshAt
    })

    assert.equal(refresh.counts.new, 0)
    assert.equal(refresh.counts.existing, 1)
    assert.equal(alpha.firstSeenAt.toISOString(), firstImportAt.toISOString())
    assert.equal(alpha.lastSeenAt.toISOString(), refreshAt.toISOString())
    assert.equal(alpha.statusAlias, 'Closed')
    assert.equal(alpha.catatan, 'Alpha updated note')
    assert.equal(JSON.stringify(beta), betaBeforeOmission)

    const newDataPath = await writeWorkbook(directory, 'new-data', [
      sourceRow({ anomali: 'KBLI-01', DATA: 'Gamma data' })
    ])
    const newData = await importKbliWorkbook({
      database,
      filePath: newDataPath,
      apply: true,
      now: new Date('2026-02-03T00:00:00.000Z')
    })
    const gammaKey = createKbliKey('assignment-1', 'KBLI-01', 'Gamma data')

    assert.equal(newData.counts.new, 1)
    assert.notEqual(alphaKey, gammaKey)
    assert.ok(database.kbliRows.has(gammaKey))

    const conflictingPath = await writeWorkbook(directory, 'conflicting', [
      sourceRow({ DATA: 'Conflicting data', catatan: 'first' }),
      sourceRow({ DATA: 'Conflicting data', catatan: 'second' })
    ])
    const beforeConflict = JSON.stringify([...database.kbliRows.values()])
    const conflicting = await importKbliWorkbook({
      database,
      filePath: conflictingPath,
      apply: true
    })

    assert.equal(conflicting.valid, false)
    assert.equal(conflicting.applied, false)
    assert.equal(conflicting.counts.conflictingDuplicates, 1)
    assert.equal(JSON.stringify([...database.kbliRows.values()]), beforeConflict)

    const invalidMasterPath = await writeWorkbook(directory, 'invalid-masters', [
      sourceRow({ id_subsls: 'missing-sls', anomali: 'KBLI-01', DATA: 'Missing SLS' }),
      sourceRow({ id_subsls: 'sls-1', anomali: 'missing-kategori', DATA: 'Missing category' })
    ])
    const invalidMasters = await importKbliWorkbook({
      database,
      filePath: invalidMasterPath
    })

    assert.equal(invalidMasters.valid, false)
    assert.equal(invalidMasters.counts.invalidMasterSls, 1)
    assert.equal(invalidMasters.counts.invalidMasterKategori, 1)

    const rollbackDatabase = new FakeDatabase()
    prepareMasters(rollbackDatabase)
    rollbackDatabase.addKbli(storedKbli('assignment-1', 'KBLI-01', 'Existing data'))
    rollbackDatabase.failOnUpdate = true
    const rollbackPath = await writeWorkbook(directory, 'rollback', [
      sourceRow({ anomali: 'KBLI-02', DATA: 'New before failure' }),
      sourceRow({ anomali: 'KBLI-01', DATA: 'Existing data', catatan: 'Updated then fails' })
    ])
    const beforeRollback = JSON.stringify([...rollbackDatabase.kbliRows.values()])

    await assert.rejects(
      importKbliWorkbook({
        database: rollbackDatabase,
        filePath: rollbackPath,
        apply: true,
        now: new Date('2026-02-04T00:00:00.000Z')
      }),
      /Simulated KBLI update failure/
    )
    assert.equal(JSON.stringify([...rollbackDatabase.kbliRows.values()]), beforeRollback)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

await run()
console.log('KBLI import tests passed.')
