<script setup lang="ts">
const isVisible = ref(false)
let revealTimer: ReturnType<typeof setTimeout> | undefined

function startLoading(): void {
  if (revealTimer) {
    clearTimeout(revealTimer)
  }

  revealTimer = setTimeout(() => {
    isVisible.value = true
    revealTimer = undefined
  }, 100)
}

function finishLoading(): void {
  if (revealTimer) {
    clearTimeout(revealTimer)
    revealTimer = undefined
  }

  isVisible.value = false
}

if (import.meta.client) {
  const nuxtApp = useNuxtApp()

  nuxtApp.hook('page:loading:start', startLoading)
  nuxtApp.hook('page:loading:end', finishLoading)

  onBeforeUnmount(() => {
    if (revealTimer) {
      clearTimeout(revealTimer)
    }
  })
}
</script>

<template>
  <div
    v-if="isVisible"
    class="route-loading-indicator"
    role="status"
    aria-label="Memuat halaman"
  >
    <span class="route-loading-indicator__spinner" />
  </div>
</template>

<style scoped>
.route-loading-indicator {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: var(--color-paper);
}

.route-loading-indicator__spinner {
  width: clamp(3rem, 8vw, 4rem);
  height: clamp(3rem, 8vw, 4rem);
  border: 0.375rem solid var(--color-rule-2);
  border-top-color: var(--color-accent);
  border-radius: 999px;
  animation: route-loading-spin 700ms linear infinite;
}

@keyframes route-loading-spin {
  to {
    transform: rotate(1turn);
  }
}

@media (prefers-reduced-motion: reduce) {
  .route-loading-indicator__spinner {
    animation-duration: 1.5s;
  }
}
</style>
