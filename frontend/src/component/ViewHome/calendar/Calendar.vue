<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CalendarNavigation from './CalendarNavigation.vue'
import CalendarWeekdays from './CalendarWeekdays.vue'
import CalendarDays from './CalendarDays.vue'
import { getIcon } from '@/util/calendar/calendar'
import { StoreExams } from '@/store/StoreExams'
import { StoreI18n } from '@/store/StoreI18n'

const storeExam = StoreExams()
const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

// Fetch Exams
onMounted(async () => {
  await storeExam.fetchExams()
})

const currentDate = ref<Date>(new Date())
const selectedDate = ref<Date | null>(null)
const today = new Date()

/** Returns the current month and year as a localized string (e.g. "Mai 2025") */
const monthYear = computed(() => {
  const monthIndex = currentDate.value.getMonth() // 0–11
  const year = currentDate.value.getFullYear()
  const monthKey = [
    'calendar_month_ja',
    'calendar_month_fe',
    'calendar_month_ma',
    'calendar_month_ap',
    'calendar_month_may',
    'calendar_month_jun',
    'calendar_month_jul',
    'calendar_month_au',
    'calendar_month_se',
    'calendar_month_oc',
    'calendar_month_no',
    'calendar_month_de',
  ][monthIndex]

  return `${translate(monthKey)} ${year}`
})

/**
 * Decrements the current month by one.
 *
 * Note: This function updates the internal state `currentDate` and thus triggers a re-render.
 */
const prevMonth = () =>
  (currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  ))

/** Advances the current date to the first day of the next month */
const nextMonth = () =>
  (currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  ))

const firstDay = computed(
  () => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1),
)
const lastDay = computed(
  () => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0),
)

/**
 * Compares two dates and returns true if they fall on the same calendar day
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const isToday = (date: Date): boolean => isSameDay(date, today)
const selectDate = (date: Date): Date => (selectedDate.value = date)

/** Builds a flat array of calendar days including nulls for alignment */
const calendarDays = computed(() => {
  const startOffset = (firstDay.value.getDay() + 6) % 7
  const days = Array(startOffset).fill(null)
  for (let d = 1; d <= lastDay.value.getDate(); d++) {
    days.push(new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), d))
  }
  while (days.length % 7 !== 0) days.push(null)
  return days
})

/* Legend */
const legendItems = computed(() => storeExam.fetchLegendItems())
</script>

<template>
  <div class="sheet">
    <header class="sheet-header">
      <h2 class="sheet-title">{{ translate('deadlines') }}</h2>
    </header>
    <div class="sheet-content">
      <div class="calendar-container">
        <div class="calendar">
          <CalendarNavigation
            :monthYear="monthYear"
            :prevMonth="prevMonth"
            :nextMonth="nextMonth"
          />
          <CalendarWeekdays />
          <CalendarDays :calendarDays="calendarDays" :isToday="isToday" :selectDate="selectDate" />
        </div>

        <!-- Legend -->
        <aside class="is-hidden-tablet-and-mobile">
          <div v-if="legendItems.length" class="legend-items">
            <div v-for="(item, index) in legendItems" :key="index" class="legend-item">
              <span class="dot-icon">{{ getIcon(item.color) }}</span>
              <div class="legend-details">
                <p class="legend-titles">
                  {{ item.titles.join(', ') }}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewHome/calendar/Calendar.css';
</style>
