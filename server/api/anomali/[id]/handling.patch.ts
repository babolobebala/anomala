import { Prisma } from '../../../../generated/prisma/client'
import { prisma } from '../../../utils/prisma'

interface UpdateHandlingBody {
  isHandled?: unknown
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Anomaly id is required.' })
  }

  const body = await readBody<UpdateHandlingBody>(event)

  if (typeof body?.isHandled !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'isHandled must be a boolean.' })
  }

  try {
    const anomaly = await prisma.anomali.update({
      where: { id },
      data: {
        isHandled: body.isHandled,
        handledAt: body.isHandled ? new Date() : null
      },
      select: {
        id: true,
        isHandled: true,
        handledAt: true
      }
    })

    return {
      id: anomaly.id,
      isHandled: anomaly.isHandled,
      handledAt: anomaly.handledAt?.toISOString() ?? null
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Anomaly not found.' })
    }

    throw error
  }
})
