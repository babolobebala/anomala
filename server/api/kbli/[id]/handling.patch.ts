import { Prisma } from '../../../../generated/prisma/client'
import { buildKbliHandlingUpdate } from '../../../utils/kbli-query'
import { prisma } from '../../../utils/prisma'

interface UpdateHandlingBody {
  isHandled?: unknown
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'KBLI id is required.' })
  }

  const body = await readBody<UpdateHandlingBody>(event)

  if (typeof body?.isHandled !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'isHandled must be a boolean.' })
  }

  try {
    const kbli = await prisma.kbli.update({
      where: { id },
      data: buildKbliHandlingUpdate(body.isHandled, new Date()),
      select: {
        id: true,
        isHandled: true,
        handledAt: true
      }
    })

    return {
      id: kbli.id,
      isHandled: kbli.isHandled,
      handledAt: kbli.handledAt?.toISOString() ?? null
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'KBLI finding not found.' })
    }

    throw error
  }
})
