<script setup lang="ts">
import { getWeekdayArray } from '@/util/calendar/calendar'
</script>

<template>
  <div class="calendar-weekdays">
    <div v-for="day in getWeekdayArray()" :key="'weekday-' + day" class="calendar-weekday">
      {{ day }}
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewHome/calendar/CalendarWeekdays.css';
</style>
