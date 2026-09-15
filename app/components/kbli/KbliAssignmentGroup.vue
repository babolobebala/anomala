<script setup lang="ts">
import KbliRow from './KbliRow.vue'
import type {
  AssignmentKbliGroup,
  ExecutorOption,
  KbliFindingItem
} from '~/types/kbli'

const props = defineProps<{
  group: AssignmentKbliGroup
  expanded: boolean
  saving: Record<string, boolean>
  savingExecutor: boolean
  expandedData: Record<string, boolean>
  executorOptions: ExecutorOption[]
}>()

const emit = defineEmits<{
  'toggle-assignment': []
  'toggle-data': [id: string]
  'toggle-handling': [kbli: KbliFindingItem]
  'update-executor': [eksekutorId: string | null]
}>()

const detailsId = computed(
  () => `kbli-assignment-${encodeURIComponent(props.group.assignmentId)}`
)
const hasFindings = computed(() => props.group.kbli.length > 0)
const UNASSIGNED_EXECUTOR_VALUE = '__unassigned__'
const executorSelectMenuUi = {
  base: 'bg-[var(--color-paper)] text-[var(--color-ink-2)] placeholder:text-[var(--color-muted)] ring-[var(--color-rule-2)] hover:bg-[var(--color-paper-2)] disabled:bg-[var(--color-paper)] disabled:text-[var(--color-muted)] disabled:opacity-100',
  arrow: 'fill-[var(--color-paper)] stroke-[var(--color-muted)]',
  content: 'bg-[var(--color-paper)] text-[var(--color-ink-2)] ring-[var(--color-rule-2)] shadow-lg',
  item: 'text-[var(--color-ink-2)] data-highlighted:not-data-disabled:text-[var(--color-ink)] data-highlighted:not-data-disabled:before:bg-[var(--color-paper-2)]'
}
const executorItems = computed(() => [
  { label: 'Belum ditugaskan', value: UNASSIGNED_EXECUTOR_VALUE },
  ...props.executorOptions
    .filter(executor => executor.id.trim().length > 0)
    .map(executor => ({
      label: executor.nama,
      value: executor.id.trim()
    }))
])

function selectedExecutorValue(): string {
  return props.group.executor?.id.trim() || UNASSIGNED_EXECUTOR_VALUE
}

function updateExecutor(value: unknown): void {
  const executorId = String(value ?? '').trim()

  emit(
    'update-executor',
    executorId === UNASSIGNED_EXECUTOR_VALUE ? null : executorId || null
  )
}

function sourceStatusTone(status: string | null): 'blue' | 'red' | 'green' {
  const normalized = status?.trim().toUpperCase() ?? ''

  if (normalized.startsWith('REJECTED')) {
    return 'red'
  }

  if (normalized.startsWith('APPROVED') || normalized.startsWith('EDITED')) {
    return 'green'
  }

  return 'blue'
}
</script>

<template>
  <tr
    class="assignment-row"
    :class="{ 'assignment-row--expanded': expanded }"
  >
    <td class="assignment-cell assignment-cell--toggle">
      <button
        v-if="hasFindings"
        type="button"
        class="assignment-toggle"
        :aria-controls="detailsId"
        :aria-expanded="expanded"
        :aria-label="
          expanded
            ? `Tutup detail ${group.assignmentId}`
            : `Buka detail ${group.assignmentId}`
        "
        @click="emit('toggle-assignment')"
      >
        <UIcon
          :name="expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          aria-hidden="true"
        />
      </button>
    </td>
    <td class="assignment-cell">
      <span class="cell-primary">{{ group.wilayah.namaSls || "—" }}</span>
      <span class="cell-secondary">{{ group.wilayah.idSubsls }}</span>
    </td>
    <td class="assignment-cell">
      <span class="cell-primary">{{ group.wilayah.kecamatan || "—" }}</span>
      <span class="cell-secondary">{{ group.wilayah.desa || "—" }}</span>
    </td>
    <td class="assignment-cell">
      <span class="cell-primary assignment-name">{{
        group.namaAssignment || "Tanpa nama assignment"
      }}</span>
      <span class="cell-secondary assignment-id">{{ group.assignmentId }}</span>
    </td>
    <td class="assignment-cell">
      <span
        class="source-status"
        :class="`source-status--${sourceStatusTone(group.statusAlias)}`"
      >{{
        group.statusAlias || "Status FASIH tidak tersedia"
      }}</span>
      <span class="cell-secondary">No. Bang: {{ group.nomorBangunan || "—" }} · SBR:
        {{ group.idsbr || "—" }}</span>
    </td>
    <td class="assignment-cell assignment-cell--fasih">
      <UTooltip
        v-if="group.linkFasihEdit"
        text="Buka di FASIH"
      >
        <a
          :href="group.linkFasihEdit"
          target="_blank"
          rel="noopener noreferrer"
          class="assignment-fasih-link"
          :aria-label="`Buka assignment ${group.assignmentId} di FASIH`"
        >
          <UIcon
            name="i-lucide-external-link"
            aria-hidden="true"
          />
        </a>
      </UTooltip>
      <span
        v-else
        class="cell-secondary"
      >—</span>
    </td>
    <td class="assignment-cell assignment-cell--executor">
      <USelectMenu
        :model-value="selectedExecutorValue()"
        :items="executorItems"
        value-key="value"
        color="neutral"
        variant="outline"
        size="sm"
        class="assignment-executor"
        :ui="executorSelectMenuUi"
        :disabled="savingExecutor"
        placeholder="Pilih eksekutor"
        @update:model-value="updateExecutor"
      />
    </td>
    <td class="assignment-cell assignment-cell--handling">
      <span
        class="handling-progress"
        :aria-label="`${group.summary.handled} dari ${group.summary.total} KBLI selesai`"
      >
        {{ group.summary.handled }}/{{ group.summary.total }} selesai
      </span>
    </td>
  </tr>

  <tr
    v-if="expanded"
    class="assignment-detail-row"
  >
    <td
      :colspan="8"
      class="assignment-detail-cell"
    >
      <div
        :id="detailsId"
        class="assignment-detail"
      >
        <table class="kbli-table">
          <thead>
            <tr>
              <th
                scope="col"
                class="kbli-table__kategori"
              >
                Kategori
              </th>
              <th
                scope="col"
                class="kbli-table__data"
              >
                Data
              </th>
              <th
                scope="col"
                class="kbli-table__catatan"
              >
                Catatan
              </th>
              <th
                scope="col"
                class="kbli-table__status"
              >
                Status
              </th>
              <th
                scope="col"
                class="kbli-table__action"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <KbliRow
              v-for="finding in group.kbli"
              :key="finding.id"
              :kbli="finding"
              :expanded="Boolean(expandedData[finding.id])"
              :saving="Boolean(saving[finding.id])"
              @toggle-data="emit('toggle-data', finding.id)"
              @toggle-handling="emit('toggle-handling', finding)"
            />
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.assignment-row {
  background: var(--color-paper);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.assignment-row--expanded,
.assignment-row:focus-within {
  background: var(--color-paper-2);
}

.assignment-cell {
  padding: 0.625rem var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule);
  vertical-align: middle;
}

.assignment-cell--toggle,
.assignment-cell--fasih {
  text-align: center;
}

.assignment-cell--handling {
  min-width: 11.5rem;
}

.assignment-cell--executor {
  min-width: 11rem;
}

.assignment-executor {
  min-width: 10rem;
}

.cell-primary,
.cell-secondary {
  display: block;
  overflow-wrap: anywhere;
}

.cell-primary {
  color: var(--color-ink);
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1.3;
}

.cell-secondary {
  margin-top: 0.125rem;
  color: var(--color-muted);
  font-family: inherit;
  font-size: var(--text-2xs);
  line-height: 1.3;
}

.assignment-id {
  font-variant-numeric: tabular-nums;
}

.assignment-name {
  max-width: 18rem;
}

.assignment-toggle,
.assignment-fasih-link {
  display: inline-grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border: var(--rule) solid var(--color-rule);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-muted);
  text-decoration: none;
  transition:
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.assignment-toggle {
  cursor: pointer;
}

.assignment-toggle:focus-visible,
.assignment-fasih-link:focus-visible {
  outline: var(--rule-focus) solid var(--color-focus);
  outline-offset: 2px;
}

.assignment-toggle:active,
.assignment-fasih-link:active {
  transform: translateY(1px);
}

.assignment-fasih-link {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-accent-ink);
}

.assignment-toggle:hover,
.assignment-fasih-link:hover {
  transform: none;
}

.source-status {
  display: inline-flex;
  align-items: center;
  min-height: 1.25rem;
  max-width: 100%;
  padding: 0 var(--space-2);
  border: var(--rule) solid var(--color-rule-2);
  border-radius: var(--radius-sm);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  line-height: 1;
  overflow-wrap: anywhere;
}

.source-status--blue {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-accent-ink);
}

.source-status--red {
  border-color: var(--color-error);
  background: var(--color-error);
  color: var(--color-accent-ink);
}

.source-status--green {
  border-color: var(--color-success);
  background: var(--color-success);
  color: var(--color-accent-ink);
}

.handling-progress {
  font-size: var(--text-xs);
  font-weight: 600;
}

.assignment-detail-row {
  background: var(--color-paper-2);
}

.assignment-detail-cell {
  padding: 0;
  border-bottom: var(--rule) solid var(--color-rule-2);
}

.assignment-detail {
  padding: var(--space-2) var(--space-3) var(--space-3);
}

.kbli-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border: var(--rule) solid var(--color-rule);
  background: var(--color-paper);
  color: var(--color-ink-2);
}

.kbli-table th {
  padding: var(--space-2) var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule);
  background: var(--color-paper);
  color: var(--color-ink-2);
  font-family: inherit;
  font-size: var(--text-2xs);
  font-weight: 500;
  letter-spacing: 0;
  text-align: start;
}

.kbli-table__kategori {
  width: 4.5rem;
}

.kbli-table__data {
  width: auto;
}

.kbli-table__catatan {
  width: 19%;
}

.kbli-table__status {
  width: 10.5rem;
}

.kbli-table__action {
  width: 12rem;
}

@media (hover: hover) and (pointer: fine) {
  .assignment-toggle:hover,
  .assignment-fasih-link:hover {
    background: var(--color-paper-2);
    color: var(--color-accent);
    transform: translateY(-1px);
  }

  .assignment-toggle:hover {
    transform: none;
  }

  .assignment-fasih-link:hover {
    border-color: var(--color-accent);
    background: var(--color-accent);
    color: var(--color-accent-ink);
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .assignment-row,
  .assignment-toggle,
  .assignment-fasih-link {
    transition-duration: 150ms;
  }
}
</style>
