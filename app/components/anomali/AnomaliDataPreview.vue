<script setup lang="ts">
interface DataRow {
  label: string
  value: string
}

const PREVIEW_LIMIT = 2

const props = defineProps<{
  data: string
  expanded: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const rows = computed<DataRow[]>(() =>
  props.data
    .split(/\r?\n/)
    .map((line) => {
      const divider = line.indexOf(':')

      if (divider <= 0) {
        return null
      }

      const key = line.slice(0, divider).trim()
      const value = line.slice(divider + 1).trim()

      if (!key || !value) {
        return null
      }

      return {
        label: key
          .replace(/[_-]+/g, ' ')
          .replace(/\b\w/g, character => character.toUpperCase()),
        value
      }
    })
    .filter((row): row is DataRow => row !== null)
)

const rawLines = computed(() => props.data.split(/\r?\n/).filter(Boolean))
const isStructured = computed(() => rows.value.length > 0)
const visibleRows = computed(() =>
  props.expanded ? rows.value : rows.value.slice(0, PREVIEW_LIMIT)
)
const visibleRaw = computed(() =>
  (props.expanded
    ? rawLines.value
    : rawLines.value.slice(0, PREVIEW_LIMIT)
  ).join('\n')
)
const hasMore = computed(
  () =>
    (isStructured.value ? rows.value.length : rawLines.value.length)
    > PREVIEW_LIMIT
)
</script>

<template>
  <div class="data-preview">
    <template v-if="isStructured">
      <dl>
        <div
          v-for="entry in visibleRows"
          :key="`${entry.label}-${entry.value}`"
        >
          <dt>{{ entry.label }}</dt>
          <dd>{{ entry.value }}</dd>
        </div>
      </dl>
    </template>
    <pre
      v-else
      class="data-raw"
    >{{ visibleRaw }}</pre>
    <button
      v-if="hasMore"
      type="button"
      class="data-toggle"
      :aria-expanded="expanded"
      @click="emit('toggle')"
    >
      {{ expanded ? "Ringkas" : "Lihat semua" }}
    </button>
  </div>
</template>

<style scoped>
.data-preview dl {
  display: grid;
  gap: var(--space-1);
  margin: 0;
}

.data-preview dl div {
  display: grid;
  grid-template-columns: minmax(4.5rem, 7rem) minmax(0, 1fr);
  gap: var(--space-2);
}

.data-preview dt {
  color: var(--color-muted);
}

.data-preview dd {
  margin: 0;
  color: var(--color-ink-2);
  overflow-wrap: anywhere;
}

.data-preview dt,
.data-preview dd,
.data-raw {
  font-size: var(--text-2xs);
  line-height: 1.35;
}

.data-toggle {
  position: relative;
  min-height: 1.75rem;
  margin-top: var(--space-1);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-accent);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}

.data-toggle::before {
  position: absolute;
  inset: -0.5rem -0.75rem;
  content: '';
}

.data-toggle:focus-visible {
  outline: var(--rule-focus) solid var(--color-focus);
  outline-offset: 2px;
}

.data-toggle:active {
  color: var(--color-ink);
  transform: translateY(1px);
}

.data-raw {
  margin: 0;
  overflow-x: auto;
  color: var(--color-ink-2);
  font-family: inherit;
  white-space: pre-wrap;
}

@media (hover: hover) and (pointer: fine) {
  .data-toggle:hover {
    color: var(--color-ink);
  }
}

@media (prefers-reduced-motion: reduce) {
  .data-toggle {
    transition-duration: 150ms;
  }
}
</style>
