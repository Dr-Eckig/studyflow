<script setup lang="ts">
import { StoreTasks } from '@/store/StoreTasks'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import ProgressBar from '../ProgressBar.vue'
import { StoreI18n } from '@/store/StoreI18n'
import { StoreStatistics } from '@/store/StoreStatistics'
import { toast } from 'vue3-toastify'
import { parseDateForBackend } from '@/util/date'

const storeTasks = StoreTasks()
const statisticsStore = StoreStatistics()
const { tasks } = storeToRefs(storeTasks)

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

// Fetch Tasks
onMounted(async () => {
  const today = parseDateForBackend(new Date())
  await storeTasks.fetchTasks(today, today)
})

/** Calculates the progress of the tasks percentage */
const progress = computed(() => {
  if (!tasks.value.length) return 0
  const doneCount = tasks.value.filter((t) => t.completed).length
  return Math.round((doneCount / tasks.value.length) * 100)
})

/**
 * Toggle the completed status of a task.
 * @param task The task to modify.
 * @returns A promise that resolves to true if the request was successful, false otherwise.
 */
const toggleDone = async (task: (typeof tasks.value)[number]) => {
  const success = await storeTasks
    .patchTask(task.id!, { completed: task.completed })
    .then(() => statisticsStore.fetchWeeklyStatistics())

  if (!success) {
    toast.error(translate('error_toggle_status'))
  }
}
</script>

<template>
  <div class="sheet">
    <h2 class="sheet-title">{{ translate('tasks_today') }}</h2>
    <div class="sheet-content">
      <p class="center no-tasks" v-if="!tasks.length">{{ translate('tasks_today_none') }}</p>

      <ul class="task-list">
        <li v-for="(task, index) in tasks" :key="index">
          <v-checkbox
            v-model="task.completed"
            :label="task.name || translate('overview_task_none')"
            hide-details
            @change="() => toggleDone(task)"
          />
        </li>
      </ul>

      <div class="progress">
        <ProgressBar
          :percentage="progress || 0"
          :text="`${progress ? progress : 0}` + '% ' + translate('tasks_today_progress')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewHome/TodaysTasks.css';
</style>
