import { buildAnomalyRecapQuery } from '../../utils/anomali-query'
import { prisma } from '../../utils/prisma'

interface RecapRow {
  kodeAnomali: string
  deskripsi: string
  totalAssignments: bigint | number | string
  totalAnomalies: bigint | number | string
  unhandledAssignments: bigint | number | string
  unhandledAnomalies: bigint | number | string
  handledAssignments: bigint | number | string
  handledAnomalies: bigint | number | string
  disappearedAssignments: bigint | number | string
  disappearedAnomalies: bigint | number | string
}

function toNumber(value: bigint | number | string | null): number {
  return Math.max(0, Number(value ?? 0))
}

export default defineEventHandler(async () => {
  const rows = await prisma.$queryRaw<RecapRow[]>(buildAnomalyRecapQuery())

  return rows.map(row => ({
    kodeAnomali: row.kodeAnomali,
    deskripsi: row.deskripsi,
    statistics: {
      total: {
        assignments: toNumber(row.totalAssignments),
        anomalies: toNumber(row.totalAnomalies)
      },
      unhandled: {
        assignments: toNumber(row.unhandledAssignments),
        anomalies: toNumber(row.unhandledAnomalies)
      },
      handled: {
        assignments: toNumber(row.handledAssignments),
        anomalies: toNumber(row.handledAnomalies)
      },
      disappeared: {
        assignments: toNumber(row.disappearedAssignments),
        anomalies: toNumber(row.disappearedAnomalies)
      }
    }
  }))
})
