import assert from 'node:assert/strict'

import {
  buildKbliAssignmentCountQuery,
  buildKbliAssignmentIdsQuery,
  buildKbliFindingCountQuery,
  buildKbliHandlingUpdate,
  buildKbliHandlingUpsert,
  buildKbliStatisticsQueries,
  buildVisibleKbliWhere,
  groupKbliRows,
  kbliMasterSlsWhere,
  parseKbliListFilters,
  summarizeKbliSubset,
  type KbliAssignmentGroup,
  type KbliVisibleRow
} from '../server/utils/kbli-query'

interface RawSql {
  strings: readonly string[]
  values: readonly unknown[]
}

function sqlText(query: unknown): string {
  return (query as RawSql).strings.join(' ')
}

function sqlValues(query: unknown): unknown[] {
  return [...(query as RawSql).values]
}

interface WilayahFixture {
  idSubsls: string
  kecamatan: string
  desa: string
  namaSls: string
  ppl: string
  pml: string
}

const wilayahA: WilayahFixture = {
  idSubsls: 'sls-1',
  kecamatan: 'KEC-A',
  desa: 'DESA-1',
  namaSls: 'SLS 1',
  ppl: 'PPL-1',
  pml: 'PML-1'
}
const wilayahB: WilayahFixture = {
  idSubsls: 'sls-2',
  kecamatan: 'KEC-B',
  desa: 'DESA-2',
  namaSls: 'SLS 2',
  ppl: 'PPL-2',
  pml: 'PML-2'
}

const HANDLED_AT = new Date('2026-02-02T10:00:00.000Z')

function visibleRow(
  id: string,
  assignmentId: string,
  kategori: string,
  options: {
    isHandled?: boolean
    handledAt?: Date | null
    wilayah?: WilayahFixture
  } = {}
): KbliVisibleRow {
  return {
    id,
    kbliKey: `key-${id}`,
    assignmentId,
    kategori,
    statusAlias: 'Closed',
    namaAssignment: `Assignment ${assignmentId}`,
    nomorBangunan: '001',
    idsbr: `sbr-${assignmentId}`,
    linkFasihEdit: `https://fasih.example/${assignmentId}`,
    data: `Field: ${id}`,
    catatan: null,
    isHandled: options.isHandled ?? false,
    handledAt: options.handledAt ?? null,
    masterSls: options.wilayah ?? wilayahA
  }
}

/**
 * A1 has C handled + G unresolved, A2 has only handled C findings, A3 has an
 * unresolved I finding and A4 mixes unresolved/handled G findings in another SLS.
 */
const rows: KbliVisibleRow[] = [
  visibleRow('k2', 'A1', 'G'),
  visibleRow('k1', 'A1', 'C', { isHandled: true, handledAt: HANDLED_AT }),
  visibleRow('k4', 'A2', 'C', { isHandled: true, handledAt: HANDLED_AT }),
  visibleRow('k3', 'A2', 'C', { isHandled: true, handledAt: HANDLED_AT }),
  visibleRow('k5', 'A3', 'I'),
  visibleRow('k7', 'A4', 'G', { isHandled: true, handledAt: HANDLED_AT, wilayah: wilayahB }),
  visibleRow('k6', 'A4', 'G', { wilayah: wilayahB })
]

function visibleRowsFor(ids: readonly string[], kategori?: string): KbliVisibleRow[] {
  return rows
    .filter(row => ids.includes(row.assignmentId))
    .filter(row => !kategori || row.kategori === kategori)
    .slice()
    .sort(
      (left, right) =>
        left.assignmentId.localeCompare(right.assignmentId)
        || left.kategori.localeCompare(right.kategori)
        || left.id.localeCompare(right.id)
    )
}

function distinctAssignmentIds(predicate?: (row: KbliVisibleRow) => boolean): string[] {
  return [...new Set(rows.filter(row => (predicate ? predicate(row) : true)).map(row => row.assignmentId))].sort()
}

function groupsFor(ids: readonly string[], kategori?: string): KbliAssignmentGroup[] {
  return groupKbliRows(ids, visibleRowsFor(ids, kategori))
}

function summariesFor(groups: readonly KbliAssignmentGroup[]): Array<[string, string]> {
  return groups.map(group => [
    group.assignmentId,
    `${group.summary.handled}/${group.summary.total}`
  ])
}

interface StatisticsFixture {
  total: { assignments: number, findings: number }
  unhandled: { assignments: number, findings: number }
  handled: { assignments: number, findings: number }
}

/**
 * Mirrors the SQL semantics of `buildKbliStatisticsQueries`: assignments are
 * distinct counts over the filtered universe, an assignment is unresolved when
 * at least one finding in that universe is unresolved, and the rest are handled.
 */
function statisticsFor(findings: readonly KbliVisibleRow[]): StatisticsFixture {
  const byAssignment = new Map<string, KbliVisibleRow[]>()

  for (const finding of findings) {
    const assignmentFindings = byAssignment.get(finding.assignmentId) ?? []
    assignmentFindings.push(finding)
    byAssignment.set(finding.assignmentId, assignmentFindings)
  }

  let unhandledAssignments = 0
  let handledAssignments = 0

  for (const assignmentFindings of byAssignment.values()) {
    if (summarizeKbliSubset(assignmentFindings).unhandled > 0) {
      unhandledAssignments += 1
    } else {
      handledAssignments += 1
    }
  }

  const unhandledFindings = findings.filter(finding => !finding.isHandled).length

  return {
    total: { assignments: byAssignment.size, findings: findings.length },
    unhandled: { assignments: unhandledAssignments, findings: unhandledFindings },
    handled: {
      assignments: handledAssignments,
      findings: findings.length - unhandledFindings
    }
  }
}

// --- filter parsing -------------------------------------------------------

const defaultFilters = parseKbliListFilters({})

assert.equal(defaultFilters.page, 1)
assert.equal(defaultFilters.pageSize, 20)
assert.equal(defaultFilters.kategori, undefined)
assert.equal(defaultFilters.completionStatus, undefined)
assert.equal(parseKbliListFilters({ pageSize: '999' }).pageSize, 100)
assert.equal(parseKbliListFilters({ page: '0' }).page, 1)
assert.equal(parseKbliListFilters({ completionStatus: 'unhandled' }).completionStatus, 'unhandled')
assert.equal(parseKbliListFilters({ completionStatus: 'handled' }).completionStatus, 'handled')
// KBLI imports are cumulative, so the anomaly-only disappearance status is not accepted.
assert.equal(parseKbliListFilters({ completionStatus: 'disappeared' }).completionStatus, undefined)
assert.equal(parseKbliListFilters({ completionStatus: 'unknown' }).completionStatus, undefined)
// Executor filtering is no longer part of the KBLI operational query.
assert.equal('executor' in parseKbliListFilters({ executor: 'exec-1' }), false)

const noFilterCountText = sqlText(buildKbliAssignmentCountQuery(defaultFilters))
assert.ok(!noFilterCountText.includes('WHERE'))
assert.ok(!noFilterCountText.includes('isActive'))

// --- one parent row per assignment ---------------------------------------

const allAssignmentIds = distinctAssignmentIds()
const allGroups = groupsFor(allAssignmentIds)

assert.deepEqual(allAssignmentIds, ['A1', 'A2', 'A3', 'A4'])
assert.equal(allGroups.length, 4)
assert.equal(new Set(allGroups.map(group => group.assignmentId)).size, allGroups.length)
assert.deepEqual(
  allGroups.map(group => [group.assignmentId, group.kbli.map(finding => finding.id)]),
  [
    ['A1', ['k1', 'k2']],
    ['A2', ['k3', 'k4']],
    ['A3', ['k5']],
    ['A4', ['k6', 'k7']]
  ]
)
// Unresolved findings are the default, and handling state flows into the group.
assert.deepEqual(summariesFor(allGroups), [
  ['A1', '1/2'],
  ['A2', '2/2'],
  ['A3', '0/1'],
  ['A4', '1/2']
])
assert.deepEqual(allGroups[0].summary, { total: 2, handled: 1, unhandled: 1 })
assert.equal(allGroups[0].kbli[0].isHandled, true)
assert.equal(allGroups[0].kbli[0].handledAt, HANDLED_AT.toISOString())
assert.equal(allGroups[0].kbli[1].isHandled, false)
assert.equal(allGroups[0].kbli[1].handledAt, null)
assert.equal(allGroups[2].wilayah.idSubsls, 'sls-1')
assert.equal(allGroups[3].wilayah.idSubsls, 'sls-2')

assert.deepEqual(summarizeKbliSubset([]), { total: 0, handled: 0, unhandled: 0 })
assert.deepEqual(
  summarizeKbliSubset([{ isHandled: false }, { isHandled: false }]),
  { total: 2, handled: 0, unhandled: 2 }
)

// --- assignment status and progress --------------------------------------

const statusByAssignment = new Map(
  allGroups.map(group => [group.assignmentId, group.summary])
)

// Any unresolved finding keeps the assignment unresolved.
assert.equal(statusByAssignment.get('A1')?.unhandled, 1)
assert.equal(statusByAssignment.get('A4')?.unhandled, 1)
// All findings handled means the assignment is handled.
assert.equal(statusByAssignment.get('A2')?.unhandled, 0)
assert.equal(statusByAssignment.get('A2')?.handled, 2)

const unhandledFilters = parseKbliListFilters({ completionStatus: 'unhandled' })
const handledFilters = parseKbliListFilters({ completionStatus: 'handled' })
const unhandledQuery = sqlText(buildKbliAssignmentCountQuery(unhandledFilters))
const handledQuery = sqlText(buildKbliAssignmentCountQuery(handledFilters))

assert.match(unhandledQuery, /EXISTS \(/)
assert.match(unhandledQuery, /completion\.isHandled = false/)
assert.match(handledQuery, /NOT EXISTS \(/)
assert.match(handledQuery, /completion\.isHandled = false/)
assert.match(sqlText(buildKbliAssignmentIdsQuery(unhandledFilters, 1)), /completion\.isHandled = false/)
assert.doesNotMatch(unhandledQuery, /isActive/)
assert.doesNotMatch(handledQuery, /isSesuaiLapangan/)

// The handling-status filter must follow the filtered finding universe.
const kategoriCHandledQuery = buildKbliAssignmentCountQuery(
  parseKbliListFilters({ kategori: 'C', completionStatus: 'handled' })
)

assert.match(sqlText(kategoriCHandledQuery), /completion\.kategori = /)
assert.match(sqlText(kategoriCHandledQuery), /k\.kategori = /)
assert.deepEqual(sqlValues(kategoriCHandledQuery), ['C', 'C'])

// --- assignment-level pagination never splits child rows -----------------

const pageFilters = parseKbliListFilters({ page: '1', pageSize: '2' })
const pageOneQuery = buildKbliAssignmentIdsQuery(pageFilters, 1)
const pageOneText = sqlText(pageOneQuery)

assert.match(pageOneText, /GROUP BY k\.assignmentId/)
assert.match(pageOneText, /ORDER BY k\.assignmentId ASC/)
assert.deepEqual(sqlValues(pageOneQuery).slice(-2), [2, 0])
assert.deepEqual(sqlValues(buildKbliAssignmentIdsQuery(pageFilters, 2)).slice(-2), [2, 2])

const pageOneIds = allAssignmentIds.slice(0, 2)
const pageTwoIds = allAssignmentIds.slice(2)
const pageOneGroups = groupsFor(pageOneIds)

assert.deepEqual(pageOneGroups.map(group => group.assignmentId), ['A1', 'A2'])
assert.deepEqual(pageOneGroups[0].kbli.map(finding => finding.id), ['k1', 'k2'])
assert.deepEqual(summariesFor(groupsFor(pageTwoIds)), [
  ['A3', '0/1'],
  ['A4', '1/2']
])
assert.deepEqual(
  buildVisibleKbliWhere(pageTwoIds, defaultFilters),
  { assignmentId: { in: ['A3', 'A4'] } }
)

// --- category-filtered universe ------------------------------------------

const kategoriCFilters = parseKbliListFilters({ kategori: 'C' })
const kategoriCIds = distinctAssignmentIds(row => row.kategori === 'C')

assert.equal(kategoriCFilters.kategori, 'C')
assert.deepEqual(kategoriCIds, ['A1', 'A2'])
assert.match(sqlText(buildKbliAssignmentCountQuery(kategoriCFilters)), /k\.kategori = /)
assert.deepEqual(sqlValues(buildKbliAssignmentCountQuery(kategoriCFilters)), ['C'])
assert.deepEqual(
  buildVisibleKbliWhere(kategoriCIds, kategoriCFilters),
  { assignmentId: { in: ['A1', 'A2'] }, kategori: 'C' }
)

const kategoriCGroups = groupsFor(kategoriCIds, 'C')

// Children only ever contain the filtered category.
assert.ok(kategoriCGroups.every(group => group.kbli.every(finding => finding.kategori === 'C')))
assert.deepEqual(
  kategoriCGroups.map(group => group.kbli.map(finding => finding.kategori)),
  [['C'], ['C', 'C']]
)
// A1 is unresolved without a filter but handled inside the C universe.
assert.deepEqual(summariesFor(kategoriCGroups), [
  ['A1', '1/1'],
  ['A2', '2/2']
])
assert.equal(kategoriCGroups[0].summary.unhandled, 0)

const kategoriGGroups = groupsFor(distinctAssignmentIds(row => row.kategori === 'G'), 'G')

assert.deepEqual(summariesFor(kategoriGGroups), [
  ['A1', '0/1'],
  ['A4', '1/2']
])
assert.equal(kategoriGGroups[0].summary.unhandled, 1)
assert.equal(kategoriGGroups[1].summary.unhandled, 1)

// Without a category filter every finding of the visible assignment is kept.
assert.deepEqual(summariesFor(allGroups), [
  ['A1', '1/2'],
  ['A2', '2/2'],
  ['A3', '0/1'],
  ['A4', '1/2']
])
assert.equal(
  allGroups.reduce((total, group) => total + group.kbli.length, 0),
  rows.length
)

// --- wilayah filters ------------------------------------------------------

const wilayahFilters = parseKbliListFilters({
  kecamatan: 'KEC-A',
  desa: 'DESA-1',
  namaSls: 'SLS 1',
  ppl: 'PPL-1',
  pml: 'PML-1'
})
const wilayahCountQuery = buildKbliAssignmentCountQuery(wilayahFilters)
const wilayahText = sqlText(wilayahCountQuery)

assert.match(wilayahText, /INNER JOIN master_sls AS sls ON sls\.idSubsls = k\.idSubsls/)
assert.match(wilayahText, /sls\.kecamatan = /)
assert.match(wilayahText, /sls\.desa = /)
assert.match(wilayahText, /sls\.namaSls = /)
assert.match(wilayahText, /sls\.ppl = /)
assert.match(wilayahText, /sls\.pml = /)
assert.deepEqual(sqlValues(wilayahCountQuery), ['KEC-A', 'DESA-1', 'SLS 1', 'PPL-1', 'PML-1'])
assert.deepEqual(
  distinctAssignmentIds(row => row.masterSls.kecamatan === 'KEC-A'),
  ['A1', 'A2', 'A3']
)
assert.deepEqual(kbliMasterSlsWhere({ kecamatan: 'KEC-A', desa: '', namaSls: 'SLS 1' }), {
  kecamatan: 'KEC-A',
  namaSls: 'SLS 1'
})

// --- statistics -----------------------------------------------------------

const statisticsQueries = buildKbliStatisticsQueries(defaultFilters)

assert.match(sqlText(statisticsQueries.totalAssignments), /COUNT\(DISTINCT k\.assignmentId\) AS total/)
assert.match(sqlText(statisticsQueries.totalFindings), /COUNT\(\*\) AS total/)
assert.match(sqlText(statisticsQueries.unhandled), /completion\.isHandled = false/)
assert.match(sqlText(statisticsQueries.handled), /NOT EXISTS \(/)
assert.match(sqlText(statisticsQueries.unhandledFindings), /k\.isHandled = false/)
assert.match(sqlText(statisticsQueries.handledFindings), /k\.isHandled = true/)
assert.doesNotMatch(sqlText(statisticsQueries.totalAssignments), /isActive/)

assert.match(sqlText(buildKbliFindingCountQuery(defaultFilters)), /COUNT\(\*\) AS total/)
assert.match(sqlText(buildKbliFindingCountQuery(defaultFilters, 'unhandled')), /k\.isHandled = false/)
assert.match(sqlText(buildKbliFindingCountQuery(defaultFilters, 'handled')), /k\.isHandled = true/)

// Statistics ignore the currently selected handling status: the same filters
// with and without a selected status must produce identical queries.
const filteredStatistics = buildKbliStatisticsQueries({
  ...defaultFilters,
  kategori: 'C',
  completionStatus: 'handled'
})
const statusFreeStatistics = buildKbliStatisticsQueries({
  ...defaultFilters,
  kategori: 'C'
})

for (const key of Object.keys(filteredStatistics) as Array<keyof typeof filteredStatistics>) {
  assert.equal(sqlText(filteredStatistics[key]), sqlText(statusFreeStatistics[key]))
  assert.match(sqlText(statusFreeStatistics[key]), /k\.kategori = /)
}

const allStatistics = statisticsFor(rows)

assert.deepEqual(allStatistics, {
  total: { assignments: 4, findings: 7 },
  unhandled: { assignments: 3, findings: 3 },
  handled: { assignments: 1, findings: 4 }
})
assert.deepEqual(statisticsFor(visibleRowsFor(kategoriCIds, 'C')), {
  total: { assignments: 2, findings: 3 },
  unhandled: { assignments: 0, findings: 0 },
  handled: { assignments: 2, findings: 3 }
})
assert.deepEqual(statisticsFor(visibleRowsFor(['A1', 'A4'], 'G')), {
  total: { assignments: 2, findings: 3 },
  unhandled: { assignments: 2, findings: 2 },
  handled: { assignments: 0, findings: 1 }
})
assert.equal(
  allStatistics.total.assignments,
  allStatistics.unhandled.assignments + allStatistics.handled.assignments
)
assert.equal(
  allStatistics.total.findings,
  allStatistics.unhandled.findings + allStatistics.handled.findings
)

// --- handling mutation ----------------------------------------------------

const handledAt = new Date('2026-03-01T08:30:00.000Z')

assert.deepEqual(buildKbliHandlingUpdate(true, handledAt), {
  isHandled: true,
  handledAt
})
assert.deepEqual(buildKbliHandlingUpdate(false, handledAt), {
  isHandled: false,
  handledAt: null
})
// Only the two manual handling fields are written.
assert.deepEqual(Object.keys(buildKbliHandlingUpdate(true, handledAt)), ['isHandled', 'handledAt'])

const storedRows = rows.map(row => ({ ...row }))

function applyHandlingUpdate(id: string, isHandled: boolean): void {
  const row = storedRows.find(candidate => candidate.id === id)

  if (!row) {
    throw new Error(`Missing row ${id}`)
  }

  Object.assign(row, buildKbliHandlingUpdate(isHandled, handledAt))
}

function summariesFromStored(): Array<[string, string]> {
  return summariesFor(groupKbliRows(allAssignmentIds, storedRows.filter(row => row.assignmentId === 'A1')))
}

applyHandlingUpdate('k2', true)

const handledRow = storedRows.find(row => row.id === 'k2')

assert.equal(handledRow?.isHandled, true)
assert.equal(handledRow?.handledAt?.toISOString(), handledAt.toISOString())
// Imported source data is never part of the mutation payload.
assert.equal(handledRow?.data, 'Field: k2')
assert.equal(handledRow?.statusAlias, 'Closed')
// Local progress picks up the handled finding.
assert.deepEqual(summariesFromStored(), [['A1', '2/2']])

applyHandlingUpdate('k2', false)

assert.equal(storedRows.find(row => row.id === 'k2')?.isHandled, false)
assert.equal(storedRows.find(row => row.id === 'k2')?.handledAt, null)
assert.deepEqual(summariesFromStored(), [['A1', '1/2']])

// --- retained executor foundation ----------------------------------------

assert.deepEqual(buildKbliHandlingUpsert('A1', 'exec-1'), {
  where: { assignmentId: 'A1' },
  create: { assignmentId: 'A1', eksekutorId: 'exec-1' },
  update: { eksekutorId: 'exec-1' }
})
assert.deepEqual(buildKbliHandlingUpsert('A1', null), {
  where: { assignmentId: 'A1' },
  create: { assignmentId: 'A1', eksekutorId: null },
  update: { eksekutorId: null }
})

console.log('KBLI query tests passed.')
