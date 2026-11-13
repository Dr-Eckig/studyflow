/**
 * Format a date as a string in the format DD.MM.YYYY.
 * @param date the date to format
 * @returns the formatted date string
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

/**
 * Compares the given date with the current date and returns true if they are equal.
 * This check is done by comparing the day, month and year of the given date with the current date.
 * @param {Date} date the date to compare with the current date
 * @returns {boolean} true if the given date is equal to the current date, otherwise false
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Format a date as a string in the format YYYY-MM-DD, suitable for sending to the backend.
 * @param date the date to format
 * @returns the formatted date string
 */
export function parseDateForBackend(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Checks if a given date is in the past.
 * @param {Date} dateToCheck the date to check
 * @returns {boolean} true if the given date is in the past, otherwise false
 */
export function isPast(dateToCheck: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dateToCheck < today
}
