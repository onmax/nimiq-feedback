<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const rating = defineModel<number>({ default: 0 })
const { t } = useI18n()
</script>

<template>
  <div
    flex="~ items-center justify-center gap-24" outline="[&:has(:focus-visible)]:1.5 blue" mx-auto rounded-4 w-max
    f-p-sm
  >
    <template v-for="i in 5" :key="i">
      <input :id="`rating-${i}`" v-model="rating" class="peer" type="radio" name="rating" :value="i" sr-only>
      <label
        :for="`rating-${i}`" :data-state="i <= rating ? 'active' : undefined"
        text="neutral-300 data-[state=active]:gold hocus:gold [&:has(~_label:hover)]:gold" :style="`--i: ${i}; --b:40ms`"
        delay="[calc(25ms*var(--i))] group-hocus:[calc(var(--b)*(5-var(--i)))]" size-40 cursor-pointer transition-colors
        ease-out i-nimiq:star
      />
    </template>
  </div>

  <label flex f-mt-sm>
    <textarea
      id="description" name="description" :placeholder="t('feedbackForm.descriptionPlaceholder')" rows="4"
      required nq-input-box
    />
  </label>
</template>
