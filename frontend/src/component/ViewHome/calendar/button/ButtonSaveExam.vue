<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/component/Button.vue'
import { StoreExams } from '@/store/StoreExams'
import { StoreStatistics } from '@/store/StoreStatistics'
import { StoreI18n } from '@/store/StoreI18n'
import { isPast, parseDateForBackend } from '@/util/date'
import { toast } from 'vue3-toastify'
import { removeIcon } from '@/util/calendar/calendar'
import type { Exam } from '@/type/model/exam'

const props = defineProps<{
  examId: string | null
  title: string
  description: string | null
  color: string
  selectedDate: Date | null
}>()

const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'validation-failed', payload: { title: boolean; color: boolean; date: boolean }): void
}>()

const storeExam = StoreExams()
const storeStatistics = StoreStatistics()
const translate = (key: string) => StoreI18n().dictionary[key] || key

const loading = ref(false)

/**
 * Checks if the exam has valid values for title, color and date.
 *
 * If validation fails, a toast error will be displayed and the
 * validation-failed event will be emitted with the invalid fields.
 *
 * @returns {boolean} true if the exam is valid, false otherwise
 */
function validate() {
  const invalid = {
    title: !props.title || !props.title.trim(),
    color: !props.color,
    date: !props.selectedDate,
    pastDate: isPast(props.selectedDate!),
  }

  if (invalid.title) toast.error(translate('missing_title'))
  if (invalid.color) toast.error(translate('missing_color'))
  if (invalid.date) toast.error(translate('missing_date'))
  if (invalid.pastDate) toast.error(translate('error_past_date'))

  emit('validation-failed', invalid)
  return !(invalid.title || invalid.color || invalid.date || invalid.pastDate)
}

/**
 * Validates the exam and saves it if valid.
 *
 * If the exam is valid, it is saved and the 'saved' event is emitted.
 * If the exam is invalid, the 'validation-failed' event is emitted with
 * the invalid fields.
 *
 * If the exam is already saved, it is updated. Otherwise, a new exam is created.
 *
 * @returns {Promise<void>}
 */
async function save() {
  if (!validate()) return

  loading.value = true

  const exam: Exam = {
    title: props.title.trim(),
    tagColor: removeIcon(props.color),
    deadline: parseDateForBackend(props.selectedDate!),
    note: props.description ?? undefined,
  } as Exam

  const success = props.examId
    ? await storeExam.patchExam(props.examId, exam)
    : await storeExam.createExam(exam)

  if (!success) {
    toast.error(props.examId ? translate('error_exam_update') : translate('error_exam_create'))
    loading.value = false
    return
  }

  await Promise.all([storeExam.fetchExams(), storeStatistics.fetchExamStatistics()])

  toast.success(translate('exam_saved'))
  emit('saved')

  loading.value = false
}
</script>

<template>
  <Button
    icon="mdi-check"
    :label="translate('save')"
    color="success"
    @click="save"
    :loading="loading"
  />
</template>
