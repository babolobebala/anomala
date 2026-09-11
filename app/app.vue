<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'id'
  }
})

const title = 'Anomali SE 2026'
const description = 'Operasional penanganan anomali Sensus Ekonomi 2026.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <RouteLoadingIndicator />
    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
