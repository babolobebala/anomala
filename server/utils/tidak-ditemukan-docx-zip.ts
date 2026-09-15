export const MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS = 100

export class TidakDitemukanDocxZipRequestError extends Error {}

export function parseTidakDitemukanDocxZipIds(body: unknown): string[] {
  if (!body || typeof body !== 'object' || !Array.isArray((body as { idSubsls?: unknown }).idSubsls)) {
    throw new TidakDitemukanDocxZipRequestError('idSubsls must be an array.')
  }

  const suppliedIds = (body as { idSubsls: unknown[] }).idSubsls

  if (suppliedIds.length === 0) {
    throw new TidakDitemukanDocxZipRequestError('At least one idSubsls is required.')
  }

  if (suppliedIds.length > MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS) {
    throw new TidakDitemukanDocxZipRequestError(
      `A ZIP download can contain at most ${MAX_TIDAK_DITEMUKAN_DOCX_ZIP_SLS} SLS.`
    )
  }

  const ids: string[] = []
  const seen = new Set<string>()

  for (const value of suppliedIds) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new TidakDitemukanDocxZipRequestError('Each idSubsls must be a non-empty string.')
    }

    const idSubsls = value.trim()
    if (!seen.has(idSubsls)) {
      seen.add(idSubsls)
      ids.push(idSubsls)
    }
  }

  return ids
}
