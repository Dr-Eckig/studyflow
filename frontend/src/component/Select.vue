<script setup lang="ts">
const props = defineProps<{
  label: string
  options: { label: string; value: string }[]
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <v-select
    :label="props.label"
    :items="props.options"
    item-title="label"
    item-value="value"
    variant="solo"
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
