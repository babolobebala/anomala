import {
  buildAssignmentAnomalyWhere,
  buildAssignmentCountQuery,
  buildAssignmentIdsQuery,
  parseAnomalyListFilters,
  summarizeAnomalySubset
} from '../../utils/anomali-query'
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
  const filters = parseAnomalyListFilters(getQuery(event))
  const [countRow] = await prisma.$queryRaw<CountResult[]>(
    buildAssignmentCountQuery(filters)
  )
  const totalAssignments = Math.max(0, toNumber(countRow?.total ?? 0))
  const totalPages = Math.ceil(totalAssignments / filters.pageSize)
  const page = totalPages === 0 ? 1 : Math.min(filters.page, totalPages)

  const assignments = await prisma.$queryRaw<AssignmentIdResult[]>(
    buildAssignmentIdsQuery(filters, page)
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

  const [rows, assignmentHandlings] = await Promise.all([
    prisma.anomali.findMany({
      where: buildAssignmentAnomalyWhere(assignmentIds, filters),
      select: {
        id: true,
        anomalyKey: true,
        assignmentId: true,
        namaAssignment: true,
        nomorBangunan: true,
        idsbr: true,
        linkFasihEdit: true,
        kodeAnomali: true,
        data: true,
        catatan: true,
        statusAlias: true,
        isActive: true,
        isHandled: true,
        handledAt: true,
        handlingNote: true,
        isSesuaiLapangan: true,
        sesuaiLapanganAt: true,
        masterSls: {
          select: {
            idSubsls: true,
            kecamatan: true,
            desa: true,
            namaSls: true,
            ppl: true,
            pml: true
          }
        },
        masterAnomali: {
          select: { deskripsi: true }
        }
      },
      orderBy: [{ assignmentId: 'asc' }, { kodeAnomali: 'asc' }, { id: 'asc' }]
    }),
    prisma.assignmentHandling.findMany({
      where: { assignmentId: { in: assignmentIds } },
      select: {
        assignmentId: true,
        eksekutor: {
          select: { id: true, nama: true }
        }
      }
    })
  ])
  const executorsByAssignment = new Map(
    assignmentHandlings.map(handling => [handling.assignmentId, handling.eksekutor])
  )

  const groupsByAssignment = new Map<
    string,
    {
      assignmentId: string
      namaAssignment: string | null
      nomorBangunan: string | null
      idsbr: string | null
      linkFasihEdit: string | null
      statusAlias: string | null
      executor: { id: string, nama: string } | null
      wilayah: {
        idSubsls: string
        kecamatan: string
        desa: string
        namaSls: string
        ppl: string
        pml: string
      }
      summary: {
        total: number
        handled: number
        unhandled: number
        active: number
        inactive: number
      }
      anomalies: Array<{
        id: string
        anomalyKey: string
        kodeAnomali: string
        deskripsi: string
        data: string
        catatan: string | null
        statusAlias: string | null
        isActive: boolean
        isHandled: boolean
        handledAt: string | null
        handlingNote: string | null
        isSesuaiLapangan: boolean
        sesuaiLapanganAt: string | null
      }>
    }
  >()

  for (const row of rows) {
    const group = groupsByAssignment.get(row.assignmentId) ?? {
      assignmentId: row.assignmentId,
      namaAssignment: row.namaAssignment,
      nomorBangunan: row.nomorBangunan,
      idsbr: row.idsbr,
      linkFasihEdit: row.linkFasihEdit,
      statusAlias: row.statusAlias,
      executor: executorsByAssignment.get(row.assignmentId) ?? null,
      wilayah: row.masterSls,
      summary: {
        total: 0,
        handled: 0,
        unhandled: 0,
        active: 0,
        inactive: 0
      },
      anomalies: []
    }
    const anomaly = {
      id: row.id,
      anomalyKey: row.anomalyKey,
      kodeAnomali: row.kodeAnomali,
      deskripsi: row.masterAnomali.deskripsi,
      data: row.data,
      catatan: row.catatan,
      statusAlias: row.statusAlias,
      isActive: row.isActive,
      isHandled: row.isHandled,
      handledAt: row.handledAt?.toISOString() ?? null,
      handlingNote: row.handlingNote,
      isSesuaiLapangan: row.isSesuaiLapangan,
      sesuaiLapanganAt: row.sesuaiLapanganAt?.toISOString() ?? null
    }

    group.anomalies.push(anomaly)
    Object.assign(group.summary, summarizeAnomalySubset(group.anomalies))
    groupsByAssignment.set(row.assignmentId, group)
  }

  return {
    page,
    pageSize: filters.pageSize,
    totalAssignments,
    totalPages,
    groups: assignmentIds
      .map(assignmentId => groupsByAssignment.get(assignmentId))
      .filter((group): group is NonNullable<typeof group> => Boolean(group))
  }
})
