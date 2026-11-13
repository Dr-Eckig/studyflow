<script setup lang="ts">
import NavigationHeader from '@/component/ViewLearningPlan/NavigationHeader.vue'
import DayCard from '@/component/ViewLearningPlan/DayCard.vue'
import TaskModal from '@/component/ViewLearningPlan/TaskModal.vue'
import { StoreExams } from '@/store/StoreExams'
import { StoreTasks } from '@/store/StoreTasks'
import type { ExamTask } from '@/type/model/task'
import { parseDateForBackend } from '@/util/date'
import { createModalManager } from '@/util/learningPlan/learningPlanModal'
import { createWeekNavigation } from '@/util/learningPlan/learningPlanWeekNavigation'
import { computed, onMounted, reactive, ref } from 'vue'
import Loading from '@/component/Loading.vue'
import FirstDeadlineHint from '@/component/FirstDeadlineHint.vue'

const taskStore = StoreTasks()
const examStore = StoreExams()

const loading = ref(true)
const examsLoaded = ref(false)

// Fetch Tasks and Categories
const tasksByDate = reactive<Record<string, ExamTask[]>>({})
const categories = computed(() => examStore.categories)

/**
 * Updates the tasksByDate object by clearing it and re-assigning values
 * from the groupedTasks array fetched from the server.
 *
 * @remarks
 * This method is used after the groupedTasks array has been updated.
 * The tasksByDate object is used to display the tasks in the UI and its
 * values must be updated when the groupedTasks array is updated.
 */
const updateTasksByDate = () => {
  Object.keys(tasksByDate).forEach((key) => delete tasksByDate[key])

  for (const item of taskStore.groupedTasks) {
    const dateKey = item.date ? item.date.slice(0, 10) : 'no-date'
    tasksByDate[dateKey] = item.tasks
  }
}

onMounted(async () => {
  const [success] = await Promise.all([examStore.fetchExams(), reloadTasks()])
  examsLoaded.value = success
  loading.value = false
})

/**
 * Fetches the grouped tasks from the server and updates the tasksByDate
 * object with the newly fetched data.
 *
 * @remarks
 * This method is used to reload the tasks displayed in the UI after
 * changes have been made to the tasks or categories.
 */
const reloadTasks = async () => {
  const success = await taskStore.fetchGroupedTasks()
  if (success) {
    updateTasksByDate()
  }
}

/* Week Navigation and Calculation of Dates in the active Week */
const { weekDates, weekHeader, nextWeek, prevWeek, goToToday } = createWeekNavigation()

/* Modal Manager */
const {
  showModal,
  selectedDate,
  selectedTaskId,
  newTaskTitle,
  newTaskCategory,
  openModal,
  closeModal,
} = createModalManager()

/**
 * Toggles the modal window. If the modal is to be closed, calls
 * closeModal() to reset the modal state.
 *
 * @param val - True to show the modal, false to hide it.
 */
function handleShowModal(val: boolean) {
  showModal.value = val
  if (!val) closeModal()
}
</script>

<template>
  <Loading v-if="loading" />
  <main class="learning-plan" v-else>
    <NavigationHeader
      :weekHeader="weekHeader"
      :prevWeek="prevWeek"
      :nextWeek="nextWeek"
      :goToToday="goToToday"
    />

    <FirstDeadlineHint
      v-if="examsLoaded && examStore.exams.length === 0"
      show-calendar-link
      class="learning-plan-start"
    />

    <!-- DayCard -->
    <div class="grid">
      <DayCard
        v-for="date in weekDates"
        :key="parseDateForBackend(date)"
        :date="date"
        :tasks="tasksByDate[parseDateForBackend(date)] || []"
        :exams="examStore.exams"
        :openModal="openModal"
        @task-saved="reloadTasks"
      />
    </div>

    <TaskModal
      v-if="showModal && selectedDate"
      :selectedDate="selectedDate"
      :showModal="showModal"
      :categories="categories"
      :taskId="selectedTaskId"
      v-model:newTaskTitle="newTaskTitle"
      v-model:newTaskCategory="newTaskCategory"
      @update:showModal="handleShowModal"
      @task-saved="reloadTasks"
    />
  </main>
</template>

<style scoped>
@import '@/css/view/ViewLearningPlan.css';
</style>
