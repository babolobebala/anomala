import assert from 'node:assert/strict'

import {
  groupTidakDitemukanRows,
  parseTidakDitemukanListFilters,
  tidakDitemukanMasterSlsWhere,
  type TidakDitemukanVisibleAssignment
} from '../server/utils/tidak-ditemukan-query'
import {
  buildTidakDitemukanTemplateData,
  hasTidakDitemukanDocxSource
} from '../server/services/tidak-ditemukan-docx'
import {
  buildTidakDitemukanSelesaiData,
  isTidakDitemukanSelesai,
  shouldDeleteTidakDitemukanStatus
} from '../server/utils/tidak-ditemukan-status'
import { serializeTidakDitemukanSnapshot } from '../server/utils/tidak-ditemukan-snapshot'

function row(
  id: string,
  idSubsls: string,
  namaAssignment: string,
  sumber: string | null = null
): TidakDitemukanVisibleAssignment {
  return {
    id,
    idSubsls,
    namaAssignment,
    sumber,
    masterSls: {
      idSubsls,
      kecamatan: idSubsls === 'sls-1' ? 'Kecamatan A' : 'Kecamatan B',
      desa: idSubsls === 'sls-1' ? 'Desa A' : 'Desa B',
      namaSls: `SLS ${idSubsls}`,
      ppl: 'PPL 1',
      pml: 'PML 1'
    }
  }
}

const filters = parseTidakDitemukanListFilters({
  page: '2', pageSize: '10', kecamatan: 'Kecamatan A', desa: 'Desa A',
  namaSls: 'SLS sls-1', ppl: 'PPL 1', pml: 'PML 1', completionStatus: 'completed'
})
assert.deepEqual(filters, {
  page: 2, pageSize: 10, kecamatan: 'Kecamatan A', desa: 'Desa A', namaSls: 'SLS sls-1',
  ppl: 'PPL 1', pml: 'PML 1', completionStatus: 'completed', search: undefined
})
assert.deepEqual(tidakDitemukanMasterSlsWhere(filters), {
  tidakDitemukanAssignments: { some: {} }, kecamatan: 'Kecamatan A', desa: 'Desa A',
  namaSls: 'SLS sls-1', ppl: 'PPL 1', pml: 'PML 1'
})

const rows = [
  row('a-1', 'sls-1', 'Assignment 1', 'Sumber A'),
  row('a-2', 'sls-1', 'Assignment 2'),
  row('a-3', 'sls-2', 'Assignment 3'),
  row('a-4', 'sls-3', 'Assignment 4')
]
const firstPage = groupTidakDitemukanRows(
  ['sls-1', 'sls-2'], rows.filter(item => item.idSubsls !== 'sls-3'),
  new Map([['sls-2', { isSelesai: true, selesaiAt: new Date('2026-09-15T00:00:00.000Z') }]])
)
assert.equal(firstPage.length, 2)
assert.equal(firstPage[0]?.assignments.length, 2)
assert.equal(firstPage[1]?.assignments.length, 1)
assert.equal(firstPage[0]?.assignments[0]?.sumber, 'Sumber A')
assert.equal(firstPage[0]?.assignments[1]?.sumber, null)
assert.equal(firstPage[0]?.isSelesai, false, 'missing status is unresolved')
assert.equal(firstPage[1]?.isSelesai, true)
assert.equal(firstPage[1]?.selesaiAt, '2026-09-15T00:00:00.000Z')

const secondPage = groupTidakDitemukanRows(['sls-3'], rows.filter(item => item.idSubsls === 'sls-3'), new Map())
assert.deepEqual(secondPage.map(group => group.idSubsls), ['sls-3'], 'SLS pagination never splits rows')

const now = new Date('2026-09-15T01:00:00.000Z')
assert.equal(isTidakDitemukanSelesai(undefined), false)
assert.equal(isTidakDitemukanSelesai({ isSelesai: true, selesaiAt: now }), true)
assert.deepEqual(buildTidakDitemukanSelesaiData(now), { isSelesai: true, selesaiAt: now })
assert.equal(shouldDeleteTidakDitemukanStatus(false), true)
assert.equal(shouldDeleteTidakDitemukanStatus(true), false)

assert.deepEqual(serializeTidakDitemukanSnapshot({
  importedAt: now, namaFile: 'snapshot.xlsx', jumlahAssignment: 4, jumlahSls: 3
}), {
  importedAt: '2026-09-15T01:00:00.000Z', namaFile: 'snapshot.xlsx', jumlahAssignment: 4, jumlahSls: 3
})

const docxData = buildTidakDitemukanTemplateData({
  wilayah: rows[0]!.masterSls,
  assignments: [{ namaAssignment: 'Assignment 1' }, { namaAssignment: 'Assignment 2' }]
})
assert.deepEqual(docxData.assignments, [
  { no: 1, namaAssignment: 'Assignment 1' }, { no: 2, namaAssignment: 'Assignment 2' }
])
assert.equal(hasTidakDitemukanDocxSource(rows[0]!.masterSls, docxData.assignments), true)
assert.equal(hasTidakDitemukanDocxSource(null, docxData.assignments), false, 'unknown SLS is rejected')
assert.equal(hasTidakDitemukanDocxSource(rows[0]!.masterSls, []), false, 'non-active SLS is rejected')

console.log('Tidak Ditemukan query/status/DOCX tests passed.')
