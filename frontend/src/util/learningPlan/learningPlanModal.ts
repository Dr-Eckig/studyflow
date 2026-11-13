import { StoreI18n } from '@/store/StoreI18n'
import { StoreTasks } from '@/store/StoreTasks'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

/**
 * Creates a modal manager for handling task-related modals.
 *
 * The modal manager maintains state for displaying the modal,
 * the selected date, and task-related data such as task ID, title,
 * and category. It provides functions to open and close the modal,
 * as well as to initialize task data based on a given task ID.
 *
 * The `openModal` function sets the selected date and task ID,
 * initializes task data if an ID is provided, and displays the modal.
 * The `closeModal` function resets all modal-related states to their
 * default values.
 *
 * @returns An object containing the state and functions of the modal manager.
 */
export function createModalManager() {
  const storeI18n = StoreI18n()
  const translate = (key: string) => storeI18n.dictionary[key] || key

  const showModal = ref(false)
  const selectedDate = ref<Date | null>(null)

  const selectedTaskId = ref<string | null>(null)
  const newTaskTitle = ref('')
  const newTaskCategory = ref(translate('task_choose_category'))

  /**
   * Opens the modal window with specified date and task.
   *
   * Sets the `selectedDate` to the provided date and `selectedTaskId`
   * to the provided taskId. If a taskId is given, it initializes the
   * task data by calling `setInitialData`. Finally, sets `showModal`
   * to true to display the modal.
   *
   * @param date - The date to set as the selected date.
   * @param taskId - The ID of the task to be displayed or edited, or null for a new task.
   */
  async function openModal(date: Date, taskId: string | null = null) {
    selectedTaskId.value = taskId
    selectedDate.value = date

    newTaskTitle.value = ''
    newTaskCategory.value = translate('task_choose_category')

    if (taskId) {
      setInitialData(taskId)
    }

    showModal.value = true
  }

  /**
   * Sets the initial data for the task modal based on the given task ID.
   *
   * Fetches the task details from the task store using the provided task ID.
   * If the task is found, it sets the `newTaskTitle` and `newTaskCategory`
   * with the task's name and examId, respectively. If the task is not found,
   * it displays an error message using a toast notification.
   *
   * @param taskId - The ID of the task to fetch and set data for.
   */
  async function setInitialData(taskId: string) {
    const taskStore = StoreTasks()
    const task = await taskStore.getTaskById(taskId)

    if (!task) {
      toast.error(translate('task_not_found'))
      return
    }

    newTaskTitle.value = task.name
    newTaskCategory.value = task.examId
  }

  /**
   * Closes the modal window.
   *
   * Resets all values to their default state:
   * - `selectedDate` is set to null
   * - `showModal` is set to false
   * - `selectedTaskId` is set to null
   * - `newTaskTitle` is set to ''
   * - `newTaskCategory` is set to the translated string 'task_choose_category'
   */
  function closeModal() {
    selectedDate.value = null
    showModal.value = false
    selectedTaskId.value = null
    newTaskTitle.value = ''
    newTaskCategory.value = translate('task_choose_category')
  }

  return {
    showModal,
    selectedDate,
    selectedTaskId,
    newTaskTitle,
    newTaskCategory,
    openModal,
    closeModal,
  }
}
