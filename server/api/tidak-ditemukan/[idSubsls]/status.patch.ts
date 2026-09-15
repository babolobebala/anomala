import { prisma } from '../../../utils/prisma'
import {
  buildTidakDitemukanSelesaiData,
  shouldDeleteTidakDitemukanStatus
} from '../../../utils/tidak-ditemukan-status'

interface StatusBody { isSelesai?: unknown }

export default defineEventHandler(async (event) => {
  const idSubsls = getRouterParam(event, 'idSubsls')
  const body = await readBody<StatusBody>(event)

  if (!idSubsls || typeof body?.isSelesai !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'idSubsls and isSelesai are required.' })
  }

  const activeAssignment = await prisma.tidakDitemukanAssignment.findFirst({
    where: { idSubsls }, select: { id: true }
  })

  if (!activeAssignment) {
    throw createError({ statusCode: 404, statusMessage: 'Tidak Ditemukan SLS not found.' })
  }

  if (shouldDeleteTidakDitemukanStatus(body.isSelesai)) {
    await prisma.tidakDitemukanSlsStatus.deleteMany({ where: { idSubsls } })
    return { idSubsls, isSelesai: false, selesaiAt: null }
  }

  const status = await prisma.tidakDitemukanSlsStatus.upsert({
    where: { idSubsls },
    create: { idSubsls, ...buildTidakDitemukanSelesaiData(new Date()) },
    update: buildTidakDitemukanSelesaiData(new Date()),
    select: { idSubsls: true, isSelesai: true, selesaiAt: true }
  })

  return { ...status, selesaiAt: status.selesaiAt?.toISOString() ?? null }
})
