<script setup lang="ts">
import CalendarModal from './CalendarModal.vue'
import { getIcon } from '@/util/calendar/calendar'
import { StoreExams } from '@/store/StoreExams'
import type { Exam } from '@/type/model/exam'
import { createModalManager } from '@/util/calendar/calendarModal'

const props = defineProps<{
  calendarDays: Date[]
  isToday: (date: Date) => boolean
  selectDate: (date: Date) => void
}>()

const storeExam = StoreExams()

/**
 * Given a date, returns an array of exams which have deadlines on the given date.
 *
 * @param {Date} date - The date for which to find exams.
 *
 * @returns {Exam[]} - An array of exams with deadlines on the given date.
 */
const getDotsForDate = (date: Date): Exam[] => {
  return storeExam.exams.filter((exam) => {
    if (!exam.deadline) return false
    return new Date(exam.deadline).toDateString() === date.toDateString()
  })
}

const dotsFor = (d: Date) => getDotsForDate(d)

/* Modal Manager */
const { showModal, selectedDate, newTitle, newDescription, newColor, openModal, closeModal } =
  createModalManager()

function handleShowModal(val: boolean) {
  showModal.value = val
  if (!val) closeModal()
}
</script>

<template>
  <div class="calendar-grid">
    <div v-for="(day, index) in calendarDays" :key="'day-' + index">
      <div
        v-if="day"
        class="date-btn"
        :class="{ today: props.isToday(day) }"
        @click="openModal(day)"
      >
        <!-- Day -->
        {{ day.getDate() }}

        <!-- Dots -->
        <div class="dot-overlay">
          <span v-for="exam in dotsFor(day)" :key="exam.title" class="dot-icon">{{
            getIcon(exam.tagColor)
          }}</span>
        </div>
      </div>

      <!-- Empty Placeholder -->
      <div v-else class="date-placeholder"></div>
    </div>
  </div>

  <!-- Modal -->
  <CalendarModal
    :selectedDay="selectedDate"
    :showModal="showModal"
    v-model:newTitle="newTitle"
    v-model:newDescription="newDescription"
    v-model:newColor="newColor"
    @update:showModal="handleShowModal"
  />
</template>

<style scoped>
@import '@/css/component/ViewHome/calendar/CalendarDays.css';
</style>
