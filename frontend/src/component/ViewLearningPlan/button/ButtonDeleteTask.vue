<script setup lang="ts">
import Button from '@/component/Button.vue'
import { StoreI18n } from '@/store/StoreI18n'
import { StoreTasks } from '@/store/StoreTasks'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const { taskId } = defineProps<{
  taskId: string
}>()

const emit = defineEmits<{
  (e: 'task-deleted'): void
}>()

const taskStore = StoreTasks()
const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

const loading = ref(false)

/**
 * Deletes the specified task. If the deletion is successful, it shows a success toast,
 * emits a 'task-deleted' event, and sets the loading state to false. If the deletion fails,
 * it shows an error toast and sets the loading state to false.
 * The loading state is managed during the execution.
 * @param taskId The id of the task to be deleted
 */
async function deleteTask(taskId: string) {
  loading.value = true
  const success = await taskStore.deleteTask(taskId)
  if (success) {
    toast.success(translate('task_deleted'))
    emit('task-deleted')
  } else {
    toast.error(translate('error_delete_task'))
  }

  loading.value = false
}
</script>

<template>
  <Button
    icon="mdi-trash-can-outline"
    variant="text"
    size="x-small"
    color="error"
    @click="deleteTask(taskId)"
    :aria-label="translate('task_delete')"
    :loading="loading"
  />
</template>
