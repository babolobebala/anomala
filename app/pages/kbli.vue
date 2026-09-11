<script setup lang="ts">
import KbliAssignmentGroup from '~/components/kbli/KbliAssignmentGroup.vue'
import KbliFilterBar from '~/components/kbli/KbliFilterBar.vue'
import type {
  AssignmentKbliGroup,
  KbliAssignmentStatistics,
  KbliFilterState,
  KbliFindingItem,
  KbliHandlingResponse,
  KbliListResponse
} from '~/types/kbli'

const PAGE_SIZE = 20

const filters = reactive<KbliFilterState>({
  kecamatan: '',
  desa: '',
  namaSls: '',
  ppl: '',
  pml: '',
  kategori: '',
  completionStatus: 'unhandled'
})
const searchInput = ref('')
const committedSearch = ref('')
const page = ref(1)
const expandedData = reactive<Record<string, boolean>>({})
const expandedAssignments = reactive<Record<string, boolean>>({})
const saving = reactive<Record<string, boolean>>({})
const mutationError = ref('')

const listQuery = computed(() => ({
  page: page.value,
  pageSize: PAGE_SIZE,
  search: committedSearch.value || undefined,
  kecamatan: filters.kecamatan || undefined,
  desa: filters.desa || undefined,
  namaSls: filters.namaSls || undefined,
  ppl: filters.ppl || undefined,
  pml: filters.pml || undefined,
  kategori: filters.kategori || undefined,
  completionStatus: filters.completionStatus || undefined
}))

const statisticsQuery = computed(() => ({
  search: committedSearch.value || undefined,
  kecamatan: filters.kecamatan || undefined,
  desa: filters.desa || undefined,
  namaSls: filters.namaSls || undefined,
  ppl: filters.ppl || undefined,
  pml: filters.pml || undefined,
  kategori: filters.kategori || undefined
}))

const {
  data: list,
  status: listStatus,
  error: listError
} = await useFetch<KbliListResponse>('/api/kbli', {
  query: listQuery
})
const {
  data: statistics,
  status: statisticsStatus
} = await useFetch<KbliAssignmentStatistics>('/api/kbli/statistics', {
  query: statisticsQuery
})

const statisticsCards = computed(() => [
  {
    assignmentLabel: 'Total Assignment',
    findingLabel: 'Total KBLI',
    assignments: statistics.value?.total.assignments ?? 0,
    findings: statistics.value?.total.findings ?? 0,
    completionStatus: ''
  },
  {
    assignmentLabel: 'Belum Selesai',
    findingLabel: 'Belum Selesai',
    assignments: statistics.value?.unhandled.assignments ?? 0,
    findings: statistics.value?.unhandled.findings ?? 0,
    completionStatus: 'unhandled'
  },
  {
    assignmentLabel: 'Selesai (Tandai)',
    findingLabel: 'Selesai (Tandai)',
    assignments: statistics.value?.handled.assignments ?? 0,
    findings: statistics.value?.handled.findings ?? 0,
    completionStatus: 'handled'
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
    () => filters.kategori,
    () => filters.completionStatus
  ],
  () => {
    page.value = 1
  }
)

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
})

function updateFilters(nextFilters: KbliFilterState): void {
  Object.assign(filters, nextFilters)
}

function selectCompletionStatus(completionStatus: string): void {
  updateFilters({
    ...filters,
    completionStatus
  })
}

function toggleData(id: string): void {
  expandedData[id] = !expandedData[id]
}

function toggleAssignment(assignmentId: string): void {
  expandedAssignments[assignmentId] = !expandedAssignments[assignmentId]
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}

function recalculateGroupSummary(group: AssignmentKbliGroup): void {
  const unhandled = group.kbli.filter(finding => !finding.isHandled).length

  group.summary.total = group.kbli.length
  group.summary.unhandled = unhandled
  group.summary.handled = group.summary.total - unhandled
}

async function toggleHandling(
  group: AssignmentKbliGroup,
  finding: KbliFindingItem
): Promise<void> {
  if (saving[finding.id]) {
    return
  }

  mutationError.value = ''
  saving[finding.id] = true
  const previous = {
    isHandled: finding.isHandled,
    handledAt: finding.handledAt,
    summary: { ...group.summary }
  }
  const nextIsHandled = !finding.isHandled

  finding.isHandled = nextIsHandled
  finding.handledAt = nextIsHandled ? new Date().toISOString() : null
  recalculateGroupSummary(group)

  try {
    const result = await $fetch<KbliHandlingResponse>(
      `/api/kbli/${finding.id}/handling`,
      {
        method: 'PATCH',
        body: { isHandled: nextIsHandled }
      }
    )

    finding.isHandled = result.isHandled
    finding.handledAt = result.handledAt
  } catch {
    finding.isHandled = previous.isHandled
    finding.handledAt = previous.handledAt
    Object.assign(group.summary, previous.summary)
    mutationError.value
      = 'Status penanganan gagal diperbarui. Perubahan lokal dikembalikan.'
  } finally {
    saving[finding.id] = false
  }
}
</script>

<template>
  <main class="kbli-page">
    <AppNavbar />

    <section
      class="page-heading"
      aria-labelledby="page-title"
    >
      <div>
        <h1 id="page-title">
          Penelusuran KBLI
        </h1>
        <p class="page-heading__description">
          Satu baris untuk satu assignment. Buka detail untuk meninjau dan
          menangani seluruh temuan KBLI.
        </p>
      </div>
    </section>

    <section
      class="statistics-row"
      aria-label="Statistik assignment KBLI"
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
          >{{ formatCount(card.assignments) }}</strong>
        </span>
        <span class="statistics-card__metric statistics-card__metric--kbli">
          <span class="statistics-card__context">KBLI</span>
          <span class="statistics-card__label">{{ card.findingLabel }}</span>
          <USkeleton
            v-if="isStatisticsSkeletonVisible"
            class="statistics-card__value-skeleton"
          />
          <strong
            v-else
            class="statistics-card__value"
          >{{ formatCount(card.findings) }}</strong>
        </span>
      </UButton>
    </section>

    <KbliFilterBar
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
          <strong>Data KBLI tidak dapat dimuat.</strong>
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
          <p>Ubah atau reset filter untuk melihat temuan KBLI lainnya.</p>
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

          <tbody :aria-label="isListSkeletonVisible ? 'Memuat data KBLI' : undefined">
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
                  <USkeleton class="assignment-table__skeleton-secondary" />
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
              <KbliAssignmentGroup
                v-for="group in list?.groups"
                :key="group.assignmentId"
                :group="group"
                :expanded="Boolean(expandedAssignments[group.assignmentId])"
                :saving="saving"
                :expanded-data="expandedData"
                @toggle-assignment="toggleAssignment(group.assignmentId)"
                @toggle-data="toggleData"
                @toggle-handling="toggleHandling(group, $event)"
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
  </main>
</template>

<style scoped>
.kbli-page {
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

.statistics-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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

.statistics-card__metric--kbli {
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

.mutation-error {
  margin: var(--space-4) 0 0;
  padding: var(--space-3);
  border: var(--rule) solid var(--color-error);
  color: var(--color-error);
  font-size: var(--text-sm);
}

.results-section {
  margin-top: var(--space-3);
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

.result-count {
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
  margin-top: var(--space-3);
  padding: var(--space-3) 0;
  color: var(--color-muted);
  font-family: inherit;
  font-size: var(--text-xs);
}

.pagination :deep(button) {
  min-height: 2.5rem;
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
  border: var(--rule) solid var(--color-rule-2);
  border-radius: var(--radius-sm);
  background: var(--color-paper);
}

.assignment-table {
  width: 100%;
  min-width: 70rem;
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--color-ink-2);
  font-size: var(--text-sm);
}

.assignment-table th {
  padding: var(--space-2) var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule-2);
  background: var(--color-paper);
  color: var(--color-ink-2);
  font-family: inherit;
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0;
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

/* Column balance mirrors /anomali: the control columns keep their exact 3rem /
   4.5rem sizing and the data columns keep anomaly's proportions while summing
   to the same 94% total (there is no Eksekutor column), so the fixed columns
   are never stretched. */
.assignment-table th:nth-child(2) {
  width: 13%;
}

.assignment-table th:nth-child(3) {
  width: 14%;
}

.assignment-table th:nth-child(4) {
  width: 24%;
}

.assignment-table th:nth-child(5) {
  width: 28%;
}

.assignment-table th:nth-child(7) {
  width: 15%;
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
}
</style>
