<script lang="ts" setup>
import type { ExamTask } from '@/type/model/task'
import { getWeekdayName } from '@/util/calendar/calendar'
import { isPast, isToday, parseDateForBackend } from '@/util/date'
import Button from '../Button.vue'
import TaskList from './TaskList.vue'
import { StoreI18n } from '@/store/StoreI18n'
import { computed } from 'vue'
import Chip from '../Chip.vue'
import type { Exam } from '@/type/model/exam'

const { date, tasks, exams, openModal } = defineProps<{
  date: Date
  tasks: ExamTask[]
  exams: Exam[]
  openModal: (date: Date, taskId: string | null) => void
}>()

const emit = defineEmits<{
  (e: 'task-saved'): void
}>()

/** Returns the exams that are scheduled for this day */
const examsForThisDay = computed(() =>
  exams.filter((exam) => {
    const examDate = new Date(exam.deadline!)
    return parseDateForBackend(examDate) === parseDateForBackend(date)
  }),
)

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <section class="day-column sheet" :class="{ today: isToday(date), past: isPast(date) }">
    <header class="day-header">
      <div class="date-info">
        <h3>{{ getWeekdayName(date) }}</h3>
        <span class="date-number">{{ date.getDate() }}</span>
      </div>
      <Button
        icon="mdi-plus"
        color="primary"
        size="x-small"
        @click="
          () => {
            if (!isPast(date)) openModal(date, null)
          }
        "
        :aria-label="translate('task_new')"
      />
    </header>

    <ul v-if="examsForThisDay.length" class="exam-chips">
      <li v-for="exam in examsForThisDay" :key="exam.id" class="exam-chip">
        <Chip :label="exam.title" :class="exam.tagColor" rounded size="small" />
      </li>
    </ul>

    <!-- <ul v-if="examsForThisDay.length" class="exam-chips">
      <li v-for="exam in examsForThisDay" :key="exam.id" class="exam-chip">
        <Chip
          :label="getIcon(exam.tagColor) + ' ' + exam.title"
          rounded
          size="small"
          color="secondary"
          variant="outlined"
        />
      </li>
    </ul> -->

    <TaskList :tasks="tasks" :date="date" :openModal="openModal" @task-saved="emit('task-saved')" />
  </section>
</template>

<style scoped>
@import '@/css/component/ViewLearningPlan/DayCard.css';
</style>
