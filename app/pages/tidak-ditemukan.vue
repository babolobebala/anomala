<script setup lang="ts">
import TidakDitemukanFilterBar from '~/components/tidak-ditemukan/TidakDitemukanFilterBar.vue'
import TidakDitemukanSlsGroupRow from '~/components/tidak-ditemukan/TidakDitemukanSlsGroup.vue'
import type {
  TidakDitemukanFilterState,
  TidakDitemukanListResponse,
  TidakDitemukanSlsGroup,
  TidakDitemukanSnapshot
} from '~/types/tidak-ditemukan'

const PAGE_SIZE = 20
const filters = reactive<TidakDitemukanFilterState>({
  kecamatan: '',
  desa: '',
  namaSls: '',
  ppl: '',
  pml: '',
  completionStatus: ''
})
const searchInput = ref('')
const committedSearch = ref('')
const page = ref(1)
const expanded = reactive<Record<string, boolean>>({})
const saving = reactive<Record<string, boolean>>({})
const mutationError = ref('')
const downloadingZip = ref(false)

const listQuery = computed(() => ({
  page: page.value,
  pageSize: PAGE_SIZE,
  search: committedSearch.value || undefined,
  kecamatan: filters.kecamatan || undefined,
  desa: filters.desa || undefined,
  namaSls: filters.namaSls || undefined,
  ppl: filters.ppl || undefined,
  pml: filters.pml || undefined,
  completionStatus: filters.completionStatus || undefined
}))
const {
  data: list,
  status: listStatus,
  error: listError
} = await useFetch<TidakDitemukanListResponse>('/api/tidak-ditemukan', {
  query: listQuery
})
const { data: snapshot } = await useFetch<TidakDitemukanSnapshot | null>(
  '/api/tidak-ditemukan/snapshot'
)

let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(searchInput, (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    committedSearch.value = value.trim()
    page.value = 1
  }, 280)
})
watch(
  filters,
  () => {
    page.value = 1
  },
  { deep: true }
)
onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer)
})

const isLoading = computed(() => listStatus.value === 'pending')
const hasGroups = computed(() => (list.value?.groups.length ?? 0) > 0)
const rangeStart = computed(() =>
  list.value?.totalSls ? (list.value.page - 1) * list.value.pageSize + 1 : 0
)
const rangeEnd = computed(() =>
  list.value
    ? Math.min(list.value.page * list.value.pageSize, list.value.totalSls)
    : 0
)

function updateFilters(next: TidakDitemukanFilterState): void {
  Object.assign(filters, next)
}
function formatCount(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}
function formattedImportDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date(value))
}

async function updateStatus(
  group: TidakDitemukanSlsGroup,
  isSelesai: boolean
): Promise<void> {
  if (saving[group.idSubsls]) return
  saving[group.idSubsls] = true
  mutationError.value = ''
  const previous = { isSelesai: group.isSelesai, selesaiAt: group.selesaiAt }
  group.isSelesai = isSelesai
  group.selesaiAt = isSelesai ? new Date().toISOString() : null
  try {
    const response = await $fetch<{
      isSelesai: boolean
      selesaiAt: string | null
    }>(`/api/tidak-ditemukan/${encodeURIComponent(group.idSubsls)}/status`, {
      method: 'PATCH',
      body: { isSelesai }
    })
    group.isSelesai = response.isSelesai
    group.selesaiAt = response.selesaiAt
  } catch {
    group.isSelesai = previous.isSelesai
    group.selesaiAt = previous.selesaiAt
    mutationError.value
      = 'Status SLS gagal diperbarui. Perubahan lokal dikembalikan.'
  } finally {
    saving[group.idSubsls] = false
  }
}

async function downloadVisibleDocxZip(): Promise<void> {
  const idSubsls = list.value?.groups.map(group => group.idSubsls) ?? []
  if (idSubsls.length === 0 || downloadingZip.value) return

  downloadingZip.value = true
  mutationError.value = ''
  try {
    const response = await fetch('/api/tidak-ditemukan/docx-zip', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idSubsls })
    })

    if (!response.ok) throw new Error('ZIP download failed.')

    const downloadUrl = URL.createObjectURL(await response.blob())
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `Tidak Ditemukan - ${idSubsls.length} SLS.zip`
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)
  } catch {
    mutationError.value
      = 'ZIP DOCX gagal dibuat. Tidak ada status SLS yang diubah.'
  } finally {
    downloadingZip.value = false
  }
}
</script>

<template>
  <main class="tidak-ditemukan-page">
    <AppNavbar />
    <section class="page-heading">
      <div>
        <h1>Tidak Ditemukan</h1>
        <p>
          Satu baris untuk satu SLS. Buka detail untuk melihat seluruh
          assignment tidak ditemukan.
        </p>
      </div>
      <p
        v-if="snapshot"
        class="snapshot"
      >
        Data per {{ formattedImportDate(snapshot.importedAt) }} ·
        {{ formatCount(snapshot.jumlahAssignment) }} assignment ·
        {{ formatCount(snapshot.jumlahSls) }} SLS
        <span v-if="snapshot.namaFile">· {{ snapshot.namaFile }}</span>
      </p>
    </section>

    <TidakDitemukanFilterBar
      :filters="filters"
      :search="searchInput"
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
      class="results"
      :aria-busy="isLoading"
    >
      <div
        v-if="list"
        class="results-toolbar"
      >
        <p class="result-count">
          Menampilkan {{ rangeStart }}–{{ rangeEnd }} dari
          {{ list.totalSls }} SLS
        </p>
        <UButton
          label="Download Semua (ZIP)"
          icon="i-lucide-download"
          color="neutral"
          variant="outline"
          size="xs"
          :disabled="!hasGroups"
          :loading="downloadingZip"
          @click="downloadVisibleDocxZip"
        />
      </div>
      <div
        v-if="listError"
        class="empty-state"
        role="alert"
      >
        Data Tidak Ditemukan tidak dapat dimuat.
      </div>
      <div
        v-else-if="!hasGroups && !isLoading"
        class="empty-state"
      >
        Tidak ada SLS yang cocok dengan filter.
      </div>
      <div
        v-else
        class="table-scroll"
      >
        <table class="sls-table">
          <thead>
            <tr>
              <th />
              <th>SLS</th>
              <th>Wilayah</th>
              <th>PPL</th>
              <th>PML</th>
              <th>Jumlah Assignment</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td
                colspan="8"
                class="loading-cell"
              >
                <USkeleton class="loading-cell__line" />
              </td>
            </tr>
            <template v-else>
              <TidakDitemukanSlsGroupRow
                v-for="group in list?.groups"
                :key="group.idSubsls"
                :group="group"
                :expanded="Boolean(expanded[group.idSubsls])"
                :saving="Boolean(saving[group.idSubsls])"
                @toggle="expanded[group.idSubsls] = !expanded[group.idSubsls]"
                @update-status="updateStatus(group, $event)"
              />
            </template>
          </tbody>
        </table>
      </div>
      <nav
        v-if="list && list.totalPages > 1"
        class="pagination"
        aria-label="Halaman SLS"
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
.tidak-ditemukan-page {
  width: min(100%, 112rem);
  margin-inline: auto;
  padding: clamp(var(--space-3), 2vw, var(--space-6));
}
.page-heading {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule);
}
.page-heading h1 {
  margin: 0;
  color: var(--color-ink);
  font-size: var(--text-xl);
  font-weight: 600;
}
.page-heading p {
  margin: var(--space-1) 0 0;
  color: var(--color-muted);
  font-size: var(--text-xs);
}
.snapshot {
  max-width: 34rem;
  text-align: end;
}
.results {
  margin-top: var(--space-3);
}
.results-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}
.result-count {
  margin: 0;
  color: var(--color-muted);
  font-size: var(--text-xs);
}
.table-scroll {
  overflow-x: auto;
  border: var(--rule) solid var(--color-rule-2);
  border-radius: var(--radius-sm);
}
.sls-table {
  width: 100%;
  min-width: 70rem;
  border-collapse: collapse;
  color: var(--color-ink-2);
}
.sls-table th {
  padding: var(--space-2) var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule-2);
  background: var(--color-paper);
  text-align: start;
  font-size: var(--text-xs);
  font-weight: 500;
  white-space: nowrap;
}
.sls-table th:first-child {
  width: 3rem;
}
.sls-table th:nth-child(6) {
  width: 9rem;
}
.sls-table th:nth-child(7) {
  width: 8rem;
}
.sls-table th:last-child {
  width: 13rem;
}
.loading-cell {
  padding: var(--space-5);
}
.loading-cell__line {
  width: 100%;
  height: 2rem;
}
.empty-state,
.mutation-error {
  margin-top: var(--space-3);
  padding: var(--space-3);
  border: var(--rule) solid var(--color-rule-2);
  background: var(--color-paper);
  color: var(--color-ink-2);
  font-size: var(--text-sm);
}
.mutation-error {
  border-color: var(--color-error);
  color: var(--color-error);
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-3);
  color: var(--color-muted);
  font-size: var(--text-xs);
}
@media (max-width: 40rem) {
  .page-heading {
    flex-direction: column;
  }
  .snapshot {
    text-align: start;
  }
  .pagination {
    gap: var(--space-2);
  }
}
</style>
