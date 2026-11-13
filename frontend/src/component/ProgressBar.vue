<script setup lang="ts">
const props = defineProps<{
  percentage: number
  text: string
}>()
</script>

<template>
  <v-progress-linear
    :model-value="props.percentage"
    :color="props.percentage === 100 ? 'success' : 'primary'"
    height="8"
    rounded
    aria-labelledby="progressbar-label"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-label="props.text"
  />
  <p id="progressbar-label" class="progress-bar-text">
    {{ props.text }}
  </p>
</template>

<style scoped>
@import '@/css/component/ProgressBar.css';
</style>
