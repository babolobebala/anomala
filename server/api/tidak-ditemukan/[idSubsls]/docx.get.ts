import {
  generateTidakDitemukanDocx,
  hasTidakDitemukanDocxSource
} from '../../../services/tidak-ditemukan-docx'
import { buildTidakDitemukanDocxFilename } from '../../../utils/tidak-ditemukan-docx-filename'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const idSubsls = getRouterParam(event, 'idSubsls')

  if (!idSubsls) {
    throw createError({ statusCode: 400, statusMessage: 'idSubsls is required.' })
  }

  const [assignments, masterSls] = await Promise.all([
    prisma.tidakDitemukanAssignment.findMany({
      where: { idSubsls }, select: { namaAssignment: true, sumber: true }, orderBy: [{ namaAssignment: 'asc' }, { id: 'asc' }]
    }),
    prisma.masterSls.findUnique({
      where: { idSubsls }, select: { namaSls: true, desa: true, kecamatan: true, ppl: true, pml: true }
    })
  ])

  if (!masterSls || !hasTidakDitemukanDocxSource(masterSls, assignments)) {
    throw createError({ statusCode: 404, statusMessage: 'Tidak Ditemukan SLS not found in the active snapshot.' })
  }

  const report = await generateTidakDitemukanDocx({ wilayah: masterSls, assignments })
  setHeader(event, 'content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  setHeader(event, 'content-disposition', `attachment; filename="${buildTidakDitemukanDocxFilename({ idSubsls, ...masterSls })}"`)
  return report
})
