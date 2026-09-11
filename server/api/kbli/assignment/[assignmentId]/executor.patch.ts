import { buildKbliHandlingUpsert } from '../../../../utils/kbli-query'
import { prisma } from '../../../../utils/prisma'

interface UpdateAssignmentExecutorBody {
  eksekutorId?: unknown
}

export default defineEventHandler(async (event) => {
  const assignmentId = getRouterParam(event, 'assignmentId')

  if (!assignmentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Assignment id is required.'
    })
  }

  const body = await readBody<UpdateAssignmentExecutorBody>(event)
  const eksekutorId = typeof body?.eksekutorId === 'string'
    ? body.eksekutorId.trim() || null
    : body?.eksekutorId === null
      ? null
      : undefined

  if (eksekutorId === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'eksekutorId must be a string or null.'
    })
  }

  const assignment = await prisma.kbli.findFirst({
    where: { assignmentId },
    select: { id: true }
  })

  if (!assignment) {
    throw createError({ statusCode: 404, statusMessage: 'Assignment not found.' })
  }

  if (eksekutorId) {
    const eksekutor = await prisma.masterEksekutor.findUnique({
      where: { id: eksekutorId },
      select: { id: true }
    })

    if (!eksekutor) {
      throw createError({ statusCode: 400, statusMessage: 'Executor not found.' })
    }
  }

  const handling = await prisma.kbliHandling.upsert({
    ...buildKbliHandlingUpsert(assignmentId, eksekutorId),
    select: {
      assignmentId: true,
      eksekutor: {
        select: { id: true, nama: true }
      }
    }
  })

  return handling
})
