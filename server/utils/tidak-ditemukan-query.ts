import { Prisma } from '../../generated/prisma/client'

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

type QueryValue = string | string[] | undefined

export type TidakDitemukanCompletionStatus = 'unresolved' | 'completed'

export interface TidakDitemukanListFilters {
  page: number
  pageSize: number
  search?: string
  kecamatan?: string
  desa?: string
  namaSls?: string
  ppl?: string
  pml?: string
  completionStatus?: TidakDitemukanCompletionStatus
}

export interface TidakDitemukanWilayah {
  idSubsls: string
  kecamatan: string
  desa: string
  namaSls: string
  ppl: string
  pml: string
}

export interface TidakDitemukanVisibleAssignment {
  id: string
  idSubsls: string
  namaAssignment: string
  masterSls: TidakDitemukanWilayah
}

export interface TidakDitemukanSlsGroup {
  idSubsls: string
  wilayah: TidakDitemukanWilayah
  isSelesai: boolean
  selesaiAt: string | null
  assignments: Array<{ id: string, namaAssignment: string }>
}

function queryString(value: QueryValue): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value
  const normalized = candidate?.trim()
  return normalized || undefined
}

function positiveInteger(value: QueryValue, fallback: number, maximum: number): number {
  const parsed = Number.parseInt(queryString(value) ?? '', 10)
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback
}

function completionStatusValue(value: QueryValue): TidakDitemukanCompletionStatus | undefined {
  const normalized = queryString(value)
  return normalized === 'unresolved' || normalized === 'completed' ? normalized : undefined
}

export function parseTidakDitemukanListFilters(
  query: Record<string, QueryValue>
): TidakDitemukanListFilters {
  return {
    page: positiveInteger(query.page, 1, Number.MAX_SAFE_INTEGER),
    pageSize: positiveInteger(query.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    search: queryString(query.search),
    kecamatan: queryString(query.kecamatan),
    desa: queryString(query.desa),
    namaSls: queryString(query.namaSls),
    ppl: queryString(query.ppl),
    pml: queryString(query.pml),
    completionStatus: completionStatusValue(query.completionStatus)
  }
}

function contextualConditions(filters: TidakDitemukanListFilters): Prisma.Sql[] {
  const conditions: Prisma.Sql[] = []

  if (filters.kecamatan) conditions.push(Prisma.sql`sls.kecamatan = ${filters.kecamatan}`)
  if (filters.desa) conditions.push(Prisma.sql`sls.desa = ${filters.desa}`)
  if (filters.namaSls) conditions.push(Prisma.sql`sls.namaSls = ${filters.namaSls}`)
  if (filters.ppl) conditions.push(Prisma.sql`sls.ppl = ${filters.ppl}`)
  if (filters.pml) conditions.push(Prisma.sql`sls.pml = ${filters.pml}`)

  if (filters.search) {
    conditions.push(Prisma.sql`(
      LOWER(a.idSubsls) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(a.namaAssignment) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.namaSls) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.kecamatan) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.desa) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.ppl) LIKE CONCAT('%', LOWER(${filters.search}), '%')
      OR LOWER(sls.pml) LIKE CONCAT('%', LOWER(${filters.search}), '%')
    )`)
  }

  if (filters.completionStatus === 'unresolved') {
    conditions.push(Prisma.sql`(status.idSubsls IS NULL OR status.isSelesai = false)`)
  }

  if (filters.completionStatus === 'completed') {
    conditions.push(Prisma.sql`status.isSelesai = true`)
  }

  return conditions
}

function whereClause(conditions: Prisma.Sql[]): Prisma.Sql {
  return conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty
}

export function buildTidakDitemukanSlsCountQuery(filters: TidakDitemukanListFilters): Prisma.Sql {
  return Prisma.sql`
    SELECT COUNT(DISTINCT a.idSubsls) AS total
    FROM tidak_ditemukan_assignment AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    LEFT JOIN tidak_ditemukan_slsstatus AS status ON status.idSubsls = a.idSubsls
    ${whereClause(contextualConditions(filters))}
  `
}

export function buildTidakDitemukanSlsIdsQuery(
  filters: TidakDitemukanListFilters,
  page: number
): Prisma.Sql {
  const offset = (page - 1) * filters.pageSize

  return Prisma.sql`
    SELECT a.idSubsls
    FROM tidak_ditemukan_assignment AS a
    INNER JOIN master_sls AS sls ON sls.idSubsls = a.idSubsls
    LEFT JOIN tidak_ditemukan_slsstatus AS status ON status.idSubsls = a.idSubsls
    ${whereClause(contextualConditions(filters))}
    GROUP BY a.idSubsls
    ORDER BY sls.kecamatan ASC, sls.desa ASC, sls.namaSls ASC, a.idSubsls ASC
    LIMIT ${filters.pageSize} OFFSET ${offset}
  `
}

/** Groups only assignments belonging to paged SLS ids, so an SLS cannot split across pages. */
export function groupTidakDitemukanRows(
  idSubslsValues: readonly string[],
  rows: readonly TidakDitemukanVisibleAssignment[],
  statusesBySls: ReadonlyMap<string, { isSelesai: boolean, selesaiAt: Date | null }>
): TidakDitemukanSlsGroup[] {
  const groups = new Map<string, TidakDitemukanSlsGroup>()

  for (const row of rows) {
    const status = statusesBySls.get(row.idSubsls)
    const group = groups.get(row.idSubsls) ?? {
      idSubsls: row.idSubsls,
      wilayah: row.masterSls,
      isSelesai: status?.isSelesai === true,
      selesaiAt: status?.isSelesai ? status.selesaiAt?.toISOString() ?? null : null,
      assignments: []
    }
    group.assignments.push({ id: row.id, namaAssignment: row.namaAssignment })
    groups.set(row.idSubsls, group)
  }

  return idSubslsValues
    .map(idSubsls => groups.get(idSubsls))
    .filter((group): group is TidakDitemukanSlsGroup => Boolean(group))
}

export function tidakDitemukanMasterSlsWhere(
  filters: Pick<TidakDitemukanListFilters, 'kecamatan' | 'desa' | 'namaSls' | 'ppl' | 'pml'>
): Prisma.MasterSlsWhereInput {
  return {
    tidakDitemukanAssignments: { some: {} },
    ...(filters.kecamatan ? { kecamatan: filters.kecamatan } : {}),
    ...(filters.desa ? { desa: filters.desa } : {}),
    ...(filters.namaSls ? { namaSls: filters.namaSls } : {}),
    ...(filters.ppl ? { ppl: filters.ppl } : {}),
    ...(filters.pml ? { pml: filters.pml } : {})
  }
}
