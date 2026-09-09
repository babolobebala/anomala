import assert from 'node:assert/strict'

import {
  activeAssignmentHandlingWhere,
  buildAnomalyCountQuery,
  buildAssignmentCountQuery,
  buildAssignmentIdsQuery,
  buildAssignmentStatisticsQueries,
  parseAnomalyListFilters
} from '../server/utils/anomali-query'

function sqlText(query: unknown): string {
  return (query as { strings: readonly string[] }).strings.join(' ')
}

const unhandledFilters = parseAnomalyListFilters({ completionStatus: 'unhandled' })
const handledFilters = parseAnomalyListFilters({ completionStatus: 'handled' })
const disappearedFilters = parseAnomalyListFilters({ completionStatus: 'disappeared' })

assert.equal(unhandledFilters.completionStatus, 'unhandled')
assert.equal(handledFilters.completionStatus, 'handled')
assert.equal(disappearedFilters.completionStatus, 'disappeared')
assert.equal(parseAnomalyListFilters({ completionStatus: 'unknown' }).completionStatus, undefined)

const unhandledQuery = sqlText(buildAssignmentCountQuery(unhandledFilters))
assert.match(unhandledQuery, /completion\.isActive = true/)
assert.match(unhandledQuery, /completion\.isHandled = false/)

const handledQuery = sqlText(buildAssignmentCountQuery(handledFilters))
assert.match(handledQuery, /completion\.isActive = true/)
assert.match(handledQuery, /NOT EXISTS/)
assert.match(handledQuery, /completion\.isHandled = false/)

const disappearedQuery = sqlText(buildAssignmentIdsQuery(disappearedFilters, 1))
assert.match(disappearedQuery, /NOT EXISTS/)
assert.match(disappearedQuery, /completion\.isActive = true/)

const statisticsQueries = buildAssignmentStatisticsQueries(unhandledFilters)
assert.doesNotMatch(sqlText(statisticsQueries.totalAssignments), /completion\./)
assert.match(sqlText(statisticsQueries.unhandled), /completion\.isHandled = false/)
assert.match(sqlText(statisticsQueries.handled), /NOT EXISTS/)
assert.match(sqlText(statisticsQueries.disappeared), /NOT EXISTS/)
assert.match(sqlText(statisticsQueries.totalAnomalies), /COUNT\(\*\)/)
assert.match(sqlText(statisticsQueries.unhandledAnomalies), /a\.isActive = true AND a\.isHandled = false/)
assert.match(sqlText(statisticsQueries.handledAnomalies), /a\.isActive = true AND a\.isHandled = true/)
assert.match(sqlText(statisticsQueries.disappearedAnomalies), /a\.isActive = false AND a\.isHandled = true/)

assert.match(sqlText(buildAnomalyCountQuery(unhandledFilters, 'unhandled')), /a\.isHandled = false/)

assert.deepEqual(activeAssignmentHandlingWhere('assignment-1'), {
  assignmentId: 'assignment-1',
  isActive: true
})

console.log('Anomali assignment-status query tests passed.')
