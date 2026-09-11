import {
  buildKbliStatisticsQueries,
  parseKbliListFilters
} from '../../utils/kbli-query'
import { prisma } from '../../utils/prisma'

interface CountResult {
  total: bigint | number | string
}

function toNumber(value: CountResult['total']): number {
  return Math.max(0, Number(value))
}

export default defineEventHandler(async (event) => {
  const filters = parseKbliListFilters(getQuery(event))
  const queries = buildKbliStatisticsQueries(filters)
  const [
    totalAssignmentRow,
    unhandledAssignmentRow,
    handledAssignmentRow,
    totalFindingRow,
    unhandledFindingRow,
    handledFindingRow
  ] = await Promise.all([
    prisma.$queryRaw<CountResult[]>(queries.totalAssignments),
    prisma.$queryRaw<CountResult[]>(queries.unhandled),
    prisma.$queryRaw<CountResult[]>(queries.handled),
    prisma.$queryRaw<CountResult[]>(queries.totalFindings),
    prisma.$queryRaw<CountResult[]>(queries.unhandledFindings),
    prisma.$queryRaw<CountResult[]>(queries.handledFindings)
  ])

  return {
    total: {
      assignments: toNumber(totalAssignmentRow[0]?.total ?? 0),
      findings: toNumber(totalFindingRow[0]?.total ?? 0)
    },
    unhandled: {
      assignments: toNumber(unhandledAssignmentRow[0]?.total ?? 0),
      findings: toNumber(unhandledFindingRow[0]?.total ?? 0)
    },
    handled: {
      assignments: toNumber(handledAssignmentRow[0]?.total ?? 0),
      findings: toNumber(handledFindingRow[0]?.total ?? 0)
    }
  }
})
