export interface TidakDitemukanWilayah {
  idSubsls: string
  kecamatan: string
  desa: string
  namaSls: string
  ppl: string
  pml: string
}

export interface TidakDitemukanSlsGroup {
  idSubsls: string
  wilayah: TidakDitemukanWilayah
  isSelesai: boolean
  selesaiAt: string | null
  assignments: Array<{ id: string, namaAssignment: string }>
}

export interface TidakDitemukanListResponse {
  page: number
  pageSize: number
  totalSls: number
  totalPages: number
  groups: TidakDitemukanSlsGroup[]
}

export interface TidakDitemukanFilterOptions {
  kecamatan: string[]
  desa: string[]
  namaSls: string[]
  ppl: string[]
  pml: string[]
}

export interface TidakDitemukanFilterState {
  kecamatan: string
  desa: string
  namaSls: string
  ppl: string
  pml: string
  completionStatus: '' | 'unresolved' | 'completed'
}

export interface TidakDitemukanSnapshot {
  importedAt: string
  namaFile: string
  jumlahAssignment: number
  jumlahSls: number
}
