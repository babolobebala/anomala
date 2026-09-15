import {
  tidakDitemukanMasterSlsWhere,
  parseTidakDitemukanListFilters,
  type TidakDitemukanListFilters
} from '../../utils/tidak-ditemukan-query'
import { prisma } from '../../utils/prisma'

function selectedWhere(filters: TidakDitemukanListFilters, omit?: 'ppl' | 'pml') {
  return tidakDitemukanMasterSlsWhere({
    ...filters,
    ...(omit === 'ppl' ? { ppl: undefined } : {}),
    ...(omit === 'pml' ? { pml: undefined } : {})
  })
}

export default defineEventHandler(async (event) => {
  const filters = parseTidakDitemukanListFilters(getQuery(event))
  const noRows = { idSubsls: { in: [] } }
  const [kecamatan, desa, namaSls, ppl, pml] = await prisma.$transaction([
    prisma.masterSls.findMany({
      where: { tidakDitemukanAssignments: { some: {} } }, distinct: ['kecamatan'], select: { kecamatan: true }, orderBy: { kecamatan: 'asc' }
    }),
    filters.kecamatan
      ? prisma.masterSls.findMany({ where: { tidakDitemukanAssignments: { some: {} }, kecamatan: filters.kecamatan }, distinct: ['desa'], select: { desa: true }, orderBy: { desa: 'asc' } })
      : prisma.masterSls.findMany({ where: noRows, distinct: ['desa'], select: { desa: true }, orderBy: { desa: 'asc' } }),
    filters.kecamatan && filters.desa
      ? prisma.masterSls.findMany({ where: { tidakDitemukanAssignments: { some: {} }, kecamatan: filters.kecamatan, desa: filters.desa }, distinct: ['namaSls'], select: { namaSls: true }, orderBy: { namaSls: 'asc' } })
      : prisma.masterSls.findMany({ where: noRows, distinct: ['namaSls'], select: { namaSls: true }, orderBy: { namaSls: 'asc' } }),
    prisma.masterSls.findMany({ where: selectedWhere(filters, 'ppl'), distinct: ['ppl'], select: { ppl: true }, orderBy: { ppl: 'asc' } }),
    prisma.masterSls.findMany({ where: selectedWhere(filters, 'pml'), distinct: ['pml'], select: { pml: true }, orderBy: { pml: 'asc' } })
  ])

  return {
    kecamatan: kecamatan.map(row => row.kecamatan),
    desa: desa.map(row => row.desa),
    namaSls: namaSls.map(row => row.namaSls),
    ppl: ppl.map(row => row.ppl),
    pml: pml.map(row => row.pml)
  }
})
