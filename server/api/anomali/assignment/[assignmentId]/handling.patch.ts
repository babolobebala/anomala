import { activeAssignmentHandlingWhere } from '../../../../utils/anomali-query'
import { prisma } from '../../../../utils/prisma'

interface UpdateAssignmentHandlingBody {
  isHandled?: unknown
}

export default defineEventHandler(async (event) => {
  const assignmentId = getRouterParam(event, 'assignmentId')

  if (!assignmentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Assignment id is required.'
    })
  }

  const body = await readBody<UpdateAssignmentHandlingBody>(event)

  if (typeof body?.isHandled !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'isHandled must be a boolean.'
    })
  }

  const handledAt = body.isHandled ? new Date() : null
  const result = await prisma.anomali.updateMany({
    where: body.isHandled
      ? activeAssignmentHandlingWhere(assignmentId)
      : {
          assignmentId,
          isActive: true,
          isHandled: true,
          isSesuaiLapangan: false
        },
    data: {
      isHandled: body.isHandled,
      handledAt
    }
  })

  if (result.count === 0) {
    const assignment = await prisma.anomali.findFirst({
      where: { assignmentId },
      select: { id: true }
    })

    if (!assignment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Assignment not found.'
      })
    }
  }

  return {
    assignmentId,
    isHandled: body.isHandled,
    handledAt: handledAt?.toISOString() ?? null,
    updatedCount: result.count
  }
})
