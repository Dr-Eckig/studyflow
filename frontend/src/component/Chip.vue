<script setup lang="ts">
import type { VuetifyColor, VuetifyVariant } from '@/type'

const props = withDefaults(
  defineProps<{
    icon?: string
    label?: string
    color?: VuetifyColor
    variant?: VuetifyVariant
    size?: 'x-small' | 'small' | 'large' | 'x-large'
  }>(),
  {
    // Default Values
    variant: 'flat',
  },
)
</script>

<template>
  <v-chip
    :prepend-icon="props.icon"
    :color="props.color"
    :variant="props.variant"
    :size="props.size"
    class="chip"
  >
    {{ props.label }}
  </v-chip>
</template>

<style scoped>
@import '@/css/component/Chip.css';
</style>
