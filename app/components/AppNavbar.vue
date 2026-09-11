<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Anomali', to: '/anomali' },
  { label: 'Rekap Anomali', to: '/rekap-anomali' },
  { label: 'KBLI', to: '/kbli' },
  { label: 'Rekap KBLI', to: '/rekap-kbli' }
] as const

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <header class="app-navbar">
    <div class="app-navbar__inner">
      <NuxtLink
        to="/"
        class="app-navbar__brand"
        aria-label="Sensus Ekonomi 2026, beranda"
      >
        Sensus Ekonomi 2026
      </NuxtLink>

      <nav
        class="app-navbar__links"
        aria-label="Navigasi utama"
      >
        <UButton
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :label="item.label"
          :color="isActive(item.to) ? 'primary' : 'neutral'"
          variant="solid"
          size="sm"
          class="app-navbar__link"
          :class="{ 'app-navbar__link--active': isActive(item.to) }"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        />
      </nav>

      <div class="app-navbar__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-navbar {
  width: 100%;
  padding-block: var(--space-3);
  border-bottom: var(--rule) solid var(--color-rule);
}

.app-navbar__inner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 2.5rem;
}

.app-navbar__brand {
  flex: 0 0 auto;
  color: var(--color-ink);
  font-size: var(--text-sm);
  font-weight: 650;
  letter-spacing: -0.015em;
  text-decoration: none;
  white-space: nowrap;
}

.app-navbar__links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  min-width: 0;
  margin-inline: auto;
}

.app-navbar__link {
  white-space: nowrap;
}

.app-navbar__link--active {
  color: var(--color-accent-ink);
}

.app-navbar__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  margin-inline-start: auto;
}

@media (max-width: 54rem) {
  .app-navbar__inner {
    flex-wrap: wrap;
  }

  .app-navbar__links {
    order: 3;
    flex-basis: 100%;
    justify-content: flex-start;
    margin-inline: 0;
    padding-top: var(--space-1);
    overflow-x: auto;
  }
}

@media (max-width: 30rem) {
  .app-navbar__links {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-1);
    overflow-x: visible;
  }

  .app-navbar__link {
    width: 100%;
    justify-content: center;
  }
}
</style>
