import JSZip from 'jszip'
import {
  generateTidakDitemukanDocx,
  hasTidakDitemukanDocxSource
} from '../../services/tidak-ditemukan-docx'
import { prisma } from '../../utils/prisma'
import {
  TidakDitemukanDocxZipRequestError,
  parseTidakDitemukanDocxZipIds
} from '../../utils/tidak-ditemukan-docx-zip'
import { buildTidakDitemukanDocxFilename } from '../../utils/tidak-ditemukan-docx-filename'

export default defineEventHandler(async (event) => {
  let idSubslsValues: string[]

  try {
    idSubslsValues = parseTidakDitemukanDocxZipIds(await readBody(event))
  } catch (error) {
    if (error instanceof TidakDitemukanDocxZipRequestError) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }
    throw error
  }

  const [assignments, masterSlsValues] = await Promise.all([
    prisma.tidakDitemukanAssignment.findMany({
      where: { idSubsls: { in: idSubslsValues } },
      select: { idSubsls: true, namaAssignment: true, sumber: true },
      orderBy: [{ idSubsls: 'asc' }, { namaAssignment: 'asc' }, { id: 'asc' }]
    }),
    prisma.masterSls.findMany({
      where: { idSubsls: { in: idSubslsValues } },
      select: { idSubsls: true, namaSls: true, desa: true, kecamatan: true, ppl: true, pml: true }
    })
  ])

  const assignmentsBySls = new Map<string, Array<{ namaAssignment: string, sumber: string | null }>>()
  for (const assignment of assignments) {
    assignmentsBySls.set(assignment.idSubsls, [
      ...(assignmentsBySls.get(assignment.idSubsls) ?? []),
      { namaAssignment: assignment.namaAssignment, sumber: assignment.sumber }
    ])
  }
  const masterSlsById = new Map(masterSlsValues.map(masterSls => [masterSls.idSubsls, masterSls]))

  const sources = idSubslsValues.map((idSubsls) => {
    const masterSls = masterSlsById.get(idSubsls)
    const slsAssignments = assignmentsBySls.get(idSubsls) ?? []

    if (!hasTidakDitemukanDocxSource(masterSls ?? null, slsAssignments)) {
      throw createError({
        statusCode: 404,
        statusMessage: `Tidak Ditemukan SLS ${idSubsls} not found in the active snapshot.`
      })
    }

    return { idSubsls, masterSls: masterSls!, assignments: slsAssignments }
  })

  const zip = new JSZip()
  for (const source of sources) {
    const report = await generateTidakDitemukanDocx({
      wilayah: source.masterSls,
      assignments: source.assignments
    })
    zip.file(buildTidakDitemukanDocxFilename({ idSubsls: source.idSubsls, ...source.masterSls }), report)
  }

  const archive = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  })

  setHeader(event, 'content-type', 'application/zip')
  setHeader(event, 'content-disposition', `attachment; filename="Tidak Ditemukan - ${sources.length} SLS.zip"`)
  return archive
})
