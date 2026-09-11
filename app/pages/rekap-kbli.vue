<script setup lang="ts">
import type {
  KbliAssignmentStatistics,
  KbliRecapItem
} from '~/types/kbli'

const selectedCategories = ref<string[]>([])
const numberFormatter = new Intl.NumberFormat('id-ID')
const statisticCards: Array<{
  key: keyof KbliAssignmentStatistics
  label: string
}> = [
  { key: 'total', label: 'Total' },
  { key: 'unhandled', label: 'Belum Selesai' },
  { key: 'handled', label: 'Selesai (Tandai)' }
]
const selectMenuUi = {
  base: 'bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] hover:bg-[var(--color-paper-2)]',
  trailingIcon: 'text-[var(--color-muted)]',
  content: 'w-[min(32rem,calc(100vw-2rem))] bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] shadow-lg',
  input: 'border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-2)]',
  item: 'text-[var(--color-ink-2)] data-highlighted:not-data-disabled:text-[var(--color-ink)] data-highlighted:not-data-disabled:before:bg-[var(--color-paper-2)]',
  itemLabel: 'whitespace-normal break-words',
  itemDescription: 'text-[var(--color-muted)]'
}

const {
  data: recap,
  status: recapStatus,
  error: recapError
} = await useFetch<KbliRecapItem[]>('/api/kbli/recap')

const recapItems = computed(() => recap.value ?? [])
const categoryOptions = computed(() => recapItems.value
  .map(item => ({
    label: item.kategori,
    description: item.deskripsi ?? undefined,
    value: item.kategori.trim()
  }))
  .filter(item => item.value.length > 0)
)
const visibleRecapItems = computed(() => {
  if (selectedCategories.value.length === 0) {
    return recapItems.value
  }

  const selected = new Set(selectedCategories.value)
  return recapItems.value.filter(item => selected.has(item.kategori))
})
const selectedCategoryLabel = computed(() => selectedCategories.value.length === 0
  ? 'Semua kategori KBLI'
  : `${selectedCategories.value.length} kategori dipilih`
)
const isLoading = computed(() => recapStatus.value === 'pending')

function formatCount(value: number): string {
  return numberFormatter.format(value)
}

function showAllCategories(): void {
  selectedCategories.value = []
}
</script>

<template>
  <main class="recap-page">
    <AppNavbar />

    <section
      class="page-heading"
      aria-labelledby="page-title"
    >
      <div>
        <h1 id="page-title">
          Rekap KBLI
        </h1>
        <p>
          Ringkasan assignment dan KBLI per kategori.
        </p>
      </div>
    </section>

    <section
      class="recap-filter"
      aria-label="Filter kategori KBLI"
    >
      <div>
        <p class="recap-filter__label">
          Kategori KBLI
        </p>
        <p class="recap-filter__summary">
          {{ selectedCategoryLabel }}
        </p>
      </div>
      <div class="recap-filter__controls">
        <USelectMenu
          v-model="selectedCategories"
          multiple
          clear
          :items="categoryOptions"
          value-key="value"
          label-key="label"
          description-key="description"
          color="neutral"
          variant="outline"
          size="md"
          class="recap-filter__select"
          :ui="selectMenuUi"
          :search-input="{
            autofocus: false,
            icon: 'i-lucide-search',
            placeholder: 'Cari kategori atau deskripsi...'
          }"
          :filter-fields="['label', 'description']"
          :loading="isLoading"
          placeholder="Semua kategori KBLI"
          aria-label="Pilih kategori KBLI"
        />
        <UButton
          v-if="selectedCategories.length"
          label="Tampilkan semua"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="showAllCategories"
        />
      </div>
    </section>

    <section
      v-if="isLoading"
      class="recap-list"
      aria-label="Memuat rekap KBLI"
      aria-busy="true"
    >
      <article
        v-for="index in 3"
        :key="index"
        class="recap-group"
      >
        <div class="recap-group__heading">
          <USkeleton class="recap-group__code-skeleton" />
          <USkeleton class="recap-group__description-skeleton" />
        </div>
        <div class="statistics-grid">
          <USkeleton
            v-for="cardIndex in 3"
            :key="cardIndex"
            class="statistics-skeleton"
          />
        </div>
      </article>
    </section>

    <p
      v-else-if="recapError"
      class="recap-message recap-message--error"
      role="alert"
    >
      Rekap KBLI tidak dapat dimuat. Periksa koneksi database, lalu muat ulang halaman.
    </p>

    <p
      v-else-if="visibleRecapItems.length === 0"
      class="recap-message"
    >
      Tidak ada kategori KBLI yang cocok dengan filter.
    </p>

    <section
      v-else
      class="recap-list"
      aria-live="polite"
    >
      <article
        v-for="item in visibleRecapItems"
        :key="item.kategori"
        class="recap-group"
      >
        <header class="recap-group__heading">
          <h2>{{ item.kategori }}</h2>
          <p v-if="item.deskripsi">
            {{ item.deskripsi }}
          </p>
        </header>

        <div class="statistics-grid">
          <section
            v-for="card in statisticCards"
            :key="card.key"
            class="statistics-card"
            :aria-label="`${item.kategori}, ${card.label}`"
          >
            <h3>{{ card.label }}</h3>
            <div class="statistics-card__metrics">
              <div>
                <span>Assignment</span>
                <strong>{{ formatCount(item.statistics[card.key].assignments) }}</strong>
              </div>
              <div>
                <span>KBLI</span>
                <strong>{{ formatCount(item.statistics[card.key].findings) }}</strong>
              </div>
            </div>
          </section>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.recap-page {
  width: min(100%, 112rem);
  min-height: 100dvh;
  margin-inline: auto;
  padding: 0 clamp(var(--space-3), 2vw, var(--space-6));
}

.page-heading {
  padding-block: var(--space-4) var(--space-3);
}

.page-heading h1,
.recap-group__heading h2 {
  margin: 0;
  color: var(--color-ink);
  font-weight: 650;
  letter-spacing: -0.025em;
  overflow-wrap: anywhere;
}

.page-heading h1 {
  font-size: var(--text-xl);
}

.page-heading p,
.recap-group__heading p {
  margin: var(--space-1) 0 0;
  color: var(--color-muted);
  font-size: var(--text-sm);
  line-height: 1.4;
}

.recap-filter {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-block: var(--rule) solid var(--color-rule);
}

.recap-filter__label,
.recap-filter__summary {
  margin: 0;
}

.recap-filter__label {
  color: var(--color-ink);
  font-size: var(--text-sm);
  font-weight: 600;
}

.recap-filter__summary {
  margin-top: var(--space-1);
  color: var(--color-muted);
  font-size: var(--text-xs);
}

.recap-filter__controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
  min-width: min(100%, 22rem);
}

.recap-filter__select {
  width: min(100%, 26rem);
}

.recap-list {
  display: grid;
  gap: var(--space-4);
  padding-block: var(--space-4);
}

.recap-group {
  padding-bottom: var(--space-4);
  border-bottom: var(--rule) solid var(--color-rule);
}

.recap-group:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.recap-group__heading {
  display: grid;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

.recap-group__heading h2 {
  font-size: var(--text-lg);
}

.recap-group__heading p {
  margin: 0;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
}

.statistics-card {
  min-width: 0;
  border: var(--rule) solid var(--color-rule-2);
  border-radius: var(--radius-sm);
  background: var(--color-paper);
}

.statistics-card h3 {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule-2);
  color: var(--color-ink);
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1.3;
}

.statistics-card__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.statistics-card__metrics > div {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
}

.statistics-card__metrics > div + div {
  border-inline-start: var(--rule) solid var(--color-rule-2);
}

.statistics-card__metrics span {
  color: var(--color-muted);
  font-size: var(--text-2xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.2;
  text-transform: uppercase;
}

.statistics-card__metrics strong {
  color: var(--color-ink);
  font-size: var(--text-lg);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.statistics-skeleton {
  height: 5.75rem;
}

.recap-group__code-skeleton {
  width: 4rem;
  height: 1.125rem;
}

.recap-group__description-skeleton {
  width: min(100%, 28rem);
  height: 0.875rem;
}

.recap-message {
  margin: var(--space-4) 0 0;
  padding: var(--space-3);
  border: var(--rule) solid var(--color-rule-2);
  color: var(--color-muted);
  font-size: var(--text-sm);
}

.recap-message--error {
  border-color: var(--color-error);
  color: var(--color-error);
}

@media (max-width: 67rem) {
  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 39.99rem) {
  .recap-filter {
    align-items: stretch;
    flex-direction: column;
  }

  .recap-filter__controls,
  .recap-filter__select {
    width: 100%;
  }

  .recap-filter__controls {
    justify-content: space-between;
  }
}

@media (max-width: 30rem) {
  .statistics-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
