export interface KbliFindingItem {
  id: string
  kbliKey: string
  kategori: string
  data: string
  catatan: string | null
  statusAlias: string | null
  isHandled: boolean
  handledAt: string | null
}

export interface KbliWilayah {
  idSubsls: string
  kecamatan: string
  desa: string
  namaSls: string
  ppl: string
  pml: string
}

export interface AssignmentKbliGroup {
  assignmentId: string
  namaAssignment: string | null
  nomorBangunan: string | null
  idsbr: string | null
  linkFasihEdit: string | null
  statusAlias: string | null
  wilayah: KbliWilayah
  summary: {
    total: number
    handled: number
    unhandled: number
  }
  kbli: KbliFindingItem[]
}

export interface KbliListResponse {
  page: number
  pageSize: number
  totalAssignments: number
  totalPages: number
  groups: AssignmentKbliGroup[]
}

export interface KbliTemuanOption {
  kode: string
  deskripsi: string | null
}

export interface KbliFilterOptions {
  kecamatan: string[]
  desa: string[]
  namaSls: string[]
  ppl: string[]
  pml: string[]
  kategori: KbliTemuanOption[]
}

export interface KbliFilterState {
  kecamatan: string
  desa: string
  namaSls: string
  ppl: string
  pml: string
  kategori: string
  completionStatus: string
}

export interface KbliStatisticsMetric {
  assignments: number
  findings: number
}

export interface KbliAssignmentStatistics {
  total: KbliStatisticsMetric
  unhandled: KbliStatisticsMetric
  handled: KbliStatisticsMetric
}

export interface KbliRecapItem {
  kategori: string
  deskripsi: string | null
  statistics: KbliAssignmentStatistics
}

export interface KbliHandlingResponse {
  id: string
  isHandled: boolean
  handledAt: string | null
}
