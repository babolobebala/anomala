<template>
  <main class="placeholder-page">
    <AppNavbar />
    <section class="placeholder-page__content">
      <h1>Penelusuran KBLI</h1>
      <p>Halaman penelusuran KBLI sedang disiapkan.</p>
    </section>
  </main>
</template>

<style scoped>
.placeholder-page {
  min-height: 100dvh;
  padding: 0 clamp(var(--space-3), 2vw, var(--space-6));
}

.placeholder-page__content {
  width: min(100%, 60rem);
  margin-inline: auto;
  padding-block: var(--space-10);
}

h1 {
  margin: 0;
  color: var(--color-ink);
  font-size: var(--text-2xl);
  font-weight: 650;
  letter-spacing: -0.03em;
}

p {
  margin: var(--space-2) 0 0;
  color: var(--color-muted);
  font-size: var(--text-sm);
}
</style>
