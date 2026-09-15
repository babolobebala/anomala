export interface TidakDitemukanSnapshotRecord {
  importedAt: Date
  namaFile: string
  jumlahAssignment: number
  jumlahSls: number
}

export function serializeTidakDitemukanSnapshot(snapshot: TidakDitemukanSnapshotRecord | null) {
  return snapshot && { ...snapshot, importedAt: snapshot.importedAt.toISOString() }
}
