import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { buildAnomalyRecapQuery } from '../server/utils/anomali-query'

interface MasterCode {
  kodeAnomali: string
  deskripsi: string
}

interface Finding {
  assignmentId: string
  kodeAnomali: string
  isActive: boolean
  isHandled: boolean
  isSesuaiLapangan: boolean
}

interface RecapMetric {
  assignments: number
  anomalies: number
}

interface CodeRecap {
  kodeAnomali: string
  deskripsi: string
  total: RecapMetric
  unhandled: RecapMetric
  handled: RecapMetric
  disappeared: RecapMetric
}

function isUnhandled(finding: Finding): boolean {
  return finding.isActive && !finding.isHandled && !finding.isSesuaiLapangan
}

function isHandled(finding: Finding): boolean {
  return finding.isActive && (finding.isHandled || finding.isSesuaiLapangan)
}

function isDisappeared(finding: Finding): boolean {
  return !finding.isActive && finding.isHandled
}

function summarizeCodes(
  masterCodes: readonly MasterCode[],
  findings: readonly Finding[]
): CodeRecap[] {
  return masterCodes.map((masterCode) => {
    const codeFindings = findings.filter(finding => finding.kodeAnomali === masterCode.kodeAnomali)
    const byAssignment = new Map<string, Finding[]>()

    for (const finding of codeFindings) {
      const assignmentFindings = byAssignment.get(finding.assignmentId) ?? []
      assignmentFindings.push(finding)
      byAssignment.set(finding.assignmentId, assignmentFindings)
    }

    let unhandledAssignments = 0
    let handledAssignments = 0
    let disappearedAssignments = 0

    for (const assignmentFindings of byAssignment.values()) {
      const hasActive = assignmentFindings.some(finding => finding.isActive)

      if (!hasActive) {
        disappearedAssignments += 1
      } else if (assignmentFindings.some(isUnhandled)) {
        unhandledAssignments += 1
      } else {
        handledAssignments += 1
      }
    }

    return {
      kodeAnomali: masterCode.kodeAnomali,
      deskripsi: masterCode.deskripsi,
      total: {
        assignments: byAssignment.size,
        anomalies: codeFindings.length
      },
      unhandled: {
        assignments: unhandledAssignments,
        anomalies: codeFindings.filter(isUnhandled).length
      },
      handled: {
        assignments: handledAssignments,
        anomalies: codeFindings.filter(isHandled).length
      },
      disappeared: {
        assignments: disappearedAssignments,
        anomalies: codeFindings.filter(isDisappeared).length
      }
    }
  })
}

function sqlText(query: unknown): string {
  return (query as { strings: readonly string[] }).strings.join(' ')
}

function factTableReferenceCount(sql: string, table: string): number {
  return [...sql.matchAll(new RegExp(`\\b(?:FROM|JOIN)\\s+${table}\\b`, 'gi'))].length
}

const masterCodes: MasterCode[] = [
  { kodeAnomali: 'AK01', deskripsi: 'Anomali 1' },
  { kodeAnomali: 'AK02', deskripsi: 'Anomali 2' },
  { kodeAnomali: 'AK03', deskripsi: 'Anomali 3' }
]

const findings: Finding[] = [
  { assignmentId: 'A1', kodeAnomali: 'AK01', isActive: true, isHandled: false, isSesuaiLapangan: false },
  { assignmentId: 'A1', kodeAnomali: 'AK01', isActive: true, isHandled: true, isSesuaiLapangan: false },
  { assignmentId: 'A2', kodeAnomali: 'AK01', isActive: true, isHandled: true, isSesuaiLapangan: false },
  { assignmentId: 'A3', kodeAnomali: 'AK01', isActive: true, isHandled: false, isSesuaiLapangan: true },
  { assignmentId: 'A4', kodeAnomali: 'AK01', isActive: false, isHandled: true, isSesuaiLapangan: false },
  { assignmentId: 'A5', kodeAnomali: 'AK01', isActive: false, isHandled: false, isSesuaiLapangan: false },
  { assignmentId: 'A1', kodeAnomali: 'AK02', isActive: true, isHandled: true, isSesuaiLapangan: false }
]

const recap = summarizeCodes(masterCodes, findings)
const recapByCode = new Map(recap.map(item => [item.kodeAnomali, item]))

assert.deepEqual(recap.map(item => item.kodeAnomali), ['AK01', 'AK02', 'AK03'])
assert.deepEqual(recapByCode.get('AK01'), {
  kodeAnomali: 'AK01',
  deskripsi: 'Anomali 1',
  total: { assignments: 5, anomalies: 6 },
  unhandled: { assignments: 1, anomalies: 1 },
  handled: { assignments: 2, anomalies: 3 },
  disappeared: { assignments: 2, anomalies: 1 }
})
assert.deepEqual(recapByCode.get('AK02'), {
  kodeAnomali: 'AK02',
  deskripsi: 'Anomali 2',
  total: { assignments: 1, anomalies: 1 },
  unhandled: { assignments: 0, anomalies: 0 },
  handled: { assignments: 1, anomalies: 1 },
  disappeared: { assignments: 0, anomalies: 0 }
})
assert.deepEqual(recapByCode.get('AK03'), {
  kodeAnomali: 'AK03',
  deskripsi: 'Anomali 3',
  total: { assignments: 0, anomalies: 0 },
  unhandled: { assignments: 0, anomalies: 0 },
  handled: { assignments: 0, anomalies: 0 },
  disappeared: { assignments: 0, anomalies: 0 }
})

const recapQuery = sqlText(buildAnomalyRecapQuery())

assert.match(recapQuery, /FROM master_anomali AS m/)
assert.match(recapQuery, /recap\.kodeAnomali = m\.kodeAnomali/)
assert.match(recapQuery, /GROUP BY a\.kodeAnomali, a\.assignmentId/)
assert.match(recapQuery, /GROUP BY per_assignment\.kodeAnomali/)
assert.equal(factTableReferenceCount(recapQuery, 'anomali'), 1)
assert.doesNotMatch(recapQuery, /COUNT\s*\(\s*DISTINCT\s+/i)

const endpointSource = readFileSync(
  new URL('../server/api/anomali/recap.get.ts', import.meta.url),
  'utf8'
)

assert.equal([...endpointSource.matchAll(/prisma\.\$queryRaw/g)].length, 1)
assert.equal([...endpointSource.matchAll(/\bprisma\.[\w$]+/g)].length, 1)
assert.doesNotMatch(endpointSource, /Promise\.all/)

console.log('Anomali recap tests passed.')
