import { ref, computed } from 'vue'

/**
 * Creates a week navigation that manages the state of the current week.
 * @returns An object containing the week state, computed dates for the week,
 * and functions to navigate to the next and previous week, and to go to the
 * current week.
 */
export function createWeekNavigation() {
  const currentWeekOffset = ref(0)

  /**
   * Move to the next week.
   */
  function nextWeek() {
    currentWeekOffset.value++
  }

  /**
   * Move to the previous week.
   */
  function prevWeek() {
    currentWeekOffset.value--
  }

  /**
   * Resets the week navigation to the current week.
   */
  function goToToday() {
    currentWeekOffset.value = 0
  }

  /**
   * Returns the date of the Monday of the week for a given date.
   *
   * @param {Date} date - The date for which to find the corresponding Monday.
   * @returns {Date} The date object representing the Monday of the input date's week.
   */
  function getMonday(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7))
  }

  /** Returns the start date of the week (Monday) based on the current week offset. */
  const weekStartDate = computed(() => {
    const today = new Date()
    const monday = getMonday(today)
    monday.setDate(monday.getDate() + currentWeekOffset.value * 7)
    return monday
  })

  /** Returns an array of dates representing the days of the current week. */
  const weekDates = computed(() => {
    const startDate = weekStartDate.value
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  })

  /** Returns a string representing the date range of the current week. */
  const weekHeader = computed(() => {
    const start = weekStartDate.value.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
    })
    const end = new Date(weekStartDate.value)
    end.setDate(end.getDate() + 6)
    const endStr = end.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    return `${start} - ${endStr}`
  })

  return {
    currentWeekOffset,
    weekStartDate,
    weekDates,
    weekHeader,
    nextWeek,
    prevWeek,
    goToToday,
  }
}
