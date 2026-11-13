<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import Button from '../Button.vue'
import Chip from '../Chip.vue'

const { weekHeader } = defineProps<{
  weekHeader: string
  prevWeek: () => void
  nextWeek: () => void
  goToToday: () => void
}>()

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <div class="navigation-header">
    <div class="week-navigation">
      <Button
        icon="mdi-chevron-left"
        size="small"
        variant="tonal"
        @click="prevWeek"
        :aria-label="translate('previous_week')"
      />

      <!-- Desktop/ Tablet Buttons -->
      <Button
        :label="translate('today')"
        color="primary"
        rounded
        @click="goToToday"
        class="is-hidden-tablet-and-mobile"
      />
      <Chip
        :label="weekHeader"
        color="primary"
        variant="tonal"
        rounded
        size="large"
        class="is-hidden-tablet-and-mobile not-clickable"
      />

      <!-- Mobile Buttons -->
      <Button
        label="Heute"
        color="primary"
        size="small"
        rounded
        @click="goToToday"
        class="is-hidden-desktop"
      />
      <Chip
        :label="weekHeader"
        color="primary"
        size="small"
        variant="tonal"
        rounded
        class="is-hidden-desktop not-clickable"
      />

      <Button
        icon="mdi-chevron-right"
        size="small"
        variant="tonal"
        @click="nextWeek"
        :aria-label="translate('next_week')"
      />
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewLearningPlan/NavigationHeader.css';
</style>
