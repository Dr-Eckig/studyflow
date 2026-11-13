<script setup lang="ts">
  import type { VuetifyColor, VuetifyVariant } from '@/type';
  import type { ButtonType } from '@/type/button';

  const props = withDefaults(
    defineProps<{ 
      icon?: string,
      label?: string,
      color?: VuetifyColor,
      variant?:  VuetifyVariant,
      size?: 'x-small' | 'small' | 'large' | 'x-large',
      type?: ButtonType,
      fullwidth?: boolean
    }>(), {
      // Default Values
      variant: 'flat',
      type: 'button',
      fullwidth: false
    }
  )

  const emit = defineEmits<{
    (e: 'click'): void
  }>()
</script>

<template>

  <!-- Icon Button (Vuetify) -->
  <v-btn
    v-if="!props.label"
    :icon="props.icon"
    :color="props.color"
    :variant="props.variant"
    :size="props.size"
    @click="emit('click')"
    tag="button"
  />

  <!-- Button with Text (Vuetify) -->
  <v-btn
    v-else
    :prepend-icon="props.icon"
    :color="props.color"
    :variant="props.variant"
    :size="props.size"
    :type="props.type"
    :block="props.fullwidth"
    @click="emit('click')"
  >
    <span>{{ props.label }} </span>
  </v-btn>
</template>

<style scoped>
  @import '@/css/component/Button.css';
</style>

