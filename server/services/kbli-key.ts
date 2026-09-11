import { createDeterministicImportKey, normalizeImportData } from './anomali-key'

/**
 * Produces the canonical DATA representation used both for KBLI storage and
 * deterministic identity keying.
 */
export function normalizeKbliData(value: unknown): string {
  return normalizeImportData(value)
}

export function createKbliKey(
  assignmentId: string,
  kategori: string,
  data: unknown
): string {
  return createDeterministicImportKey([
    assignmentId,
    kategori,
    normalizeKbliData(data)
  ])
}
