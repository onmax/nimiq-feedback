<template>
  <div nq-prose>
    <NuxtLink v-if="isDevMode" to="/playground">Go to Playground (Dev Only)</NuxtLink>
    <NuxtContent />
  </div>
</template>

<script setup lang="ts">
// In Nuxt 3 (which uses Vite), import.meta.env.DEV is the standard way to check for development mode.
const isDevMode = import.meta.env.DEV;
</script>
