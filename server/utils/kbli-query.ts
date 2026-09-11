import { Prisma } from '../../generated/prisma/client'

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

type QueryValue = string | string[] | undefined

/**
 * KBLI findings only have manual completion state. Imports are cumulative, so
 * there is no disappearance lifecycle and therefore no `disappeared` status.
 */
export type KbliCompletionStatus = 'unhandled' | 'handled'

export interface KbliListFilters {
  page: number
  pageSize: number
  search?: string
  kecamatan?: string
  desa?: string
  namaSls?: string
  ppl?: string
  pml?: string
  kategori?: string
  completionStatus?: KbliCompletionStatus
}

export interface KbliWilayah {
  idSubsls: string
  kecamatan: string
  desa: string
  namaSls: string
  ppl: string
  pml: string
}

export interface KbliVisibleRow {
  id: string
  kbliKey: string
  assignmentId: string
  kategori: string
  statusAlias: string | null
  namaAssignment: string | null
  nomorBangunan: string | null
  idsbr: string | null
  linkFasihEdit: string | null
  data: string
  catatan: string | null
  isHandled: boolean
  handledAt: Date | null
  masterSls: KbliWilayah
}

export interface KbliFindingItem {
  id: string
  kbliKey: string
  kategori: string
  data: string
  catatan: string | null
  statusAlias: string | null
  isHandled: boolean
  handledAt: string | null
}

export interface KbliHandlingStatusRecord {
  isHandled: boolean
}

export interface KbliSubsetSummary {
  total: number
  handled: number
  unhandled: number
}

export interface KbliAssignmentGroup {
  assignmentId: string
  namaAssignment: string | null
  nomorBangunan: string | null
  idsbr: string | null
  linkFasihEdit: string | null
  statusAlias: string | null
  wilayah: KbliWilayah
  summary: KbliSubsetSummary
  kbli: KbliFindingItem[]
}

export interface KbliHandlingUpdate {
  isHandled: boolean
  handledAt: Date | null
}

export interface KbliHandlingUpsertArgs {
  where: { assignmentId: string }
  create: { assignmentId: string, eksekutorId: string | null }
  update: { eksekutorId: string | null }
}

function queryString(value: QueryValue): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value
  const normalized = candidate?.trim()

  return normalized || undefined
}

function positiveInteger(value: QueryValue, fallback: number, maximum: number): number {
  const parsed = Number.parseInt(queryString(value) ?? '', 10)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback
  }

  return Math.min(parsed, maximum)
}

function completionStatusValue(value: QueryValue): KbliCompletionStatus | undefined {
  const normalized = queryString(value)

  if (normalized === 'unhandled' || normalized === 'handled') {
    return normalized
  }
}

export function parseKbliListFilters(query: Record<string, QueryValue>): KbliListFilters {
  return {
    page: positiveInteger(query.page, 1, Number.MAX_SAFE_INTEGER),
    pageSize: positiveInteger(query.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    search: queryString(query.search),
    kecamatan: queryString(query.kecamatan),
    desa: queryString(query.desa),
    namaSls: queryString(query.namaSls),
    ppl: queryString(query.ppl),
    pml: queryString(query.pml),
    kategori: queryString(query.kategori),
    completionStatus: completionStatusValue(query.completionStatus)
  }
}

export function buildVisibleKbliWhere(
  assignmentIds: string[],
  filters: Pick<KbliListFilters, 'kategori'>
): Prisma.KbliWhereInput {
  return {
    assignmentId: { in: assignmentIds },
    ...(filters.kategori ? { kategori: filters.kategori } : {})
  }
}

export function kbliMasterSlsWhere(
  filters: Pick<KbliListFilters, 'kecamatan' | 'desa' | 'namaSls'>
): Prisma.MasterSlsWhereInput {
  return {
    ...(filters.kecamatan ? { kecamatan: filters.kecamatan } : {}),
    ...(filters.desa ? { desa: filters.desa } : {}),
    ...(filters.namaSls ? { namaSls: filters.namaSls } : {})
  }
}

function contextualConditions(filters: KbliListFilters): Prisma.Sql[] {
  const conditions: Prisma.Sql[] = []

  if (filters.kecamatan) {
    conditions.push(Prisma.sql`sls.kecamatan = ${filters.kecamatan}`)
  }

  if (filters.desa) {
    conditions.push(Prisma.sql`sls.desa = ${filters.desa}`)
  }

  if (filters.namaSls) {
    conditions.push(Prisma.sql`sls.namaSls = ${filters.namaSls}`)
  }

  if (filters.ppl) {
    conditions.push(Prisma.sql`sls.ppl = ${filters.ppl}`)
  }

  if (filters.pml) {
    conditions.push(Prisma.sql`sls.pml = ${filters.pml}`)
  }

  if (filters.kategori) {
    conditions.push(Prisma.sql`k.kategori = ${filters.kategori}`)
  }

  if (filters.search) {
    conditions.push(Prisma.sql`(
      LOWER(k.assignmentId) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(k.namaAssignment, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(k.nomorBangunan, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(k.idsbr, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(k.idSubsls) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.namaSls) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.kecamatan) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.desa) LIKE CONCAT('%', LOWER(${filters.search}), '%')
    )`)
  }

  return conditions
}

/**
 * Assignment completion is derived from the currently relevant finding universe,
 * so the category filter is re-applied inside the correlated subquery exactly
 * like the anomaly query does.
 */
function addCompletionStatusCondition(
  conditions: Prisma.Sql[],
  filters: KbliListFilters,
  completionStatus: KbliCompletionStatus | undefined
): void {
  const completionKategoriCondition = filters.kategori
    ? Prisma.sql`AND completion.kategori = ${filters.kategori}`
    : Prisma.empty

  if (completionStatus === 'unhandled') {
    conditions.push(Prisma.sql`EXISTS (
      SELECT 1
      FROM kbli AS completion
      WHERE completion.assignmentId = k.assignmentId
        ${completionKategoriCondition}
        AND completion.isHandled = false
    )`)
  }

  if (completionStatus === 'handled') {
    conditions.push(Prisma.sql`NOT EXISTS (
      SELECT 1
      FROM kbli AS completion
      WHERE completion.assignmentId = k.assignmentId
        ${completionKategoriCondition}
        AND completion.isHandled = false
    )`)
  }
}

function whereClause(conditions: Prisma.Sql[]): Prisma.Sql {
  return conditions.length > 0
    ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
    : Prisma.empty
}

export function buildKbliAssignmentCountQuery(filters: KbliListFilters): Prisma.Sql {
  const conditions = contextualConditions(filters)

  addCompletionStatusCondition(conditions, filters, filters.completionStatus)

  return Prisma.sql`
    SELECT COUNT(DISTINCT k.assignmentId) AS total
    FROM kbli AS k
    INNER JOIN master_sls AS sls ON sls.idSubsls = k.idSubsls
    ${whereClause(conditions)}
  `
}

export function buildKbliFindingCountQuery(
  filters: KbliListFilters,
  handlingStatus?: KbliCompletionStatus
): Prisma.Sql {
  const conditions = contextualConditions(filters)

  if (handlingStatus === 'unhandled') {
    conditions.push(Prisma.sql`k.isHandled = false`)
  }

  if (handlingStatus === 'handled') {
    conditions.push(Prisma.sql`k.isHandled = true`)
  }

  return Prisma.sql`
    SELECT COUNT(*) AS total
    FROM kbli AS k
    INNER JOIN master_sls AS sls ON sls.idSubsls = k.idSubsls
    ${whereClause(conditions)}
  `
}

export function buildKbliAssignmentIdsQuery(
  filters: KbliListFilters,
  page: number
): Prisma.Sql {
  const conditions = contextualConditions(filters)

  addCompletionStatusCondition(conditions, filters, filters.completionStatus)

  const offset = (page - 1) * filters.pageSize

  return Prisma.sql`
    SELECT k.assignmentId
    FROM kbli AS k
    INNER JOIN master_sls AS sls ON sls.idSubsls = k.idSubsls
    ${whereClause(conditions)}
    GROUP BY k.assignmentId
    ORDER BY k.assignmentId ASC
    LIMIT ${filters.pageSize} OFFSET ${offset}
  `
}

/**
 * Statistics intentionally ignore the selected handling status so the cards can
 * always show the full breakdown of the contextual filters in scope.
 */
export function buildKbliStatisticsQueries(filters: KbliListFilters): {
  totalAssignments: Prisma.Sql
  unhandled: Prisma.Sql
  handled: Prisma.Sql
  totalFindings: Prisma.Sql
  unhandledFindings: Prisma.Sql
  handledFindings: Prisma.Sql
} {
  const contextualFilters = {
    ...filters,
    completionStatus: undefined
  }

  return {
    totalAssignments: buildKbliAssignmentCountQuery(contextualFilters),
    unhandled: buildKbliAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: 'unhandled'
    }),
    handled: buildKbliAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: 'handled'
    }),
    totalFindings: buildKbliFindingCountQuery(contextualFilters),
    unhandledFindings: buildKbliFindingCountQuery(contextualFilters, 'unhandled'),
    handledFindings: buildKbliFindingCountQuery(contextualFilters, 'handled')
  }
}

/**
 * Recap metrics are scoped to each KBLI category before assignment completion
 * is derived. A finding from another category must never affect an assignment's
 * recap status in the current category.
 */
export function buildKbliRecapQuery(): Prisma.Sql {
  return Prisma.sql`
    SELECT
      m.kode AS kategori,
      m.deskripsi,
      COUNT(DISTINCT k.assignmentId) AS totalAssignments,
      COUNT(k.id) AS totalFindings,
      COUNT(DISTINCT CASE
        WHEN assignment_status.hasUnhandled = 1 THEN k.assignmentId
      END) AS unhandledAssignments,
      SUM(CASE WHEN k.isHandled = false THEN 1 ELSE 0 END) AS unhandledFindings,
      COUNT(DISTINCT CASE
        WHEN assignment_status.hasUnhandled = 0 THEN k.assignmentId
      END) AS handledAssignments,
      SUM(CASE WHEN k.isHandled = true THEN 1 ELSE 0 END) AS handledFindings
    FROM master_kbli_temuan AS m
    LEFT JOIN kbli AS k ON k.kategori = m.kode
    LEFT JOIN (
      SELECT
        kategori,
        assignmentId,
        MAX(CASE WHEN isHandled = false THEN 1 ELSE 0 END) AS hasUnhandled
      FROM kbli
      GROUP BY kategori, assignmentId
    ) AS assignment_status ON assignment_status.kategori = k.kategori
      AND assignment_status.assignmentId = k.assignmentId
    GROUP BY m.kode, m.deskripsi
    ORDER BY m.kode ASC
  `
}

export function summarizeKbliSubset(
  findings: readonly KbliHandlingStatusRecord[]
): KbliSubsetSummary {
  const unhandled = findings.filter(finding => !finding.isHandled).length

  return {
    total: findings.length,
    handled: findings.length - unhandled,
    unhandled
  }
}

/**
 * Groups visible KBLI rows into one parent assignment row per `assignmentId`,
 * preserving the order of the paged assignment ids. Child rows keep the order
 * they were read in, so a single assignment can never be split across pages.
 */
export function groupKbliRows(
  assignmentIds: readonly string[],
  rows: readonly KbliVisibleRow[]
): KbliAssignmentGroup[] {
  const groupsByAssignment = new Map<string, KbliAssignmentGroup>()

  for (const row of rows) {
    const group = groupsByAssignment.get(row.assignmentId) ?? {
      assignmentId: row.assignmentId,
      namaAssignment: row.namaAssignment,
      nomorBangunan: row.nomorBangunan,
      idsbr: row.idsbr,
      linkFasihEdit: row.linkFasihEdit,
      statusAlias: row.statusAlias,
      wilayah: row.masterSls,
      summary: { total: 0, handled: 0, unhandled: 0 },
      kbli: []
    }

    group.kbli.push({
      id: row.id,
      kbliKey: row.kbliKey,
      kategori: row.kategori,
      data: row.data,
      catatan: row.catatan,
      statusAlias: row.statusAlias,
      isHandled: row.isHandled,
      handledAt: row.handledAt ? row.handledAt.toISOString() : null
    })
    Object.assign(group.summary, summarizeKbliSubset(group.kbli))
    groupsByAssignment.set(row.assignmentId, group)
  }

  return assignmentIds
    .map(assignmentId => groupsByAssignment.get(assignmentId))
    .filter((group): group is KbliAssignmentGroup => Boolean(group))
}

/**
 * Only the manual handling fields are written, so a mutation can never touch the
 * imported KBLI source data.
 */
export function buildKbliHandlingUpdate(
  isHandled: boolean,
  now: Date
): KbliHandlingUpdate {
  return {
    isHandled,
    handledAt: isHandled ? now : null
  }
}

export function buildKbliHandlingUpsert(
  assignmentId: string,
  eksekutorId: string | null
): KbliHandlingUpsertArgs {
  return {
    where: { assignmentId },
    create: { assignmentId, eksekutorId },
    update: { eksekutorId }
  }
}
