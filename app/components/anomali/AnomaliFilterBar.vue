<script setup lang="ts">
import type { AnomalyFilterOptions, AnomalyFilterState } from '~/types/anomali'

const ALL_VALUE = '__all__'
const lightSelectMenuUi = {
  base: 'bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] hover:bg-[var(--color-paper-2)] disabled:bg-[var(--color-paper-3)] disabled:text-[var(--color-muted)] disabled:ring-[var(--color-rule-2)] disabled:opacity-100',
  trailingIcon: 'text-[var(--color-muted)]',
  content:
    'w-max max-w-[calc(100vw-1rem)] bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] shadow-lg',
  input:
    'border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-2)]',
  item: 'text-[var(--color-ink-2)] data-highlighted:not-data-disabled:text-[var(--color-ink)] data-highlighted:not-data-disabled:before:bg-[var(--color-paper-2)]',
  itemLabel: 'whitespace-normal break-words',
  itemDescription: 'text-[var(--color-muted)]'
}
const lightInputUi = {
  base: 'bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)]',
  leadingIcon: 'text-[var(--color-muted)]'
}

type RegionFilterField
  = 'kecamatan' | 'desa' | 'namaSls' | 'ppl' | 'pml' | 'isActive'

interface SelectItem {
  label: string
  value: string
}

const props = defineProps<{
  filters: AnomalyFilterState
  search: string
  totalAssignments: number
}>()

const emit = defineEmits<{
  'update:filters': [filters: AnomalyFilterState]
  'update:search': [search: string]
}>()

const drawerOpen = ref(false)
const draftRegionFilters = reactive<
  Pick<AnomalyFilterState, RegionFilterField>
>({
  kecamatan: '',
  desa: '',
  namaSls: '',
  ppl: '',
  pml: '',
  isActive: ''
})

const regionOptionsQuery = computed(() => ({
  kecamatan: draftRegionFilters.kecamatan || undefined,
  desa: draftRegionFilters.desa || undefined,
  namaSls: draftRegionFilters.namaSls || undefined,
  ppl: draftRegionFilters.ppl || undefined,
  pml: draftRegionFilters.pml || undefined
}))

const { data: regionOptions, status: regionOptionsStatus }
  = await useFetch<AnomalyFilterOptions>('/api/anomali/filter-options', {
    query: regionOptionsQuery
  })

const handlingTabs = [
  { label: 'Belum selesai', value: 'unhandled' },
  { label: 'Selesai (tandai)', value: 'handled' },
  { label: 'Selesai + anomali hilang', value: 'disappeared' }
]

const selectedHandlingLabel = computed(
  () =>
    handlingTabs.find(
      tab => tab.value === toSelectValue(props.filters.completionStatus)
    )?.label ?? 'Status penanganan'
)

const anomalyOptions = computed<SelectItem[]>(() => [
  { label: 'Semua anomali', value: ALL_VALUE },
  ...(regionOptions.value?.anomalyCodes
    .map(anomaly => ({
      label: `${anomaly.kodeAnomali} — ${anomaly.deskripsi}`,
      value: anomaly.kodeAnomali.trim()
    }))
    .filter(anomaly => anomaly.value.length > 0) ?? [])
])

const kecamatanOptions = computed(() =>
  selectItems(regionOptions.value?.kecamatan, 'Semua kecamatan')
)
const desaOptions = computed(() =>
  selectItems(regionOptions.value?.desa, 'Semua desa')
)
const slsOptions = computed(() =>
  selectItems(regionOptions.value?.namaSls, 'Semua SLS')
)
const pplOptions = computed(() =>
  selectItems(regionOptions.value?.ppl, 'Semua PPL')
)
const pmlOptions = computed(() =>
  selectItems(regionOptions.value?.pml, 'Semua PML')
)
const activeOptions: SelectItem[] = [
  { label: 'Semua status sistem', value: ALL_VALUE },
  { label: 'Aktif', value: 'true' },
  { label: 'Hilang by sistem', value: 'false' }
]

const activeRegionFilterCount = computed(
  () =>
    Object.values({
      kecamatan: props.filters.kecamatan,
      desa: props.filters.desa,
      namaSls: props.filters.namaSls,
      ppl: props.filters.ppl,
      pml: props.filters.pml,
      isActive: props.filters.isActive
    }).filter(Boolean).length
)

const isRegionOptionsLoading = computed(
  () => regionOptionsStatus.value === 'pending'
)

watch(drawerOpen, (isOpen) => {
  if (isOpen) {
    syncDraftRegionFilters()
  }
})

function selectItems(
  values: string[] | undefined,
  allLabel: string
): SelectItem[] {
  return [
    { label: allLabel, value: ALL_VALUE },
    ...(values ?? [])
      .map(value => value.trim())
      .filter(value => value.length > 0)
      .map(value => ({ label: value, value }))
  ]
}

function toSelectValue(value: string): string {
  return value.trim().length > 0 ? value : ALL_VALUE
}

function fromSelectValue(value: unknown): string {
  return typeof value === 'string' && value !== ALL_VALUE ? value : ''
}

function syncDraftRegionFilters(): void {
  Object.assign(draftRegionFilters, {
    kecamatan: props.filters.kecamatan,
    desa: props.filters.desa,
    namaSls: props.filters.namaSls,
    ppl: props.filters.ppl,
    pml: props.filters.pml,
    isActive: props.filters.isActive
  })
}

function updateSearch(value: string | number | undefined): void {
  emit('update:search', typeof value === 'string' ? value : '')
}

function updateQuickFilter(
  field: 'kodeAnomali' | 'completionStatus',
  value: string
): void {
  emit('update:filters', {
    ...props.filters,
    [field]: fromSelectValue(value)
  })
}

function updateDraftRegionFilter(
  field: RegionFilterField,
  value: string
): void {
  draftRegionFilters[field] = fromSelectValue(value)

  if (field === 'kecamatan') {
    draftRegionFilters.desa = ''
    draftRegionFilters.namaSls = ''
  }

  if (field === 'desa') {
    draftRegionFilters.namaSls = ''
  }
}

function resetRegionFilters(): void {
  Object.assign(draftRegionFilters, {
    kecamatan: '',
    desa: '',
    namaSls: '',
    ppl: '',
    pml: '',
    isActive: ''
  })
}

function applyRegionFilters(): void {
  emit('update:filters', {
    ...props.filters,
    ...draftRegionFilters
  })
  drawerOpen.value = false
}
</script>

<template>
  <section
    class="filter-toolbar"
    aria-label="Filter anomali"
  >
    <div class="filter-toolbar__summary">
      <USelectMenu
        :model-value="filters.completionStatus || undefined"
        :items="handlingTabs"
        value-key="value"
        color="neutral"
        variant="outline"
        size="md"
        class="filter-toolbar__status-select"
        :ui="lightSelectMenuUi"
        :search-input="false"
        placeholder="Pilih status"
        aria-label="Status Penanganan"
        @update:model-value="
          updateQuickFilter('completionStatus', String($event ?? ''))
        "
      />
      <div
        class="filter-toolbar__total"
        aria-live="polite"
      >
        <UBadge
          color="warning"
          variant="solid"
          size="sm"
        >
          {{ totalAssignments }}
        </UBadge>
        <span>{{ selectedHandlingLabel }}</span>
      </div>
    </div>

    <div class="filter-toolbar__controls">
      <UInput
        :model-value="search"
        class="filter-toolbar__search"
        color="neutral"
        variant="outline"
        size="md"
        icon="i-lucide-search"
        :ui="lightInputUi"
        type="search"
        placeholder="Cari assignment, nama, bangunan, IDSBR..."
        @update:model-value="updateSearch"
      />

      <USelectMenu
        :model-value="toSelectValue(filters.kodeAnomali)"
        :items="anomalyOptions"
        value-key="value"
        color="neutral"
        variant="outline"
        size="md"
        class="filter-toolbar__anomaly"
        :ui="lightSelectMenuUi"
        :search-input="{
          autofocus: false,
          icon: 'i-lucide-search',
          placeholder: 'Cari anomali...'
        }"
        :loading="isRegionOptionsLoading"
        @update:model-value="
          updateQuickFilter('kodeAnomali', String($event ?? ''))
        "
      />

      <USlideover
        v-model:open="drawerOpen"
        title="Filter Wilayah"
        :ui="{
          content:
            'w-full max-w-md bg-[var(--color-paper)] text-[var(--color-ink-2)]',
          header:
            'border-b border-[var(--color-rule)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)]',
          body: 'bg-[var(--color-paper)] p-0',
          footer: 'bg-[var(--color-paper)] p-0'
        }"
      >
        <UButton
          color="neutral"
          variant="outline"
          size="md"
          icon="i-lucide-list-filter"
          class="filter-toolbar__region-trigger"
          :aria-label="`Filter Wilayah${activeRegionFilterCount ? `, ${activeRegionFilterCount} filter aktif` : ''}`"
        >
          <span>Filter Wilayah</span>
          <UBadge
            v-if="activeRegionFilterCount"
            color="neutral"
            variant="solid"
            size="sm"
          >
            {{ activeRegionFilterCount }}
          </UBadge>
        </UButton>

        <template #body>
          <div class="region-drawer">
            <label class="region-drawer__field">
              <span>Kecamatan</span>
              <USelectMenu
                :model-value="toSelectValue(draftRegionFilters.kecamatan)"
                :items="kecamatanOptions"
                value-key="value"
                color="neutral"
                variant="outline"
                size="md"
                :ui="lightSelectMenuUi"
                :search-input="{
                  autofocus: false,
                  placeholder: 'Cari kecamatan...'
                }"
                :loading="isRegionOptionsLoading"
                @update:model-value="
                  updateDraftRegionFilter('kecamatan', String($event ?? ''))
                "
              />
            </label>

            <label class="region-drawer__field">
              <span>Desa</span>
              <USelectMenu
                :model-value="toSelectValue(draftRegionFilters.desa)"
                :items="desaOptions"
                value-key="value"
                color="neutral"
                variant="outline"
                size="md"
                :ui="lightSelectMenuUi"
                :disabled="!draftRegionFilters.kecamatan"
                :search-input="{
                  autofocus: false,
                  placeholder: 'Cari desa...'
                }"
                :loading="isRegionOptionsLoading"
                @update:model-value="
                  updateDraftRegionFilter('desa', String($event ?? ''))
                "
              />
            </label>

            <label class="region-drawer__field">
              <span>SLS</span>
              <USelectMenu
                :model-value="toSelectValue(draftRegionFilters.namaSls)"
                :items="slsOptions"
                value-key="value"
                color="neutral"
                variant="outline"
                size="md"
                :ui="lightSelectMenuUi"
                :disabled="!draftRegionFilters.desa"
                :search-input="{ autofocus: false, placeholder: 'Cari SLS...' }"
                :loading="isRegionOptionsLoading"
                @update:model-value="
                  updateDraftRegionFilter('namaSls', String($event ?? ''))
                "
              />
            </label>

            <label class="region-drawer__field">
              <span>PML</span>
              <USelectMenu
                :model-value="toSelectValue(draftRegionFilters.pml)"
                :items="pmlOptions"
                value-key="value"
                color="neutral"
                variant="outline"
                size="md"
                :ui="lightSelectMenuUi"
                :search-input="{ autofocus: false, placeholder: 'Cari PML...' }"
                :loading="isRegionOptionsLoading"
                @update:model-value="
                  updateDraftRegionFilter('pml', String($event ?? ''))
                "
              />
            </label>

            <label class="region-drawer__field">
              <span>PPL</span>
              <USelectMenu
                :model-value="toSelectValue(draftRegionFilters.ppl)"
                :items="pplOptions"
                value-key="value"
                color="neutral"
                variant="outline"
                size="md"
                :ui="lightSelectMenuUi"
                :search-input="{ autofocus: false, placeholder: 'Cari PPL...' }"
                :loading="isRegionOptionsLoading"
                @update:model-value="
                  updateDraftRegionFilter('ppl', String($event ?? ''))
                "
              />
            </label>

            <label class="region-drawer__field">
              <span>Keberadaan sistem</span>
              <USelectMenu
                :model-value="toSelectValue(draftRegionFilters.isActive)"
                :items="activeOptions"
                value-key="value"
                color="neutral"
                variant="outline"
                size="md"
                :ui="lightSelectMenuUi"
                :search-input="false"
                @update:model-value="
                  updateDraftRegionFilter('isActive', String($event ?? ''))
                "
              />
            </label>
          </div>
        </template>

        <template #footer>
          <div class="region-drawer__actions">
            <UButton
              label="Reset"
              color="error"
              size="md"
              @click="resetRegionFilters"
            />
            <UButton
              label="Terapkan"
              color="primary"
              size="md"
              @click="applyRegionFilters"
            />
          </div>
        </template>
      </USlideover>
    </div>
  </section>
</template>

<style scoped>
.filter-toolbar {
  display: grid;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.filter-toolbar__status {
  display: flex;
  gap: var(--space-1);
  overflow-x: auto;
  padding-bottom: 1px;
}

.filter-toolbar__status :deep(button),
.filter-toolbar__controls :deep(button),
.filter-toolbar__controls :deep(input) {
  white-space: nowrap;
}

.filter-toolbar__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.filter-toolbar__search {
  width: min(100%, 28rem);
  min-width: min(100%, 16rem);
  flex: 0 1 28rem;
}

.filter-toolbar__anomaly {
  width: min(100%, 36rem);
  min-width: min(100%, 18rem);
  flex: 0 1 36rem;
}

.filter-toolbar__region-trigger {
  flex: 0 0 auto;
  margin-left: auto;
  border-color: var(--color-rule-2);
  background: var(--color-paper);
  color: var(--color-ink-2);
}

.filter-toolbar__region-trigger :deep(.badge) {
  margin-left: var(--space-1);
}

.filter-toolbar__summary {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.filter-toolbar__status-select {
  width: 12.5rem;
}

.filter-toolbar__total {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-3);
  border: var(--rule) solid var(--color-rule);
  border-radius: var(--radius-sm);
  background: var(--color-paper);
  color: var(--color-ink-2);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.filter-toolbar__summary :deep(button),
.filter-toolbar__controls :deep(button),
.filter-toolbar__controls :deep(input),
.region-drawer :deep(button) {
  min-height: 2.5rem;
}

.region-drawer {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
}

.region-drawer__field {
  display: grid;
  gap: var(--space-1);
}

.region-drawer__field > span {
  color: var(--color-muted);
  font-size: var(--text-xs);
  font-weight: 500;
}

.region-drawer__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-top: var(--rule) solid var(--color-rule);
}

.region-drawer__actions :deep(button) {
  min-width: 5.5rem;
}

@media (max-width: 39.99rem) {
  .filter-toolbar__search,
  .filter-toolbar__anomaly {
    min-width: 100%;
    flex-basis: 100%;
  }
}
</style>
