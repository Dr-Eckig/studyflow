<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>

<template>
  <v-textarea :label="props.label" variant="solo" />
</template>
