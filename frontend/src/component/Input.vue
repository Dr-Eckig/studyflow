<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string
  password?: boolean
}>()

const text = defineModel<string>('text')

const showPassword = ref(false)
</script>

<template>
  <v-text-field
    v-model="text"
    :label="props.label"
    variant="solo"
    :type="props.password ? (showPassword ? 'text' : 'password') : 'text'"
    :append-inner-icon="props.password ? (showPassword ? 'mdi-eye-off' : 'mdi-eye') : undefined"
    @click:append-inner="() => (showPassword = !showPassword)"
  />
</template>
