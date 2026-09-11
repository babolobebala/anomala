import assert from 'node:assert/strict'

import {
  activeAssignmentHandlingWhere,
  buildAnomalyCountQuery,
  buildAnomalyRecapQuery,
  buildAssignmentAnomalyWhere,
  buildAssignmentCountQuery,
  buildAssignmentIdsQuery,
  buildAssignmentStatisticsQueries,
  isOperationallyResolved,
  parseAnomalyListFilters,
  summarizeAnomalySubset
} from '../server/utils/anomali-query'

function sqlText(query: unknown): string {
  return (query as { strings: readonly string[] }).strings.join(' ')
}

interface RecapAssignmentRecord {
  assignmentId: string
  kodeAnomali: string
  isActive: boolean
  isHandled: boolean
  isSesuaiLapangan: boolean
}

interface AssignmentStatusCounts {
  total: number
  unhandled: number
  handled: number
  disappeared: number
}

function summarizeFilteredAssignmentStatistics(
  anomalies: readonly RecapAssignmentRecord[]
): AssignmentStatusCounts {
  const byAssignment = new Map<string, RecapAssignmentRecord[]>()

  for (const anomaly of anomalies) {
    const assignment = byAssignment.get(anomaly.assignmentId) ?? []
    assignment.push(anomaly)
    byAssignment.set(anomaly.assignmentId, assignment)
  }

  const counts: AssignmentStatusCounts = {
    total: byAssignment.size,
    unhandled: 0,
    handled: 0,
    disappeared: 0
  }

  for (const assignment of byAssignment.values()) {
    const summary = summarizeAnomalySubset(assignment)

    if (summary.active === 0) {
      counts.disappeared += 1
    } else if (summary.unhandled > 0) {
      counts.unhandled += 1
    } else {
      counts.handled += 1
    }
  }

  return counts
}

function summarizeGroupedRecapAssignments(
  anomalies: readonly RecapAssignmentRecord[]
): Map<string, AssignmentStatusCounts> {
  const byCode = new Map<string, RecapAssignmentRecord[]>()

  for (const anomaly of anomalies) {
    const codeAnomalies = byCode.get(anomaly.kodeAnomali) ?? []
    codeAnomalies.push(anomaly)
    byCode.set(anomaly.kodeAnomali, codeAnomalies)
  }

  return new Map(
    [...byCode].map(([kodeAnomali, codeAnomalies]) => [
      kodeAnomali,
      summarizeFilteredAssignmentStatistics(codeAnomalies)
    ])
  )
}

const unhandledFilters = parseAnomalyListFilters({ completionStatus: 'unhandled' })
const handledFilters = parseAnomalyListFilters({ completionStatus: 'handled' })
const disappearedFilters = parseAnomalyListFilters({ completionStatus: 'disappeared' })
const ak02Filters = parseAnomalyListFilters({ kodeAnomali: 'AK02' })
const ak03Filters = parseAnomalyListFilters({ kodeAnomali: 'AK03' })
const ak03HandledFilters = parseAnomalyListFilters({
  kodeAnomali: 'AK03',
  completionStatus: 'handled'
})

assert.equal(unhandledFilters.completionStatus, 'unhandled')
assert.equal(handledFilters.completionStatus, 'handled')
assert.equal(disappearedFilters.completionStatus, 'disappeared')
assert.equal(parseAnomalyListFilters({ completionStatus: 'unknown' }).completionStatus, undefined)

const unhandledQuery = sqlText(buildAssignmentCountQuery(unhandledFilters))
assert.match(unhandledQuery, /completion\.isActive = true/)
assert.match(unhandledQuery, /completion\.isHandled = false/)
assert.match(unhandledQuery, /completion\.isSesuaiLapangan = false/)

const handledQuery = sqlText(buildAssignmentCountQuery(handledFilters))
assert.match(handledQuery, /completion\.isActive = true/)
assert.match(handledQuery, /NOT EXISTS/)
assert.match(handledQuery, /completion\.isHandled = false/)
assert.match(handledQuery, /completion\.isSesuaiLapangan = false/)

const disappearedQuery = sqlText(buildAssignmentIdsQuery(disappearedFilters, 1))
assert.match(disappearedQuery, /NOT EXISTS/)
assert.match(disappearedQuery, /completion\.isActive = true/)

const statisticsQueries = buildAssignmentStatisticsQueries(unhandledFilters)
assert.doesNotMatch(sqlText(statisticsQueries.totalAssignments), /completion\./)
assert.match(sqlText(statisticsQueries.unhandled), /completion\.isHandled = false/)
assert.match(sqlText(statisticsQueries.unhandled), /completion\.isSesuaiLapangan = false/)
assert.match(sqlText(statisticsQueries.handled), /NOT EXISTS/)
assert.match(sqlText(statisticsQueries.disappeared), /NOT EXISTS/)
assert.match(sqlText(statisticsQueries.totalAnomalies), /COUNT\(\*\)/)
assert.match(sqlText(statisticsQueries.unhandledAnomalies), /a\.isActive = true AND a\.isHandled = false AND a\.isSesuaiLapangan = false/)
assert.match(sqlText(statisticsQueries.handledAnomalies), /a\.isActive = true AND \(a\.isHandled = true OR a\.isSesuaiLapangan = true\)/)
assert.match(sqlText(statisticsQueries.disappearedAnomalies), /a\.isActive = false AND a\.isHandled = true/)

assert.match(sqlText(buildAnomalyCountQuery(unhandledFilters, 'unhandled')), /a\.isHandled = false/)
assert.match(sqlText(buildAnomalyCountQuery(unhandledFilters, 'unhandled')), /a\.isSesuaiLapangan = false/)

const mixedAssignment = [
  { kodeAnomali: 'AK02', isActive: true, isHandled: true, isSesuaiLapangan: false },
  { kodeAnomali: 'AK03', isActive: true, isHandled: false, isSesuaiLapangan: false }
]
const ak02Anomalies = mixedAssignment.filter(anomaly => anomaly.kodeAnomali === 'AK02')
const ak03Anomalies = mixedAssignment.filter(anomaly => anomaly.kodeAnomali === 'AK03')

assert.deepEqual(summarizeAnomalySubset(mixedAssignment), {
  total: 2,
  handled: 1,
  unhandled: 1,
  active: 2,
  inactive: 0
})
assert.deepEqual(summarizeAnomalySubset(ak02Anomalies), {
  total: 1,
  handled: 1,
  unhandled: 0,
  active: 1,
  inactive: 0
})
assert.deepEqual(summarizeAnomalySubset(ak03Anomalies), {
  total: 1,
  handled: 0,
  unhandled: 1,
  active: 1,
  inactive: 0
})
assert.ok(ak02Anomalies.every(anomaly => anomaly.kodeAnomali === 'AK02'))
assert.equal(isOperationallyResolved({
  isActive: true,
  isHandled: false,
  isSesuaiLapangan: true
}), true)
assert.deepEqual(buildAssignmentAnomalyWhere(['assignment-1'], ak02Filters), {
  assignmentId: { in: ['assignment-1'] },
  kodeAnomali: 'AK02'
})

const ak02Statistics = buildAssignmentStatisticsQueries(ak02Filters)
assert.match(sqlText(ak02Statistics.totalAssignments), /a\.kodeAnomali =/)
assert.match(sqlText(ak02Statistics.unhandled), /completion\.kodeAnomali =/)
assert.match(sqlText(ak02Statistics.handled), /completion\.kodeAnomali =/)
assert.match(sqlText(ak02Statistics.disappeared), /completion\.kodeAnomali =/)
assert.match(sqlText(buildAssignmentIdsQuery(ak03HandledFilters, 1)), /completion\.kodeAnomali =/)

const recapQuery = sqlText(buildAnomalyRecapQuery())
assert.match(recapQuery, /FROM master_anomali AS m/)
assert.match(recapQuery, /LEFT JOIN anomali AS a ON a\.kodeAnomali = m\.kodeAnomali/)
assert.match(recapQuery, /GROUP BY m\.kodeAnomali, m\.deskripsi/)
assert.match(recapQuery, /SELECT\s+a\.kodeAnomali,\s+a\.assignmentId,/)
assert.match(recapQuery, /GROUP BY a\.kodeAnomali, a\.assignmentId/)
assert.match(recapQuery, /assignment_status\.kodeAnomali = a\.kodeAnomali/)
assert.match(recapQuery, /COUNT\(DISTINCT CASE\s+WHEN assignment_status\.hasUnhandled = 1 THEN a\.assignmentId/)
assert.match(recapQuery, /a\.isActive = true AND a\.isHandled = false AND a\.isSesuaiLapangan = false/)
assert.match(recapQuery, /a\.isActive = true AND \(a\.isHandled = true OR a\.isSesuaiLapangan = true\)/)
assert.match(recapQuery, /a\.isActive = false AND a\.isHandled = true/)

const mixedCodeAssignments: RecapAssignmentRecord[] = [
  { assignmentId: 'assignment-x', kodeAnomali: 'AK02', isActive: true, isHandled: true, isSesuaiLapangan: false },
  { assignmentId: 'assignment-x', kodeAnomali: 'AK03', isActive: true, isHandled: false, isSesuaiLapangan: false },
  { assignmentId: 'assignment-x', kodeAnomali: 'AK15', isActive: true, isHandled: false, isSesuaiLapangan: false }
]
const mixedCodeRecap = summarizeGroupedRecapAssignments(mixedCodeAssignments)

assert.deepEqual(mixedCodeRecap.get('AK02'), {
  total: 1,
  unhandled: 0,
  handled: 1,
  disappeared: 0
})
assert.deepEqual(mixedCodeRecap.get('AK03'), {
  total: 1,
  unhandled: 1,
  handled: 0,
  disappeared: 0
})

const fieldConditionAssignments: RecapAssignmentRecord[] = [
  { assignmentId: 'assignment-y', kodeAnomali: 'AK02', isActive: true, isHandled: false, isSesuaiLapangan: true },
  { assignmentId: 'assignment-y', kodeAnomali: 'AK03', isActive: true, isHandled: false, isSesuaiLapangan: false }
]
const fieldConditionRecap = summarizeGroupedRecapAssignments(fieldConditionAssignments)

assert.deepEqual(fieldConditionRecap.get('AK02'), {
  total: 1,
  unhandled: 0,
  handled: 1,
  disappeared: 0
})
assert.deepEqual(fieldConditionRecap.get('AK03'), {
  total: 1,
  unhandled: 1,
  handled: 0,
  disappeared: 0
})

const historicalAssignments: RecapAssignmentRecord[] = [
  { assignmentId: 'assignment-z', kodeAnomali: 'AK02', isActive: false, isHandled: true, isSesuaiLapangan: false },
  { assignmentId: 'assignment-z', kodeAnomali: 'AK03', isActive: true, isHandled: false, isSesuaiLapangan: false }
]

assert.deepEqual(summarizeGroupedRecapAssignments(historicalAssignments).get('AK02'), {
  total: 1,
  unhandled: 0,
  handled: 0,
  disappeared: 1
})

const statisticsParityAssignments: RecapAssignmentRecord[] = [
  { assignmentId: 'assignment-1', kodeAnomali: 'AK02', isActive: true, isHandled: true, isSesuaiLapangan: false },
  { assignmentId: 'assignment-1', kodeAnomali: 'AK03', isActive: true, isHandled: false, isSesuaiLapangan: false },
  { assignmentId: 'assignment-1', kodeAnomali: 'AK15', isActive: true, isHandled: false, isSesuaiLapangan: false },
  { assignmentId: 'assignment-2', kodeAnomali: 'AK02', isActive: true, isHandled: false, isSesuaiLapangan: false },
  { assignmentId: 'assignment-3', kodeAnomali: 'AK02', isActive: true, isHandled: false, isSesuaiLapangan: false }
]
const ak02RecapStatistics = summarizeGroupedRecapAssignments(statisticsParityAssignments).get('AK02')
const ak02FilteredStatistics = summarizeFilteredAssignmentStatistics(
  statisticsParityAssignments.filter(anomaly => anomaly.kodeAnomali === 'AK02')
)

assert.deepEqual(ak02RecapStatistics, ak02FilteredStatistics)
assert.deepEqual(ak02RecapStatistics, {
  total: 3,
  unhandled: 2,
  handled: 1,
  disappeared: 0
})

assert.deepEqual(activeAssignmentHandlingWhere('assignment-1'), {
  assignmentId: 'assignment-1',
  isActive: true,
  isHandled: false,
  isSesuaiLapangan: false
})

console.log('Anomali assignment-status query tests passed.')
