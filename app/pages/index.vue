<script setup lang="ts">
import AnomaliAssignmentGroup from '~/components/anomali/AnomaliAssignmentGroup.vue'
import AnomaliFilterBar from '~/components/anomali/AnomaliFilterBar.vue'
import type {
  AnomalyFilterState,
  AnomalyAssignmentStatistics,
  AnomalyListItem,
  AnomalyListResponse,
  AssignmentHandlingResponse,
  AssignmentAnomalyGroup,
  HandlingResponse
} from '~/types/anomali'

const PAGE_SIZE = 20

interface AnomaliImportCounts {
  sourceRows: number
  uniqueRows: number
  duplicateRows: number
  new: number
  existing: number
  reappeared: number
  disappeared: number
  invalidMasterSls: number
  invalidMasterAnomali: number
  conflictingDuplicates: number
}

interface AnomaliImportResult {
  applied: boolean
  valid: boolean
  counts: AnomaliImportCounts
  issues: Array<{ code: string, message: string }>
}

const filters = reactive<AnomalyFilterState>({
  kecamatan: '',
  desa: '',
  namaSls: '',
  ppl: '',
  pml: '',
  kodeAnomali: '',
  isActive: '',
  completionStatus: 'unhandled'
})
const searchInput = ref('')
const committedSearch = ref('')
const page = ref(1)
const expandedData = reactive<Record<string, boolean>>({})
const expandedAssignments = reactive<Record<string, boolean>>({})
const saving = reactive<Record<string, boolean>>({})
const assignmentSaving = reactive<Record<string, boolean>>({})
const mutationError = ref('')
const importModalOpen = ref(false)
const importFile = ref<File | null>(null)
const importPassword = ref('')
const importPreview = ref<AnomaliImportResult | null>(null)
const importError = ref('')
const previewingImport = ref(false)
const applyingImport = ref(false)
const toast = useToast()
const importFileUploadUi = {
  base: 'bg-[var(--color-paper)] border-[var(--color-rule-2)] text-[var(--color-ink-2)] hover:bg-[var(--color-paper-2)]',
  icon: 'text-[var(--color-accent)]',
  label: 'text-[var(--color-ink)]',
  description: 'text-[var(--color-muted)]'
}
const importInputUi = {
  base: 'bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)]',
  leadingIcon: 'text-[var(--color-muted)]',
  trailingIcon: 'text-[var(--color-muted)]'
}

const listQuery = computed(() => ({
  page: page.value,
  pageSize: PAGE_SIZE,
  search: committedSearch.value || undefined,
  kecamatan: filters.kecamatan || undefined,
  desa: filters.desa || undefined,
  namaSls: filters.namaSls || undefined,
  ppl: filters.ppl || undefined,
  pml: filters.pml || undefined,
  kodeAnomali: filters.kodeAnomali || undefined,
  isActive: filters.isActive || undefined,
  completionStatus: filters.completionStatus || undefined
}))

const statisticsQuery = computed(() => ({
  search: committedSearch.value || undefined,
  kecamatan: filters.kecamatan || undefined,
  desa: filters.desa || undefined,
  namaSls: filters.namaSls || undefined,
  ppl: filters.ppl || undefined,
  pml: filters.pml || undefined,
  kodeAnomali: filters.kodeAnomali || undefined,
  isActive: filters.isActive || undefined
}))

const {
  data: list,
  status: listStatus,
  error: listError,
  refresh: refreshList
} = await useFetch<AnomalyListResponse>('/api/anomali', {
  query: listQuery
})
const {
  data: statistics,
  status: statisticsStatus,
  refresh: refreshStatistics
} = await useFetch<AnomalyAssignmentStatistics>('/api/anomali/statistics', {
  query: statisticsQuery
})
const statisticsCards = computed(() => [
  {
    assignmentLabel: 'Total Assignment',
    anomalyLabel: 'Total Anomali',
    assignments: statistics.value?.total.assignments ?? 0,
    anomalies: statistics.value?.total.anomalies ?? 0,
    completionStatus: ''
  },
  {
    assignmentLabel: 'Belum Selesai',
    anomalyLabel: 'Belum Selesai',
    assignments: statistics.value?.unhandled.assignments ?? 0,
    anomalies: statistics.value?.unhandled.anomalies ?? 0,
    completionStatus: 'unhandled'
  },
  {
    assignmentLabel: 'Selesai (Tandai)',
    anomalyLabel: 'Selesai (Tandai)',
    assignments: statistics.value?.handled.assignments ?? 0,
    anomalies: statistics.value?.handled.anomalies ?? 0,
    completionStatus: 'handled'
  },
  {
    assignmentLabel: 'Selesai + Anomali Hilang',
    anomalyLabel: 'Anomali Hilang',
    assignments: statistics.value?.disappeared.assignments ?? 0,
    anomalies: statistics.value?.disappeared.anomalies ?? 0,
    completionStatus: 'disappeared'
  }
])
const isLoading = computed(() => listStatus.value === 'pending')
const isListSkeletonVisible = useDelayedPending(() => isLoading.value)
const isStatisticsSkeletonVisible = useDelayedPending(
  () => statisticsStatus.value === 'pending'
)
const hasGroups = computed(() => (list.value?.groups.length ?? 0) > 0)
const rangeStart = computed(() => {
  if (!list.value || list.value.totalAssignments === 0) {
    return 0
  }

  return (list.value.page - 1) * list.value.pageSize + 1
})
const rangeEnd = computed(() => {
  if (!list.value) {
    return 0
  }

  return Math.min(
    list.value.page * list.value.pageSize,
    list.value.totalAssignments
  )
})

let searchTimer: ReturnType<typeof setTimeout> | undefined

watch(searchInput, (value) => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    committedSearch.value = value.trim()
    page.value = 1
  }, 280)
})

watch(
  [
    () => filters.kecamatan,
    () => filters.desa,
    () => filters.namaSls,
    () => filters.ppl,
    () => filters.pml,
    () => filters.kodeAnomali,
    () => filters.isActive,
    () => filters.completionStatus
  ],
  () => {
    page.value = 1
  }
)

watch([importFile, importPassword], () => {
  importPreview.value = null
  importError.value = ''
})

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
})

function updateFilters(nextFilters: AnomalyFilterState): void {
  Object.assign(filters, nextFilters)
}

function selectCompletionStatus(completionStatus: string): void {
  updateFilters({
    ...filters,
    completionStatus
  })
}

function resetImportForm(): void {
  importFile.value = null
  importPassword.value = ''
  importPreview.value = null
  importError.value = ''
}

function openImportModal(): void {
  resetImportForm()
  importModalOpen.value = true
}

function onImportModalUpdate(isOpen: boolean): void {
  if (!isOpen) {
    resetImportForm()
  }
}

function closeImportModal(): void {
  importModalOpen.value = false
  resetImportForm()
}

function createImportFormData(): FormData | null {
  if (!importFile.value) {
    importError.value = 'Pilih file XLSX terlebih dahulu.'
    return null
  }

  if (!importFile.value.name.toLowerCase().endsWith('.xlsx')) {
    importError.value = 'File import harus berformat XLSX.'
    return null
  }

  const formData = new FormData()
  formData.append('file', importFile.value)
  formData.append('password', importPassword.value)

  return formData
}

function requestErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { statusMessage?: string, message?: string } }).data

    return data?.statusMessage ?? data?.message ?? fallback
  }

  return fallback
}

async function previewImport(): Promise<void> {
  const formData = createImportFormData()

  if (!formData || previewingImport.value) {
    return
  }

  importError.value = ''
  previewingImport.value = true

  try {
    importPreview.value = await $fetch<AnomaliImportResult>('/api/anomali/import/preview', {
      method: 'POST',
      body: formData
    })
  } catch (error) {
    importPreview.value = null
    importError.value = requestErrorMessage(error, 'Preview import gagal dibuat.')
  } finally {
    previewingImport.value = false
  }
}

async function applyImport(): Promise<void> {
  const formData = createImportFormData()

  if (!formData || !importPreview.value?.valid || applyingImport.value) {
    return
  }

  importError.value = ''
  applyingImport.value = true

  try {
    const result = await $fetch<AnomaliImportResult>('/api/anomali/import/apply', {
      method: 'POST',
      body: formData
    })

    if (!result.valid || !result.applied) {
      importPreview.value = result
      return
    }

    page.value = 1
    await Promise.all([refreshList(), refreshStatistics()])
    toast.add({
      title: 'Import anomali berhasil',
      description: `${formatImportCount(result.counts.new)} baru, ${formatImportCount(result.counts.disappeared)} hilang oleh sistem.`,
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    closeImportModal()
  } catch (error) {
    importError.value = requestErrorMessage(error, 'Import data gagal dilakukan.')
  } finally {
    applyingImport.value = false
  }
}

function formatImportCount(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}

function toggleData(id: string): void {
  expandedData[id] = !expandedData[id]
}

function toggleAssignment(assignmentId: string): void {
  expandedAssignments[assignmentId] = !expandedAssignments[assignmentId]
}

async function toggleHandling(
  group: AssignmentAnomalyGroup,
  anomaly: AnomalyListItem
): Promise<void> {
  if (!anomaly.isActive || saving[anomaly.id]) {
    return
  }

  mutationError.value = ''
  saving[anomaly.id] = true
  const previous = {
    isHandled: anomaly.isHandled,
    handledAt: anomaly.handledAt,
    handled: group.summary.handled,
    unhandled: group.summary.unhandled
  }
  const nextIsHandled = !anomaly.isHandled

  anomaly.isHandled = nextIsHandled
  anomaly.handledAt = nextIsHandled ? new Date().toISOString() : null
  group.summary.handled += nextIsHandled ? 1 : -1
  group.summary.unhandled += nextIsHandled ? -1 : 1

  try {
    const result = await $fetch<HandlingResponse>(
      `/api/anomali/${anomaly.id}/handling`,
      {
        method: 'PATCH',
        body: { isHandled: nextIsHandled }
      }
    )

    anomaly.isHandled = result.isHandled
    anomaly.handledAt = result.handledAt
    await refreshStatistics()
  } catch {
    anomaly.isHandled = previous.isHandled
    anomaly.handledAt = previous.handledAt
    group.summary.handled = previous.handled
    group.summary.unhandled = previous.unhandled
    mutationError.value
      = 'Status penanganan gagal diperbarui. Perubahan lokal dikembalikan.'
  } finally {
    saving[anomaly.id] = false
  }
}

async function toggleAssignmentHandling(
  group: AssignmentAnomalyGroup
): Promise<void> {
  if (assignmentSaving[group.assignmentId]) {
    return
  }

  mutationError.value = ''
  assignmentSaving[group.assignmentId] = true
  const activeAnomalies = group.anomalies.filter(anomaly => anomaly.isActive)

  if (activeAnomalies.length === 0) {
    assignmentSaving[group.assignmentId] = false
    return
  }

  const nextIsHandled = activeAnomalies.some(anomaly => !anomaly.isHandled)

  try {
    const result = await $fetch<AssignmentHandlingResponse>(
      `/api/anomali/assignment/${encodeURIComponent(group.assignmentId)}/handling`,
      {
        method: 'PATCH',
        body: { isHandled: nextIsHandled }
      }
    )

    for (const anomaly of activeAnomalies) {
      anomaly.isHandled = result.isHandled
      anomaly.handledAt = result.handledAt
    }

    group.summary.handled = result.isHandled ? group.summary.total : group.summary.inactive
    group.summary.unhandled = result.isHandled ? 0 : group.summary.active
    await refreshStatistics()
  } catch {
    mutationError.value
      = 'Status penanganan assignment gagal diperbarui. Coba lagi.'
  } finally {
    assignmentSaving[group.assignmentId] = false
  }
}
</script>

<template>
  <main class="anomali-page">
    <section
      class="page-heading"
      aria-labelledby="page-title"
    >
      <div>
        <h1 id="page-title">
          Penanganan Anomali
        </h1>
        <p class="page-heading__description">
          Satu baris untuk satu assignment. Buka detail untuk meninjau dan
          menangani seluruh anomalinya.
        </p>
      </div>
      <UButton
        label="Import XLSX"
        icon="i-lucide-upload"
        color="neutral"
        variant="outline"
        size="sm"
        @click="openImportModal"
      />
    </section>

    <section
      class="statistics-row"
      aria-label="Statistik assignment anomali"
    >
      <UButton
        v-for="card in statisticsCards"
        :key="card.assignmentLabel"
        color="neutral"
        variant="outline"
        class="statistics-card"
        :class="{
          'statistics-card--active': filters.completionStatus === card.completionStatus
        }"
        :aria-pressed="filters.completionStatus === card.completionStatus"
        @click="selectCompletionStatus(card.completionStatus)"
      >
        <span class="statistics-card__metric">
          <span class="statistics-card__context">Assignment</span>
          <span class="statistics-card__label">{{ card.assignmentLabel }}</span>
          <USkeleton
            v-if="isStatisticsSkeletonVisible"
            class="statistics-card__value-skeleton"
          />
          <strong
            v-else
            class="statistics-card__value"
          >{{ formatImportCount(card.assignments) }}</strong>
        </span>
        <span class="statistics-card__metric statistics-card__metric--anomaly">
          <span class="statistics-card__context">Anomali</span>
          <span class="statistics-card__label">{{ card.anomalyLabel }}</span>
          <USkeleton
            v-if="isStatisticsSkeletonVisible"
            class="statistics-card__value-skeleton"
          />
          <strong
            v-else
            class="statistics-card__value"
          >{{ formatImportCount(card.anomalies) }}</strong>
        </span>
      </UButton>
    </section>

    <AnomaliFilterBar
      :filters="filters"
      :search="searchInput"
      :total-assignments="list?.totalAssignments ?? 0"
      @update:filters="updateFilters"
      @update:search="searchInput = $event"
    />

    <p
      v-if="mutationError"
      class="mutation-error"
      role="alert"
    >
      {{ mutationError }}
    </p>

    <section
      class="results-section"
      aria-live="polite"
      :aria-busy="isLoading"
    >
      <div class="results-toolbar">
        <p
          v-if="isListSkeletonVisible"
          class="result-count"
        >
          <USkeleton class="result-count__skeleton" />
        </p>
        <p
          v-else-if="list"
          class="result-count"
        >
          Menampilkan {{ rangeStart }}–{{ rangeEnd }} dari
          {{ list.totalAssignments }} assignment
        </p>
      </div>

      <div
        v-if="listError"
        class="empty-state"
        role="alert"
      >
        <span
          class="empty-state__icon"
          aria-hidden="true"
        >!</span>
        <div>
          <strong>Data anomali tidak dapat dimuat.</strong>
          <p>Periksa koneksi database, lalu muat ulang halaman.</p>
        </div>
      </div>

      <div
        v-else-if="!hasGroups && !isLoading"
        class="empty-state"
      >
        <span
          class="empty-state__icon"
          aria-hidden="true"
        >0</span>
        <div>
          <strong>Tidak ada assignment yang cocok.</strong>
          <p>Ubah atau reset filter untuk melihat anomali lainnya.</p>
        </div>
      </div>

      <div
        v-else
        class="table-scroll"
      >
        <table class="assignment-table">
          <thead>
            <tr>
              <th
                scope="col"
                class="assignment-table__toggle"
              >
                <span class="visually-hidden">Detail</span>
              </th>
              <th scope="col">
                SLS
              </th>
              <th scope="col">
                Wilayah
              </th>
              <th scope="col">
                Assignment
              </th>
              <th scope="col">
                Detail assignment
              </th>
              <th
                scope="col"
                class="assignment-table__fasih"
              >
                FASIH
              </th>
              <th scope="col">
                Penanganan
              </th>
            </tr>
          </thead>
          <tbody :aria-label="isListSkeletonVisible ? 'Memuat data anomali' : undefined">
            <template v-if="isListSkeletonVisible">
              <tr
                v-for="index in 7"
                :key="index"
                class="assignment-table__skeleton-row"
              >
                <td class="assignment-table__skeleton-toggle">
                  <USkeleton class="assignment-table__skeleton-icon" />
                </td>
                <td>
                  <USkeleton class="assignment-table__skeleton-primary" />
                  <USkeleton class="assignment-table__skeleton-secondary" />
                </td>
                <td>
                  <USkeleton class="assignment-table__skeleton-primary" />
                  <USkeleton class="assignment-table__skeleton-secondary" />
                </td>
                <td>
                  <USkeleton class="assignment-table__skeleton-primary assignment-table__skeleton-primary--wide" />
                </td>
                <td>
                  <USkeleton class="assignment-table__skeleton-badge" />
                  <USkeleton class="assignment-table__skeleton-secondary assignment-table__skeleton-secondary--wide" />
                </td>
                <td class="assignment-table__skeleton-fasih">
                  <USkeleton class="assignment-table__skeleton-icon" />
                </td>
                <td>
                  <USkeleton class="assignment-table__skeleton-primary assignment-table__skeleton-primary--short" />
                  <USkeleton class="assignment-table__skeleton-action" />
                </td>
              </tr>
            </template>
            <template v-else>
              <AnomaliAssignmentGroup
                v-for="group in list?.groups"
                :key="group.assignmentId"
                :group="group"
                :expanded="Boolean(expandedAssignments[group.assignmentId])"
                :saving="saving"
                :saving-assignment="Boolean(assignmentSaving[group.assignmentId])"
                :expanded-data="expandedData"
                @toggle-assignment="toggleAssignment(group.assignmentId)"
                @toggle-data="toggleData"
                @toggle-handling="toggleHandling(group, $event)"
                @toggle-assignment-handling="toggleAssignmentHandling(group)"
              />
            </template>
          </tbody>
        </table>
      </div>

      <nav
        v-if="list && list.totalPages > 1"
        class="pagination"
        aria-label="Halaman assignment"
      >
        <UButton
          label="Sebelumnya"
          color="neutral"
          variant="outline"
          :disabled="list.page === 1"
          @click="page = list.page - 1"
        />
        <span>Halaman {{ list.page }} / {{ list.totalPages }}</span>
        <UButton
          label="Berikutnya"
          color="neutral"
          variant="outline"
          :disabled="list.page === list.totalPages"
          @click="page = list.page + 1"
        />
      </nav>
    </section>

    <UModal
      v-model:open="importModalOpen"
      title="Import XLSX Anomali"
      description="Unggah snapshot terbaru untuk melihat rekonsiliasi sebelum diimpor."
      :ui="{
        content: 'import-modal bg-[var(--color-paper)] text-[var(--color-ink-2)]',
        header: 'border-b border-[var(--color-rule)] bg-[var(--color-paper)]',
        title: 'text-[var(--color-ink)]',
        description: 'text-[var(--color-muted)]',
        body: 'bg-[var(--color-paper)] p-0',
        footer: 'border-t border-[var(--color-rule)] bg-[var(--color-paper)] p-0'
      }"
      @update:open="onImportModalUpdate"
    >
      <template #body>
        <div class="import-form">
          <label
            class="import-field"
            for="anomali-import-file"
          >
            <span>File XLSX</span>
            <UFileUpload
              id="anomali-import-file"
              v-model="importFile"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :file-image="false"
              :dropzone="false"
              :ui="importFileUploadUi"
              label="Pilih file XLSX"
              description="File diproses sementara dan tidak disimpan."
            />
          </label>

          <label
            class="import-field"
            for="anomali-import-password"
          >
            <span>Password import</span>
            <UInput
              id="anomali-import-password"
              v-model="importPassword"
              type="password"
              autocomplete="current-password"
              :ui="importInputUi"
              placeholder="Masukkan password"
            />
          </label>

          <p
            v-if="importError"
            class="import-message import-message--error"
            role="alert"
          >
            {{ importError }}
          </p>

          <template v-if="importPreview">
            <div
              class="import-preview"
              :class="{ 'import-preview--invalid': !importPreview.valid }"
            >
              <div class="import-preview__header">
                <strong>{{ importPreview.valid ? 'Ringkasan rekonsiliasi' : 'Import belum dapat dilakukan' }}</strong>
                <span>{{ importPreview.valid ? 'Siap diimpor' : 'Perbaiki temuan berikut' }}</span>
              </div>
              <div class="import-preview__grid">
                <div><strong>{{ formatImportCount(importPreview.counts.sourceRows) }}</strong><span>Baris sumber</span></div>
                <div><strong>{{ formatImportCount(importPreview.counts.uniqueRows) }}</strong><span>Anomali unik</span></div>
                <div><strong>{{ formatImportCount(importPreview.counts.new) }}</strong><span>Baru</span></div>
                <div><strong>{{ formatImportCount(importPreview.counts.existing) }}</strong><span>Tetap</span></div>
                <div><strong>{{ formatImportCount(importPreview.counts.reappeared) }}</strong><span>Muncul kembali</span></div>
                <div><strong>{{ formatImportCount(importPreview.counts.disappeared) }}</strong><span>Hilang oleh sistem</span></div>
                <div><strong>{{ formatImportCount(importPreview.counts.duplicateRows) }}</strong><span>Duplikat</span></div>
                <div><strong>{{ formatImportCount(importPreview.counts.invalidMasterSls) }}</strong><span>Master SLS tidak ditemukan</span></div>
                <div><strong>{{ formatImportCount(importPreview.counts.invalidMasterAnomali) }}</strong><span>Master Anomali tidak ditemukan</span></div>
                <div><strong>{{ formatImportCount(importPreview.counts.conflictingDuplicates) }}</strong><span>Konflik</span></div>
              </div>
              <ul
                v-if="importPreview.issues.length"
                class="import-preview__issues"
              >
                <li
                  v-for="issue in importPreview.issues.slice(0, 3)"
                  :key="issue.code"
                >
                  {{ issue.message }}
                </li>
              </ul>
            </div>
          </template>
        </div>
      </template>

      <template #footer>
        <div class="import-actions">
          <UButton
            label="Batal"
            color="neutral"
            variant="ghost"
            :disabled="previewingImport || applyingImport"
            @click="closeImportModal"
          />
          <UButton
            v-if="importPreview?.valid"
            label="Import Data"
            icon="i-lucide-upload"
            :loading="applyingImport"
            :disabled="previewingImport"
            @click="applyImport"
          />
          <UButton
            v-else
            label="Preview Import"
            icon="i-lucide-file-search"
            :loading="previewingImport"
            :disabled="applyingImport"
            @click="previewImport"
          />
        </div>
      </template>
    </UModal>
  </main>
</template>

<style scoped>
.anomali-page {
  width: min(100%, 112rem);
  margin-inline: auto;
  padding: clamp(var(--space-3), 2vw, var(--space-6));
}

.page-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule);
}

.page-heading h1 {
  margin: 0;
  color: var(--color-ink);
  font-family: inherit;
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
}

.page-heading__description {
  max-width: 52rem;
  margin: var(--space-2) 0 0;
  color: var(--color-muted);
  font-size: var(--text-sm);
  line-height: 1.45;
}

.page-heading :deep(button) {
  flex: 0 0 auto;
  margin-top: var(--space-1);
}

.statistics-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.statistics-card {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  min-height: 5.25rem;
  padding: 0;
  border-color: var(--color-rule-2);
  background: var(--color-paper);
  color: var(--color-ink-2);
  text-align: start;
}

.statistics-card__metric {
  display: grid;
  min-width: 0;
  align-content: center;
  gap: 0.2rem;
  padding: var(--space-2) var(--space-3);
}

.statistics-card__metric--anomaly {
  border-left: var(--rule) solid var(--color-rule-2);
}

.statistics-card:hover {
  border-color: var(--color-accent);
  background: var(--color-paper-2);
}

.statistics-card--active {
  border-color: var(--color-accent);
  background: var(--color-paper-2);
}

.statistics-card__label {
  color: var(--color-muted);
  font-size: var(--text-2xs);
  font-weight: 500;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.statistics-card__context {
  color: var(--color-muted);
  font-size: var(--text-2xs);
  font-weight: 600;
  letter-spacing: 0.05em;
  line-height: 1.2;
  text-transform: uppercase;
}

.statistics-card__value {
  color: var(--color-ink);
  font-size: var(--text-xl);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.statistics-card__value-skeleton {
  width: 3.5rem;
  height: 1.25rem;
}

.import-form {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
}

.import-field {
  display: grid;
  gap: var(--space-2);
  color: var(--color-ink);
  font-size: var(--text-sm);
  font-weight: 500;
}

.import-message {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.import-message--error {
  border: var(--rule) solid var(--color-error);
  color: var(--color-error);
}

.import-preview {
  border: var(--rule) solid var(--color-rule-2);
}

.import-preview--invalid {
  border-color: var(--color-error);
}

.import-preview__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule-2);
  color: var(--color-ink);
  font-size: var(--text-sm);
}

.import-preview__header span {
  color: var(--color-muted);
  font-size: var(--text-xs);
}

.import-preview__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.import-preview__grid div {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-3);
  border-right: var(--rule) solid var(--color-rule-2);
  border-bottom: var(--rule) solid var(--color-rule-2);
}

.import-preview__grid div:nth-child(2n) {
  border-right: 0;
}

.import-preview__grid div:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.import-preview__grid strong {
  color: var(--color-ink);
  font-size: var(--text-lg);
  font-variant-numeric: tabular-nums;
}

.import-preview__grid span {
  color: var(--color-muted);
  font-size: var(--text-xs);
  line-height: 1.3;
}

.import-preview__issues {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: var(--space-3) var(--space-3) var(--space-3) 2rem;
  border-top: var(--rule) solid var(--color-rule-2);
  color: var(--color-error);
  font-size: var(--text-xs);
}

.import-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  width: 100%;
}

.page-heading__readout {
  margin: 0;
  color: var(--color-accent);
  font-family: inherit;
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.mutation-error {
  margin: var(--space-4) 0 0;
  padding: var(--space-3);
  border: var(--rule) solid var(--color-error);
  color: var(--color-error);
  font-size: var(--text-sm);
}

.results-section {
  margin-top: var(--space-4);
}

.results-toolbar,
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.results-toolbar {
  margin-bottom: var(--space-2);
}

.result-count,
.result-hint {
  margin: 0;
  color: var(--color-muted);
  font-family: inherit;
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
}

.result-count__skeleton {
  width: 14rem;
  height: 0.875rem;
}

.pagination {
  align-items: center;
  margin-top: var(--space-3);
  padding: var(--space-3) 0;
  color: var(--color-muted);
  font-family: inherit;
  font-size: var(--text-xs);
}

.pagination :deep(button) {
  white-space: nowrap;
}

.empty-state {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  border: var(--rule) solid var(--color-rule);
  background: var(--color-paper);
  color: var(--color-ink-2);
}

.empty-state__icon {
  display: grid;
  width: 2rem;
  height: 2rem;
  flex: 0 0 auto;
  place-items: center;
  border: var(--rule) solid var(--color-rule-2);
  border-radius: var(--radius-sm);
  color: var(--color-accent);
  font-family: inherit;
}

.empty-state strong {
  color: var(--color-ink);
  font-size: var(--text-sm);
}

.empty-state p {
  margin: var(--space-1) 0 0;
  color: var(--color-muted);
  font-size: var(--text-sm);
}

.table-scroll {
  overflow-x: auto;
  border: var(--rule) solid var(--color-rule);
  background: var(--color-paper);
}

.assignment-table {
  width: 100%;
  min-width: 66rem;
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--color-ink-2);
  font-size: var(--text-sm);
}

.assignment-table th {
  padding: var(--space-2) var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule-2);
  background: var(--color-paper-2);
  color: var(--color-muted);
  font-family: inherit;
  font-size: var(--text-2xs);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-align: start;
  white-space: nowrap;
}

.assignment-table__toggle {
  width: 3rem;
}

.assignment-table__fasih {
  width: 4.5rem;
  text-align: center;
}

.page-heading {
  align-items: flex-start;
  padding-bottom: var(--space-2);
}

.page-heading h1 {
  font-size: var(--text-xl);
  letter-spacing: -0.02em;
}

.page-heading__description {
  margin-top: var(--space-1);
  font-size: var(--text-xs);
}

.results-section {
  margin-top: var(--space-3);
}

.results-toolbar {
  margin-bottom: var(--space-2);
}

.table-scroll {
  border-color: var(--color-rule-2);
  border-radius: var(--radius-sm);
}

.assignment-table th {
  padding: var(--space-2) var(--space-3);
  background: var(--color-paper);
  color: var(--color-ink-2);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0;
}

.assignment-table th:nth-child(2) {
  width: 11%;
}

.assignment-table th:nth-child(3) {
  width: 12%;
}

.assignment-table th:nth-child(4) {
  width: 20%;
}

.assignment-table th:nth-child(5) {
  width: 24%;
}

.assignment-table th:nth-child(7) {
  width: 13%;
}

.pagination :deep(button) {
  min-height: 2.5rem;
}

.assignment-table__skeleton-row td {
  height: 3.875rem;
  padding: 0.625rem var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule);
  vertical-align: middle;
}

.assignment-table__skeleton-toggle,
.assignment-table__skeleton-fasih {
  text-align: center;
}

.assignment-table__skeleton-row :deep(.animate-pulse) {
  background: var(--color-paper-2);
}

.assignment-table__skeleton-primary,
.assignment-table__skeleton-secondary,
.assignment-table__skeleton-badge,
.assignment-table__skeleton-action {
  display: block;
}

.assignment-table__skeleton-primary {
  width: 70%;
  height: 0.75rem;
}

.assignment-table__skeleton-primary--wide {
  width: 84%;
}

.assignment-table__skeleton-primary--short {
  width: 45%;
}

.assignment-table__skeleton-secondary {
  width: 45%;
  height: 0.625rem;
  margin-top: 0.375rem;
}

.assignment-table__skeleton-secondary--wide {
  width: 72%;
}

.assignment-table__skeleton-badge {
  width: 4.5rem;
  height: 1.25rem;
}

.assignment-table__skeleton-action {
  width: 6.5rem;
  height: 0.625rem;
  margin-top: 0.375rem;
}

.assignment-table__skeleton-icon {
  width: 2.25rem;
  height: 2.25rem;
  margin-inline: auto;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 39.99rem) {
  .statistics-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .page-heading,
  .results-toolbar,
  .pagination {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-hint {
    display: none;
  }

  .import-preview__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
