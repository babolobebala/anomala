import { createReport } from 'docx-templates'

export const TIDAK_DITEMUKAN_TEMPLATE_KEY = 'tidak-ditemukan-sls-ppl.docx'

export interface TidakDitemukanDocxInput {
  wilayah: {
    namaSls: string
    desa: string
    kecamatan: string
    ppl: string
    pml: string
  }
  assignments: Array<{ namaAssignment: string }>
}

export function hasTidakDitemukanDocxSource(
  masterSls: TidakDitemukanDocxInput['wilayah'] | null,
  assignments: readonly { namaAssignment: string }[]
): boolean {
  return Boolean(masterSls) && assignments.length > 0
}

export function buildTidakDitemukanTemplateData(input: TidakDitemukanDocxInput) {
  return {
    nama_ppl: input.wilayah.ppl,
    nama_sls: input.wilayah.namaSls,
    desa: input.wilayah.desa,
    kecamatan: input.wilayah.kecamatan,
    // No canonical kabupaten field exists in MasterSls; the template keeps it blank.
    kabupaten: '',
    nama_pml: input.wilayah.pml,
    assignments: input.assignments.map((assignment, index) => ({
      no: index + 1,
      namaAssignment: assignment.namaAssignment
    }))
  }
}

async function loadTidakDitemukanTemplate(): Promise<Buffer> {
  const template = await useStorage('assets:templates').getItemRaw<Uint8Array>(
    TIDAK_DITEMUKAN_TEMPLATE_KEY
  )

  if (!template) {
    throw new Error('Tidak Ditemukan DOCX template is not available in server assets.')
  }

  return Buffer.from(template)
}

export async function generateTidakDitemukanDocx(
  input: TidakDitemukanDocxInput,
  template?: Buffer
): Promise<Buffer> {
  const report = await createReport({
    template: template ?? await loadTidakDitemukanTemplate(),
    data: buildTidakDitemukanTemplateData(input),
    cmdDelimiter: ['{', '}']
  })

  return Buffer.from(report)
}
