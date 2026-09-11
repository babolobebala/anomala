<template>
  <main class="landing-page">
    <section
      class="landing-menu"
      aria-labelledby="landing-title"
    >
      <h1 id="landing-title">
        Sensus Ekonomi 2026
      </h1>
      <p class="landing-menu__subtitle">
        Menu Utama
      </p>
      <div class="landing-menu__links">
        <UButton
          label="Penanganan Anomali"
          to="/anomali"
          color="neutral"
          variant="outline"
          size="lg"
          class="landing-menu__link"
        />
        <UButton
          label="Rekap Anomali"
          to="/rekap-anomali"
          color="neutral"
          variant="outline"
          size="lg"
          class="landing-menu__link"
        />
        <UButton
          label="Penelusuran KBLI"
          to="/kbli"
          color="neutral"
          variant="outline"
          size="lg"
          class="landing-menu__link"
        />
        <UButton
          label="Rekap KBLI"
          to="/rekap-kbli"
          color="neutral"
          variant="outline"
          size="lg"
          class="landing-menu__link"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing-page {
  display: grid;
  min-height: 100dvh;
  place-items: center;
  padding: clamp(var(--space-6), 8vw, var(--space-10)) var(--space-4);
}

.landing-menu {
  width: min(100%, 25rem);
  text-align: center;
}

.landing-menu__subtitle {
  margin: 0;
  color: var(--color-muted);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: var(--color-ink);
  font-size: clamp(var(--text-xl), 4vw, var(--text-2xl));
  font-weight: 650;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
}

.landing-menu__subtitle + .landing-menu__links {
  margin-top: var(--space-5);
}

.landing-menu__links {
  display: grid;
  gap: var(--space-2);
}

.landing-menu__link {
  width: 100%;
  justify-content: center;
}
</style>
