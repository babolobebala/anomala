import { createHash } from 'node:crypto'

/**
 * Produces the canonical DATA representation used both for storage and keying.
 * It intentionally preserves case, content order, and interior whitespace.
 */
export function normalizeAnomalyData(value: unknown): string {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .trim()
}

function lengthPrefixed(value: string): string {
  return `${Buffer.byteLength(value, 'utf8')}:${value}`
}

export function createAnomalyKey(
  assignmentId: string,
  kodeAnomali: string,
  data: unknown
): string {
  const normalizedData = normalizeAnomalyData(data)
  const payload = [assignmentId, kodeAnomali, normalizedData]
    .map(lengthPrefixed)
    .join('|')

  return createHash('sha256').update(payload, 'utf8').digest('hex')
}
