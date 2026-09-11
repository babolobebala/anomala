import assert from 'node:assert/strict'

import { buildKbliRecapQuery } from '../server/utils/kbli-query'

interface RawSql {
  strings: readonly string[]
}

interface MasterCategory {
  code: string
  description: string | null
}

interface Finding {
  assignmentId: string
  category: string
  isHandled: boolean
}

interface RecapMetric {
  assignments: number
  findings: number
}

interface CategoryRecap {
  code: string
  description: string | null
  total: RecapMetric
  unhandled: RecapMetric
  handled: RecapMetric
}

function sqlText(query: unknown): string {
  return (query as RawSql).strings.join(' ')
}

function summarizeCategories(
  categories: readonly MasterCategory[],
  findings: readonly Finding[]
): CategoryRecap[] {
  return categories.map((category) => {
    const categoryFindings = findings.filter(finding => finding.category === category.code)
    const findingsByAssignment = new Map<string, Finding[]>()

    for (const finding of categoryFindings) {
      const assignmentFindings = findingsByAssignment.get(finding.assignmentId) ?? []
      assignmentFindings.push(finding)
      findingsByAssignment.set(finding.assignmentId, assignmentFindings)
    }

    let unhandledAssignments = 0

    for (const assignmentFindings of findingsByAssignment.values()) {
      if (assignmentFindings.some(finding => !finding.isHandled)) {
        unhandledAssignments += 1
      }
    }

    const unhandledFindings = categoryFindings.filter(finding => !finding.isHandled).length
    const totalAssignments = findingsByAssignment.size
    const totalFindings = categoryFindings.length

    return {
      code: category.code,
      description: category.description,
      total: { assignments: totalAssignments, findings: totalFindings },
      unhandled: {
        assignments: unhandledAssignments,
        findings: unhandledFindings
      },
      handled: {
        assignments: totalAssignments - unhandledAssignments,
        findings: totalFindings - unhandledFindings
      }
    }
  })
}

const categories: MasterCategory[] = [
  { code: 'C', description: 'Kategori C' },
  { code: 'G', description: 'Kategori G' },
  { code: 'I', description: 'Kategori I' }
]

const findings: Finding[] = [
  { assignmentId: 'A1', category: 'C', isHandled: true },
  { assignmentId: 'A1', category: 'G', isHandled: false },
  { assignmentId: 'A2', category: 'C', isHandled: false },
  { assignmentId: 'A3', category: 'C', isHandled: true }
]

const recap = summarizeCategories(categories, findings)
const recapByCategory = new Map(recap.map(item => [item.code, item]))

assert.deepEqual(recap.map(item => item.code), ['C', 'G', 'I'])
assert.deepEqual(recapByCategory.get('C'), {
  code: 'C',
  description: 'Kategori C',
  total: { assignments: 3, findings: 3 },
  unhandled: { assignments: 1, findings: 1 },
  handled: { assignments: 2, findings: 2 }
})
assert.deepEqual(recapByCategory.get('G'), {
  code: 'G',
  description: 'Kategori G',
  total: { assignments: 1, findings: 1 },
  unhandled: { assignments: 1, findings: 1 },
  handled: { assignments: 0, findings: 0 }
})
assert.deepEqual(recapByCategory.get('I'), {
  code: 'I',
  description: 'Kategori I',
  total: { assignments: 0, findings: 0 },
  unhandled: { assignments: 0, findings: 0 },
  handled: { assignments: 0, findings: 0 }
})

for (const item of recap) {
  assert.equal(
    item.total.assignments,
    item.unhandled.assignments + item.handled.assignments
  )
  assert.equal(
    item.total.findings,
    item.unhandled.findings + item.handled.findings
  )
}

const mixedCategoryFindings: Finding[] = [
  { assignmentId: 'A1', category: 'C', isHandled: true },
  { assignmentId: 'A1', category: 'C', isHandled: false }
]

assert.deepEqual(summarizeCategories(categories, mixedCategoryFindings)[0], {
  code: 'C',
  description: 'Kategori C',
  total: { assignments: 1, findings: 2 },
  unhandled: { assignments: 1, findings: 1 },
  handled: { assignments: 0, findings: 1 }
})

assert.deepEqual(
  summarizeCategories(categories, mixedCategoryFindings.map(finding => ({
    ...finding,
    isHandled: true
  })))[0],
  {
    code: 'C',
    description: 'Kategori C',
    total: { assignments: 1, findings: 2 },
    unhandled: { assignments: 0, findings: 0 },
    handled: { assignments: 1, findings: 2 }
  }
)

const recapQuery = sqlText(buildKbliRecapQuery())

assert.match(recapQuery, /FROM master_kbli_temuan AS m/)
assert.match(recapQuery, /LEFT JOIN kbli AS k ON k\.kategori = m\.kode/)
assert.match(recapQuery, /GROUP BY kategori, assignmentId/)
assert.match(recapQuery, /assignment_status\.kategori = k\.kategori/)
assert.match(recapQuery, /assignment_status\.hasUnhandled = 1/)
assert.match(recapQuery, /assignment_status\.hasUnhandled = 0/)
assert.match(recapQuery, /k\.isHandled = false/)
assert.match(recapQuery, /k\.isHandled = true/)

console.log('KBLI recap tests passed.')
