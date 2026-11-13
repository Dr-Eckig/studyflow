<script setup lang="ts">
const { modelValue } = defineProps<{ modelValue: boolean }>()
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="modal-overlay">
      <div class="modal" @click.stop>
        <!-- Children/ Content of the Modal -->
        <slot />
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import '@/css/component/Modal.css';
</style>
