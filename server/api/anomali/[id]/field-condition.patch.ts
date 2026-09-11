import { Prisma } from '../../../../generated/prisma/client'
import { prisma } from '../../../utils/prisma'

interface UpdateFieldConditionBody {
  isSesuaiLapangan?: unknown
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Anomaly id is required.' })
  }

  const body = await readBody<UpdateFieldConditionBody>(event)

  if (typeof body?.isSesuaiLapangan !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'isSesuaiLapangan must be a boolean.'
    })
  }

  try {
    const anomaly = await prisma.anomali.update({
      where: { id },
      data: {
        isSesuaiLapangan: body.isSesuaiLapangan,
        sesuaiLapanganAt: body.isSesuaiLapangan ? new Date() : null
      },
      select: {
        id: true,
        isSesuaiLapangan: true,
        sesuaiLapanganAt: true
      }
    })

    return {
      id: anomaly.id,
      isSesuaiLapangan: anomaly.isSesuaiLapangan,
      sesuaiLapanganAt: anomaly.sesuaiLapanganAt?.toISOString() ?? null
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Anomaly not found.' })
    }

    throw error
  }
})
