import { buildKbliRecapQuery } from '../../utils/kbli-query'
import { prisma } from '../../utils/prisma'

interface RecapRow {
  kategori: string
  deskripsi: string | null
  totalAssignments: bigint | number | string
  totalFindings: bigint | number | string
  unhandledAssignments: bigint | number | string
  unhandledFindings: bigint | number | string
  handledAssignments: bigint | number | string
  handledFindings: bigint | number | string
}

function toNumber(value: bigint | number | string | null): number {
  return Math.max(0, Number(value ?? 0))
}

export default defineEventHandler(async () => {
  const rows = await prisma.$queryRaw<RecapRow[]>(buildKbliRecapQuery())

  return rows.map(row => ({
    kategori: row.kategori,
    deskripsi: row.deskripsi,
    statistics: {
      total: {
        assignments: toNumber(row.totalAssignments),
        findings: toNumber(row.totalFindings)
      },
      unhandled: {
        assignments: toNumber(row.unhandledAssignments),
        findings: toNumber(row.unhandledFindings)
      },
      handled: {
        assignments: toNumber(row.handledAssignments),
        findings: toNumber(row.handledFindings)
      }
    }
  }))
})
