export interface AnomalyListItem {
  id: string
  anomalyKey: string
  kodeAnomali: string
  deskripsi: string
  data: string
  catatan: string | null
  statusAlias: string | null
  isActive: boolean
  isHandled: boolean
  handledAt: string | null
  handlingNote: string | null
  isSesuaiLapangan: boolean
  sesuaiLapanganAt: string | null
}

export interface AssignmentAnomalyGroup {
  assignmentId: string
  namaAssignment: string | null
  nomorBangunan: string | null
  idsbr: string | null
  linkFasihEdit: string | null
  statusAlias: string | null
  executor: ExecutorOption | null
  wilayah: {
    idSubsls: string
    kecamatan: string
    desa: string
    namaSls: string
    ppl: string
    pml: string
  }
  summary: {
    total: number
    handled: number
    unhandled: number
    active: number
    inactive: number
  }
  anomalies: AnomalyListItem[]
}

export interface AnomalyListResponse {
  page: number
  pageSize: number
  totalAssignments: number
  totalPages: number
  groups: AssignmentAnomalyGroup[]
}

export interface AnomalyFilterOptions {
  kecamatan: string[]
  desa: string[]
  namaSls: string[]
  ppl: string[]
  pml: string[]
  anomalyCodes: Array<{
    kodeAnomali: string
    deskripsi: string
  }>
}

export interface AnomalyFilterState {
  kecamatan: string
  desa: string
  namaSls: string
  ppl: string
  pml: string
  kodeAnomali: string
  isActive: string
  completionStatus: string
}

export interface AnomalyStatisticsMetric {
  assignments: number
  anomalies: number
}

export interface AnomalyAssignmentStatistics {
  total: AnomalyStatisticsMetric
  unhandled: AnomalyStatisticsMetric
  handled: AnomalyStatisticsMetric
  disappeared: AnomalyStatisticsMetric
}

export interface AnomalyRecapItem {
  kodeAnomali: string
  deskripsi: string
  statistics: AnomalyAssignmentStatistics
}

export interface HandlingResponse {
  id: string
  isHandled: boolean
  handledAt: string | null
}

export interface FieldConditionResponse {
  id: string
  isSesuaiLapangan: boolean
  sesuaiLapanganAt: string | null
}

export interface ExecutorOption {
  id: string
  nama: string
}

export interface AssignmentExecutorResponse {
  assignmentId: string
  eksekutor: ExecutorOption | null
}

export interface AssignmentHandlingResponse {
  assignmentId: string
  isHandled: boolean
  handledAt: string | null
  updatedCount: number
}
