import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  return prisma.masterEksekutor.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: 'asc' }
  })
})
