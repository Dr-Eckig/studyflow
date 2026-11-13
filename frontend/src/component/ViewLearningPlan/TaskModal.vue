<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import { getWeekdayLongName } from '@/util/calendar/calendar'
import { formatDate } from '@/util/date'
import Select from '../Select.vue'
import Input from '../Input.vue'
import Button from '../Button.vue'
import Modal from '@/component/Modal.vue'
import { computed, ref } from 'vue'
import ButtonSaveTask from './button/ButtonSaveTask.vue'
import type { Category } from '@/type/model/exam'

const props = defineProps<{
  selectedDate: Date
  showModal: boolean
  categories: Category[]
  taskId: string | null
}>()

const newTaskTitle = defineModel<string>('newTaskTitle')
const newTaskCategory = defineModel<string>('newTaskCategory')

const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'task-saved'): void
}>()

function closeModal() {
  emit('update:showModal', false)
}

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

// Error Handling
const missingTitle = ref(false)
const missingCategory = ref(false)

/**
 * Handles a validation error from the child components.
 *
 * @param {Object} payload Object with two properties:
 *  - title: boolean, whether the title is invalid
 *  - category: boolean, whether the category is invalid
 */
function handleValidationFailed(payload: { title: boolean; category: boolean }) {
  missingTitle.value = payload.title
  missingCategory.value = payload.category
}

/** Filters the categories based on the selected date */
const filteredCategories = computed(() =>
  props.categories.filter((c) => c.date >= props.selectedDate),
)
</script>

<template>
  <Modal :modelValue="showModal" @click.self="closeModal">
    <h2>{{ props.taskId !== null ? translate('task_edit') : translate('task_new') }}</h2>
    <p class="modal-date">
      {{ selectedDate ? getWeekdayLongName(selectedDate) : '' }}
      {{ selectedDate ? formatDate(selectedDate) : '' }}
    </p>

    <div class="form-group">
      <Input
        :label="translate('task')"
        id="taskTitle"
        v-model="newTaskTitle"
        autofocus
        :error="missingTitle"
      />
    </div>

    <div class="form-group">
      <Select
        :label="translate('schedule_type')"
        :options="
          filteredCategories.map((c) => ({
            label: c.icon + ' ' + c.title,
            value: c.examId ?? '',
          }))
        "
        v-model="newTaskCategory"
        :error="missingCategory"
      />
    </div>

    <div class="modal-buttons">
      <Button :label="translate('close')" variant="tonal" @click="closeModal" />
      <ButtonSaveTask
        :task-id="props.taskId"
        :selected-date="props.selectedDate"
        :new-task-title="newTaskTitle ?? ''"
        :new-task-category="newTaskCategory ?? ''"
        :categories="filteredCategories"
        @task-saved="(emit('task-saved'), closeModal())"
        @validation-failed="handleValidationFailed"
      />
    </div>
  </Modal>
</template>

<style scoped>
@import '@/css/component/ViewLearningPlan/TaskModal.css';
</style>
