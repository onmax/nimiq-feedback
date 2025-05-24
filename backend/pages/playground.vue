<template #dev-only>
  <div>
    <h1>This is the development playground.</h1>
    <NuxtLink to="/">Go to Documentation</NuxtLink>

    <div class="language-selector">
      <label for="language-select">Select Language: </label>
      <select id="language-select" v-model="selectedLanguage">
        <option value="en">
          English
        </option>
        <option value="es">
          Español
        </option>
      </select>
    </div>

    <FeedbackModal :language="selectedLanguage" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FeedbackModal from '~/components/FeedbackModal.vue' // Adjusted path

const selectedLanguage = ref('en')
</script>

<style scoped>
.language-selector {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.language-selector label {
  margin-right: 0.5rem;
}
</style>
