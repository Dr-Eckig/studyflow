import { ref } from 'vue'

/**
 * Creates a modal manager for the calendar.
 *
 * The modal manager provides a state for displaying the modal and
 * for the selected date. It also provides a state for the input fields
 * of the modal and functions to open and close the modal.
 *
 * @returns An object containing the state and functions of the modal manager
 */
export function createModalManager() {
  const showModal = ref(false)
  const selectedDate = ref<Date | null>(null)

  const newTitle = ref('')
  const newDescription = ref<string | null>(null)
  const newColor = ref<string | undefined>(undefined)

  async function openModal(date: Date) {
    selectedDate.value = date
    showModal.value = true
  }

  /**
   * Closes the modal window.
   *
   * Resets all modal-related states to their default values:
   * - `selectedDate` is set to null
   * - `showModal` is set to false
   * - `newTitle` is set to an empty string
   * - `newDescription` is set to null
   * - `newColor` is set to undefined
   */
  function closeModal() {
    selectedDate.value = null
    showModal.value = false
    newTitle.value = ''
    newDescription.value = null
    newColor.value = undefined
  }

  return {
    showModal,
    selectedDate,
    newTitle,
    newDescription,
    newColor,
    openModal,
    closeModal,
  }
}
