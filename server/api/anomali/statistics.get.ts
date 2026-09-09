import {
  buildAssignmentStatisticsQueries,
  parseAnomalyListFilters
} from '../../utils/anomali-query'
import { prisma } from '../../utils/prisma'

interface CountResult {
  total: bigint | number | string
}

function toNumber(value: CountResult['total']): number {
  return Math.max(0, Number(value))
}

export default defineEventHandler(async (event) => {
  const filters = parseAnomalyListFilters(getQuery(event))
  const queries = buildAssignmentStatisticsQueries(filters)
  const [
    totalAssignmentRow,
    unhandledAssignmentRow,
    handledAssignmentRow,
    disappearedAssignmentRow,
    totalAnomalyRow,
    unhandledAnomalyRow,
    handledAnomalyRow,
    disappearedAnomalyRow
  ] = await Promise.all([
    prisma.$queryRaw<CountResult[]>(queries.totalAssignments),
    prisma.$queryRaw<CountResult[]>(queries.unhandled),
    prisma.$queryRaw<CountResult[]>(queries.handled),
    prisma.$queryRaw<CountResult[]>(queries.disappeared),
    prisma.$queryRaw<CountResult[]>(queries.totalAnomalies),
    prisma.$queryRaw<CountResult[]>(queries.unhandledAnomalies),
    prisma.$queryRaw<CountResult[]>(queries.handledAnomalies),
    prisma.$queryRaw<CountResult[]>(queries.disappearedAnomalies)
  ])

  return {
    total: {
      assignments: toNumber(totalAssignmentRow[0]?.total ?? 0),
      anomalies: toNumber(totalAnomalyRow[0]?.total ?? 0)
    },
    unhandled: {
      assignments: toNumber(unhandledAssignmentRow[0]?.total ?? 0),
      anomalies: toNumber(unhandledAnomalyRow[0]?.total ?? 0)
    },
    handled: {
      assignments: toNumber(handledAssignmentRow[0]?.total ?? 0),
      anomalies: toNumber(handledAnomalyRow[0]?.total ?? 0)
    },
    disappeared: {
      assignments: toNumber(disappearedAssignmentRow[0]?.total ?? 0),
      anomalies: toNumber(disappearedAnomalyRow[0]?.total ?? 0)
    }
  }
})
