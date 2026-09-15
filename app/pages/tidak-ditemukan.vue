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

interface TidakDitemukanImportCounts {
  sourceRows: number
  jumlahAssignment: number
  jumlahSls: number
  invalidRows: number
  invalidMasterSls: number
}

interface TidakDitemukanImportResult {
  fileName: string
  applied: boolean
  valid: boolean
  counts: TidakDitemukanImportCounts
  issues: Array<{ code: string, message: string }>
}
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
const importModalOpen = ref(false)
const importFile = ref<File | null>(null)
const importPassword = ref('')
const importPreview = ref<TidakDitemukanImportResult | null>(null)
const importError = ref('')
const previewingImport = ref(false)
const applyingImport = ref(false)
const importConfirmed = ref(false)
const filterBarKey = ref(0)
const toast = useToast()
const importFileUploadUi = {
  base: 'bg-[var(--color-paper)] border-[var(--color-rule-2)] text-[var(--color-ink-2)] hover:bg-[var(--color-paper-2)]',
  icon: 'text-[var(--color-accent)]',
  label: 'text-[var(--color-ink)]',
  description: 'text-[var(--color-muted)]'
}
const importInputUi = {
  base: 'bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)]'
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
  completionStatus: filters.completionStatus || undefined
}))
const {
  data: list,
  status: listStatus,
  error: listError,
  refresh: refreshList
} = await useFetch<TidakDitemukanListResponse>('/api/tidak-ditemukan', {
  query: listQuery
})
const {
  data: snapshot,
  refresh: refreshSnapshot
} = await useFetch<TidakDitemukanSnapshot | null>('/api/tidak-ditemukan/snapshot')

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
watch(importFile, () => {
  importPreview.value = null
  importError.value = ''
  importConfirmed.value = false
  importPassword.value = ''
})
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

function resetImportForm(): void {
  importFile.value = null
  importPassword.value = ''
  importPreview.value = null
  importError.value = ''
  importConfirmed.value = false
}

function openImportModal(): void {
  resetImportForm()
  importModalOpen.value = true
}

function closeImportModal(): void {
  importModalOpen.value = false
  resetImportForm()
}

function onImportModalUpdate(isOpen: boolean): void {
  if (!isOpen) resetImportForm()
}

function createImportFormData(includePassword = false): FormData | null {
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
  if (includePassword) formData.append('password', importPassword.value)
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
  if (!formData || previewingImport.value) return

  importError.value = ''
  previewingImport.value = true
  try {
    importPreview.value = await $fetch<TidakDitemukanImportResult>(
      '/api/tidak-ditemukan/import/preview',
      { method: 'POST', body: formData }
    )
  } catch (error) {
    importPreview.value = null
    importError.value = requestErrorMessage(error, 'Preview import gagal dibuat.')
  } finally {
    previewingImport.value = false
  }
}

async function applyImport(): Promise<void> {
  const formData = createImportFormData(true)
  if (!formData || !importPreview.value?.valid || !importConfirmed.value || !importPassword.value || applyingImport.value) return

  importError.value = ''
  applyingImport.value = true
  try {
    const result = await $fetch<TidakDitemukanImportResult>(
      '/api/tidak-ditemukan/import/apply',
      { method: 'POST', body: formData }
    )

    if (!result.valid || !result.applied) {
      importPreview.value = result
      return
    }

    page.value = 1
    filterBarKey.value++
    await Promise.all([refreshList(), refreshSnapshot()])
    toast.add({
      title: 'Import Tidak Ditemukan berhasil',
      description: `${formatCount(result.counts.jumlahAssignment)} assignment pada ${formatCount(result.counts.jumlahSls)} SLS telah diganti.`,
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
    <AppNavbar>
      <template #actions>
        <UButton
          label="Import Data"
          icon="i-lucide-upload"
          color="neutral"
          variant="outline"
          size="sm"
          @click="openImportModal"
        />
      </template>
    </AppNavbar>
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
      :key="filterBarKey"
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

    <UModal
      v-model:open="importModalOpen"
      title="Import XLSX Tidak Ditemukan"
      description="Validasi snapshot sebelum mengganti data Tidak Ditemukan saat ini."
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
            for="tidak-ditemukan-import-file"
          >
            <span>File XLSX</span>
            <UFileUpload
              id="tidak-ditemukan-import-file"
              v-model="importFile"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :file-image="false"
              :dropzone="false"
              :ui="importFileUploadUi"
              label="Pilih file XLSX"
              description="File diproses sementara dan tidak disimpan."
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
                <strong>{{ importPreview.valid ? 'Ringkasan validasi' : 'Import belum dapat dilakukan' }}</strong>
                <span>{{ importPreview.fileName }}</span>
              </div>
              <div class="import-preview__grid">
                <div><strong>{{ formatCount(importPreview.counts.sourceRows) }}</strong><span>Baris sumber</span></div>
                <div><strong>{{ formatCount(importPreview.counts.jumlahAssignment) }}</strong><span>Assignment valid</span></div>
                <div><strong>{{ formatCount(importPreview.counts.jumlahSls) }}</strong><span>SLS</span></div>
                <div><strong>{{ formatCount(importPreview.counts.invalidRows) }}</strong><span>Baris tidak valid</span></div>
                <div><strong>{{ formatCount(importPreview.counts.invalidMasterSls) }}</strong><span>Master SLS tidak ditemukan</span></div>
              </div>
              <ul
                v-if="importPreview.issues.length"
                class="import-preview__issues"
              >
                <li
                  v-for="issue in importPreview.issues.slice(0, 5)"
                  :key="`${issue.code}-${issue.message}`"
                >
                  {{ issue.message }}
                </li>
              </ul>
            </div>

            <label
              v-if="importPreview.valid"
              class="import-confirmation"
            >
              <input
                v-model="importConfirmed"
                type="checkbox"
              >
              <span>Saya memahami bahwa data dan seluruh status SLS saat ini akan diganti.</span>
            </label>

            <label
              v-if="importPreview.valid"
              class="import-field"
              for="tidak-ditemukan-import-password"
            >
              <span>Password import</span>
              <UInput
                id="tidak-ditemukan-import-password"
                v-model="importPassword"
                type="password"
                autocomplete="current-password"
                :ui="importInputUi"
                placeholder="Masukkan password"
              />
            </label>
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
            label="Terapkan & Ganti Data"
            icon="i-lucide-upload"
            color="error"
            :loading="applyingImport"
            :disabled="previewingImport || !importConfirmed || !importPassword"
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
.import-warning,
.import-message {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}
.import-warning {
  border: var(--rule) solid var(--color-warning);
  color: var(--color-ink-2);
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
.import-preview__header span,
.import-preview__grid span {
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
.import-preview__grid div:nth-child(2n) { border-right: 0; }
.import-preview__grid strong { color: var(--color-ink); font-size: var(--text-lg); font-variant-numeric: tabular-nums; }
.import-preview__issues {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: var(--space-3) var(--space-3) var(--space-3) 2rem;
  border-top: var(--rule) solid var(--color-rule-2);
  color: var(--color-error);
  font-size: var(--text-xs);
}
.import-confirmation {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  color: var(--color-ink-2);
  font-size: var(--text-sm);
}
.import-confirmation input { margin-top: 0.2rem; accent-color: var(--color-accent); }
.import-actions { display: flex; justify-content: flex-end; gap: var(--space-2); width: 100%; }
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
