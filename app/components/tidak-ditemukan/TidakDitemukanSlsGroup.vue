<script setup lang="ts">
import type { TidakDitemukanSlsGroup } from '~/types/tidak-ditemukan'

const props = defineProps<{ group: TidakDitemukanSlsGroup, expanded: boolean, saving: boolean }>()
const emit = defineEmits<{ toggle: [], 'update-status': [isSelesai: boolean] }>()
const detailsId = computed(() => `tidak-ditemukan-${encodeURIComponent(props.group.idSubsls)}`)
</script>

<template>
  <tr class="sls-row">
    <td><UButton color="neutral" variant="ghost" size="sm" :icon="expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'" :aria-controls="detailsId" :aria-expanded="expanded" @click="emit('toggle')" /></td>
    <td><strong>{{ group.wilayah.namaSls }}</strong><span>{{ group.idSubsls }}</span></td>
    <td><strong>{{ group.wilayah.kecamatan }}</strong><span>{{ group.wilayah.desa }}</span></td>
    <td>{{ group.wilayah.ppl }}</td>
    <td>{{ group.wilayah.pml }}</td>
    <td>{{ group.assignments.length }}</td>
    <td><UBadge :color="group.isSelesai ? 'success' : 'error'" variant="solid">{{ group.isSelesai ? 'Selesai' : 'Belum selesai' }}</UBadge></td>
    <td class="sls-row__actions">
      <a :href="`/api/tidak-ditemukan/${encodeURIComponent(group.idSubsls)}/docx`" class="download-docx">Download DOCX</a>
      <UButton :label="group.isSelesai ? 'Batalkan' : 'Tandai selesai'" :color="group.isSelesai ? 'neutral' : 'success'" size="xs" :loading="saving" @click="emit('update-status', !group.isSelesai)" />
    </td>
  </tr>
  <tr v-if="expanded" class="sls-detail-row">
    <td :colspan="8"><div :id="detailsId" class="sls-detail"><table><thead><tr><th>No.</th><th>Nama Assignment</th></tr></thead><tbody><tr v-for="(assignment, index) in group.assignments" :key="assignment.id"><td>{{ index + 1 }}</td><td>{{ assignment.namaAssignment }}</td></tr></tbody></table></div></td>
  </tr>
</template>

<style scoped>
.sls-row td { padding: 0.625rem var(--space-3); border-bottom: var(--rule) solid var(--color-rule); font-size: var(--text-xs); vertical-align: middle; }
.sls-row td span { display: block; margin-top: 0.125rem; color: var(--color-muted); font-size: var(--text-2xs); }
.sls-row__actions { display: flex; gap: var(--space-1); white-space: nowrap; }
.download-docx { display: inline-flex; align-items: center; min-height: 1.5rem; padding: 0.25rem 0.5rem; border: var(--rule) solid var(--color-rule); border-radius: var(--radius-sm); color: var(--color-ink); font-size: var(--text-2xs); font-weight: 500; text-decoration: none; }
.download-docx:hover { background: var(--color-paper-2); }
.sls-detail-row td { padding: 0; background: var(--color-paper-2); }
.sls-detail { padding: var(--space-3); }
.sls-detail table { width: 100%; border-collapse: collapse; background: var(--color-paper); }
.sls-detail th, .sls-detail td { padding: var(--space-2) var(--space-3); border: var(--rule) solid var(--color-rule); text-align: start; font-size: var(--text-xs); }
.sls-detail th:first-child, .sls-detail td:first-child { width: 4rem; }
</style>
