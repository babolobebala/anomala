import {
  buildKbliAssignmentCountQuery,
  buildKbliAssignmentIdsQuery,
  buildVisibleKbliWhere,
  groupKbliRows,
  parseKbliListFilters,
  type KbliVisibleRow
} from '../../utils/kbli-query'
import { prisma } from '../../utils/prisma'

interface CountResult {
  total: bigint | number | string
}

interface AssignmentIdResult {
  assignmentId: string
}

function toNumber(value: CountResult['total']): number {
  return typeof value === 'bigint' ? Number(value) : Number(value)
}

export default defineEventHandler(async (event) => {
  const filters = parseKbliListFilters(getQuery(event))
  const [countRow] = await prisma.$queryRaw<CountResult[]>(
    buildKbliAssignmentCountQuery(filters)
  )
  const totalAssignments = Math.max(0, toNumber(countRow?.total ?? 0))
  const totalPages = Math.ceil(totalAssignments / filters.pageSize)
  const page = totalPages === 0 ? 1 : Math.min(filters.page, totalPages)

  const assignments = await prisma.$queryRaw<AssignmentIdResult[]>(
    buildKbliAssignmentIdsQuery(filters, page)
  )
  const assignmentIds = assignments.map(assignment => assignment.assignmentId)

  if (assignmentIds.length === 0) {
    return {
      page,
      pageSize: filters.pageSize,
      totalAssignments,
      totalPages,
      groups: []
    }
  }

  const rows = await prisma.kbli.findMany({
    where: buildVisibleKbliWhere(assignmentIds, filters),
    select: {
      id: true,
      kbliKey: true,
      assignmentId: true,
      kategori: true,
      statusAlias: true,
      namaAssignment: true,
      nomorBangunan: true,
      idsbr: true,
      linkFasihEdit: true,
      data: true,
      catatan: true,
      isHandled: true,
      handledAt: true,
      masterSls: {
        select: {
          idSubsls: true,
          kecamatan: true,
          desa: true,
          namaSls: true,
          ppl: true,
          pml: true
        }
      }
    },
    orderBy: [{ assignmentId: 'asc' }, { kategori: 'asc' }, { id: 'asc' }]
  })

  return {
    page,
    pageSize: filters.pageSize,
    totalAssignments,
    totalPages,
    groups: groupKbliRows(assignmentIds, rows as KbliVisibleRow[])
  }
})
