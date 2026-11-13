<script setup lang="ts">
import Button from '@/component/Button.vue'
import { StoreExams } from '@/store/StoreExams'
import { StoreI18n } from '@/store/StoreI18n'
import type { Exam } from '@/type/model/exam'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const props = defineProps<{
  exam: Exam
}>()

const emit = defineEmits<{
  (e: 'exam-deleted'): void
}>()

const storeExam = StoreExams()
const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

const loading = ref(false)

/**
 * Deletes the specified exam. If the deletion is successful, it fetches the updated list of exams,
 * shows a success toast, and emits an 'exam-deleted' event. If the deletion fails, it shows an error toast.
 * The loading state is managed during the execution.
 */
async function deleteExam() {
  if (!props.exam.id) return
  loading.value = true

  const success = await storeExam.deleteExam(props.exam.id)
  if (!success) {
    toast.error(translate('error_exam_delete'))
    loading.value = false
    return
  }

  await storeExam.fetchExams()
  toast.success(translate('exam_deleted'))
  emit('exam-deleted')
  loading.value = false
}
</script>

<template>
  <Button
    icon="mdi-delete"
    variant="text"
    color="error"
    size="x-small"
    :loading="loading"
    @click="deleteExam"
  />
</template>
