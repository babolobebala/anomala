import { Prisma } from '../../generated/prisma/client'

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

type QueryValue = string | string[] | undefined
export type AnomalyCompletionStatus = 'unhandled' | 'handled' | 'disappeared'

export interface AnomalyListFilters {
  page: number
  pageSize: number
  search?: string
  kecamatan?: string
  desa?: string
  namaSls?: string
  ppl?: string
  pml?: string
  kodeAnomali?: string
  isActive?: boolean
  completionStatus?: AnomalyCompletionStatus
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

function booleanValue(value: QueryValue): boolean | undefined {
  const normalized = queryString(value)?.toLowerCase()

  if (normalized === 'true') {
    return true
  }

  if (normalized === 'false') {
    return false
  }
}

function completionStatusValue(value: QueryValue): AnomalyCompletionStatus | undefined {
  const normalized = queryString(value)

  if (normalized === 'unhandled' || normalized === 'handled' || normalized === 'disappeared') {
    return normalized
  }
}

export function parseAnomalyListFilters(query: Record<string, QueryValue>): AnomalyListFilters {
  return {
    page: positiveInteger(query.page, 1, Number.MAX_SAFE_INTEGER),
    pageSize: positiveInteger(query.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    search: queryString(query.search),
    kecamatan: queryString(query.kecamatan),
    desa: queryString(query.desa),
    namaSls: queryString(query.namaSls),
    ppl: queryString(query.ppl),
    pml: queryString(query.pml),
    kodeAnomali: queryString(query.kodeAnomali),
    isActive: booleanValue(query.isActive),
    completionStatus: completionStatusValue(query.completionStatus)
  }
}

export function buildAnomaliWhere(filters: AnomalyListFilters): Prisma.AnomaliWhereInput {
  const masterSls: Prisma.MasterSlsWhereInput = {}
  const where: Prisma.AnomaliWhereInput = {}

  if (filters.kecamatan) {
    masterSls.kecamatan = filters.kecamatan
  }

  if (filters.desa) {
    masterSls.desa = filters.desa
  }

  if (filters.namaSls) {
    masterSls.namaSls = filters.namaSls
  }

  if (filters.ppl) {
    masterSls.ppl = filters.ppl
  }

  if (filters.pml) {
    masterSls.pml = filters.pml
  }

  if (Object.keys(masterSls).length > 0) {
    where.masterSls = masterSls
  }

  if (filters.kodeAnomali) {
    where.kodeAnomali = filters.kodeAnomali
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive
  }

  if (filters.search) {
    where.OR = [
      { assignmentId: { contains: filters.search } },
      { namaAssignment: { contains: filters.search } },
      { nomorBangunan: { contains: filters.search } },
      { idsbr: { contains: filters.search } },
      { data: { contains: filters.search } }
    ]
  }

  return where
}

function contextualConditions(filters: AnomalyListFilters): Prisma.Sql[] {
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

  if (filters.kodeAnomali) {
    conditions.push(Prisma.sql`a.kodeAnomali = ${filters.kodeAnomali}`)
  }

  if (filters.isActive !== undefined) {
    conditions.push(Prisma.sql`a.isActive = ${filters.isActive}`)
  }

  if (filters.search) {
    conditions.push(Prisma.sql`(
      LOWER(a.assignmentId) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(a.namaAssignment, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(a.nomorBangunan, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(COALESCE(a.idsbr, '')) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(a.data) LIKE CONCAT('%', LOWER(${filters.search}), '%')
    )`)
  }

  return conditions
}

function addCompletionStatusCondition(
  conditions: Prisma.Sql[],
  completionStatus: AnomalyCompletionStatus | undefined
): void {
  if (completionStatus === 'unhandled') {
    conditions.push(Prisma.sql`EXISTS (
      SELECT 1
      FROM anomali AS completion
      WHERE completion.assignmentId = a.assignmentId
        AND completion.isActive = true
        AND completion.isHandled = false
    )`)
  }

  if (completionStatus === 'handled') {
    conditions.push(Prisma.sql`EXISTS (
      SELECT 1
      FROM anomali AS completion
      WHERE completion.assignmentId = a.assignmentId
        AND completion.isActive = true
    ) AND NOT EXISTS (
      SELECT 1
      FROM anomali AS completion
      WHERE completion.assignmentId = a.assignmentId
        AND completion.isActive = true
        AND completion.isHandled = false
    )`)
  }

  if (completionStatus === 'disappeared') {
    conditions.push(Prisma.sql`NOT EXISTS (
      SELECT 1
      FROM anomali AS completion
      WHERE completion.assignmentId = a.assignmentId
        AND completion.isActive = true
    )`)
  }
}

export function buildAssignmentCountQuery(filters: AnomalyListFilters): Prisma.Sql {
  const conditions = contextualConditions(filters)

  addCompletionStatusCondition(conditions, filters.completionStatus)

  const whereClause = conditions.length > 0
    ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
    : Prisma.empty

  return Prisma.sql`
    SELECT COUNT(DISTINCT a.assignmentId) AS total
    FROM anomali AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    ${whereClause}
  `
}

type AnomalyMetricStatus = 'unhandled' | 'handled' | 'disappeared'

function addAnomalyMetricCondition(
  conditions: Prisma.Sql[],
  anomalyStatus: AnomalyMetricStatus | undefined
): void {
  if (anomalyStatus === 'unhandled') {
    conditions.push(Prisma.sql`a.isActive = true AND a.isHandled = false`)
  }

  if (anomalyStatus === 'handled') {
    conditions.push(Prisma.sql`a.isActive = true AND a.isHandled = true`)
  }

  if (anomalyStatus === 'disappeared') {
    conditions.push(Prisma.sql`a.isActive = false AND a.isHandled = true`)
  }
}

export function buildAnomalyCountQuery(
  filters: AnomalyListFilters,
  anomalyStatus?: AnomalyMetricStatus
): Prisma.Sql {
  const conditions = contextualConditions(filters)
  addAnomalyMetricCondition(conditions, anomalyStatus)
  const whereClause = conditions.length > 0
    ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
    : Prisma.empty

  return Prisma.sql`
    SELECT COUNT(*) AS total
    FROM anomali AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    ${whereClause}
  `
}

export function buildAssignmentStatisticsQueries(filters: AnomalyListFilters): {
  totalAssignments: Prisma.Sql
  unhandled: Prisma.Sql
  handled: Prisma.Sql
  disappeared: Prisma.Sql
  totalAnomalies: Prisma.Sql
  unhandledAnomalies: Prisma.Sql
  handledAnomalies: Prisma.Sql
  disappearedAnomalies: Prisma.Sql
} {
  const contextualFilters = {
    ...filters,
    completionStatus: undefined
  }

  return {
    totalAssignments: buildAssignmentCountQuery(contextualFilters),
    unhandled: buildAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: 'unhandled'
    }),
    handled: buildAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: 'handled'
    }),
    disappeared: buildAssignmentCountQuery({
      ...contextualFilters,
      completionStatus: 'disappeared'
    }),
    totalAnomalies: buildAnomalyCountQuery(contextualFilters),
    unhandledAnomalies: buildAnomalyCountQuery(contextualFilters, 'unhandled'),
    handledAnomalies: buildAnomalyCountQuery(contextualFilters, 'handled'),
    disappearedAnomalies: buildAnomalyCountQuery(contextualFilters, 'disappeared')
  }
}

export function buildAssignmentIdsQuery(
  filters: AnomalyListFilters,
  page: number
): Prisma.Sql {
  const conditions = contextualConditions(filters)

  addCompletionStatusCondition(conditions, filters.completionStatus)

  const whereClause = conditions.length > 0
    ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
    : Prisma.empty
  const offset = (page - 1) * filters.pageSize

  return Prisma.sql`
    SELECT a.assignmentId
    FROM anomali AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    ${whereClause}
    GROUP BY a.assignmentId
    ORDER BY a.assignmentId ASC
    LIMIT ${filters.pageSize} OFFSET ${offset}
  `
}

export function masterSlsWhere(filters: Pick<AnomalyListFilters, 'kecamatan' | 'desa' | 'namaSls'>): Prisma.MasterSlsWhereInput {
  return {
    ...(filters.kecamatan ? { kecamatan: filters.kecamatan } : {}),
    ...(filters.desa ? { desa: filters.desa } : {}),
    ...(filters.namaSls ? { namaSls: filters.namaSls } : {})
  }
}

export function activeAssignmentHandlingWhere(assignmentId: string): Prisma.AnomaliWhereInput {
  return { assignmentId, isActive: true }
}
