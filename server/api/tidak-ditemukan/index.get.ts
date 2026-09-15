import {
  buildTidakDitemukanSlsCountQuery,
  buildTidakDitemukanSlsIdsQuery,
  groupTidakDitemukanRows,
  parseTidakDitemukanListFilters,
  type TidakDitemukanVisibleAssignment
} from '../../utils/tidak-ditemukan-query'
import { prisma } from '../../utils/prisma'

interface CountResult { total: bigint | number | string }
interface SlsIdResult { idSubsls: string }

export default defineEventHandler(async (event) => {
  const filters = parseTidakDitemukanListFilters(getQuery(event))
  const [countRow] = await prisma.$queryRaw<CountResult[]>(
    buildTidakDitemukanSlsCountQuery(filters)
  )
  const totalSls = Math.max(0, Number(countRow?.total ?? 0))
  const totalPages = Math.ceil(totalSls / filters.pageSize)
  const page = totalPages === 0 ? 1 : Math.min(filters.page, totalPages)
  const idSubslsValues = (await prisma.$queryRaw<SlsIdResult[]>(
    buildTidakDitemukanSlsIdsQuery(filters, page)
  )).map(row => row.idSubsls)

  if (idSubslsValues.length === 0) {
    return { page, pageSize: filters.pageSize, totalSls, totalPages, groups: [] }
  }

  const [rows, statuses] = await Promise.all([
    prisma.tidakDitemukanAssignment.findMany({
      where: { idSubsls: { in: idSubslsValues } },
      select: {
        id: true,
        idSubsls: true,
        namaAssignment: true,
        sumber: true,
        masterSls: {
          select: { idSubsls: true, kecamatan: true, desa: true, namaSls: true, ppl: true, pml: true }
        }
      },
      orderBy: [{ idSubsls: 'asc' }, { namaAssignment: 'asc' }, { id: 'asc' }]
    }),
    prisma.tidakDitemukanSlsStatus.findMany({
      where: { idSubsls: { in: idSubslsValues } },
      select: { idSubsls: true, isSelesai: true, selesaiAt: true }
    })
  ])

  return {
    page,
    pageSize: filters.pageSize,
    totalSls,
    totalPages,
    groups: groupTidakDitemukanRows(
      idSubslsValues,
      rows as TidakDitemukanVisibleAssignment[],
      new Map(statuses.map(status => [status.idSubsls, status]))
    )
  }
})
