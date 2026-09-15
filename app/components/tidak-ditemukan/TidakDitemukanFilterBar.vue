<script setup lang="ts">
import type { TidakDitemukanFilterOptions, TidakDitemukanFilterState } from '~/types/tidak-ditemukan'

const lightInputUi = {
  base: 'bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)]',
  leadingIcon: 'text-[var(--color-muted)]'
}

const props = defineProps<{ filters: TidakDitemukanFilterState, search: string }>()
const emit = defineEmits<{
  'update:filters': [filters: TidakDitemukanFilterState]
  'update:search': [value: string]
}>()

const optionsQuery = computed(() => ({
  kecamatan: props.filters.kecamatan || undefined,
  desa: props.filters.desa || undefined,
  namaSls: props.filters.namaSls || undefined,
  ppl: props.filters.ppl || undefined,
  pml: props.filters.pml || undefined
}))
const { data: options } = await useFetch<TidakDitemukanFilterOptions>(
  '/api/tidak-ditemukan/filter-options', { query: optionsQuery }
)

function update(field: keyof TidakDitemukanFilterState, value: string): void {
  const next = { ...props.filters, [field]: value }
  if (field === 'kecamatan') {
    next.desa = ''
    next.namaSls = ''
  }
  if (field === 'desa') next.namaSls = ''
  emit('update:filters', next)
}
</script>

<template>
  <section
    class="filters"
    aria-label="Filter Tidak Ditemukan"
  >
    <UInput
      :model-value="search"
      icon="i-lucide-search"
      placeholder="Cari assignment, SLS, wilayah, PPL, PML..."
      color="neutral"
      variant="outline"
      class="filters__search"
      :ui="lightInputUi"
      @update:model-value="emit('update:search', String($event ?? ''))"
    />
    <select
      :value="filters.completionStatus"
      aria-label="Status"
      @change="update('completionStatus', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">
        Semua status
      </option>
      <option value="unresolved">
        Belum selesai
      </option>
      <option value="completed">
        Selesai
      </option>
    </select>
    <select
      :value="filters.kecamatan"
      aria-label="Kecamatan"
      @change="update('kecamatan', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">
        Semua kecamatan
      </option>
      <option
        v-for="item in options?.kecamatan"
        :key="item"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
    <select
      :value="filters.desa"
      :disabled="!filters.kecamatan"
      aria-label="Desa"
      @change="update('desa', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">
        Semua desa
      </option>
      <option
        v-for="item in options?.desa"
        :key="item"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
    <select
      :value="filters.namaSls"
      :disabled="!filters.desa"
      aria-label="SLS"
      @change="update('namaSls', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">
        Semua SLS
      </option>
      <option
        v-for="item in options?.namaSls"
        :key="item"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
    <select
      :value="filters.ppl"
      aria-label="PPL"
      @change="update('ppl', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">
        Semua PPL
      </option>
      <option
        v-for="item in options?.ppl"
        :key="item"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
    <select
      :value="filters.pml"
      aria-label="PML"
      @change="update('pml', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">
        Semua PML
      </option>
      <option
        v-for="item in options?.pml"
        :key="item"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
  </section>
</template>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3); }
.filters__search { min-width: min(100%, 18rem); flex: 1 1 20rem; }
.filters select { min-height: 2.5rem; max-width: 13rem; padding: 0 var(--space-2); border: var(--rule) solid var(--color-rule-2); border-radius: var(--radius-sm); background: var(--color-paper); color: var(--color-ink-2); font: inherit; font-size: var(--text-xs); }
.filters select:disabled { color: var(--color-muted); background: var(--color-paper-2); }
</style>
