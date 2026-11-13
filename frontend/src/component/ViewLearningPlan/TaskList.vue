<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import type { ExamTask } from '@/type/model/task'
import Button from '../Button.vue'
import ButtonDeleteTask from './button/ButtonDeleteTask.vue'

const { tasks, date, openModal } = defineProps<{
  tasks: ExamTask[]
  date: Date
  openModal: (date: Date, taskId: string | null) => void
}>()

const emit = defineEmits<{
  (e: 'task-saved'): void
}>()

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <ul class="task-list">
    <li v-for="task in tasks" :key="task.taskId" :class="{ completed: task.completed }">
      <div class="task-category-indicator" :class="task.category.color" />
      <div class="task-content">
        <div class="task-actions">
          <Button
            icon="mdi-pencil-outline"
            variant="text"
            size="x-small"
            color="warning"
            @click="openModal(date, task.taskId)"
            :aria-label="translate('task_edit')"
          />
          <ButtonDeleteTask :taskId="task.taskId" @task-deleted="emit('task-saved')" />
        </div>
        <span class="task-title">{{ task.title }}</span>
      </div>
    </li>
    <li v-if="tasks.length === 0" class="empty-task-list">
      <p class="hint">{{ translate('schedule_add') }}</p>
    </li>
  </ul>
</template>

<style scoped>
@import '@/css/component/ViewLearningPlan/TaskList.css';
</style>
