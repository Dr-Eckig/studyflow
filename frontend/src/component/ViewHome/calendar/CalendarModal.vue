<script setup lang="ts">
import Button from '@/component/Button.vue'
import Input from '@/component/Input.vue'
import Modal from '@/component/Modal.vue'
import Select from '@/component/Select.vue'
import { getAllPossibleColors, getIcon } from '@/util/calendar/calendar'
import { computed, ref } from 'vue'
import Textarea from '@/component/Textarea.vue'
import { StoreExams } from '@/store/StoreExams'
import type { Exam } from '@/type/model/exam'
import { StoreI18n } from '@/store/StoreI18n'
import { formatDate, isPast } from '@/util/date'
import ButtonDeleteExam from './button/ButtonDeleteExam.vue'
import ButtonSaveExam from './button/ButtonSaveExam.vue'

const props = defineProps<{
  selectedDay: Date | null
  showModal: boolean
}>()

const newTitle = defineModel<string>('newTitle')
const newDescription = defineModel<string | null>('newDescription')
const newColor = defineModel<string>('newColor')

const examId = ref<string | null>(null)
const addDeadline = ref(false)

const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
}>()

/**
 * Closes the modal window.
 *
 * Emits an event to update the `showModal` prop to `false`, effectively hiding the modal.
 */
function closeModal() {
  emit('update:showModal', false)
}

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

const storeExam = StoreExams()

/**
 * Given a date, returns an array of exams which have deadlines on the given date.
 *
 * @param {Date} date - The date for which to find exams.
 *
 * @returns {Exam[]} - An array of exams with deadlines on the given date.
 */
const getExamsForDate = (date: Date): Exam[] => {
  return storeExam.exams.filter((exam) => {
    if (!exam.deadline) return false
    return new Date(exam.deadline).toDateString() === date.toDateString()
  })
}

const exams = computed(() => (props.selectedDay ? getExamsForDate(props.selectedDay) : []))

const colorOptions = computed(() =>
  getAllPossibleColors().map((color) => ({
    value: color.key,
    label: `${getIcon(color.key)} ${color.label}`,
  })),
)

// Error Handling
const invalidTitle = ref(false)
const invalidColor = ref(false)
const invalidDate = ref(false)

/**
 * Handles a validation error from the child components.
 *
 * @param {Object} payload Object with three properties:
 *  - title: boolean, whether the title is invalid
 *  - color: boolean, whether the color is invalid
 *  - date: boolean, whether the date is invalid
 */
function handleValidationFailed(payload: { title: boolean; color: boolean; date: boolean }) {
  invalidTitle.value = payload.title
  invalidColor.value = payload.color
  invalidDate.value = payload.date
}

/**
 * Populates the form with the details of the selected exam for editing.
 *
 * @param {Exam} exam - The exam object containing the details to be edited.
 */
function editExam(exam: Exam) {
  newTitle.value = exam.title
  newColor.value = exam.tagColor
  newDescription.value = exam.note ?? undefined
  addDeadline.value = true
  examId.value = exam.id ?? null
}

/**
 * Resets all the values in the form to their initial state.
 *
 * This function is called after a successful save or cancellation of the modal.
 */
function resetValues() {
  newTitle.value = ''
  newColor.value = undefined
  newDescription.value = ''
  addDeadline.value = false
  examId.value = null

  invalidTitle.value = false
  invalidColor.value = false
  invalidDate.value = false
}
</script>

<template>
  <Modal :modelValue="showModal" @click.self="closeModal">
    <h2>
      {{ translate('calendar_details') }}
      {{ props.selectedDay ? formatDate(props.selectedDay) : '' }}
    </h2>
    <ul v-if="exams.length" class="dot-summary">
      <li v-for="exam in exams" :key="exam.id" class="exam-item">
        <span class="dot-icon">{{ getIcon(exam.tagColor) }}</span>

        <strong>{{ exam.title }}</strong>
        <p v-if="exam.note">
          <span class="dot-icon is-invisible">{{ getIcon(exam.tagColor) }}</span>
          <span class="description">{{ exam.note }}</span>
        </p>
        <span class="actions">
          <Button
            icon="mdi-pencil"
            variant="text"
            size="x-small"
            @click="editExam(exam)"
            v-if="!isPast(props.selectedDay ?? new Date())"
          />
          <ButtonDeleteExam :exam="exam" @exam-deleted="resetValues" />
        </span>
      </li>
    </ul>
    <p v-else>{{ translate('calendar_no_deadline') }}</p>

    <div v-if="addDeadline">
      <Input
        :label="translate('calendar_title_input')"
        v-model="newTitle"
        autofocus
        :error="invalidTitle"
      />
      <Select
        :label="translate('calendar_color_input')"
        :options="colorOptions"
        v-model="newColor"
        :error="invalidColor"
      />
      <Textarea :label="translate('calendar_description_input')" v-model="newDescription" />

      <span class="save-cancel-buttons">
        <Button
          icon="mdi-close"
          :label="translate('close')"
          color="error"
          variant="tonal"
          @click="resetValues()"
        />
        <ButtonSaveExam
          :exam-id="examId"
          :title="newTitle ?? ''"
          :description="newDescription ?? ''"
          :color="newColor ?? ''"
          :selected-date="selectedDay"
          @saved="resetValues"
          @validation-failed="handleValidationFailed"
        />
      </span>
    </div>

    <Button
      v-else-if="!isPast(props.selectedDay ?? new Date())"
      icon="mdi-plus"
      :label="translate('calendar_add_deadline_button')"
      variant="tonal"
      color="primary"
      @click="addDeadline = true"
    />

    <Button v-if="!addDeadline" :label="translate('close')" color="primary" @click="closeModal" />
  </Modal>
</template>

<style scoped>
@import '@/css/component/ViewHome/calendar/CalendarModal.css';
</style>
