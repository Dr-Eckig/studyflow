<script setup lang="ts">
import { getMotivationText } from '@/util/motivationText'
</script>

<template>
  <div class="sheet motivation-card statistics-card is-hidden-tablet-and-mobile">
    <div class="card-content">
      <p class="center motivation-text">{{ getMotivationText() }}</p>
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewHome/statistics/Motivation.css';
</style>
