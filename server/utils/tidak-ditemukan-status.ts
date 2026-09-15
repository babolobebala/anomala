export interface TidakDitemukanStatusRecord {
  isSelesai: boolean
  selesaiAt: Date | null
}

export function isTidakDitemukanSelesai(status?: TidakDitemukanStatusRecord | null): boolean {
  return status?.isSelesai === true
}

export function buildTidakDitemukanSelesaiData(now: Date) {
  return { isSelesai: true, selesaiAt: now }
}

export function shouldDeleteTidakDitemukanStatus(isSelesai: boolean): boolean {
  return !isSelesai
}
