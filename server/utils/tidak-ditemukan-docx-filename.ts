interface TidakDitemukanDocxFilenameSource {
  idSubsls: string
  kecamatan: string | null | undefined
  desa: string | null | undefined
  ppl: string | null | undefined
  pml: string | null | undefined
}

function filenamePart(value: string | null | undefined): string {
  return value
    ?.trim()
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, '-')
    .replace(/\s+/g, ' ')
    || '-'
}

export function buildTidakDitemukanDocxFilename(source: TidakDitemukanDocxFilenameSource): string {
  return [source.kecamatan, source.desa, source.idSubsls, source.ppl, source.pml]
    .map(filenamePart)
    .join(' - ')
    .concat('.docx')
}
