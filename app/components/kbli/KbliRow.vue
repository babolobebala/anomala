<script setup lang="ts">
import KbliDataPreview from './KbliDataPreview.vue'
import type { KbliFindingItem } from '~/types/kbli'

defineProps<{
  kbli: KbliFindingItem
  expanded: boolean
  saving: boolean
}>()

const emit = defineEmits<{
  'toggle-data': []
  'toggle-handling': []
}>()
</script>

<template>
  <tr class="kbli-row">
    <td class="kbli-cell kbli-cell--kategori">
      <span class="kbli-kategori">{{ kbli.kategori }}</span>
    </td>
    <td class="kbli-cell kbli-cell--data">
      <KbliDataPreview
        :data="kbli.data"
        :expanded="expanded"
        @toggle="emit('toggle-data')"
      />
    </td>
    <td class="kbli-cell kbli-cell--catatan">
      <p
        v-if="kbli.catatan"
        class="kbli-note"
      >
        {{ kbli.catatan }}
      </p>
      <span
        v-else
        class="kbli-empty"
      >—</span>
    </td>
    <td class="kbli-cell kbli-cell--status">
      <span
        class="handling-status"
        :class="
          kbli.isHandled ? 'handling-status--done' : 'handling-status--pending'
        "
      >
        {{ kbli.isHandled ? "Selesai (tandai)" : "Belum selesai" }}
      </span>
    </td>
    <td class="kbli-cell kbli-cell--action">
      <div class="kbli-actions">
        <button
          type="button"
          class="kbli-action"
          :disabled="saving"
          @click="emit('toggle-handling')"
        >
          <UIcon
            v-if="saving"
            name="i-lucide-loader-circle"
            class="kbli-action__icon loading-icon"
            aria-hidden="true"
          />
          <UIcon
            v-else
            :name="kbli.isHandled ? 'i-lucide-undo-2' : 'i-lucide-check'"
            class="kbli-action__icon"
            aria-hidden="true"
          />
          {{ saving ? "Memproses" : kbli.isHandled ? "Batalkan" : "Tandai selesai" }}
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.kbli-row {
  display: table-row;
  background: var(--color-paper);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.kbli-cell {
  padding: var(--space-2) var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule);
  vertical-align: top;
}

.kbli-cell--kategori {
  width: 4.5rem;
}

.kbli-cell--data {
  width: auto;
}

.kbli-cell--catatan {
  width: 19%;
}

.kbli-cell--status {
  width: 10.5rem;
}

.kbli-cell--action {
  width: 12rem;
}

.kbli-kategori {
  display: block;
  color: var(--color-ink);
  font-family: inherit;
  font-size: var(--text-2xs);
  font-weight: 600;
  line-height: 1.35;
}

.kbli-note {
  margin: 0;
  color: var(--color-muted);
  font-size: var(--text-2xs);
  font-weight: 400;
  line-height: 1.35;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.kbli-empty {
  color: var(--color-muted);
  font-size: var(--text-2xs);
}

.kbli-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
  min-width: 0;
}

.handling-status {
  display: inline-flex;
  min-height: 1.25rem;
  align-items: center;
  padding: 0 var(--space-2);
  border: var(--rule) solid var(--color-rule-2);
  border-radius: var(--radius-sm);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
  font-family: inherit;
  font-size: var(--text-2xs);
  line-height: 1;
  white-space: nowrap;
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

.kbli-action {
  position: relative;
  display: inline-flex;
  width: 100%;
  min-height: 1.5rem;
  align-items: center;
  gap: var(--space-1);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-accent);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-2xs);
  font-weight: 500;
  line-height: 1.2;
  text-align: start;
  white-space: normal;
  transition:
    color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.kbli-action::before {
  position: absolute;
  inset: -0.125rem -0.25rem;
  content: '';
}

.kbli-action__icon {
  flex: 0 0 auto;
  width: 0.875rem;
  height: 0.875rem;
}

.kbli-action:disabled {
  color: var(--color-muted);
  cursor: not-allowed;
}

.kbli-action:focus-visible {
  outline: var(--rule-focus) solid var(--color-focus);
  outline-offset: 2px;
}

.kbli-action:active {
  transform: translateY(1px);
}

.loading-icon {
  animation: kbli-spin 700ms linear infinite;
}

@keyframes kbli-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (hover: hover) and (pointer: fine) {
  .kbli-row:hover {
    background: var(--color-paper-2);
  }

  .kbli-action:not(:disabled):hover {
    color: var(--color-ink);
    transform: translateY(-1px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .kbli-row,
  .kbli-action {
    transition-duration: 150ms;
  }

  .loading-icon {
    animation-duration: 1.4s;
  }
}
</style>
