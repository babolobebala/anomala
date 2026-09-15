import { prisma } from '../../utils/prisma'
import { serializeTidakDitemukanSnapshot } from '../../utils/tidak-ditemukan-snapshot'

export default defineEventHandler(async () => {
  const snapshot = await prisma.tidakDitemukanWaktuImport.findFirst({
    select: { importedAt: true, namaFile: true, jumlahAssignment: true, jumlahSls: true },
    orderBy: { importedAt: 'desc' }
  })

  return serializeTidakDitemukanSnapshot(snapshot)
})
