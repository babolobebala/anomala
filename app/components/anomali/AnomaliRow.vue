<script setup lang="ts">
import AnomaliDataPreview from './AnomaliDataPreview.vue'
import type { AnomalyListItem } from '~/types/anomali'

defineProps<{
  anomaly: AnomalyListItem
  expanded: boolean
  saving: boolean
}>()

const emit = defineEmits<{
  'toggle-data': []
  'toggle-handling': []
  'toggle-field-condition': []
}>()
</script>

<template>
  <tr class="anomaly-row">
    <td class="anomaly-cell anomaly-cell--code">
      <span class="anomaly-code">{{ anomaly.kodeAnomali }}</span>
    </td>
    <td class="anomaly-cell anomaly-cell--description">
      <p>{{ anomaly.deskripsi }}</p>
      <p
        v-if="anomaly.catatan"
        class="anomaly-note"
      >
        <strong>Catatan:</strong> {{ anomaly.catatan }}
      </p>
    </td>
    <td class="anomaly-cell anomaly-cell--data">
      <AnomaliDataPreview
        :data="anomaly.data"
        :expanded="expanded"
        @toggle="emit('toggle-data')"
      />
    </td>
    <td class="anomaly-cell anomaly-cell--status">
      <span
        class="handling-status"
        :class="
          anomaly.isActive && !anomaly.isHandled && !anomaly.isSesuaiLapangan
            ? 'handling-status--pending'
            : anomaly.isActive && anomaly.isSesuaiLapangan
              ? 'handling-status--field-condition'
            : 'handling-status--done'
        "
      >
        {{
          !anomaly.isActive
            ? "Selesai + anomali hilang"
            : anomaly.isSesuaiLapangan
              ? "Sesuai kondisi lapangan"
              : anomaly.isHandled
                ? "Selesai (tandai)"
                : "Belum selesai"
        }}
      </span>
    </td>
    <td class="anomaly-cell anomaly-cell--action">
      <div
        v-if="anomaly.isActive"
        class="anomaly-actions"
      >
        <button
          v-if="anomaly.isSesuaiLapangan"
          type="button"
          class="anomaly-action"
          :disabled="saving"
          @click="emit('toggle-field-condition')"
        >
          <UIcon
            v-if="saving"
            name="i-lucide-loader-circle"
            class="anomaly-action__icon loading-icon"
            aria-hidden="true"
          />
          <UIcon
            v-else
            name="i-lucide-undo-2"
            class="anomaly-action__icon"
            aria-hidden="true"
          />
          {{ saving ? "Memproses" : "Batalkan" }}
        </button>
        <button
          v-else-if="anomaly.isHandled"
          type="button"
          class="anomaly-action"
          :disabled="saving"
          @click="emit('toggle-handling')"
        >
          <UIcon
            v-if="saving"
            name="i-lucide-loader-circle"
            class="anomaly-action__icon loading-icon"
            aria-hidden="true"
          />
          <UIcon
            v-else
            name="i-lucide-undo-2"
            class="anomaly-action__icon"
            aria-hidden="true"
          />
          {{ saving ? "Memproses" : "Batalkan" }}
        </button>
        <template v-else>
          <button
            type="button"
            class="anomaly-action"
            :disabled="saving"
            @click="emit('toggle-handling')"
          >
            <UIcon
              v-if="saving"
              name="i-lucide-loader-circle"
              class="anomaly-action__icon loading-icon"
              aria-hidden="true"
            />
            <UIcon
              v-else
              name="i-lucide-check"
              class="anomaly-action__icon"
              aria-hidden="true"
            />
            {{ saving ? "Memproses" : "Tandai selesai" }}
          </button>
          <button
            type="button"
            class="anomaly-action"
            :disabled="saving"
            @click="emit('toggle-field-condition')"
          >
            <UIcon
              name="i-lucide-flag"
              class="anomaly-action__icon"
              aria-hidden="true"
            />
            Sesuai kondisi lapangan
          </button>
        </template>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.anomaly-row {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-bottom: var(--rule) solid var(--color-rule);
}

.anomaly-row__code strong {
  display: block;
  color: var(--color-accent);
  font-family: inherit;
  font-size: var(--text-sm);
}

.anomaly-row__code span {
  display: block;
  margin-top: var(--space-1);
  color: var(--color-ink);
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.45;
}

.anomaly-note {
  margin: var(--space-2) 0 0;
  color: var(--color-muted);
  font-size: var(--text-xs);
  line-height: 1.5;
}

.anomaly-row__statuses {
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  gap: var(--space-2);
}

.status-chip {
  display: inline-flex;
  min-height: 1.625rem;
  align-items: center;
  padding: 0 var(--space-2);
  border: var(--rule) solid currentColor;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: var(--text-2xs);
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.status-chip--active {
  color: var(--color-success);
}
.status-chip--inactive {
  color: var(--color-muted);
}
.status-chip--handled {
  color: var(--color-success);
}
.status-chip--unhandled {
  color: var(--color-warning);
}
.status-chip--source {
  color: var(--color-accent);
}

.handled-time {
  align-self: center;
  color: var(--color-muted);
  font-family: inherit;
  font-size: var(--text-xs);
}

.anomaly-row__action {
  display: flex;
  align-items: start;
}

.anomaly-row__action :deep(button) {
  white-space: nowrap;
}

@media (min-width: 40rem) {
  .anomaly-row {
    grid-template-columns: minmax(10rem, 0.9fr) minmax(16rem, 1.7fr) minmax(
        12rem,
        0.9fr
      ) auto;
    align-items: start;
  }
}

@media (max-width: 39.99rem) {
  .anomaly-row__action :deep(button) {
    width: 100%;
  }
}

.anomaly-row {
  display: table-row;
  background: var(--color-paper);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.anomaly-cell {
  padding: var(--space-2);
  border-bottom: var(--rule) solid var(--color-rule);
  vertical-align: top;
}

.anomaly-cell--code {
  width: 4.5rem;
}

.anomaly-cell--description {
  width: 19%;
}

.anomaly-cell--data {
  width: auto;
}

.anomaly-cell--status {
  width: 10.5rem;
}

.anomaly-cell--action {
  width: 12rem;
}

.anomaly-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
  min-width: 0;
}

.anomaly-code {
  display: block;
  color: var(--color-accent);
  font-family: inherit;
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1.35;
}

.anomaly-cell--description > p {
  margin: 0;
  color: var(--color-ink);
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.anomaly-cell--description > .anomaly-note {
  margin-top: var(--space-1);
  color: var(--color-muted);
  font-weight: 400;
}

.handling-status {
  display: inline-flex;
  min-height: 1.375rem;
  align-items: center;
  padding: 0 var(--space-2);
  border: var(--rule) solid currentColor;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: var(--text-2xs);
  line-height: 1;
  white-space: nowrap;
}

.handling-status--done {
  color: var(--color-success);
}

.handling-status--pending {
  color: var(--color-error);
}

.anomaly-action {
  position: relative;
  display: inline-flex;
  width: 100%;
  min-height: 2rem;
  align-items: center;
  gap: var(--space-1);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-accent);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: 1.2;
  text-align: start;
  white-space: normal;
  transition:
    color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.anomaly-action::before {
  position: absolute;
  inset: -0.125rem -0.25rem;
  content: '';
}

.anomaly-action__icon {
  flex: 0 0 auto;
  width: 0.875rem;
  height: 0.875rem;
}

.anomaly-action:disabled {
  color: var(--color-muted);
  cursor: not-allowed;
}

.anomaly-action:focus-visible {
  outline: var(--rule-focus) solid var(--color-focus);
  outline-offset: 2px;
}

.anomaly-action:active {
  transform: translateY(1px);
}

.loading-icon {
  animation: anomaly-spin 700ms linear infinite;
}

@keyframes anomaly-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (hover: hover) and (pointer: fine) {
  .anomaly-row:hover {
    background: var(--color-paper-2);
  }

  .anomaly-action:not(:disabled):hover {
    color: var(--color-ink);
    transform: translateY(-1px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .anomaly-row,
  .anomaly-action {
    transition-duration: 150ms;
  }

  .loading-icon {
    animation-duration: 1.4s;
  }
}

.anomaly-cell {
  padding: var(--space-2) var(--space-3);
  border-bottom-color: var(--color-rule);
}

.anomaly-code {
  color: var(--color-ink);
  font-size: var(--text-2xs);
}

.anomaly-cell--description > p {
  font-size: var(--text-2xs);
  font-weight: 500;
  line-height: 1.35;
}

.handling-status {
  min-height: 1.25rem;
  border-color: var(--color-rule-2);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
}

.handling-status--done {
  border-color: var(--color-success);
  background: var(--color-success);
  color: var(--color-accent-ink);
}

.handling-status--pending {
  border-color: var(--color-error);
  background: var(--color-error);
  color: var(--color-accent-ink);
}

.handling-status--field-condition {
  border-color: var(--color-warning);
  background: var(--color-warning);
  color: var(--color-accent-ink);
}

.anomaly-action {
  min-height: 1.5rem;
  font-size: var(--text-2xs);
}
</style>
