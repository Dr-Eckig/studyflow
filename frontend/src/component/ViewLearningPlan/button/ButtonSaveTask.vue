<script setup lang="ts">
import Button from '@/component/Button.vue'
import { StoreI18n } from '@/store/StoreI18n'
import { StoreTasks } from '@/store/StoreTasks'
import type { Category } from '@/type/model/exam'
import type { Task } from '@/type/model/task'
import { parseDateForBackend } from '@/util/date'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const { taskId, selectedDate, newTaskTitle, newTaskCategory, categories } = defineProps<{
  taskId: string | null
  selectedDate: Date
  newTaskTitle: string
  newTaskCategory: string
  categories: Category[]
}>()

const emit = defineEmits<{
  (e: 'task-saved'): void
  (e: 'validation-failed', payload: { title: boolean; category: boolean }): void
}>()

const taskStore = StoreTasks()
const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

const loading = ref(false)

const missingTitle = ref(false)
const missingCategory = ref(false)

/**
 * Validates if the task title and category are not empty.
 *
 * If validation fails, it displays an error message using a toast notification.
 * It also emits a 'validation-failed' event with the invalid fields.
 */
function validateFields() {
  missingTitle.value = false
  missingCategory.value = false

  if (!newTaskTitle) {
    toast.error(translate('missing_title'))
    missingTitle.value = true
  }

  if (
    !newTaskCategory ||
    newTaskCategory === translate('task_choose_category') ||
    newTaskCategory === 'task_choose_category'
  ) {
    toast.error(translate('category_empty'))
    missingCategory.value = true
  }

  if (missingTitle.value || missingCategory.value) {
    emit('validation-failed', {
      title: missingTitle.value,
      category: missingCategory.value,
    })
  }
}

/**
 * Validates and saves a task.
 *
 * First, it validates the task title and category. If validation fails, it displays
 * an error message using a toast notification. If validation succeeds, it saves the
 * task using the task store. If the task is already saved, it is updated. Otherwise, a
 * new task is created. If the save operation fails, it displays an error message
 * using a toast notification. If the save operation succeeds, it displays a success
 * message using a toast notification and emits a 'task-saved' event.
 */
async function saveTask() {
  validateFields()
  if (missingTitle.value || missingCategory.value) return

  loading.value = true

  const color = categories.find((c) => c.examId === newTaskCategory)?.color
  const examTitle = categories.find((c) => c.examId === newTaskCategory)?.title

  const baseTask = {
    examId: newTaskCategory!,
    name: newTaskTitle!,
    date: parseDateForBackend(selectedDate),
    color: color ?? '',
    examTitle: examTitle ?? '',
  }

  const task = taskId ? baseTask : ({ ...baseTask, completed: false } as Task)

  const success = taskId
    ? await taskStore.patchTask(taskId, task)
    : await taskStore.createTask(task)

  if (!success) {
    toast.error(translate('error_update_task'))
    loading.value = false
    return
  }

  toast.success(translate('task_saved'))
  emit('task-saved')

  loading.value = false
}
</script>

<template>
  <Button :label="translate('save')" color="primary" @click="saveTask" :loading="loading" />
</template>
