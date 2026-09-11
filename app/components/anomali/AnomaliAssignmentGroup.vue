<script setup lang="ts">
import AnomaliRow from './AnomaliRow.vue'
import type {
  AnomalyListItem,
  AssignmentAnomalyGroup,
  ExecutorOption
} from '~/types/anomali'

const props = defineProps<{
  group: AssignmentAnomalyGroup
  expanded: boolean
  saving: Record<string, boolean>
  savingExecutor: boolean
  expandedData: Record<string, boolean>
  executorOptions: ExecutorOption[]
}>()

const emit = defineEmits<{
  'toggle-assignment': []
  'toggle-data': [id: string]
  'toggle-handling': [anomaly: AnomalyListItem]
  'toggle-field-condition': [anomaly: AnomalyListItem]
  'update-executor': [eksekutorId: string | null]
}>()

const detailsId = computed(
  () => `assignment-${encodeURIComponent(props.group.assignmentId)}`
)
const hasActiveAnomalies = computed(() =>
  props.group.anomalies.some(anomaly => anomaly.isActive)
)
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
        v-if="hasActiveAnomalies"
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
        :aria-label="`${group.summary.handled} dari ${group.summary.total} anomali selesai`"
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
        <table class="anomaly-table">
          <thead>
            <tr>
              <th
                scope="col"
                class="anomaly-table__code"
              >
                Jenis
              </th>
              <th
                scope="col"
                class="anomaly-table__description"
              >
                Keterangan anomali
              </th>
              <th
                scope="col"
                class="anomaly-table__data"
              >
                Data anomali
              </th>
              <th
                scope="col"
                class="anomaly-table__status"
              >
                Status
              </th>
              <th
                scope="col"
                class="anomaly-table__action"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <AnomaliRow
              v-for="anomaly in group.anomalies"
              :key="anomaly.id"
              :anomaly="anomaly"
              :expanded="Boolean(expandedData[anomaly.id])"
              :saving="Boolean(saving[anomaly.id])"
              @toggle-data="emit('toggle-data', anomaly.id)"
              @toggle-handling="emit('toggle-handling', anomaly)"
              @toggle-field-condition="emit('toggle-field-condition', anomaly)"
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
  padding: var(--space-2) var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule);
  vertical-align: middle;
}

.assignment-cell--toggle,
.assignment-cell--fasih {
  text-align: center;
}

.assignment-cell--handling {
  min-width: 7.5rem;
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
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.35;
}

.cell-secondary {
  margin-top: var(--space-1);
  color: var(--color-muted);
  font-family: inherit;
  font-size: var(--text-2xs);
  line-height: 1.35;
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
  width: var(--control-height);
  height: var(--control-height);
  place-items: center;
  border: var(--rule) solid var(--color-rule-2);
  border-radius: var(--radius-sm);
  background: var(--color-paper);
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

.source-status {
  display: inline-flex;
  align-items: center;
  min-height: 1.375rem;
  max-width: 100%;
  padding: 0 var(--space-2);
  border: var(--rule) solid var(--color-rule-2);
  border-radius: var(--radius-sm);
  color: var(--color-ink-2);
  font-family: inherit;
  font-size: var(--text-2xs);
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.handling-progress {
  display: block;
  color: var(--color-ink);
  font-family: inherit;
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
  line-height: 1.35;
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

.anomaly-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: var(--color-paper);
  color: var(--color-ink-2);
}

.anomaly-table th {
  padding: var(--space-2);
  border-bottom: var(--rule) solid var(--color-rule);
  background: var(--color-paper-3);
  color: var(--color-muted);
  font-family: inherit;
  font-size: var(--text-2xs);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-align: start;
}

.anomaly-table__status {
  width: 10.5rem;
}

.anomaly-table__action {
  width: 12rem;
}

.anomaly-table__code {
  width: 4.5rem;
}

.anomaly-table__description {
  width: 19%;
}

.anomaly-table__data {
  width: auto;
}

@media (hover: hover) and (pointer: fine) {
  .assignment-row:hover {
    background: var(--color-paper-2);
  }

  .assignment-toggle:hover,
  .assignment-fasih-link:hover {
    background: var(--color-paper-2);
    color: var(--color-accent);
    transform: translateY(-1px);
  }

}

@media (prefers-reduced-motion: reduce) {
  .assignment-row,
  .assignment-toggle,
  .assignment-fasih-link {
    transition-duration: 150ms;
  }
}

.assignment-group {
  overflow: clip;
  border: var(--rule) solid var(--color-rule);
  background: var(--color-paper);
  color: var(--color-ink-2);
}

.assignment-group__header,
.assignment-group__context {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.assignment-group__header {
  padding: var(--space-4) var(--space-5);
  border-bottom: var(--rule) solid var(--color-rule);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
}

.assignment-group__name {
  margin: 0;
  color: var(--color-ink);
  font-family: inherit;
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.assignment-group__id,
.group-summary {
  color: var(--color-muted);
  font-family: inherit;
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
}

.assignment-group__id {
  margin: var(--space-1) 0 0;
}

.fasih-link {
  display: inline-flex;
  min-height: 2.25rem;
  align-items: center;
  padding: 0 var(--space-3);
  border: var(--rule) solid var(--color-rule-2);
  border-radius: var(--radius-sm);
  color: var(--color-accent);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.3;
  text-decoration: none;
  white-space: nowrap;
}

.assignment-group__context {
  padding: var(--space-4) var(--space-5);
  border-bottom: var(--rule) solid var(--color-rule);
}

.assignment-group__context dl {
  display: grid;
  gap: var(--space-2);
  margin: 0;
}

.assignment-group__context dl div {
  display: grid;
  grid-template-columns: minmax(6rem, 9rem) minmax(0, 1fr);
  gap: var(--space-2);
}

.assignment-group__context dt {
  color: var(--color-muted);
}

.assignment-group__context dd {
  margin: 0;
  color: var(--color-ink-2);
  font-size: var(--text-xs);
  overflow-wrap: anywhere;
}

.assignment-group__context dt {
  font-size: var(--text-xs);
}

.group-summary {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-3);
  max-width: 23rem;
  margin: 0;
  text-align: end;
}

.group-summary strong {
  color: var(--color-ink);
}

.anomaly-list {
  display: grid;
}

.anomaly-list :deep(.anomaly-row:last-child) {
  border-bottom: 0;
}

.fasih-link:active {
  color: var(--color-ink);
}

@media (hover: hover) and (pointer: fine) {
  .fasih-link:hover {
    border-color: var(--color-accent);
    color: var(--color-ink);
  }
}

@media (min-width: 60rem) {
  .assignment-group__context dl {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--space-6);
  }
}

@media (max-width: 39.99rem) {
  .assignment-group__header,
  .assignment-group__context {
    flex-direction: column;
  }

  .assignment-group__actions,
  .fasih-link {
    width: 100%;
  }

  .group-summary {
    text-align: start;
  }
}

.assignment-cell {
  padding: 0.625rem var(--space-3);
  border-bottom-color: var(--color-rule);
}

.assignment-cell--handling {
  min-width: 11.5rem;
}

.cell-primary {
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1.3;
}

.cell-secondary {
  margin-top: 0.125rem;
  font-size: var(--text-2xs);
  line-height: 1.3;
}

.assignment-toggle,
.assignment-fasih-link {
  width: 2.25rem;
  height: 2.25rem;
  border-color: var(--color-rule);
  border-radius: var(--radius-sm);
  background: transparent;
}

.assignment-toggle:hover,
.assignment-fasih-link:hover {
  transform: none;
}

.assignment-fasih-link {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-accent-ink);
}

@media (hover: hover) and (pointer: fine) {
  .assignment-fasih-link:hover {
    border-color: var(--color-accent);
    background: var(--color-accent);
    color: var(--color-accent-ink);
  }
}

.source-status {
  min-height: 1.25rem;
  background: var(--color-paper-2);
  color: var(--color-ink-2);
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

.assignment-detail {
  padding: var(--space-2) var(--space-3) var(--space-3);
}

.anomaly-table {
  border: var(--rule) solid var(--color-rule);
  background: var(--color-paper);
}

.anomaly-table th {
  padding: var(--space-2) var(--space-3);
  background: var(--color-paper);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  letter-spacing: 0;
}
</style>
