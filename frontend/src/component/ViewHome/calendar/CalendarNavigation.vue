<script setup lang="ts">
import Button from '@/component/Button.vue'
import { StoreI18n } from '@/store/StoreI18n'

const props = defineProps<{
  monthYear: string
  prevMonth: () => void
  nextMonth: () => void
}>()

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <div class="calendar-navigation">
    <Button
      icon="mdi-chevron-left"
      variant="text"
      @click="props.prevMonth"
      :aria-label="translate('previous_month')"
    />

    <div class="calendar-navigation-label">
      {{ props.monthYear }}
    </div>

    <Button
      icon="mdi-chevron-right"
      variant="text"
      @click="props.nextMonth"
      :aria-label="translate('next_month')"
    />
  </div>
</template>

<style scoped>
@import '@/css/component/ViewHome/calendar/CalendarNavigation.css';
</style>
